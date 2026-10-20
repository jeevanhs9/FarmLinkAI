"""
FarmLink AI — Comprehensive Backend Test Suite
Tests pooling algorithms, matching & disruption recovery, price calculations,
forecasting baselines, SAP enterprise mapping, and REST API endpoints.
"""

import sys
import os
import json
import pytest

# Ensure server module is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, get_db
from models import Base, User, ProduceListing, Order, BuyerOffer, Shipment, DisruptionEvent
from pooling_engine import (
    PoolingEngine, are_crops_compatible, select_best_vehicle,
    calculate_separate_cost, calculate_pooled_cost
)
from matching_engine import MatchingEngine
from pricing_engine import PricingEngine, compute_offer_financials
from forecasting_engine import ForecastingEngine, calculate_metrics
from sap_adapter import SAPEnterpriseAdapter
from seed import seed_database

@pytest.fixture(scope='session', autouse=True)
def setup_test_db():
    seed_database()

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# ----------------- UNIT TESTS: POOLING ENGINE -----------------
def test_crop_compatibility():
    assert are_crops_compatible('Tomato', 'Tomato') is True
    assert are_crops_compatible('Tomato', 'Chilli') is True # Both fruit_veg
    assert are_crops_compatible('Tomato', 'Potato') is True # Compatible in ventilated medium carrier
    assert are_crops_compatible('Tomato', 'Milk (Cow)') is False # Incompatible (dairy requires dedicated reefer)

def test_vehicle_selection():
    v_small = select_best_vehicle(800.0)
    assert v_small['capacity_kg'] == 1000.0

    v_med = select_best_vehicle(2400.0)
    assert v_med['capacity_kg'] == 3500.0

def test_load_pooling_savings():
    engine = PoolingEngine()
    items = [
        {'id': 'p1', 'product': 'Tomato', 'quantity': 350.0, 'location': 'Kolar'},
        {'id': 'p2', 'product': 'Tomato', 'quantity': 450.0, 'location': 'Chikkaballapur'},
        {'id': 'p3', 'product': 'Tomato', 'quantity': 250.0, 'location': 'Kolar'},
    ]
    opps = engine.find_pooling_opportunities(items, destination_corridor='Bengaluru East')
    assert len(opps) >= 1
    opp = opps[0]
    assert opp['total_quantity_kg'] == 1050.0
    assert opp['estimated_savings_inr'] > 0
    assert opp['savings_pct'] > 15.0
    assert 'Consolidates' in opp['explanation']

# ----------------- UNIT TESTS: MATCHING & DISRUPTION ENGINE -----------------
def test_matching_engine_disruption_recovery():
    engine = MatchingEngine()
    matches = engine.match_alternative_buyers(
        crop='Tomato',
        quantity_kg=180.0,
        asking_price_per_kg=30.0,
        quality='Grade A',
        origin_location='Kolar',
        excluded_buyer_id='b1'
    )
    assert len(matches) >= 2
    # Ensure ranked highest score first
    assert matches[0]['match_score'] >= matches[1]['match_score']
    # Check that scoring breakdown is complete
    assert 'crop_compatibility' in matches[0]['breakdown']
    assert 'price_feasibility' in matches[0]['breakdown']
    assert matches[0]['estimated_offer_price'] > 0

# ----------------- UNIT TESTS: PRICING & OFFER COMPARISON -----------------
def test_pricing_financials():
    offer = {
        'offeredPrice': 30.0,
        'requestedQuantity': 1000.0,
        'distanceKm': 50.0,
        'transitDays': 1,
    }
    fin = compute_offer_financials(offer)
    assert fin['grossRevenue'] == 30000.0
    assert fin['estimatedFreight'] == 600.0 # 50km * 1.0 ton * 12/ton-km
    assert fin['platformFee'] == 600.0      # 2% of 30,000
    assert fin['netProceeds'] == 28800.0    # 30,000 - 600 - 600
    assert fin['netPricePerKg'] == 28.8

def test_pricing_multi_objective_ranking():
    engine = PricingEngine()
    offers = [
        {'id': 'o1', 'buyerName': 'Local Retailer', 'offeredPrice': 30.0, 'requestedQuantity': 500.0, 'distanceKm': 20.0, 'transitDays': 1},
        {'id': 'o2', 'buyerName': 'Distant Mandi', 'offeredPrice': 31.0, 'requestedQuantity': 500.0, 'distanceKm': 120.0, 'transitDays': 3},
    ]
    # Under net proceeds: compare take-home
    res_net = engine.compare_offers(offers, priority='max_net_proceeds')
    assert res_net['recommendedOfferId'] is not None

    # Under min distance: Local Retailer must win
    res_dist = engine.compare_offers(offers, priority='min_distance')
    assert res_dist['recommendedBuyer'] == 'Local Retailer'

# ----------------- UNIT TESTS: FORECASTING ENGINE -----------------
def test_forecasting_metrics():
    actual = [100.0, 110.0, 120.0, 130.0]
    pred = [95.0, 112.0, 118.0, 135.0]
    metrics = calculate_metrics(actual, pred)
    assert metrics['mae'] == 3.5
    assert metrics['mape_pct'] > 0

def test_forecasting_evaluation():
    engine = ForecastingEngine()
    eval_res = engine.evaluate_models('Tomato', 'Kolar')
    assert 'naive_moving_average_model' in eval_res
    assert 'linear_trend_model' in eval_res
    assert len(eval_res['next_4_weeks_forecast_kg']) == 4

