"""
FarmLink AI — SQLAlchemy Data Models
Covers Users, Organizations, Produce Listings, Orders, Shipments,
Buyer Offers, Disruptions, Audit Logs, and Notifications.
"""

from datetime import datetime, timezone
import json
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, create_engine
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

Base = declarative_base()

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = 'users'

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    role = Column(String(30), nullable=False) # 'farmer', 'buyer', 'fpo', 'logistics', 'admin'
    org_name = Column(String(150), nullable=True)
    location = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=True)
    avatar = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)

    listings = relationship('ProduceListing', back_populates='farmer', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'orgName': self.org_name or self.name,
            'location': self.location,
            'phone': self.phone,
            'avatar': self.avatar,
            'isActive': self.is_active,
            'joined': self.created_at.strftime('%Y-%m-%d') if self.created_at else None,
        }


class ProduceListing(Base):
    __tablename__ = 'produce_listings'

    id = Column(String(50), primary_key=True)
    farmer_id = Column(String(50), ForeignKey('users.id'), nullable=False)
    name = Column(String(100), nullable=False) # Crop name: Tomato, Onion, etc.
    category = Column(String(50), nullable=False, default='Vegetables')
    quantity = Column(Float, nullable=False) # Initial quantity in units
    available_quantity = Column(Float, nullable=False) # Current inventory available
    unit = Column(String(20), nullable=False, default='kg')
    price = Column(Float, nullable=False) # Asking price per unit in INR
    quality = Column(String(50), nullable=False, default='Grade A')
    harvest_date = Column(String(30), nullable=True)
    location = Column(String(150), nullable=False)
    demand = Column(String(30), default='Medium')
    image = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)

    farmer = relationship('User', back_populates='listings')

    def to_dict(self):
        return {
            'id': self.id,
            'farmerId': self.farmer_id,
            'farmer': self.farmer.org_name if self.farmer else "Farmer",
            'name': self.name,
            'category': self.category,
            'quantity': self.available_quantity,
            'initialQuantity': self.quantity,
            'unit': self.unit,
            'price': self.price,
            'quality': self.quality,
            'harvest': 'Fresh Harvest',
            'harvestDate': self.harvest_date,
            'location': self.location,
            'demand': self.demand,
            'image': self.image or 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=800&auto=format&fit=crop',
            'description': self.description or '',
            'isActive': self.is_active,
            'rating': 4.7,
            'reviews': 24,
        }


class Order(Base):
    __tablename__ = 'orders'

    id = Column(String(50), primary_key=True)
    buyer_id = Column(String(50), nullable=False)
    buyer_name = Column(String(150), nullable=False)
    farmer_id = Column(String(50), nullable=False)
    farmer_name = Column(String(150), nullable=False)
    listing_id = Column(String(50), nullable=True)
    product_name = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False, default='kg')
    subtotal = Column(Float, nullable=False)
    logistics_fee = Column(Float, nullable=False)
    platform_fee = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    payment_method = Column(String(50), default='UPI')
    stage = Column(String(50), default='Order Placed')
    placed_on = Column(String(30), nullable=False)
    eta = Column(String(30), nullable=True)
    delivery_location = Column(String(255), nullable=False)
    shipment_id = Column(String(50), nullable=True)
    is_disrupted = Column(Boolean, default=False)
    disruption_reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'buyerId': self.buyer_id,
            'buyer': self.buyer_name,
            'farmerId': self.farmer_id,
            'farmer': self.farmer_name,
            'listingId': self.listing_id,
            'product': self.product_name,
            'quantity': self.quantity,
            'unit': self.unit,
            'subtotal': self.subtotal,
            'logisticsFee': self.logistics_fee,
            'platformFee': self.platform_fee,
            'total': self.total,
            'paymentMethod': self.payment_method,
            'stage': self.stage,
            'placedOn': self.placed_on,
            'eta': self.eta,
            'deliveryLocation': self.delivery_location,
            'shipmentId': self.shipment_id,
            'isDisrupted': self.is_disrupted,
            'disruptionReason': self.disruption_reason,
        }


