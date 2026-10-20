"""
FarmLink AI — SAP & Enterprise Supply Chain Integration Adapter
Defines integration boundaries and contract schemas for enterprise procurement (SAP S/4HANA MM),
transportation management (SAP TM), and supply disruption monitoring (SAP Supply Chain Control Tower).
"""

from datetime import datetime, timezone
from typing import Dict, Any, List

def format_iso_timestamp():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

class SAPEnterpriseAdapter:
    """
    Standardized payload mapper between FarmLink AI domain entities and SAP standard enterprise interfaces:
    1. SAP S/4HANA OData Purchase Order API (API_PURCHASEORDER_PROCESS_SRV / A_PurchaseOrder)
    2. SAP Transportation Management (SAP TM FreightOrder OData / cXML)
    3. SAP Supply Chain Control Tower / Event Management Disruption Webhook
    """

    def map_order_to_sap_purchase_order(self, order_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Maps a FarmLink buyer order into an SAP S/4HANA standard Purchase Order entity structure.
        """
        sap_po_id = f"4500{abs(hash(order_dict.get('id', ''))) % 1000000:06d}"
        line_item_id = "00010"
        material_num = f"AGRI-{order_dict.get('product', 'CROP')[:3].upper()}-01"

        return {
            "_sap_entity_type": "A_PurchaseOrderType",
            "_sap_system_target": "SAP S/4HANA Cloud 2026 / On-Premise MM",
            "_integration_mode": "Mock Enterprise Gateway (Ready for RFC/OData)",
            "PurchaseOrder": sap_po_id,
            "CompanyCode": "1010",
            "PurchaseOrderType": "NB", # Standard PO
            "PurchasingOrganization": "1000",
            "PurchasingGroup": "001",
            "Supplier": f"VEN-{order_dict.get('farmerId', 'FPO')}",
            "SupplierName": order_dict.get('farmer', 'Local Producer Collective'),
            "CreationDate": order_dict.get('placedOn', format_iso_timestamp()),
            "PaymentTerms": "NT00", # Immediate settlement
            "TotalGrossAmount": order_dict.get('total', 0.0),
            "DocumentCurrency": "INR",
            "DeliveryAddress": {
                "CityName": "Bengaluru",
                "PostalCode": "560001",
                "StreetName": order_dict.get('deliveryLocation', 'Bengaluru Urban Hub'),
                "Country": "IN"
            },
            "to_PurchaseOrderItem": [
                {
                    "PurchaseOrderItem": line_item_id,
                    "Material": material_num,
                    "PurchaseOrderItemText": order_dict.get('product', 'Fresh Produce'),
                    "OrderQuantity": str(order_dict.get('quantity', 0.0)),
                    "PurchaseOrderQuantityUnit": "KGM" if order_dict.get('unit') == 'kg' else "LTR",
                    "NetPriceAmount": str(order_dict.get('subtotal', 0.0) / max(1.0, float(order_dict.get('quantity', 1.0)))),
                    "Plant": "1010", # Bengaluru Distribution Center
                    "StorageLocation": "0001",
                    "RequirementTrackingNumber": order_dict.get('id', 'FL-ORD'),
                    "ScheduleLine": {
                        "ScheduleLineDeliveryDate": order_dict.get('eta', format_iso_timestamp()),
                    }
                }
            ],
            "_farmlink_reference": {
                "sourceOrderId": order_dict.get('id'),
                "buyerOrg": order_dict.get('buyer'),
                "logisticsFeeINR": order_dict.get('logisticsFee'),
                "platformFeeINR": order_dict.get('platformFee'),
            }
        }

    def map_shipment_to_sap_tm_freight_order(self, shipment_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Maps a FarmLink consolidated pooled shipment into SAP Transportation Management (SAP TM FreightOrder).
        """
        sap_fo_id = f"6100{abs(hash(shipment_dict.get('id', ''))) % 1000000:06d}"

        stops_payload = []
        for stop in shipment_dict.get('stops', []):
            stops_payload.append({
                "StopSequence": stop.get('sequence', 1),
                "StopCategory": "PICK" if stop.get('type') == 'pickup' else "DROP",
                "LocationID": f"LOC-{stop.get('id', 'STOP').upper()}",
                "LocationName": stop.get('name'),
                "GeoCoordinates": {
                    "Latitude": stop.get('position', {}).get('lat', 13.0),
                    "Longitude": stop.get('position', {}).get('lng', 77.0),
                },
                "EstimatedTimeOfArrival": stop.get('eta', '12:00 PM'),
                "ConsolidatedOrderRefs": stop.get('orderIds', []),
            })

        return {
            "_sap_entity_type": "FreightOrder",
            "_sap_system_target": "SAP Transportation Management (SAP TM 9.6 / S/4HANA TM)",
            "FreightOrderID": sap_fo_id,
            "TransportationMode": "01", # Road Transport
            "MeansOfTransport": "TRUCK_3.5T",
            "CarrierID": "CARR-FARMLINK-LOGISTICS",
            "CarrierName": "FarmLink Logistics Cooperative Hub",
            "ExecutionStatus": shipment_dict.get('status', 'Confirmed'),
            "VehicleRegistration": shipment_dict.get('vehicleId', 'KA-04-TR-1029'),
            "GrossWeight": {
                "Value": shipment_dict.get('currentPayloadKg', 0.0),
                "Unit": "KGM"
            },
            "PayloadCapacityUtilizationPct": shipment_dict.get('capacityUtilizationPct', 0.0),
            "PlannedDistanceKm": shipment_dict.get('plannedDistanceKm', 0.0),
            "TotalPlannedFreightINR": shipment_dict.get('optimizedCost', 0.0),
            "EstimatedLogisticsSavingsINR": shipment_dict.get('estimatedSavings', 0.0),
            "Stops": stops_payload,
            "_farmlink_reference": {
                "sourceShipmentId": shipment_dict.get('id'),
                "pooledOrdersCount": shipment_dict.get('pooledOrdersCount', 0),
            }
        }

    def create_sap_control_tower_disruption_alert(self, disruption_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates an event alert payload compatible with SAP Supply Chain Control Tower / Event Management.
        """
        event_id = f"EVT-SCM-{abs(hash(disruption_dict.get('id', ''))) % 1000000:06d}"

        return {
            "_sap_entity_type": "SupplyChainDisruptionAlert",
            "_sap_system_target": "SAP Supply Chain Control Tower / SAP Business Network",
            "AlertID": event_id,
            "Timestamp": format_iso_timestamp(),
            "Severity": disruption_dict.get('severity', 'high').upper(),
            "DisruptionType": disruption_dict.get('eventType', 'ORDER_CANCELLATION').upper(),
            "AffectedMaterial": disruption_dict.get('affectedCrop', 'Tomato'),
            "QuantityAtRiskKGM": disruption_dict.get('affectedQuantity', 0.0),
            "AffectedSourceOrder": disruption_dict.get('orderId'),
            "MitigationStatus": disruption_dict.get('status', 'open').upper(),
            "RecommendedMitigation": "Execute FarmLink AI Alternative Buyer Matching",
            "MitigationActionTaken": disruption_dict.get('recoveryNotes'),
            "ResolvedAlternativeBuyer": disruption_dict.get('resolvedBuyerId'),
            "IncidentSummary": disruption_dict.get('description'),
        }
