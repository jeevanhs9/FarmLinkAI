import { useState, useEffect } from 'react'
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useApp } from '../../context/useApp'
import { offerService } from '../../services/api'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatINR } from '../../utils/format'

export default function OfferComparison() {
  const { notify } = useApp()
  const [priority, setPriority] = useState('max_net_proceeds')
  const [comparison, setComparison] = useState(null)
  const [acceptingId, setAcceptingId] = useState(null)

  useEffect(() => {
    let active = true
    offerService.compare('p1', priority).then((res) => {
      if (active) setComparison(res)
    })
    return () => { active = false }
  }, [priority])

  const handleAccept = async (offerId) => {
    setAcceptingId(offerId)
    const res = await offerService.accept(offerId)
    setAcceptingId(null)
    if (res && res.success) {
      notify(`Offer ${offerId} accepted! Order generated and sent to fulfillment.`)
      offerService.compare('p1', priority).then(setComparison)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[20px] bg-gradient-to-br from-forest-800 to-forest-950 border border-forest-700/50 p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-forest-950/20 text-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-6 items-center rounded-full bg-leaf-400/20 px-2.5 text-[10px] font-bold uppercase tracking-wider text-leaf-300 ring-1 ring-inset ring-leaf-400/30">
              <Sparkles size={12} className="mr-1" />
              Scenario B · Net Proceeds Comparison
            </span>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
            Buyer Bids & Net Proceeds Intelligence
          </h2>
          <p className="mt-2 text-sm text-leaf-100/80 max-w-xl leading-relaxed">
            The highest gross asking price does not always yield the highest take-home earnings. Compare gross revenue against transport deductions and platform fees across competing buyer offers.
          </p>
        </div>

        {/* Priority Strategy Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 bg-forest-900/80 p-2 rounded-2xl border border-white/10 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-300 px-2">Optimize for:</span>
          <div className="flex gap-1.5">
            {[
              { id: 'max_net_proceeds', label: 'Max Net Earnings' },
              { id: 'min_distance', label: 'Min Distance' },
              { id: 'fast_delivery', label: 'Fast Delivery' },
            ].map((strat) => (
              <button
                key={strat.id}
                onClick={() => setPriority(strat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  priority === strat.id
                    ? 'bg-leaf-400 text-forest-950 shadow-md'
                    : 'text-leaf-100 hover:bg-white/10'
                }`}
              >
                {strat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!comparison ? (
        <div className="card p-12 text-center bg-white">
          <div className="h-10 w-10 border-2 border-forest-200 border-t-forest-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-ink-500">Calculating freight deductions and net proceeds across offers…</p>
        </div>
      ) : (
        <>
          {/* Recommendation Callout */}
          <div className="card p-5 bg-leaf-50 border-2 border-forest-500 rounded-2xl flex items-start gap-3.5 shadow-sm">
            <ShieldCheck size={22} className="text-forest-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                  Optimal Recommendation ({comparison.priorityLabel})
                </span>
                <Badge tone="success">Top Ranked Bid</Badge>
              </div>
              <p className="text-sm text-forest-950 font-medium leading-relaxed">
                {comparison.explanation}
              </p>
              <p className="text-[11px] text-ink-500 mt-2 italic">
                * {comparison.disclaimer}
              </p>
            </div>
          </div>

          {/* Offers Comparison Cards */}
          <div className="grid lg:grid-cols-3 gap-5">
            {comparison.rankedOffers.map((offer, index) => {
              const isRecommended = offer.id === comparison.recommendedOfferId
              const fin = offer.financials

              return (
                <div
                  key={offer.id}
                  className={`card p-6 flex flex-col justify-between transition-all ${
                    isRecommended
                      ? 'border-2 border-forest-600 bg-white ring-4 ring-leaf-100/60 shadow-lg'
                      : 'border border-ink-200 bg-white hover:border-ink-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-ink-400">
                          Rank #{index + 1} · {offer.id}
                        </span>
                        <h3 className="font-display font-bold text-base text-ink-900 mt-0.5">
                          {offer.buyerName}
                        </h3>
                        <p className="text-xs text-ink-500">{offer.deliveryDestination}</p>
                      </div>
                      {isRecommended && (
                        <span className="bg-forest-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                          Best Pick
                        </span>
                      )}
                    </div>

                    {/* Pricing Highlight */}
                    <div className="p-4 rounded-xl bg-sand-50/70 border border-ink-100 mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs text-ink-500 font-medium">Offered Gross Price</span>
                        <span className="font-display font-bold text-lg text-ink-900">
                          {formatINR(offer.offeredPrice)} <span className="text-xs font-normal text-ink-500">/{offer.unit}</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-ink-100">
                        <span className="text-xs font-bold text-forest-700">Net Take-Home Price</span>
                        <span className="font-display font-bold text-xl text-forest-800">
                          {formatINR(fin.netPricePerKg)} <span className="text-xs font-normal text-forest-600">/{offer.unit}</span>
                        </span>
                      </div>
                    </div>

                    {/* Detailed Math Breakdown */}
                    <div className="space-y-2 text-xs mb-5">
                      <div className="flex justify-between text-ink-600">
                        <span>Requested Quantity:</span>
                        <span className="font-bold text-ink-800">{offer.requestedQuantity} {offer.unit}</span>
                      </div>
                      <div className="flex justify-between text-ink-600">
                        <span>Gross Revenue:</span>
                        <span className="font-bold text-ink-800">{formatINR(fin.grossRevenue)}</span>
                      </div>
                      <div className="flex justify-between text-clay-600">
                        <span>Transport Cost ({fin.distanceKm} km):</span>
                        <span className="font-bold">−{formatINR(fin.estimatedFreight)}</span>
                      </div>
                      <div className="flex justify-between text-ink-500">
                        <span>Platform Fee (2%):</span>
                        <span className="font-bold">−{formatINR(fin.platformFee)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-ink-100 text-forest-900 font-bold text-sm">
                        <span>Net Take-Home:</span>
                        <span className="text-forest-700 font-display text-base">{formatINR(fin.netProceeds)}</span>
                      </div>
                    </div>

                    {/* Delivery & Terms */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-sand-50/40 p-2.5 rounded-lg border border-ink-100 mb-5">
                      <div>
                        <span className="text-ink-400 block font-medium">Transit Days:</span>
                        <span className="font-bold text-ink-800">{fin.transitDays} day(s)</span>
                      </div>
                      <div>
                        <span className="text-ink-400 block font-medium">Payment Terms:</span>
                        <span className="font-bold text-ink-800">{offer.paymentTerms}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAccept(offer.id)}
                    disabled={offer.status === 'accepted' || acceptingId === offer.id}
                    variant={isRecommended ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {offer.status === 'accepted' ? (
                      <><CheckCircle2 size={16} className="mr-1.5" /> Accepted</>
                    ) : acceptingId === offer.id ? (
                      'Processing…'
                    ) : (
                      <>Accept Offer <ArrowRight size={14} className="ml-1.5" /></>
                    )}
                  </Button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
