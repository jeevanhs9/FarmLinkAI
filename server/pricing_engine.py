"""
FarmLink AI — Price Intelligence & Buyer Offer Comparison Engine
Compares competing buyer purchase offers for farmer produce lots.
Calculates gross revenue, transport deductions, platform fees, and net farmer proceeds.
Supports multi-objective ranking (Max Net Proceeds, Min Distance, Fast Delivery).
"""

from typing import List, Dict, Any

DEFAULT_PLATFORM_FEE_RATE = 0.02 # 2% platform facilitation
FREIGHT_RATE_PER_TON_KM = 12.0   # ₹12 per ton per km in district logistics

def compute_offer_financials(
    offer: Dict[str, Any],
    platform_fee_rate: float = DEFAULT_PLATFORM_FEE_RATE,
    freight_rate_per_ton_km: float = FREIGHT_RATE_PER_TON_KM
) -> Dict[str, Any]:
    """
    Computes precise financial breakdown for an offer:
    - Gross revenue = price * quantity
    - Transport cost = distance * (weight_in_tons) * freight_rate_per_ton_km
    - Platform fee = gross_revenue * platform_fee_rate
    - Net proceeds = gross_revenue - transport_cost - platform_fee
    - Net unit realization = net_proceeds / quantity
    """
    offered_price = float(offer.get('offeredPrice') or offer.get('offered_price') or 0.0)
    quantity = float(offer.get('requestedQuantity') or offer.get('requested_quantity') or 0.0)
    distance_km = float(offer.get('distanceKm') or offer.get('distance_km') or 25.0)
    transit_days = int(offer.get('transitDays') or offer.get('transit_days') or 1)

    gross_revenue = round(offered_price * quantity, 2)
    weight_in_tons = quantity / 1000.0

    # Minimum base haulage charge of ₹350 for local delivery
    raw_freight = distance_km * weight_in_tons * freight_rate_per_ton_km
    estimated_freight = round(max(350.0, raw_freight), 2)

    platform_fee = round(gross_revenue * platform_fee_rate, 2)
    net_proceeds = round(gross_revenue - estimated_freight - platform_fee, 2)
    net_price_per_kg = round(net_proceeds / quantity, 2) if quantity > 0 else 0.0

    return {
        'grossRevenue': gross_revenue,
        'estimatedFreight': estimated_freight,
        'platformFee': platform_fee,
        'netProceeds': net_proceeds,
        'netPricePerKg': net_price_per_kg,
        'effectiveFreightDeductionPerKg': round(estimated_freight / quantity, 2) if quantity > 0 else 0.0,
        'distanceKm': distance_km,
        'transitDays': transit_days,
    }


class PricingEngine:
    """
    Evaluates and ranks a set of buyer bids against an asking price or produce listing.
    """

    def compare_offers(
        self,
        offers: List[Dict[str, Any]],
        priority: str = 'max_net_proceeds' # 'max_net_proceeds', 'min_distance', 'fast_delivery'
    ) -> Dict[str, Any]:
        if not offers:
            return {'rankedOffers': [], 'recommendedOfferId': None, 'summary': 'No offers to compare.'}

        evaluated = []
        for o in offers:
            fin = compute_offer_financials(o)
            buyer_name = o.get('buyerName') or o.get('buyer_name') or 'Buyer'
            item = {
                **o,
                'financials': fin,
            }
            evaluated.append(item)

        # Apply multi-objective sorting
        if priority == 'min_distance':
            evaluated.sort(key=lambda x: (x['financials']['distanceKm'], -x['financials']['netProceeds']))
            priority_label = 'Shortest Distance & Minimum Transit Risk'
        elif priority == 'fast_delivery':
            evaluated.sort(key=lambda x: (x['financials']['transitDays'], -x['financials']['netProceeds']))
            priority_label = 'Fastest Delivery & Settlement'
        else: # default: max_net_proceeds
            evaluated.sort(key=lambda x: x['financials']['netProceeds'], reverse=True)
            priority_label = 'Maximum Net Proceeds to Farmer'

        best = evaluated[0]
        runner_up = evaluated[1] if len(evaluated) > 1 else None

        # Build comparison explanation
        diff_note = ""
        if runner_up:
            best_fin = best['financials']
            run_fin = runner_up['financials']
            diff_inr = round(best_fin['netProceeds'] - run_fin['netProceeds'], 2)
            if diff_inr > 0:
                diff_note = (
                    f"Offer from {best.get('buyerName', 'top buyer')} delivers ₹{diff_inr:,.2f} more net profit "
                    f"than the next best offer from {runner_up.get('buyerName', 'runner up')}, even after factoring "
                    f"transportation ({best_fin['distanceKm']} km vs {run_fin['distanceKm']} km)."
                )
            else:
                diff_note = (
                    f"Offer from {best.get('buyerName')} is prioritized for {priority_label} "
                    f"with delivery in {best_fin['transitDays']} day(s) over {best_fin['distanceKm']} km."
                )

        explanation = (
            f"Under the '{priority_label}' strategy, the optimal buyer is {best.get('buyerName')}. "
            f"Gross offer of ₹{best['offeredPrice']:.2f}/kg generates gross ₹{best['financials']['grossRevenue']:,.2f}, "
            f"minus ₹{best['financials']['estimatedFreight']:,.2f} transport and ₹{best['financials']['platformFee']:,.2f} platform fee, "
            f"yielding ₹{best['financials']['netProceeds']:,.2f} net proceeds (₹{best['financials']['netPricePerKg']:.2f}/kg net). {diff_note}"
        )

        return {
            'priority': priority,
            'priorityLabel': priority_label,
            'recommendedOfferId': best.get('id'),
            'recommendedBuyer': best.get('buyerName'),
            'rankedOffers': evaluated,
            'explanation': explanation,
            'disclaimer': 'Estimated net proceeds; actual carrier freight charges depend on final route consolidation.',
        }
