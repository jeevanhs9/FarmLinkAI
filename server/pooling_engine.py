"""
FarmLink AI — Intelligent Load Pooling Engine
Evaluates produce listings and pending orders for multi-farmer load consolidation.
Considers crop compatibility, geographic corridors, vehicle payload limits,
separate vs. pooled freight cost modeling, and explainable suitability scoring.
"""

import math
from typing import List, Dict, Any, Optional

# Crop transport compatibility groups (handling & temperature requirements)
# Group 1: Fresh Solanaceous & Fruit Vegetables (moderate humidity, ambient/ventilated)
# Group 2: Root & Tuber Vegetables (low moisture, dry ventilated)
# Group 3: Leafy Greens & Perishables (high humidity, cool)
# Group 4: Dry Grains & Pulses (ambient dry, sack packed)
# Group 5: Dairy & Wet Perishables (refrigerated, dedicated)
CROP_COMPATIBILITY_GROUPS = {
    'Tomato': 'fruit_veg',
    'Chilli': 'fruit_veg',
    'Green Chilli': 'fruit_veg',
    'Capsicum': 'fruit_veg',
    'Brinjal': 'fruit_veg',

    'Potato': 'tuber_dry',
    'Onion': 'tuber_dry',
    'Garlic': 'tuber_dry',
    'Ginger': 'tuber_dry',

    'Spinach': 'leafy_perishable',
    'Coriander': 'leafy_perishable',
    'Mint': 'leafy_perishable',
    'Cabbage': 'leafy_perishable',

    'Rice (Sona Masoori)': 'grains_dry',
    'Wheat': 'grains_dry',
    'Organic Wheat': 'grains_dry',
    'Ragi': 'grains_dry',
    'Pulses': 'grains_dry',

    'Milk (Cow)': 'dairy_chilled',
}

# Standardized vehicle specs in Karnataka agricultural corridors
VEHICLE_PROFILES = [
    {
        'id': 'v_ace',
        'name': 'Tata Ace Gold (1.0T Mini-Truck)',
        'capacity_kg': 1000.0,
        'base_cost_inr': 850.0,
        'per_km_rate_inr': 18.0,
        'min_utilization_pct': 50.0,
    },
    {
        'id': 'v_407',
        'name': 'Tata 407 / Eicher Pro (3.5T Reefer/Ventilated)',
        'capacity_kg': 3500.0,
        'base_cost_inr': 1600.0,
        'per_km_rate_inr': 26.0,
        'min_utilization_pct': 50.0,
    },
    {
        'id': 'v_1109',
        'name': 'Eicher Pro 1109 (7.0T Heavy Hauler)',
        'capacity_kg': 7000.0,
        'base_cost_inr': 2800.0,
        'per_km_rate_inr': 38.0,
        'min_utilization_pct': 45.0,
    },
]

# District distance matrix from rural hubs to Bengaluru delivery clusters (km)
CORRIDOR_DISTANCES = {
    ('Kolar', 'Bengaluru North'): 68.0,
    ('Kolar', 'Bengaluru East'): 62.0,
    ('Kolar', 'Bengaluru Central'): 74.0,
    ('Chikkaballapur', 'Bengaluru North'): 56.0,
    ('Chikkaballapur', 'Bengaluru East'): 64.0,
    ('Chikkaballapur', 'Bengaluru Central'): 60.0,
    ('Tumakuru', 'Bengaluru North'): 72.0,
    ('Tumakuru', 'Bengaluru Central'): 70.0,
    ('Tumakuru', 'Bengaluru East'): 84.0,
    ('Mandya', 'Bengaluru South'): 98.0,
    ('Mandya', 'Bengaluru Central'): 105.0,
}

# Distance between pickup hubs for multi-stop consolidation (km)
INTER_HUB_DISTANCES = {
    ('Kolar', 'Chikkaballapur'): 42.0,
    ('Chikkaballapur', 'Tumakuru'): 58.0,
    ('Kolar', 'Tumakuru'): 96.0,
}

