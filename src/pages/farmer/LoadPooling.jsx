import { useState, useEffect } from 'react'
import { Truck, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { poolingService } from '../../services/api'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { formatINR } from '../../utils/format'

const CORRIDORS = ['Bengaluru East', 'Bengaluru North', 'Bengaluru Central', 'Mysuru Hub']

export default function LoadPooling() {
  const navigate = useNavigate()
  const [corridor, setCorridor] = useState(CORRIDORS[0])
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmedShipment, setConfirmedShipment] = useState(null)

  useEffect(() => {
    let active = true
    poolingService.getOpportunities(corridor).then((opps) => {
      if (active) {
        setOpportunities(opps || [])
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [corridor])

  const handleConfirmPool = async () => {
    if (!selectedOpp) return
    setConfirming(true)
    const shipment = await poolingService.confirmPool({
      itemIds: selectedOpp.candidate_items,
      destination: selectedOpp.destination_corridor,
      vehicleName: selectedOpp.recommended_vehicle?.name || 'Tata 407 (3.5T Reefer)',
    })
    setConfirming(false)
    setConfirmedShipment(shipment)
    setSelectedOpp(null)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[20px] bg-gradient-to-br from-forest-800 to-forest-950 border border-forest-700/50 p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-forest-950/20 text-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-6 items-center rounded-full bg-leaf-400/20 px-2.5 text-[10px] font-bold uppercase tracking-wider text-leaf-300 ring-1 ring-inset ring-leaf-400/30">
              <Sparkles size={12} className="mr-1" />
              Scenario A · Multi-Farmer Load Pooling
            </span>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
            Intelligent Load Consolidation
          </h2>
          <p className="mt-2 text-sm text-leaf-100/80 max-w-xl leading-relaxed">
            Consolidate fragmented smallholder produce lots into unified, economical vehicle routes. Check crop perishability compatibility, vehicle payload constraints, and verified logistics cost savings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="text-xs font-bold uppercase text-leaf-300 tracking-wider">Destination Corridor:</label>
          <select
            value={corridor}
            onChange={(e) => setCorridor(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-forest-900 border border-white/20 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-leaf-400 cursor-pointer"
          >
            {CORRIDORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Confirmed Shipment Success Banner */}
      {confirmedShipment && (
        <div className="card p-6 bg-leaf-50 border-2 border-forest-500 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-forest-700 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-forest-950">
                Pooled Shipment {confirmedShipment.id} Dispatched!
              </h4>
              <p className="text-xs text-forest-800 mt-0.5">
                Consolidated {confirmedShipment.pooledOrdersCount || 2} lots onto {confirmedShipment.vehicleName}. Estimated savings: {formatINR(confirmedShipment.estimatedSavings || 1350)} ({confirmedShipment.savingsPct || 28.1}%).
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => setConfirmedShipment(null)}>Dismiss</Button>
            <Button size="sm" onClick={() => navigate('/logistics')}>Track on Live Map</Button>
          </div>
        </div>
      )}

      {/* Opportunities List */}
      {loading ? (
        <div className="card p-12 text-center bg-white">
          <div className="h-10 w-10 border-2 border-forest-200 border-t-forest-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-ink-500">Evaluating multi-farmer load compatibility and vehicle payload limits…</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="card p-10 text-center bg-white">
          <Truck size={40} className="mx-auto text-ink-300 mb-3" />
          <h3 className="font-display font-bold text-lg text-ink-800">No compatible pooling combinations found</h3>
          <p className="text-sm text-ink-500 mt-1 max-w-md mx-auto">
            Produce lots in this corridor either exceed separate delivery windows or belong to incompatible handling categories.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {opportunities.map((opp) => (
            <div key={opp.id} className="card p-6 lg:p-7 bg-white hover:border-forest-400 transition-all shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-ink-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-ink-400">{opp.id}</span>
                    <Badge tone={opp.feasibility_score >= 80 ? 'success' : 'medium'}>
                      {opp.suitability} · Score {opp.feasibility_score}/100
                    </Badge>
                    <span className="text-xs font-bold text-forest-700 bg-leaf-50 px-2.5 py-0.5 rounded-full border border-leaf-200">
                      Corridor: {opp.destination_corridor}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-ink-900">
                    Consolidated {opp.crops?.join(', ')} Run
                  </h3>
                  <p className="text-xs text-ink-500 mt-1">
                    Recommended Vehicle: <strong className="text-ink-800">{opp.recommended_vehicle?.name}</strong> · Planned Route: ~{opp.planned_distance_km} km ({opp.planned_duration_hours}h)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400 block">Estimated Savings</span>
                    <span className="font-display font-bold text-2xl text-forest-700">
                      {formatINR(opp.estimated_savings_inr)}
                    </span>
                    <span className="text-xs font-bold text-forest-600 block">
                      ({opp.savings_pct}% freight reduction)
                    </span>
                  </div>
                  <Button onClick={() => setSelectedOpp(opp)}>
                    Review & Confirm Pool <ArrowRight size={15} className="ml-1" />
                  </Button>
                </div>
              </div>

              {/* Vehicle Capacity & Economics Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
                <div className="bg-sand-50/70 p-4 rounded-xl border border-ink-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Payload Volume</span>
                  <p className="font-display font-bold text-lg text-ink-900 mt-0.5">
                    {opp.total_quantity_kg.toLocaleString('en-IN')} kg
                  </p>
                  <p className="text-xs text-ink-500">Combined from {opp.candidate_items?.length} lots</p>
                </div>

                <div className="bg-sand-50/70 p-4 rounded-xl border border-ink-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Vehicle Utilization</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="font-display font-bold text-lg text-ink-900">
                      {opp.capacity_utilization_pct}%
                    </p>
                    <span className="text-xs text-ink-500 font-medium">Cap: {opp.recommended_vehicle?.capacity_kg} kg</span>
                  </div>
                  <div className="h-1.5 w-full bg-sand-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${opp.capacity_utilization_pct > 80 ? 'bg-forest-600' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, opp.capacity_utilization_pct)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-sand-50/70 p-4 rounded-xl border border-ink-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Separate Trips Cost</span>
                  <p className="font-display font-bold text-lg text-ink-600 mt-0.5 line-through decoration-clay-500">
                    {formatINR(opp.baseline_separate_cost)}
                  </p>
                  <p className="text-xs text-ink-500">{opp.candidate_items?.length} individual mini-trucks</p>
                </div>

                <div className="bg-leaf-50/60 p-4 rounded-xl border border-leaf-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700">Pooled Route Cost</span>
                  <p className="font-display font-bold text-lg text-forest-900 mt-0.5">
                    {formatINR(opp.pooled_cost)}
                  </p>
                  <p className="text-xs font-semibold text-forest-700">Saves {formatINR(opp.estimated_savings_inr)} net</p>
                </div>
              </div>

              {/* Explainable Rationale */}
              <div className="rounded-xl bg-forest-950 p-4 text-white text-xs leading-relaxed flex items-start gap-3">
                <ShieldCheck size={18} className="text-leaf-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-leaf-300 uppercase tracking-wider mr-2">Explainable Pooling Rationale:</span>
                  <span>{opp.explanation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review & Confirmation Modal */}
      <Modal
        open={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
        title={`Confirm Pooled Shipment · ${selectedOpp?.id}`}
        maxWidth="max-w-2xl"
      >
        {selectedOpp && (
          <div className="space-y-5">
            <p className="text-xs text-ink-500">
              Confirming this pool locks the collection sequence, informs the logistics hub, and prepares freight order documentation.
            </p>

            <div className="rounded-xl border border-forest-200 bg-leaf-50/50 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-forest-900">
                <span>Vehicle: {selectedOpp.recommended_vehicle?.name}</span>
                <span>Corridor: {selectedOpp.destination_corridor}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-leaf-100">
                  <span className="text-ink-400 text-[10px] uppercase font-bold block">Consolidated Weight</span>
                  <span className="font-bold text-ink-900">{selectedOpp.total_quantity_kg} kg</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-leaf-100">
                  <span className="text-ink-400 text-[10px] uppercase font-bold block">Total Distance</span>
                  <span className="font-bold text-ink-900">{selectedOpp.planned_distance_km} km</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-leaf-100">
                  <span className="text-ink-400 text-[10px] uppercase font-bold block">Net Freight Savings</span>
                  <span className="font-bold text-forest-700">{formatINR(selectedOpp.estimated_savings_inr)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">Lots Scheduled for Consolidation</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedOpp.candidate_items?.map((itemId, idx) => (
                  <div key={itemId} className="flex justify-between items-center p-3 rounded-lg border border-ink-100 bg-sand-50/40 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-forest-700 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-ink-900">Lot #{itemId}</span>
                      <span className="text-ink-500">· {selectedOpp.crops?.[0] || 'Produce'}</span>
                    </div>
                    <span className="font-semibold text-forest-800">Ready for collection</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-sand-100/60 rounded-xl text-[11px] text-ink-600 leading-snug">
              <strong>Audit Trail:</strong> Confirmation records a <code>POOL_CONFIRMED</code> event in the compliance ledger, creates a unified <code>Shipment</code> entity, and maps directly to SAP TM FreightOrder.
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-ink-100">
              <Button variant="outline" onClick={() => setSelectedOpp(null)} disabled={confirming}>
                Cancel
              </Button>
              <Button onClick={handleConfirmPool} disabled={confirming}>
                {confirming ? 'Dispatching Run…' : 'Confirm & Authorize Dispatch'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
