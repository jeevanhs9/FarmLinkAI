import { useNavigate } from 'react-router-dom'
import { Sprout, Leaf, ShoppingBasket, Truck, ShieldCheck, ArrowRight } from 'lucide-react'
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
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl lg:min-h-[600px] grid lg:grid-cols-2 rounded-[24px] overflow-hidden shadow-2xl bg-white border border-ink-100/50 relative">
        {/* Brand panel */}
        <div className="bg-forest-950 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-forest-600/20 blur-[100px]" />
            <div className="absolute -bottom-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-leaf-500/10 blur-[100px]" />
            {/* Animated floating elements */}
            <div className="absolute top-1/4 right-10 text-leaf-500/20 animate-[pulse_4s_ease-in-out_infinite]"><Leaf size={48} /></div>
            <div className="absolute bottom-1/3 right-1/4 text-leaf-500/10 animate-[pulse_5s_ease-in-out_infinite_1s] delay-1000"><Sprout size={64} /></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-leaf-400 to-leaf-600 flex items-center justify-center shadow-lg shadow-forest-950">
                <Sprout size={22} className="text-forest-950" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">FarmLink AI</span>
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-bold leading-[1.15] tracking-tight">
              Direct Markets.<br />
              <span className="text-leaf-400">Smarter Decisions.</span><br />
              Better Tomorrow.
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-leaf-100/70 max-w-md">
              Connect harvests to real buyer needs, pool small loads, and coordinate delivery through one district-ready marketplace.
            </p>

            <div className="mt-8 max-w-md rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-leaf-400/0 via-leaf-400/5 to-leaf-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-leaf-400 mb-3">Farm-to-market workflow</p>
              <div className="flex items-center gap-2 text-sm font-bold text-white flex-wrap">
                <span>Forecast</span> <ArrowRight size={14} className="text-leaf-500/50" />
                <span>Price</span> <ArrowRight size={14} className="text-leaf-500/50" />
                <span>Match</span> <ArrowRight size={14} className="text-leaf-500/50" />
                <span>Pool</span> <ArrowRight size={14} className="text-leaf-500/50" />
                <span>Deliver</span>
              </div>
              <p className="mt-3 text-[13px] text-leaf-100/50">FPO-assisted onboarding · shared transport · buyer order visibility</p>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-6 mt-12 relative z-10 pt-8 border-t border-white/10">
            <div>
              <p className="text-2xl font-display font-bold text-white mb-1">15<span className="text-leaf-400">%</span></p>
              <p className="text-xs text-leaf-100/60 font-medium leading-snug">Higher Income<br/>for Farmers</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white mb-1">12<span className="text-leaf-400">%</span></p>
              <p className="text-xs text-leaf-100/60 font-medium leading-snug">Lower Prices<br/>for Consumers</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white mb-1">2x</p>
              <p className="text-xs text-leaf-100/60 font-medium leading-snug">More Efficient<br/>Logistics</p>
            </div>
          </div>
        </div>

        {/* Role selection */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Sign in to workspace</h2>
            <p className="text-[15px] text-ink-500 mt-2">
              This is a prototype build for SIH 2026 — choose a role below to continue with a demo login.
            </p>
          </div>

          <div className="space-y-3">
            {ROLES.map(({ key, label, desc, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className="group w-full flex items-center justify-between p-4 rounded-xl border border-ink-100 hover:border-forest-500/30 bg-white hover:bg-leaf-50/50 hover:shadow-md transition-all duration-300 text-left focus-ring active:scale-[0.99] relative overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-sand-50 group-hover:bg-white border border-ink-100 group-hover:border-leaf-200 text-ink-500 group-hover:text-forest-600 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-[15px] text-ink-900 group-hover:text-forest-900 transition-colors">{label}</p>
                    <p className="text-sm text-ink-500 mt-0.5">{desc}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-ink-100 text-ink-300 group-hover:border-forest-500 group-hover:bg-forest-600 group-hover:text-white transition-all shadow-sm relative z-10">
                  <ArrowRight size={14} strokeWidth={2.5} />
                </div>
                {/* Active circle animation on hover */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-forest-100 opacity-0 group-hover:animate-[pulse-ring_1.5s_cubic-bezier(0.215,0.61,0.355,1)_infinite]" />
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-ink-100 flex items-center justify-between">
            <p className="text-xs text-ink-500 font-medium">Prototype demo access</p>
            <div className="flex gap-1">
              {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-ink-200" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