def get_hub_to_dest_distance(hub: str, dest: str) -> float:
    for (h, d), dist in CORRIDOR_DISTANCES.items():
        if h.lower() in hub.lower() and d.lower() in dest.lower():
            return dist
    return 75.0 # default fallback estimate

def get_inter_hub_distance(hub1: str, hub2: str) -> float:
    if hub1.lower() == hub2.lower():
        return 0.0
    for (h1, h2), dist in INTER_HUB_DISTANCES.items():
        if (h1.lower() in hub1.lower() and h2.lower() in hub2.lower()) or \
           (h2.lower() in hub1.lower() and h1.lower() in hub2.lower()):
            return dist
    return 45.0

def are_crops_compatible(crop1: str, crop2: str) -> bool:
    if crop1.lower() == crop2.lower():
        return True
    group1 = CROP_COMPATIBILITY_GROUPS.get(crop1, 'other')
    group2 = CROP_COMPATIBILITY_GROUPS.get(crop2, 'other')
    # Groups that can safely travel together in a ventilated medium commercial vehicle
    compatible_cross = {
        ('fruit_veg', 'tuber_dry'),
        ('tuber_dry', 'fruit_veg'),
    }
    return group1 == group2 or (group1, group2) in compatible_cross

def select_best_vehicle(total_kg: float) -> Dict[str, Any]:
    for v in VEHICLE_PROFILES:
        if total_kg <= v['capacity_kg']:
            return v
    # Exceeds medium, return largest vehicle
    return VEHICLE_PROFILES[-1]

def calculate_separate_cost(shipment_items: List[Dict[str, Any]], dest: str) -> float:
    """Calculate cost if each farmer sent their produce independently in individual mini-trucks."""
    total_cost = 0.0
    for item in shipment_items:
        qty = item.get('quantity', 0.0)
        origin = item.get('location', 'Kolar')
        dist = get_hub_to_dest_distance(origin, dest)
        # Dedicated run vehicle selection for single shipment
        veh = select_best_vehicle(qty)
        # Round-trip or standard commercial freight base + distance
        trip_cost = veh['base_cost_inr'] + (dist * veh['per_km_rate_inr'])
        total_cost += trip_cost
    return round(total_cost, 2)