class BuyerOffer(Base):
    __tablename__ = 'buyer_offers'

    id = Column(String(50), primary_key=True)
    listing_id = Column(String(50), nullable=False)
    buyer_id = Column(String(50), nullable=False)
    buyer_name = Column(String(150), nullable=False)
    crop_name = Column(String(100), nullable=False)
    offered_price = Column(Float, nullable=False) # INR/unit
    requested_quantity = Column(Float, nullable=False)
    unit = Column(String(20), default='kg')
    delivery_destination = Column(String(150), nullable=False)
    distance_km = Column(Float, default=30.0)
    transit_days = Column(Integer, default=1)
    quality_requirement = Column(String(50), default='Grade A')
    payment_terms = Column(String(50), default='Immediate UPI')
    status = Column(String(30), default='pending') # pending, accepted, rejected, expired
    created_at = Column(DateTime, default=utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'listingId': self.listing_id,
            'buyerId': self.buyer_id,
            'buyerName': self.buyer_name,
            'cropName': self.crop_name,
            'offeredPrice': self.offered_price,
            'requestedQuantity': self.requested_quantity,
            'unit': self.unit,
            'deliveryDestination': self.delivery_destination,
            'distanceKm': self.distance_km,
            'transitDays': self.transit_days,
            'qualityRequirement': self.quality_requirement,
            'paymentTerms': self.payment_terms,
            'status': self.status,
            'createdAt': self.created_at.strftime('%Y-%m-%d') if self.created_at else None,
        }


class Shipment(Base):
    __tablename__ = 'shipments'

    id = Column(String(50), primary_key=True)
    vehicle_id = Column(String(50), nullable=False, default='KA-04-TR-1029')
    vehicle_name = Column(String(100), nullable=False, default='Tata 407 (3.5T Reefer)')
    vehicle_capacity_kg = Column(Float, nullable=False, default=3500.0)
    current_payload_kg = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), default='Confirmed') # Draft, Confirmed, Scheduled, In Transit, Delivered, Disrupted
    origin = Column(String(150), nullable=False)
    destination = Column(String(150), nullable=False)
    planned_distance_km = Column(Float, default=128.0)
    planned_duration_hours = Column(Float, default=4.5)
    baseline_cost = Column(Float, default=4800.0)
    optimized_cost = Column(Float, default=3450.0)
    estimated_savings = Column(Float, default=1350.0)
    savings_pct = Column(Float, default=28.1)
    pooled_orders_count = Column(Integer, default=0)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    stops = relationship('ShipmentStop', back_populates='shipment', cascade='all, delete-orphan', order_by='ShipmentStop.sequence')

    def to_dict(self):
        return {
            'id': self.id,
            'vehicleId': self.vehicle_id,
            'vehicleName': self.vehicle_name,
            'vehicleCapacityKg': self.vehicle_capacity_kg,
            'currentPayloadKg': self.current_payload_kg,
            'capacityUtilizationPct': round((self.current_payload_kg / self.vehicle_capacity_kg * 100), 1) if self.vehicle_capacity_kg else 0,
            'status': self.status,
            'origin': self.origin,
            'destination': self.destination,
            'plannedDistanceKm': self.planned_distance_km,
            'plannedDurationHours': self.planned_duration_hours,
            'baselineCost': self.baseline_cost,
            'optimizedCost': self.optimized_cost,
            'estimatedSavings': self.estimated_savings,
            'savingsPct': self.savings_pct,
            'pooledOrdersCount': self.pooled_orders_count,
            'explanation': self.explanation,
            'stops': [s.to_dict() for s in self.stops] if self.stops else [],
            'createdAt': self.created_at.strftime('%Y-%m-%d') if self.created_at else None,
        }


