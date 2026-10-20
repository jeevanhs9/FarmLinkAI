"""
FarmLink AI — Matching & Disruption Recovery Engine
Discovers and ranks alternative buyers or replacement suppliers when an order is cancelled
or a shipment is disrupted. Provides transparent multi-factor scoring, explainable rationale,
and complete audit trails.
"""

from typing import List, Dict, Any, Optional

# Buyer procurement preference profiles in the Bengaluru / Karnataka region
REGISTERED_BUYER_PROFILES = [
    {
        'buyer_id': 'b1',
        'name': 'ABC Hostel & Canteen',
        'type': 'Institutional Catering',
        'location': 'Bengaluru Central (Vasanth Nagar)',
        'preferred_crops': ['Tomato', 'Potato', 'Onion', 'Spinach', 'Carrot'],
        'typical_order_range_kg': [50, 250],
        'target_price_discount_tolerance_pct': 5.0, # Will pay up to +/- 5% of asking price
        'accepted_grades': ['Grade A', 'Grade B'],
        'payment_speed_days': 1,
        'reliability_rating': 4.8,
        'phone': '+91 80 4567 8901',
    },
    {
        'buyer_id': 'b2',
        'name': 'GreenTable Restaurant Collective',
        'type': 'Food Service / HoReCa',
        'location': 'Bengaluru East (Indiranagar / Mahadevapura)',
        'preferred_crops': ['Tomato', 'Onion', 'Capsicum', 'Organic Turmeric', 'Spinach'],
        'typical_order_range_kg': [80, 400],
        'target_price_discount_tolerance_pct': 10.0,
        'accepted_grades': ['Grade A'],
        'payment_speed_days': 2,
        'reliability_rating': 4.9,
        'phone': '+91 80 9876 5432',
    },
    {
        'buyer_id': 'b3',
        'name': 'FreshMart Retail Chain',
        'type': 'Retail Supermarket',
        'location': 'Bengaluru North (Hebbal / Yelahanka)',
        'preferred_crops': ['Tomato', 'Potato', 'Onion', 'Carrot', 'Milk (Cow)', 'Banana'],
        'typical_order_range_kg': [200, 1500],
        'target_price_discount_tolerance_pct': 8.0,
        'accepted_grades': ['Grade A', 'Grade B'],
        'payment_speed_days': 3,
        'reliability_rating': 4.6,
        'phone': '+91 80 3344 5566',
    },
    {
        'buyer_id': 'b6',
        'name': 'Spice Route Exports & Processing',
        'type': 'Food Processor / Agro-Packer',
        'location': 'Bengaluru South (Electronic City)',
        'preferred_crops': ['Mango (Alphonso)', 'Organic Turmeric', 'Tomato', 'Green Chilli'],
        'typical_order_range_kg': [100, 2000],
        'target_price_discount_tolerance_pct': 15.0,
        'accepted_grades': ['Grade A', 'Grade B'],
        'payment_speed_days': 5,
        'reliability_rating': 4.5,
        'phone': '+91 80 7788 9900',
    },
    {
        'buyer_id': 'b8',
        'name': 'Metro Wholesale Mandi Traders',
        'type': 'Bulk Wholesale',
        'location': 'Yeshwanthpur APMC Yard, Bengaluru',
        'preferred_crops': ['Potato', 'Onion', 'Organic Wheat', 'Rice (Sona Masoori)', 'Tomato'],
        'typical_order_range_kg': [400, 5000],
        'target_price_discount_tolerance_pct': 18.0,
        'accepted_grades': ['Grade A', 'Grade B', 'Fair Average Quality'],
        'payment_speed_days': 1,
        'reliability_rating': 4.7,
        'phone': '+91 80 1122 3344',
    },
]

