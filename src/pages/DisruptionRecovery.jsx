import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle2, RefreshCw, UserCheck, Sparkles, Building2 } from 'lucide-react'
import { useApp } from '../context/useApp'
import { disruptionService } from '../services/api'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { formatINR } from '../utils/format'

export default function DisruptionRecovery() {
  const { notify } = useApp()
  const [disruptions, setDisruptions] = useState([])
  const [selectedDisruption, setSelectedDisruption] = useState(null)
  const [matches, setMatches] = useState([])
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [reassignModalOpen, setReassignModalOpen] = useState(false)
  const [chosenBuyer, setChosenBuyer] = useState(null)
  const [recovering, setRecovering] = useState(false)
  const [resolvedNotice, setResolvedNotice] = useState(null)

  const selectDisruption = (disr) => {
    setSelectedDisruption(disr)
    setLoadingMatches(true)
    disruptionService.getMatches(disr.id).then((res) => {
      setMatches(res?.alternativeBuyers || [])
      setLoadingMatches(false)
    })
  }

  const loadDisruptions = useCallback(() => {
    disruptionService.list().then((list) => {
      setDisruptions(list || [])
      if (list && list.length > 0 && !selectedDisruption) {
        selectDisruption(list[0])
      }
    })
  }, [selectedDisruption])

  useEffect(() => {
    loadDisruptions()
  }, [loadDisruptions])

  const handleAuthorizeReassignment = async () => {
    if (!selectedDisruption || !chosenBuyer) return
    setRecovering(true)
    const res = await disruptionService.recover(selectedDisruption.id, {
      buyerId: chosenBuyer.buyer_id,
      buyerName: chosenBuyer.buyer_name,
      agreedPrice: chosenBuyer.estimated_offer_price,
    })
    setRecovering(false)
    setReassignModalOpen(false)
    if (res && res.success) {
      setResolvedNotice({
        disruptionId: selectedDisruption.id,
        buyerName: chosenBuyer.buyer_name,
        recoveredAmount: chosenBuyer.estimated_gross_recovery,
      })
      notify(`Order successfully reassigned to ${chosenBuyer.buyer_name}. Disruption resolved.`)
      loadDisruptions()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[20px] bg-gradient-to-br from-clay-600 to-forest-950 border border-clay-500/30 p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-6 items-center rounded-full bg-white/20 px-2.5 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-inset ring-white/30">
              <Sparkles size={12} className="mr-1" />
              Scenario D · Supply Chain Disruption Recovery
            </span>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
            Disruption Management & Alternative Matching
          </h2>
          <p className="mt-2 text-sm text-sand-100/90 max-w-xl leading-relaxed">
            When a buyer cancels or logistics are delayed, FarmLink automatically scans registered demand profiles to find, score, and reassign produce within perishable transit thresholds.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            onClick={loadDisruptions}
          >
            <RefreshCw size={15} className="mr-1.5" /> Refresh Incidents
          </Button>
        </div>
      </div>

      {/* Resolution Success Banner */}
      {resolvedNotice && (
        <div className="card p-6 bg-leaf-50 border-2 border-forest-500 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-forest-700 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-forest-950">
                Disruption {resolvedNotice.disruptionId} Mitigated!
              </h4>
              <p className="text-xs text-forest-800 mt-0.5">
                Produce re-allocated to <strong>{resolvedNotice.buyerName}</strong>. Recovered gross value: {formatINR(resolvedNotice.recoveredAmount)}. An audit log has been filed for compliance.
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setResolvedNotice(null)}>Dismiss Notice</Button>
        </div>
      )}

      {/* Active Incidents & Matching Layout */}
      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* Left: Incident List */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base text-ink-900 tracking-tight">
            Recorded Disruption Events ({disruptions.length})
          </h3>

          <div className="space-y-3">
            {disruptions.map((d) => {
              const isSelected = selectedDisruption?.id === d.id
              const isResolved = d.status === 'resolved'

              return (
                <button
                  key={d.id}
                  onClick={() => selectDisruption(d)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-forest-600 bg-white shadow-md ring-2 ring-leaf-100'
                      : 'border-ink-200 bg-white hover:border-ink-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-ink-500">{d.id}</span>
                    <Badge tone={isResolved ? 'success' : d.severity === 'high' ? 'danger' : 'warning'}>
                      {isResolved ? 'Resolved' : `${d.severity} priority`}
                    </Badge>
                  </div>
                  <h4 className="font-display font-bold text-sm text-ink-900">{d.affectedCrop} Batch Stranded</h4>
                  <p className="text-xs text-ink-600 mt-1 line-clamp-2 leading-relaxed">{d.description}</p>
                  <div className="flex justify-between items-center text-[11px] text-ink-400 mt-3 pt-2 border-t border-ink-100 font-medium">
                    <span>Volume: {d.affectedQuantity} kg</span>
                    <span>{d.createdAt || 'Active'}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Alternative Matching Engine View */}
        <div className="space-y-5">
          {selectedDisruption ? (
            <div className="card p-6 bg-white border border-ink-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-ink-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} className="text-clay-600" />
                    <span className="text-xs font-bold uppercase text-clay-700 tracking-wider">
                      Incident {selectedDisruption.id} · {selectedDisruption.eventType}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-ink-900">
                    Rescue Allocation for {selectedDisruption.affectedQuantity} kg {selectedDisruption.affectedCrop}
                  </h3>
                </div>
                <Badge tone={selectedDisruption.status === 'resolved' ? 'success' : 'danger'}>
                  Status: {selectedDisruption.status.toUpperCase()}
                </Badge>
              </div>

              {selectedDisruption.recoveryNotes && (
                <div className="my-4 p-4 rounded-xl bg-leaf-50 border border-leaf-200 text-xs text-forest-900 font-medium leading-relaxed">
                  <strong>Resolution Note:</strong> {selectedDisruption.recoveryNotes}
                </div>
              )}

              {/* Matched Alternative Buyers */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-display font-bold text-base text-ink-900">
                      Algorithmic Alternative Buyer Matches
                    </h4>
                    <p className="text-xs text-ink-500">
                      Ranked by multi-criteria score: Crop Compatibility (35%), Quantity Alignment (25%), Price Feasibility (25%), Settlement Speed (15%).
                    </p>
                  </div>
                </div>

                {loadingMatches ? (
                  <div className="p-8 text-center">
                    <div className="h-8 w-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-ink-500">Scanning buyer procurement registries…</p>
                  </div>
                ) : matches.length === 0 ? (
                  <p className="text-sm text-ink-500 p-6 text-center">No matching alternative buyers found for this specific produce lot.</p>
                ) : (
                  <div className="space-y-4">
                    {matches.map((m, idx) => (
                      <div
                        key={m.buyer_id}
                        className={`p-5 rounded-2xl border transition-all ${
                          idx === 0
                            ? 'border-2 border-forest-600 bg-leaf-50/20 shadow-sm'
                            : 'border-ink-200 bg-sand-50/30'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge tone={m.match_score >= 85 ? 'success' : 'medium'}>
                                {m.match_grade} · Score {m.match_score}/100
                              </Badge>
                              <span className="text-xs text-ink-500 font-medium">Rank #{idx + 1}</span>
                            </div>
                            <h5 className="font-display font-bold text-base text-ink-900 flex items-center gap-2">
                              <Building2 size={16} className="text-forest-700" />
                              {m.buyer_name}
                            </h5>
                            <p className="text-xs text-ink-500">{m.buyer_type} · {m.location}</p>
                          </div>

                          <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1">
                            <span className="text-xs text-ink-400 font-bold uppercase">Estimated Offer</span>
                            <span className="font-display font-bold text-lg text-forest-800">
                              {formatINR(m.estimated_offer_price)}/kg
                            </span>
                            <span className="text-[11px] text-ink-500">
                              Gross: {formatINR(m.estimated_gross_recovery)}
                            </span>
                          </div>
                        </div>

                        {/* Explainable Rationale */}
                        <p className="text-xs text-ink-700 bg-white p-3 rounded-xl border border-ink-100 mb-3 leading-relaxed">
                          <strong className="text-forest-800">Why this buyer matches:</strong> {m.explanation}
                        </p>

                        {/* Scoring Breakdown Chips */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] mb-4">
                          <div className="bg-white p-2 rounded-lg border border-ink-100">
                            <span className="text-ink-400 uppercase font-bold block text-[9px]">Crop Match</span>
                            <span className="font-bold text-ink-800">{m.breakdown.crop_compatibility}/35</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-ink-100">
                            <span className="text-ink-400 uppercase font-bold block text-[9px]">Batch Size</span>
                            <span className="font-bold text-ink-800">{m.breakdown.quantity_alignment}/25</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-ink-100">
                            <span className="text-ink-400 uppercase font-bold block text-[9px]">Price Fit</span>
                            <span className="font-bold text-ink-800">{m.breakdown.price_feasibility}/25</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-ink-100">
                            <span className="text-ink-400 uppercase font-bold block text-[9px]">Reliability</span>
                            <span className="font-bold text-ink-800">{m.breakdown.reliability_and_terms}/15</span>
                          </div>
                        </div>

                        {selectedDisruption.status !== 'resolved' && (
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              onClick={() => {
                                setChosenBuyer(m)
                                setReassignModalOpen(true)
                              }}
                            >
                              <UserCheck size={14} className="mr-1.5" /> Select & Authorize Reassignment
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center bg-white text-ink-500">
              Select a disruption event from the list to initiate alternative buyer matching.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        title="Authorize Order Reassignment"
        maxWidth="max-w-lg"
      >
        {chosenBuyer && selectedDisruption && (
          <div className="space-y-4">
            <p className="text-xs text-ink-600 leading-relaxed">
              You are authorizing the emergency reallocation of <strong>{selectedDisruption.affectedQuantity} kg {selectedDisruption.affectedCrop}</strong> to <strong>{chosenBuyer.buyer_name}</strong>.
            </p>

            <div className="rounded-xl bg-sand-50 p-4 border border-ink-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-500">Agreed Recovery Price:</span>
                <span className="font-bold text-ink-900">{formatINR(chosenBuyer.estimated_offer_price)}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Gross Recovered Amount:</span>
                <span className="font-bold text-forest-700">{formatINR(chosenBuyer.estimated_gross_recovery)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Payment & Settlement:</span>
                <span className="font-bold text-ink-900">Within {chosenBuyer.payment_speed_days} day(s)</span>
              </div>
            </div>

            <p className="text-[11px] text-ink-400">
              * Per enterprise governance policy, orders are never automatically reassigned without explicit user sign-off. An audit event is published to the SAP Control Tower adapter.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-ink-100">
              <Button variant="outline" onClick={() => setReassignModalOpen(false)} disabled={recovering}>
                Cancel
              </Button>
              <Button onClick={handleAuthorizeReassignment} disabled={recovering}>
                {recovering ? 'Reassigning…' : 'Confirm & Execute Reassignment'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