def test_supply_demand_gap_detection():
    engine = ForecastingEngine()
    listings = [
        {'product': 'Tomato', 'quantity': 6000.0}, # Surplus (benchmark ~3500)
        {'product': 'Onion', 'quantity': 500.0},   # Shortage (benchmark ~2200)
    ]
    gaps = engine.detect_supply_demand_gaps(listings)
    tomato_gap = next(g for g in gaps if g['crop'] == 'Tomato')
    onion_gap = next(g for g in gaps if g['crop'] == 'Onion')
    assert tomato_gap['status'] == 'Surplus Risk'
    assert onion_gap['status'] == 'Shortage Alert'

# ----------------- UNIT TESTS: SAP ADAPTER -----------------
def test_sap_mappings():
    adapter = SAPEnterpriseAdapter()
    po = adapter.map_order_to_sap_purchase_order({
        'id': 'ORD-1042', 'product': 'Tomato', 'quantity': 120, 'unit': 'kg',
        'subtotal': 3600, 'logisticsFee': 288, 'platformFee': 72, 'total': 3960,
        'farmer': "Farmers' FPO, Kolar", 'farmerId': 'f1', 'buyer': 'ABC Hostel'
    })
    assert po['_sap_entity_type'] == 'A_PurchaseOrderType'
    assert po['CompanyCode'] == '1010'
    assert len(po['to_PurchaseOrderItem']) == 1

    fo = adapter.map_shipment_to_sap_tm_freight_order({
        'id': 'SHP-101', 'status': 'In Transit', 'vehicleId': 'KA-04-1029',
        'currentPayloadKg': 1450, 'capacityUtilizationPct': 41.4, 'plannedDistanceKm': 128,
        'optimizedCost': 3450, 'estimatedSavings': 1350, 'stops': []
    })
    assert fo['_sap_entity_type'] == 'FreightOrder'
    assert fo['FreightOrderID'].startswith('6100')

# ----------------- INTEGRATION TESTS: REST APIS -----------------
def test_api_health(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    assert res.json['status'] == 'healthy'

def test_api_demo_login(client):
    res = client.post('/api/auth/demo-login', json={'role': 'farmer'})
    assert res.status_code == 200
    assert res.json['success'] is True
    assert res.json['user']['role'] == 'farmer'

def test_api_products_crud(client):
    # 1. List
    res = client.get('/api/products')
    assert res.status_code == 200
    assert len(res.json['products']) > 0

    # 2. Create
    new_product = {
        'farmerId': 'f1',
        'name': 'Organic Capsicum',
        'category': 'Vegetables',
        'quantity': 300,
        'price': 45.0,
        'unit': 'kg',
        'quality': 'Grade A',
        'location': 'Kolar, Karnataka',
        'description': 'Green bell peppers'
    }
    create_res = client.post('/api/products', json=new_product)
    assert create_res.status_code == 201
    prod_id = create_res.json['product']['id']

    # 3. Update
    upd_res = client.put(f'/api/products/{prod_id}', json={'price': 48.0})
    assert upd_res.status_code == 200
    assert upd_res.json['product']['price'] == 48.0

    # 4. Deactivate
    del_res = client.delete(f'/api/products/{prod_id}')
    assert del_res.status_code == 200

def test_api_order_and_cancellation_flow(client):
    # Place order
    order_payload = {
        'buyerId': 'b1',
        'deliveryLocation': 'Indiranagar, Bengaluru',
        'items': [{'productId': 'p1', 'quantity': 20.0}]
    }
    res = client.post('/api/orders', json=order_payload)
    assert res.status_code == 201
    order_id = res.json['orders'][0]['id']

    # Advance stage
    adv_res = client.patch(f'/api/orders/{order_id}/stage', json={'stage': 'Confirmed'})
    assert adv_res.status_code == 200
    assert adv_res.json['order']['stage'] == 'Confirmed'

    # Cancel order -> disruption
    cancel_res = client.post(f'/api/orders/{order_id}/cancel', json={'reason': 'Test Cancellation'})
    assert cancel_res.status_code == 200
    assert cancel_res.json['order']['stage'] == 'Cancelled'
    assert 'disruption' in cancel_res.json

def test_api_disruption_recovery_workflow(client):
    # List disruptions
    res = client.get('/api/disruptions')
    assert res.status_code == 200
    assert len(res.json['disruptions']) >= 1

    disr_id = res.json['disruptions'][0]['id']

    # Get ranked matches
    match_res = client.get(f'/api/disruptions/{disr_id}/matches')
    assert match_res.status_code == 200
    matches = match_res.json['alternativeBuyers']
    assert len(matches) > 0

    # Recover with top match
    best_buyer = matches[0]
    rec_res = client.post(f'/api/disruptions/{disr_id}/recover', json={
        'buyerId': best_buyer['buyer_id'],
        'buyerName': best_buyer['buyer_name'],
        'agreedPrice': best_buyer['estimated_offer_price']
    })
    assert rec_res.status_code == 200
    assert rec_res.json['disruption']['status'] == 'resolved'

def test_api_pooling_and_confirmation(client):
    opps_res = client.get('/api/pooling/opportunities')
    assert opps_res.status_code == 200
    assert len(opps_res.json['opportunities']) >= 1

    opp = opps_res.json['opportunities'][0]
    confirm_res = client.post('/api/pooling/confirm', json={
        'itemIds': opp['candidate_items'],
        'destination': opp['destination_corridor'],
        'vehicleName': opp['recommended_vehicle']['name']
    })
    assert confirm_res.status_code == 201
    assert confirm_res.json['shipment']['status'] == 'Confirmed'

def test_api_analytics(client):
    res = client.get('/api/analytics')
    assert res.status_code == 200
    metrics = res.json['metrics']
    assert metrics['activeListingsCount'] > 0
    assert metrics['totalOrdersCount'] > 0
    assert metrics['totalAvailableKg'] > 0