class ShipmentStop(Base):
    __tablename__ = 'shipment_stops'

    id = Column(String(50), primary_key=True)
    shipment_id = Column(String(50), ForeignKey('shipments.id'), nullable=False)
    sequence = Column(Integer, nullable=False)
    stop_type = Column(String(20), nullable=False) # 'pickup' or 'delivery'
    name = Column(String(150), nullable=False)
    location = Column(String(200), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    order_ids_json = Column(Text, default='[]')
    eta = Column(String(30), nullable=True)
    status = Column(String(50), default='Upcoming')

    shipment = relationship('Shipment', back_populates='stops')

    def to_dict(self):
        try:
            order_ids = json.loads(self.order_ids_json or '[]')
        except Exception:
            order_ids = []
        return {
            'id': self.id,
            'shipmentId': self.shipment_id,
            'sequence': self.sequence,
            'type': self.stop_type,
            'name': self.name,
            'location': self.location,
            'position': {'lat': self.lat, 'lng': self.lng},
            'orderIds': order_ids,
            'eta': self.eta,
            'status': self.status,
        }


class DisruptionEvent(Base):
    __tablename__ = 'disruption_events'

    id = Column(String(50), primary_key=True)
    order_id = Column(String(50), nullable=True)
    shipment_id = Column(String(50), nullable=True)
    event_type = Column(String(50), nullable=False) # 'cancellation', 'delay', 'quality_rejection', 'route_block'
    severity = Column(String(20), default='high') # 'low', 'medium', 'high', 'critical'
    description = Column(Text, nullable=False)
    affected_crop = Column(String(100), nullable=True)
    affected_quantity = Column(Float, default=0.0)
    original_buyer_id = Column(String(50), nullable=True)
    status = Column(String(30), default='open') # 'open', 'matched', 'resolved', 'cancelled'
    resolved_alternative_buyer_id = Column(String(50), nullable=True)
    recovery_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    resolved_at = Column(DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'orderId': self.order_id,
            'shipmentId': self.shipment_id,
            'eventType': self.event_type,
            'severity': self.severity,
            'description': self.description,
            'affectedCrop': self.affected_crop,
            'affectedQuantity': self.affected_quantity,
            'originalBuyerId': self.original_buyer_id,
            'status': self.status,
            'resolvedBuyerId': self.resolved_alternative_buyer_id,
            'recoveryNotes': self.recovery_notes,
            'createdAt': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None,
            'resolvedAt': self.resolved_at.strftime('%Y-%m-%d %H:%M') if self.resolved_at else None,
        }


class AuditLog(Base):
    __tablename__ = 'audit_logs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    actor_id = Column(String(50), nullable=True)
    actor_role = Column(String(30), nullable=True)
    action = Column(String(100), nullable=False) # e.g. 'POOL_CONFIRMED', 'DISRUPTION_RESOLVED', 'ORDER_PLACED'
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=False)
    details = Column(Text, nullable=True) # JSON details
    created_at = Column(DateTime, default=utcnow)

    def to_dict(self):
        try:
            details_obj = json.loads(self.details or '{}')
        except Exception:
            details_obj = {'raw': self.details}
        return {
            'id': self.id,
            'actorId': self.actor_id,
            'actorRole': self.actor_role,
            'action': self.action,
            'entityType': self.entity_type,
            'entityId': self.entity_id,
            'details': details_obj,
            'timestamp': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
        }


class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(String(50), primary_key=True)
    user_id = Column(String(50), nullable=True) # None = broadcast to role or all
    role = Column(String(30), nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    tone = Column(String(20), default='info') # 'success', 'warning', 'info', 'error'
    link = Column(String(100), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'role': self.role,
            'title': self.title,
            'message': self.message,
            'tone': self.tone,
            'link': self.link,
            'isRead': self.is_read,
            'timestamp': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None,
        }