class MatchingEngine:
    """
    Ranks alternative buyers for stranded or cancelled produce using a weighted multi-criteria decision model:
    - Crop & Grade Compatibility (35% weight)
    - Capacity & Quantity Alignment (25% weight)
    - Price Feasibility & Willingness to Pay (25% weight)
    - Buyer Reliability & Fast Settlement (15% weight)
    """

    def match_alternative_buyers(
        self,
        crop: str,
        quantity_kg: float,
        asking_price_per_kg: float,
        quality: str = 'Grade A',
        origin_location: str = 'Kolar',
        excluded_buyer_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:

        candidates = []

        for b in REGISTERED_BUYER_PROFILES:
            if excluded_buyer_id and b['buyer_id'] == excluded_buyer_id:
                continue

            # 1. Crop & Quality Compatibility (0 - 35 points)
            crop_match = any(crop.lower() in pref.lower() or pref.lower() in crop.lower() for pref in b['preferred_crops'])
            grade_match = quality in b['accepted_grades']

            if not crop_match:
                continue # Incompatible crop: cannot purchase

            crop_score = 25.0 if crop_match else 0.0
            if grade_match:
                crop_score += 10.0
            else:
                crop_score += 2.0 # Partial grade concession

            # 2. Quantity Alignment (0 - 25 points)
            min_q, max_q = b['typical_order_range_kg']
            if min_q <= quantity_kg <= max_q:
                qty_score = 25.0
                qty_note = f"Matches buyer's normal batch size ({min_q}-{max_q} kg)"
            elif quantity_kg < min_q:
                ratio = quantity_kg / min_q
                qty_score = max(5.0, 25.0 * ratio)
                qty_note = f"Slightly smaller than normal order ({int(quantity_kg)} kg vs {min_q} kg min)"
            else:
                ratio = max_q / quantity_kg
                qty_score = max(8.0, 25.0 * ratio)
                qty_note = f"Exceeds typical single drop ({int(quantity_kg)} kg vs {max_q} kg max)"

            # 3. Price Feasibility (0 - 25 points)
            # Maximum price buyer is estimated to offer based on discount tolerance
            price_offer_est = round(asking_price_per_kg * (1.0 - (b['target_price_discount_tolerance_pct'] / 200.0)), 1)
            price_ratio = price_offer_est / asking_price_per_kg if asking_price_per_kg > 0 else 1.0

            if price_ratio >= 0.98:
                price_score = 25.0
            elif price_ratio >= 0.92:
                price_score = 20.0
            elif price_ratio >= 0.85:
                price_score = 15.0
            else:
                price_score = 8.0

            # 4. Reliability & Settlement (0 - 15 points)
            rel_score = (b['reliability_rating'] / 5.0) * 10.0
            if b['payment_speed_days'] <= 1:
                rel_score += 5.0
            elif b['payment_speed_days'] <= 3:
                rel_score += 3.0
            else:
                rel_score += 1.0

            total_score = round(crop_score + qty_score + price_score + rel_score, 1)

            # Rationale narrative
            explanation = (
                f"{b['name']} ({b['type']}) regularly purchases {crop} ({qty_note}). "
                f"Estimated offer price: ₹{price_offer_est:.1f}/kg ({int(price_ratio*100)}% of target). "
                f"Settlement within {b['payment_speed_days']} day(s) with a {b['reliability_rating']}/5.0 fulfillment score."
            )

            candidates.append({
                'buyer_id': b['buyer_id'],
                'buyer_name': b['name'],
                'buyer_type': b['type'],
                'location': b['location'],
                'phone': b['phone'],
                'match_score': int(total_score),
                'match_grade': 'Optimal Alternative' if total_score >= 85 else 'Good Alternative' if total_score >= 70 else 'Viable Fallback',
                'breakdown': {
                    'crop_compatibility': round(crop_score, 1),
                    'quantity_alignment': round(qty_score, 1),
                    'price_feasibility': round(price_score, 1),
                    'reliability_and_terms': round(rel_score, 1),
                },
                'estimated_offer_price': price_offer_est,
                'estimated_gross_recovery': round(price_offer_est * quantity_kg, 2),
                'payment_speed_days': b['payment_speed_days'],
                'reliability_rating': b['reliability_rating'],
                'explanation': explanation,
            })

        # Rank candidates highest match score first
        candidates.sort(key=lambda x: x['match_score'], reverse=True)
        return candidates
