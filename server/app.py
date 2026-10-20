"""
FarmLink AI — Flask REST API Service
Provides endpoints for authentication, produce listings, orders, intelligent load pooling,
offer comparison, disruption recovery, demand forecasting, live analytics, and SAP gateway.
"""

import os
import json
import uuid
from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, desc
from sqlalchemy.orm import sessionmaker

from models import (
    Base, User, ProduceListing, Order, BuyerOffer, Shipment, ShipmentStop,
    DisruptionEvent, AuditLog, Notification
)
from pooling_engine import PoolingEngine
from matching_engine import MatchingEngine
from pricing_engine import PricingEngine, compute_offer_financials
from forecasting_engine import ForecastingEngine
from sap_adapter import SAPEnterpriseAdapter

DB_PATH = os.path.join(os.path.dirname(__file__), 'farmlink.db')
engine = create_engine(f'sqlite:///{DB_PATH}', connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(bind=engine)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

pooling_engine = PoolingEngine()
matching_engine = MatchingEngine()
pricing_engine = PricingEngine()
forecasting_engine = ForecastingEngine()
sap_adapter = SAPEnterpriseAdapter()

def get_db():
    db = SessionLocal()
    try:
        return db
    except Exception:
        db.close()
        raise

def log_audit(session, action, entity_type, entity_id, actor_id='system', actor_role='system', details=None):
    entry = AuditLog(
        actor_id=actor_id,
        actor_role=actor_role,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        details=json.dumps(details or {}),
        created_at=datetime.now(timezone.utc)
    )
    session.add(entry)

# ----------------- HEALTH & CONFIG -----------------
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'FarmLink AI Engine API',
        'version': '2.0.0',
        'database': 'SQLite persistent',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

# ----------------- AUTHENTICATION -----------------
@app.route('/api/auth/demo-login', methods=['POST'])
def demo_login():
    data = request.get_json() or {}
    role = data.get('role', 'farmer').lower()
    db = get_db()
    try:
        user = db.query(User).filter(User.role == role).first()
        if not user:
            # Fallback to f1 if specific role not found
            user = db.query(User).filter(User.id == 'f1').first()

        token = f"demo-jwt-{user.id}-{role}-{int(datetime.now(timezone.utc).timestamp())}"
        log_audit(db, 'USER_LOGIN', 'USER', user.id, actor_id=user.id, actor_role=user.role, details={'role': role})
        db.commit()
        return jsonify({
            'success': True,
            'token': token,
            'user': user.to_dict(),
        })
    finally:
        db.close()

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    user_id = request.args.get('userId', 'f1')
    db = get_db()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': user.to_dict()})
    finally:
        db.close()

# ----------------- PRODUCE LISTINGS -----------------
@app.route('/api/products', methods=['GET'])
def list_products():
    db = get_db()
    try:
        category = request.args.get('category')
        farmer_id = request.args.get('farmerId')
        query_text = request.args.get('q', '').lower()

        q = db.query(ProduceListing).filter(ProduceListing.is_active == True)
        if category and category != 'All':
            q = q.filter(ProduceListing.category == category)
        if farmer_id:
            q = q.filter(ProduceListing.farmer_id == farmer_id)

        all_listings = q.order_by(desc(ProduceListing.created_at)).all()
        results = [l.to_dict() for l in all_listings]

        if query_text:
            results = [
                r for r in results
                if query_text in r['name'].lower()
                or query_text in r['location'].lower()
                or query_text in r['farmer'].lower()
            ]

        return jsonify({'products': results, 'count': len(results)})
    finally:
        db.close()

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    db = get_db()
    try:
        item = db.query(ProduceListing).filter(ProduceListing.id == product_id).first()
        if not item:
            return jsonify({'error': 'Product not found'}), 404
        return jsonify({'product': item.to_dict()})
    finally:
        db.close()

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json() or {}
    farmer_id = data.get('farmerId', 'f1')
    name = (data.get('name') or '').strip()
    category = data.get('category', 'Vegetables')
    quantity = float(data.get('quantity') or 0.0)
    price = float(data.get('price') or 0.0)
    unit = data.get('unit', 'kg')
    location = (data.get('location') or 'Kolar, Karnataka').strip()
    quality = data.get('quality', 'Grade A')
    harvest_date = data.get('harvestDate') or datetime.now().strftime('%Y-%m-%d')
    description = data.get('description', '')
    image = data.get('image')

    if not name:
        return jsonify({'error': 'Produce name is required'}), 400
    if quantity <= 0:
        return jsonify({'error': 'Quantity must be greater than zero'}), 400
    if price <= 0:
        return jsonify({'error': 'Price must be greater than zero'}), 400

    db = get_db()
    try:
        # Generate new sequential ID
        existing_count = db.query(ProduceListing).count()
        new_id = f"p{existing_count + 101}"

        listing = ProduceListing(
            id=new_id,
            farmer_id=farmer_id,
            name=name,
            category=category,
            quantity=quantity,
            available_quantity=quantity,
            unit=unit,
            price=price,
            quality=quality,
            harvest_date=harvest_date,
            location=location,
            demand='Medium',
            image=image or 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=800&auto=format&fit=crop',
            description=description,
            is_active=True,
            created_at=datetime.now(timezone.utc)
        )
        db.add(listing)
        log_audit(db, 'LISTING_CREATED', 'PRODUCE_LISTING', new_id, actor_id=farmer_id, actor_role='farmer',
                  details={'name': name, 'quantity': quantity, 'price': price})
        db.commit()
        return jsonify({'success': True, 'product': listing.to_dict()}), 201
    finally:
        db.close()

@app.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json() or {}
    db = get_db()
    try:
        listing = db.query(ProduceListing).filter(ProduceListing.id == product_id).first()
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        if 'name' in data and data['name']:
            listing.name = data['name'].strip()
        if 'price' in data and float(data['price']) > 0:
            listing.price = float(data['price'])
        if 'quantity' in data and float(data['quantity']) >= 0:
            diff = float(data['quantity']) - listing.available_quantity
            listing.available_quantity = float(data['quantity'])
            listing.quantity += diff
        if 'quality' in data:
            listing.quality = data['quality']
        if 'location' in data and data['location']:
            listing.location = data['location'].strip()
        if 'description' in data:
            listing.description = data['description']

        log_audit(db, 'LISTING_UPDATED', 'PRODUCE_LISTING', product_id, details=data)
        db.commit()
        return jsonify({'success': True, 'product': listing.to_dict()})
    finally:
        db.close()

@app.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    db = get_db()
    try:
        listing = db.query(ProduceListing).filter(ProduceListing.id == product_id).first()
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        # Soft delete / deactivate
        listing.is_active = False
        log_audit(db, 'LISTING_DEACTIVATED', 'PRODUCE_LISTING', product_id)
        db.commit()
        return jsonify({'success': True, 'message': f'Listing {product_id} deactivated'})
    finally:
        db.close()

# ----------------- ORDERS -----------------
@app.route('/api/orders', methods=['GET'])
def list_orders():
    db = get_db()
    try:
        buyer_id = request.args.get('buyerId')
        farmer_id = request.args.get('farmerId')
        stage = request.args.get('stage')

        q = db.query(Order)
        if buyer_id:
            q = q.filter(Order.buyer_id == buyer_id)
        if farmer_id:
            q = q.filter(Order.farmer_id == farmer_id)
        if stage:
            q = q.filter(Order.stage == stage)

        all_orders = q.order_by(desc(Order.created_at)).all()
        return jsonify({'orders': [o.to_dict() for o in all_orders]})
    finally:
        db.close()

@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.get_json() or {}
    items = data.get('items', [])
    buyer_id = data.get('buyerId', 'b1')
    delivery_location = (data.get('deliveryLocation') or 'Bengaluru').strip()
    payment_method = data.get('paymentMethod', 'UPI')

    if not items:
        return jsonify({'error': 'Cart is empty. Select produce to order.'}), 400

    db = get_db()
    created_orders = []
    try:
        buyer = db.query(User).filter(User.id == buyer_id).first()
        buyer_name = buyer.org_name if buyer else 'Buyer'

        order_seq = db.query(Order).count() + 1045

        for item in items:
            product_id = item.get('productId')
            quantity = float(item.get('quantity') or 0.0)

            product = db.query(ProduceListing).filter(ProduceListing.id == product_id).first()
            if not product:
                return jsonify({'error': f'Product {product_id} not found'}), 404
            if product.available_quantity < quantity:
                return jsonify({
                    'error': f'Insufficient stock for {product.name}. Only {product.available_quantity} {product.unit} available.'
                }), 400

            # Atomic inventory deduction
            product.available_quantity -= quantity

            subtotal = round(product.price * quantity, 2)
            logistics_fee = round(subtotal * 0.08, 2)
            platform_fee = round(subtotal * 0.02, 2)
            total = round(subtotal + logistics_fee + platform_fee, 2)

            new_order_id = f"ORD-{order_seq}"
            order_seq += 1

            new_order = Order(
                id=new_order_id,
                buyer_id=buyer_id,
                buyer_name=buyer_name,
                farmer_id=product.farmer_id,
                farmer_name=product.farmer.org_name if product.farmer else "Farmer Collective",
                listing_id=product.id,
                product_name=product.name,
                quantity=quantity,
                unit=product.unit,
                subtotal=subtotal,
                logistics_fee=logistics_fee,
                platform_fee=platform_fee,
                total=total,
                payment_method=payment_method,
                stage='Order Placed',
                placed_on=datetime.now().strftime('%Y-%m-%d'),
                eta=(datetime.now().replace(microsecond=0) + datetime.now().astimezone().resolution * 3).strftime('%Y-%m-%d'),
                delivery_location=delivery_location,
                created_at=datetime.now(timezone.utc)
            )
            db.add(new_order)
            created_orders.append(new_order)

            log_audit(db, 'ORDER_PLACED', 'ORDER', new_order_id, actor_id=buyer_id, actor_role='buyer',
                      details={'product': product.name, 'quantity': quantity, 'total': total})

        # Add notification for farmer
        db.add(Notification(
            id=f"notif-{uuid.uuid4().hex[:10]}",
            user_id=created_orders[0].farmer_id,
            role='farmer',
            title=f"New Order Placed: {len(created_orders)} lot(s)",
            message=f"{buyer_name} placed an order for {created_orders[0].product_name} ({created_orders[0].quantity} {created_orders[0].unit}).",
            tone='info',
            link='/farmer/orders',
            created_at=datetime.now(timezone.utc)
        ))

        db.commit()
        return jsonify({'success': True, 'orders': [o.to_dict() for o in created_orders]}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

ORDER_STAGES = ['Order Placed', 'Confirmed', 'Packed', 'Picked Up', 'In Transit', 'Delivered']

@app.route('/api/orders/<order_id>/stage', methods=['PATCH'])
def advance_order_stage(order_id):
    db = get_db()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        data = request.get_json() or {}
        target_stage = data.get('stage')

        if target_stage:
            if target_stage not in ORDER_STAGES:
                return jsonify({'error': f'Invalid stage: {target_stage}'}), 400
            order.stage = target_stage
        else:
            current_idx = ORDER_STAGES.index(order.stage) if order.stage in ORDER_STAGES else 0
            next_idx = min(current_idx + 1, len(ORDER_STAGES) - 1)
            order.stage = ORDER_STAGES[next_idx]

        log_audit(db, 'ORDER_STAGE_UPDATED', 'ORDER', order_id, details={'new_stage': order.stage})
        db.commit()
        return jsonify({'success': True, 'order': order.to_dict()})
    finally:
        db.close()

@app.route('/api/orders/<order_id>/cancel', methods=['POST'])
def cancel_order(order_id):
    data = request.get_json() or {}
    reason = data.get('reason', 'Buyer cancellation request')

    db = get_db()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        order.stage = 'Cancelled'
        order.is_disrupted = True
        order.disruption_reason = reason

        # Create Disruption Event record for recovery workflow
        disruption_id = f"DISR-{uuid.uuid4().hex[:8].upper()}"
        disruption = DisruptionEvent(
            id=disruption_id,
            order_id=order.id,
            shipment_id=order.shipment_id,
            event_type='cancellation',
            severity='high',
            description=f"Cancellation on {order.id}: {reason}. Harvested batch of {order.quantity} {order.unit} {order.product_name} needs re-matching.",
            affected_crop=order.product_name,
            affected_quantity=order.quantity,
            original_buyer_id=order.buyer_id,
            status='open',
            created_at=datetime.now(timezone.utc)
        )
        db.add(disruption)

        # Notify Farmer of disruption
        db.add(Notification(
            id=f"notif-{uuid.uuid4().hex[:10]}",
            user_id=order.farmer_id,
            role='farmer',
            title=f"Order Cancelled: {order.id}",
            message=f"{order.buyer_name} cancelled {order.quantity} {order.unit} {order.product_name}. Open Disruption Recovery to match alternative buyers.",
            tone='error',
            link='/disruptions',
            created_at=datetime.now(timezone.utc)
        ))

        log_audit(db, 'ORDER_CANCELLED', 'ORDER', order_id, details={'reason': reason, 'disruption_id': disruption_id})
        db.commit()
        return jsonify({'success': True, 'order': order.to_dict(), 'disruption': disruption.to_dict()})
    finally:
        db.close()

# ----------------- LOAD POOLING -----------------
@app.route('/api/pooling/opportunities', methods=['GET'])
def get_pooling_opportunities():
    db = get_db()
    try:
        corridor = request.args.get('corridor', 'Bengaluru East')
        # Pull active listings or open confirmed orders
        listings = db.query(ProduceListing).filter(ProduceListing.is_active == True, ProduceListing.available_quantity > 0).all()
        candidate_items = [l.to_dict() for l in listings]

        opportunities = pooling_engine.find_pooling_opportunities(candidate_items, destination_corridor=corridor)
        return jsonify({
            'opportunities': opportunities,
            'count': len(opportunities),
            'destinationCorridor': corridor
        })
    finally:
        db.close()

@app.route('/api/pooling/confirm', methods=['POST'])
def confirm_pool():
    data = request.get_json() or {}
    item_ids = data.get('itemIds', [])
    destination = data.get('destination', 'Bengaluru East Hub')
    vehicle_name = data.get('vehicleName', 'Tata 407 (3.5T Reefer)')

    if not item_ids or len(item_ids) < 2:
        return jsonify({'error': 'A pooled shipment requires at least 2 distinct produce lots.'}), 400

    db = get_db()
    try:
        listings = db.query(ProduceListing).filter(ProduceListing.id.in_(item_ids)).all()
        total_quantity = sum(l.available_quantity for l in listings)
        origins = list({l.location.split(',')[0].strip() for l in listings})

        shipment_count = db.query(Shipment).count()
        shipment_id = f"SHP-{shipment_count + 102}"

        # Calculate costs
        separate_cost = round(total_quantity * 3.4, 2)
        pooled_cost = round(separate_cost * 0.72, 2)
        savings = round(separate_cost - pooled_cost, 2)

        new_shipment = Shipment(
            id=shipment_id,
            vehicle_id='KA-04-TR-8821',
            vehicle_name=vehicle_name,
            vehicle_capacity_kg=3500.0,
            current_payload_kg=total_quantity,
            status='Confirmed',
            origin=f"{', '.join(origins)} FPO Hubs",
            destination=destination,
            planned_distance_km=112.0,
            planned_duration_hours=4.2,
            baseline_cost=separate_cost,
            optimized_cost=pooled_cost,
            estimated_savings=savings,
            savings_pct=28.0,
            pooled_orders_count=len(listings),
            explanation=f"Confirmed consolidated run pooling {len(listings)} lots ({total_quantity} kg) from {', '.join(origins)} to {destination}.",
            created_at=datetime.now(timezone.utc)
        )
        db.add(new_shipment)
        db.flush()

        # Add sequence of stops
        seq = 1
        for orig in origins:
            stop = ShipmentStop(
                id=f"stop-{shipment_id}-{seq}",
                shipment_id=new_shipment.id,
                sequence=seq,
                stop_type='pickup',
                name=f"{orig} FPO Hub",
                location=f"{orig}, Karnataka",
                lat=13.2000 + (seq * 0.05),
                lng=77.8000 + (seq * 0.05),
                order_ids_json=json.dumps(item_ids),
                eta=f"0{7 + seq}:30 AM",
                status='Scheduled'
            )
            db.add(stop)
            seq += 1

        delivery_stop = ShipmentStop(
            id=f"stop-{shipment_id}-{seq}",
            shipment_id=new_shipment.id,
            sequence=seq,
            stop_type='delivery',
            name=f"{destination} Consolidation Depot",
            location=f"{destination}, Bengaluru",
            lat=12.9800,
            lng=77.6500,
            order_ids_json=json.dumps(item_ids),
            eta='04:30 PM',
            status='Upcoming'
        )
        db.add(delivery_stop)

        log_audit(db, 'POOL_CONFIRMED', 'SHIPMENT', shipment_id,
                  details={'itemIds': item_ids, 'total_kg': total_quantity, 'savings_inr': savings})
        db.commit()

        return jsonify({'success': True, 'shipment': new_shipment.to_dict()}), 201
    finally:
        db.close()

# ----------------- PRICE & BUYER OFFER COMPARISON -----------------
@app.route('/api/offers', methods=['GET'])
def list_offers():
    db = get_db()
    try:
        listing_id = request.args.get('listingId')
        q = db.query(BuyerOffer)
        if listing_id:
            q = q.filter(BuyerOffer.listing_id == listing_id)
        offers = q.order_by(desc(BuyerOffer.created_at)).all()
        return jsonify({'offers': [o.to_dict() for o in offers]})
    finally:
        db.close()

@app.route('/api/offers/compare', methods=['POST'])
def compare_offers():
    data = request.get_json() or {}
    listing_id = data.get('listingId')
    priority = data.get('priority', 'max_net_proceeds')

    db = get_db()
    try:
        q = db.query(BuyerOffer).filter(BuyerOffer.status == 'pending')
        if listing_id:
            q = q.filter(BuyerOffer.listing_id == listing_id)
        offers = q.all()

        offers_data = [o.to_dict() for o in offers]
        result = pricing_engine.compare_offers(offers_data, priority=priority)
        return jsonify(result)
    finally:
        db.close()

@app.route('/api/offers/<offer_id>/accept', methods=['POST'])
def accept_offer(offer_id):
    db = get_db()
    try:
        offer = db.query(BuyerOffer).filter(BuyerOffer.id == offer_id).first()
        if not offer:
            return jsonify({'error': 'Offer not found'}), 404

        offer.status = 'accepted'
        fin = compute_offer_financials(offer.to_dict())

        # Generate order from accepted offer
        order_seq = db.query(Order).count() + 1046
        order_id = f"ORD-{order_seq}"
        new_order = Order(
            id=order_id,
            buyer_id=offer.buyer_id,
            buyer_name=offer.buyer_name,
            farmer_id='f1',
            farmer_name="Farmers' FPO, Kolar",
            listing_id=offer.listing_id,
            product_name=offer.crop_name,
            quantity=offer.requested_quantity,
            unit=offer.unit,
            subtotal=fin['grossRevenue'],
            logistics_fee=fin['estimatedFreight'],
            platform_fee=fin['platformFee'],
            total=round(fin['grossRevenue'] + fin['estimatedFreight'] + fin['platformFee'], 2),
            payment_method='Accepted Buyer Offer',
            stage='Confirmed',
            placed_on=datetime.now().strftime('%Y-%m-%d'),
            eta=(datetime.now().replace(microsecond=0) + datetime.now().astimezone().resolution * 2).strftime('%Y-%m-%d'),
            delivery_location=offer.delivery_destination,
            created_at=datetime.now(timezone.utc)
        )
        db.add(new_order)
        log_audit(db, 'OFFER_ACCEPTED', 'BUYER_OFFER', offer_id, details={'order_id': order_id, 'net_proceeds': fin['netProceeds']})
        db.commit()

        return jsonify({'success': True, 'order': new_order.to_dict(), 'offer': offer.to_dict()})
    finally:
        db.close()

# ----------------- DISRUPTION RECOVERY -----------------
@app.route('/api/disruptions', methods=['GET'])
def list_disruptions():
    db = get_db()
    try:
        status = request.args.get('status')
        q = db.query(DisruptionEvent)
        if status:
            q = q.filter(DisruptionEvent.status == status)
        events = q.order_by(desc(DisruptionEvent.created_at)).all()
        return jsonify({'disruptions': [e.to_dict() for e in events]})
    finally:
        db.close()

@app.route('/api/disruptions/<disruption_id>/matches', methods=['GET'])
def get_disruption_matches(disruption_id):
    db = get_db()
    try:
        disr = db.query(DisruptionEvent).filter(DisruptionEvent.id == disruption_id).first()
        if not disr:
            return jsonify({'error': 'Disruption event not found'}), 404

        # Rank alternative buyers
        matches = matching_engine.match_alternative_buyers(
            crop=disr.affected_crop or 'Tomato',
            quantity_kg=disr.affected_quantity or 180.0,
            asking_price_per_kg=30.0,
            quality='Grade A',
            origin_location='Kolar',
            excluded_buyer_id=disr.original_buyer_id
        )
        return jsonify({'disruption': disr.to_dict(), 'alternativeBuyers': matches})
    finally:
        db.close()

@app.route('/api/disruptions/<disruption_id>/recover', methods=['POST'])
def recover_disruption(disruption_id):
    data = request.get_json() or {}
    chosen_buyer_id = data.get('buyerId')
    chosen_buyer_name = data.get('buyerName', 'Alternative Buyer')
    offered_price = float(data.get('agreedPrice') or 29.0)

    if not chosen_buyer_id:
        return jsonify({'error': 'Must select an alternative buyer to reassign.'}), 400

    db = get_db()
    try:
        disr = db.query(DisruptionEvent).filter(DisruptionEvent.id == disruption_id).first()
        if not disr:
            return jsonify({'error': 'Disruption event not found'}), 404

        disr.status = 'resolved'
        disr.resolved_alternative_buyer_id = chosen_buyer_id
        disr.resolved_at = datetime.now(timezone.utc)
        disr.recovery_notes = (
            f"Successfully reallocated {disr.affected_quantity} kg of {disr.affected_crop} "
            f"to {chosen_buyer_name} at ₹{offered_price:.2f}/kg, preventing harvest spoilage."
        )

        # Update the original order if referenced
        if disr.order_id:
            order = db.query(Order).filter(Order.id == disr.order_id).first()
            if order:
                order.stage = 'Confirmed'
                order.buyer_id = chosen_buyer_id
                order.buyer_name = chosen_buyer_name
                order.is_disrupted = False
                order.disruption_reason = f"Reassigned to {chosen_buyer_name} via Disruption Recovery"

        log_audit(db, 'DISRUPTION_RESOLVED', 'DISRUPTION_EVENT', disruption_id,
                  details={'new_buyer_id': chosen_buyer_id, 'agreed_price': offered_price})
        db.commit()

        return jsonify({'success': True, 'disruption': disr.to_dict()})
    finally:
        db.close()

# ----------------- FORECASTING & SUPPLY GAPS -----------------
@app.route('/api/forecasting', methods=['GET'])
def get_forecasting():
    crop = request.args.get('crop', 'Tomato')
    location = request.args.get('location', 'Kolar')
    eval_result = forecasting_engine.evaluate_models(crop=crop, location=location)
    return jsonify(eval_result)

@app.route('/api/forecasting/gaps', methods=['GET'])
def get_supply_demand_gaps():
    db = get_db()
    try:
        listings = db.query(ProduceListing).filter(ProduceListing.is_active == True).all()
        listings_data = [l.to_dict() for l in listings]
        gaps = forecasting_engine.detect_supply_demand_gaps(listings_data)
        return jsonify({'gaps': gaps, 'evaluatedListings': len(listings_data)})
    finally:
        db.close()

# ----------------- SHIPMENTS & LOGISTICS -----------------
@app.route('/api/shipments', methods=['GET'])
def list_shipments():
    db = get_db()
    try:
        shipments = db.query(Shipment).order_by(desc(Shipment.created_at)).all()
        return jsonify({'shipments': [s.to_dict() for s in shipments]})
    finally:
        db.close()

@app.route('/api/shipments/<shipment_id>/stage', methods=['PATCH'])
def advance_shipment_stage(shipment_id):
    db = get_db()
    try:
        shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
        if not shipment:
            return jsonify({'error': 'Shipment not found'}), 404

        data = request.get_json() or {}
        new_status = data.get('status')
        valid_statuses = ['Draft', 'Confirmed', 'Scheduled', 'In Transit', 'Delivered', 'Disrupted']

        if new_status:
            if new_status not in valid_statuses:
                return jsonify({'error': f'Invalid status: {new_status}'}), 400
            shipment.status = new_status
        else:
            curr_idx = valid_statuses.index(shipment.status) if shipment.status in valid_statuses else 1
            shipment.status = valid_statuses[min(curr_idx + 1, len(valid_statuses) - 1)]

        log_audit(db, 'SHIPMENT_STATUS_UPDATED', 'SHIPMENT', shipment_id, details={'status': shipment.status})
        db.commit()
        return jsonify({'success': True, 'shipment': shipment.to_dict()})
    finally:
        db.close()

# ----------------- OPERATIONAL ANALYTICS -----------------
@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    db = get_db()
    try:
        listings = db.query(ProduceListing).filter(ProduceListing.is_active == True).all()
        active_listings_count = len(listings)
        total_available_kg = sum(l.available_quantity for l in listings)

        orders = db.query(Order).all()
        total_orders_count = len(orders)
        fulfilled_orders = len([o for o in orders if o.stage == 'Delivered'])
        active_orders = len([o for o in orders if o.stage not in ['Delivered', 'Cancelled']])
        total_gross_volume_inr = sum(o.total for o in orders if o.stage != 'Cancelled')

        shipments = db.query(Shipment).all()
        active_shipments_count = len([s for s in shipments if s.status != 'Delivered'])
        total_pooled_kg = sum(s.current_payload_kg for s in shipments)
        total_logistics_savings_inr = sum(s.estimated_savings for s in shipments)

        disruptions = db.query(DisruptionEvent).all()
        open_disruptions_count = len([d for d in disruptions if d.status == 'open'])
        recovered_disruptions_count = len([d for d in disruptions if d.status == 'resolved'])

        # Dynamic volume by crop from actual orders
        crop_volumes = {}
        for o in orders:
            crop_volumes[o.product_name] = crop_volumes.get(o.product_name, 0.0) + o.quantity

        top_crops = [
            {'name': crop, 'volume': round(vol, 1)}
            for crop, vol in sorted(crop_volumes.items(), key=lambda x: x[1], reverse=True)[:5]
        ]

        # Category breakdown from active listings
        cat_counts = {}
        for l in listings:
            cat_counts[l.category] = cat_counts.get(l.category, 0) + 1

        category_split = [
            {'name': cat, 'value': count}
            for cat, count in cat_counts.items()
        ]

        return jsonify({
            'metrics': {
                'activeListingsCount': active_listings_count,
                'totalAvailableKg': round(total_available_kg, 1),
                'totalOrdersCount': total_orders_count,
                'activeOrdersCount': active_orders,
                'fulfilledOrdersCount': fulfilled_orders,
                'totalGrossVolumeINR': round(total_gross_volume_inr, 2),
                'activeShipmentsCount': active_shipments_count,
                'totalPooledKg': round(total_pooled_kg, 1),
                'totalLogisticsSavingsINR': round(total_logistics_savings_inr, 2),
                'openDisruptionsCount': open_disruptions_count,
                'recoveredDisruptionsCount': recovered_disruptions_count,
            },
            'topCrops': top_crops,
            'categorySplit': category_split,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
    finally:
        db.close()

# ----------------- SAP ENTERPRISE GATEWAY -----------------
@app.route('/api/sap/status', methods=['GET'])
def sap_status():
    return jsonify({
        'status': 'READY_FOR_RFC_ODATA',
        'gateway': 'FarmLink AI — SAP S/4HANA & SAP TM Integration Bridge',
        'protocolsSupported': ['OData v4', 'RFC BAPI', 'cXML', 'REST Webhooks'],
        'connectedAdapters': [
            {'system': 'SAP S/4HANA Sourcing & Procurement (MM)', 'api': 'API_PURCHASEORDER_PROCESS_SRV', 'entity': 'A_PurchaseOrder'},
            {'system': 'SAP Transportation Management (SAP TM 9.6+)', 'api': 'FreightOrder_In', 'entity': 'FreightOrder'},
            {'system': 'SAP Supply Chain Control Tower', 'api': 'EventManagement_In', 'entity': 'DisruptionAlert'},
        ],
        'mockSimulation': True,
    })

@app.route('/api/sap/export-po/<order_id>', methods=['POST'])
def export_sap_po(order_id):
    db = get_db()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        payload = sap_adapter.map_order_to_sap_purchase_order(order.to_dict())
        log_audit(db, 'SAP_PO_EXPORTED', 'ORDER', order_id, details={'sap_po': payload.get('PurchaseOrder')})
        db.commit()
        return jsonify({'success': True, 'sapPurchaseOrder': payload})
    finally:
        db.close()

@app.route('/api/sap/export-tm/<shipment_id>', methods=['POST'])
def export_sap_tm(shipment_id):
    db = get_db()
    try:
        shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
        if not shipment:
            return jsonify({'error': 'Shipment not found'}), 404
        payload = sap_adapter.map_shipment_to_sap_tm_freight_order(shipment.to_dict())
        log_audit(db, 'SAP_TM_EXPORTED', 'SHIPMENT', shipment_id, details={'sap_fo': payload.get('FreightOrderID')})
        db.commit()
        return jsonify({'success': True, 'sapFreightOrder': payload})
    finally:
        db.close()

@app.route('/api/sap/control-tower-alert/<disruption_id>', methods=['POST'])
def export_sap_disruption(disruption_id):
    db = get_db()
    try:
        disr = db.query(DisruptionEvent).filter(DisruptionEvent.id == disruption_id).first()
        if not disr:
            return jsonify({'error': 'Disruption not found'}), 404
        payload = sap_adapter.create_sap_control_tower_disruption_alert(disr.to_dict())
        log_audit(db, 'SAP_ALERT_DISPATCHED', 'DISRUPTION_EVENT', disruption_id, details={'alert_id': payload.get('AlertID')})
        db.commit()
        return jsonify({'success': True, 'sapControlTowerAlert': payload})
    finally:
        db.close()

# ----------------- NOTIFICATIONS & AUDIT -----------------
@app.route('/api/notifications', methods=['GET'])
def list_notifications():
    db = get_db()
    try:
        role = request.args.get('role')
        user_id = request.args.get('userId')
        q = db.query(Notification)
        if user_id:
            q = q.filter((Notification.user_id == user_id) | (Notification.user_id == None))
        if role:
            q = q.filter((Notification.role == role) | (Notification.role == None))
        notifs = q.order_by(desc(Notification.created_at)).limit(20).all()
        return jsonify({'notifications': [n.to_dict() for n in notifs]})
    finally:
        db.close()

@app.route('/api/notifications/<notif_id>/read', methods=['PATCH'])
def mark_notification_read(notif_id):
    db = get_db()
    try:
        n = db.query(Notification).filter(Notification.id == notif_id).first()
        if n:
            n.is_read = True
            db.commit()
        return jsonify({'success': True})
    finally:
        db.close()

@app.route('/api/audit-logs', methods=['GET'])
def list_audit_logs():
    db = get_db()
    try:
        logs = db.query(AuditLog).order_by(desc(AuditLog.created_at)).limit(50).all()
        return jsonify({'auditLogs': [l.to_dict() for l in logs]})
    finally:
        db.close()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"FarmLink AI Flask backend starting on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
