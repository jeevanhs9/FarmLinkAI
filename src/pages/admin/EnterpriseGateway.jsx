import { useState, useEffect } from 'react'
import { Copy, Check, Sparkles, FileCode } from 'lucide-react'
import { useApp } from '../../context/useApp'
import { sapService } from '../../services/api'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function EnterpriseGateway() {
  const { notify } = useApp()
  const [gatewayStatus, setGatewayStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('s4hana_po') // 's4hana_po', 'sap_tm', 'sap_control_tower'
  const [exportedPayload, setExportedPayload] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    sapService.getStatus().then((st) => { if (active) setGatewayStatus(st) })
    setLoading(true)
    const fetchPayload = async () => {
      let payload = null
      if (activeTab === 's4hana_po') {
        payload = await sapService.exportPO('ORD-1042')
      } else if (activeTab === 'sap_tm') {
        payload = await sapService.exportTM('SHP-101')
      } else if (activeTab === 'sap_control_tower') {
        payload = await sapService.exportDisruptionAlert('DISR-001')
      }
      if (active) {
        setExportedPayload(payload)
        setLoading(false)
      }
    }
    fetchPayload()
    return () => { active = false }
  }, [activeTab])

  const handleCopy = () => {
    if (!exportedPayload) return
    navigator.clipboard.writeText(JSON.stringify(exportedPayload, null, 2))
    setCopied(true)
    notify('SAP enterprise payload copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[20px] bg-gradient-to-br from-forest-900 to-ink-950 border border-white/10 p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-6 items-center rounded-full bg-leaf-400/20 px-2.5 text-[10px] font-bold uppercase tracking-wider text-leaf-300 ring-1 ring-inset ring-leaf-400/30">
              <Sparkles size={12} className="mr-1" />
              SAP Hackfest Bengaluru 2026 · Enterprise Integration
            </span>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
            SAP S/4HANA & Enterprise SCM Gateway
          </h2>
          <p className="mt-2 text-sm text-leaf-100/80 max-w-xl leading-relaxed">
            Bi-directional contract boundaries connecting district farmer cooperatives to SAP S/4HANA Material Management (MM), SAP Transportation Management (TM), and SAP Supply Chain Control Tower.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl border border-white/15 text-xs space-y-1.5 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <span className="text-leaf-300 font-bold">Bridge Status:</span>
            <Badge tone="success">{gatewayStatus?.status || 'Active (Mock RFC/OData)'}</Badge>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-leaf-300 font-bold">Standard Target:</span>
            <span className="text-white font-mono">SAP S/4HANA 2026</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-leaf-300 font-bold">Protocols:</span>
            <span className="text-white">OData v4 · cXML · REST</span>
          </div>
        </div>
      </div>

      {/* Integration Boundary Architecture Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            tab: 's4hana_po',
            title: 'SAP S/4HANA MM',
            subtitle: 'OData A_PurchaseOrder',
            desc: 'Converts confirmed buyer orders into ERP purchase orders with company codes, plant IDs, and payment terms.',
          },
          {
            tab: 'sap_tm',
            title: 'SAP TM FreightOrder',
            subtitle: 'Transportation Management',
            desc: 'Transforms multi-pickup pooled routes into multi-stop Freight Orders with vehicle tracking and GPS coordination.',
          },
          {
            tab: 'sap_control_tower',
            title: 'SAP Control Tower',
            subtitle: 'Supply Chain Event Alert',
            desc: 'Dispatches emergency event webhooks for order cancellations, supply shocks, and re-allocation audits.',
          },
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`card p-5 text-left transition-all cursor-pointer ${
              activeTab === item.tab
                ? 'border-2 border-forest-600 bg-leaf-50/30 ring-2 ring-leaf-100 shadow-md'
                : 'border border-ink-200 bg-white hover:border-ink-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-sm text-ink-900">{item.title}</span>
              <Badge tone={activeTab === item.tab ? 'success' : 'medium'}>{item.subtitle}</Badge>
            </div>
            <p className="text-xs text-ink-600 leading-relaxed">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Payload Inspection & Contract Viewer */}
      <div className="card p-6 bg-white border border-ink-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink-100 mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-ink-900 flex items-center gap-2">
              <FileCode size={18} className="text-forest-700" />
              Standard SAP Integration Contract Payload
            </h3>
            <p className="text-xs text-ink-500">
              Live schema-compliant JSON generated from live FarmLink application records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {copied ? <><Check size={14} className="mr-1 text-forest-600" /> Copied</> : <><Copy size={14} className="mr-1" /> Copy JSON</>}
            </Button>
            <Button size="sm" onClick={() => notify('Synchronized mock payload with SAP integration boundary.')}>
              Dispatch Webhook
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="h-8 w-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-ink-500">Generating standardized SAP contract payload…</p>
          </div>
        ) : exportedPayload ? (
          <div className="relative">
            <pre className="p-4 rounded-xl bg-forest-950 text-leaf-100 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed">
              {JSON.stringify(exportedPayload, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-ink-500 text-center py-8">Select an SAP adapter module to view its contract payload.</p>
        )}
      </div>

      {/* Enterprise Relevance Explanations */}
      <div className="card p-6 bg-sand-50/70 border border-ink-200">
        <h4 className="font-display font-bold text-sm text-ink-900 mb-2">
          Enterprise Integration Architecture Note (SAP Hackfest 2026)
        </h4>
        <p className="text-xs text-ink-600 leading-relaxed mb-3">
          FarmLink AI solves the "last-mile agricultural supply fragmentation" challenge that traditional ERP systems cannot address directly. By aggregating smallholder farmers at the district FPO level into pooled, compatible shipments, FarmLink acts as the trusted bridge between rural producer collectives and enterprise SAP procurement systems.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-ink-700">
          <div className="p-3 bg-white rounded-lg border border-ink-100">
            <strong>SAP S/4HANA Ingestion:</strong> Enterprise buyers can import verified FPO lots directly into SAP MM Purchase Orders without negotiating with hundreds of individual smallholders.
          </div>
          <div className="p-3 bg-white rounded-lg border border-ink-100">
            <strong>SAP Supply Chain Control Tower:</strong> Real-time disruption alerts notify enterprise planners of supply shocks or crop cancellations, with automated alternative matching to prevent production stoppages.
          </div>
        </div>
      </div>
    </div>
  )
}
