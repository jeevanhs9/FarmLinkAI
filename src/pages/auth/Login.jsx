import { useNavigate } from 'react-router-dom'
import { Sprout, Leaf, ShoppingBasket, Truck, ShieldCheck } from 'lucide-react'
import { useApp } from '../../context/useApp'

const ROLES = [
  { key: 'farmer', label: 'Farmer / FPO', desc: 'List produce, pool nearby supply, and track orders.', icon: Leaf },
  { key: 'buyer', label: 'Buyer', desc: 'Browse the marketplace and place orders directly.', icon: ShoppingBasket },
  { key: 'logistics', label: 'Logistics', desc: 'Coordinate shared pickups and buyer deliveries.', icon: Truck },
  { key: 'admin', label: 'Admin', desc: 'Review platform activity and participant records.', icon: ShieldCheck },
]

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()

  const handleSelect = (role) => {
    login(role)
    navigate(`/${role}`)
  }

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 rounded-2xl overflow-hidden border border-ink-100 shadow-sm bg-white">
        {/* Brand panel */}
        <div className="bg-forest-900 text-white p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="h-9 w-9 rounded-md bg-leaf-500 flex items-center justify-center">
                <Sprout size={20} className="text-forest-900" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl">FarmLink AI</span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold leading-snug">
              Direct Markets.<br />Smarter Decisions.<br />Better Tomorrow.
            </h1>
            <p className="mt-4 text-sm text-leaf-100/80 max-w-sm">
              Connect harvests to real buyer needs, pool small loads, and coordinate delivery through one district-ready marketplace.
            </p>
            <div className="mt-6 max-w-sm rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-leaf-300">Farm-to-market workflow</p>
              <p className="mt-2 text-sm font-semibold text-white">Forecast <span className="text-leaf-300">→</span> Price <span className="text-leaf-300">→</span> Match <span className="text-leaf-300">→</span> Pool <span className="text-leaf-300">→</span> Deliver</p>
              <p className="mt-2 text-xs text-leaf-100/70">FPO-assisted onboarding · shared transport · buyer order visibility</p>
            </div>
          </div>
          <div className="hidden lg:flex gap-6 text-xs text-leaf-100/70 mt-10">
            <span>Higher Income for Farmers</span>
            <span>Lower Prices for Consumers</span>
            <span>Efficient Logistics</span>
          </div>
        </div>

        {/* Role selection */}
        <div className="p-8 lg:p-10">
          <h2 className="font-display text-lg font-semibold text-ink-900">Sign in to your workspace</h2>
          <p className="text-sm text-ink-500 mt-1 mb-6">
            This is a prototype build for SIH 2026 — choose a role to continue with a demo login.
          </p>
          <div className="space-y-2.5">
            {ROLES.map(({ key, label, desc, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className="w-full flex items-start gap-3 p-3.5 rounded-xl border border-ink-100 hover:border-forest-500 hover:bg-leaf-50 transition-colors text-left focus-ring"
              >
                <div className="h-9 w-9 rounded-lg bg-leaf-50 text-forest-700 flex items-center justify-center shrink-0">
                  <Icon size={17} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink-900">{label}</p>
                  <p className="text-xs text-ink-500">{desc}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-ink-500 mt-6">
            Prototype demo access · sample records only · no real authentication or payment is performed.
          </p>
        </div>
      </div>
    </div>
  )
}