def calculate_pooled_cost(shipment_items: List[Dict[str, Any]], dest: str, vehicle: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate consolidated multi-pickup delivery route cost."""
    origins = list({item.get('location', 'Kolar').split(',')[0].strip() for item in shipment_items})

    # Sequence pickups: start at furthest hub, collect intermediate hubs, deliver to dest
    route_dist = 0.0
    if len(origins) == 1:
        route_dist = get_hub_to_dest_distance(origins[0], dest)
    else:
        # Multi-stop pickup circuit
        route_dist += get_inter_hub_distance(origins[0], origins[1])
        if len(origins) > 2:
            route_dist += get_inter_hub_distance(origins[1], origins[2])
        # Delivery leg from last pickup to destination
        route_dist += get_hub_to_dest_distance(origins[-1], dest)

    # Add 12% route detour & urban entry factor
    route_dist = round(route_dist * 1.12, 1)

    # Multi-stop handling surcharge: ₹250 per additional pickup
    handling_surcharge = max(0, len(origins) - 1) * 250.0

    pooled_cost = vehicle['base_cost_inr'] + (route_dist * vehicle['per_km_rate_inr']) + handling_surcharge
    travel_time_hours = round(1.2 + (route_dist / 38.0), 1) # Avg speed 38 km/h on district highways + stop time

    return {
        'route_distance_km': route_dist,
        'pooled_cost_inr': round(pooled_cost, 2),
        'travel_time_hours': travel_time_hours,
        'stop_count': len(origins) + 1,
    }


class PoolingEngine:
    """
    Evaluates candidate pools from active listings or open orders.
    Produces ranked, explainable pooling opportunities.
    """

    def find_pooling_opportunities(self, listings_or_orders: List[Dict[str, Any]], destination_corridor: str = 'Bengaluru East') -> List[Dict[str, Any]]:
        if not listings_or_orders or len(listings_or_orders) < 2:
            return []

        # Group items by crop compatibility
        groups: Dict[str, List[Dict[str, Any]]] = {}
        for item in listings_or_orders:
            crop = item.get('product') or item.get('name') or 'Tomato'
            compat_group = CROP_COMPATIBILITY_GROUPS.get(crop, 'other')
            groups.setdefault(compat_group, []).append(item)

        opportunities = []
        pool_id_counter = 1

        for group_name, items in groups.items():
            if len(items) < 2:
                continue

            # Check total quantity
            total_quantity = sum(item.get('quantity', 0.0) for item in items)
            if total_quantity <= 0:
                continue

            best_vehicle = select_best_vehicle(total_quantity)
            utilization_pct = round((total_quantity / best_vehicle['capacity_kg']) * 100, 1)

            # Calculate economics
            separate_cost = calculate_separate_cost(items, destination_corridor)
            pooled_calc = calculate_pooled_cost(items, destination_corridor, best_vehicle)
            pooled_cost = pooled_calc['pooled_cost_inr']

            savings_inr = max(0.0, round(separate_cost - pooled_cost, 2))
            savings_pct = round((savings_inr / separate_cost * 100), 1) if separate_cost > 0 else 0.0

            origins = list({item.get('location', 'Kolar').split(',')[0].strip() for item in items})
            crops = list({item.get('product') or item.get('name') for item in items})

            # Create explainable narrative
            explanation = (
                f"Consolidates {len(items)} lots of {', '.join(crops)} from {', '.join(origins)} "
                f"into a single {best_vehicle['name']}. Replaces {len(items)} separate trips with "
                f"one {pooled_calc['route_distance_km']} km coordinated route to {destination_corridor}. "
                f"Payload utilization: {utilization_pct}% ({int(total_quantity)}/{int(best_vehicle['capacity_kg'])} kg). "
                f"Reduces transport cost from ₹{int(separate_cost):,} to ₹{int(pooled_cost):,}, saving ₹{int(savings_inr):,} ({savings_pct}%)."
            )

            # Feasibility score (0-100)
            score = 0.0
            if utilization_pct >= 50: score += 40
            elif utilization_pct >= 30: score += 25
            else: score += 10

            if savings_pct >= 25: score += 40
            elif savings_pct >= 15: score += 25
            else: score += 10

            if len(origins) <= 3: score += 20 # reasonable stop sequence
            else: score += 10

            opportunity = {
                'id': f'POOL-OPP-{pool_id_counter:03d}',
                'crop_group': group_name,
                'crops': crops,
                'candidate_items': [item.get('id') for item in items],
                'item_details': items,
                'total_quantity_kg': total_quantity,
                'destination_corridor': destination_corridor,
                'recommended_vehicle': best_vehicle,
                'capacity_utilization_pct': utilization_pct,
                'baseline_separate_cost': separate_cost,
                'pooled_cost': pooled_cost,
                'estimated_savings_inr': savings_inr,
                'savings_pct': savings_pct,
                'planned_distance_km': pooled_calc['route_distance_km'],
                'planned_duration_hours': pooled_calc['travel_time_hours'],
                'feasibility_score': int(score),
                'suitability': 'Highly Economical' if score >= 80 else 'Feasible' if score >= 60 else 'Marginal',
                'explanation': explanation,
            }
            opportunities.append(opportunity)
            pool_id_counter += 1

        # Sort by feasibility score descending
        opportunities.sort(key=lambda x: x['feasibility_score'], reverse=True)
        return opportunities
