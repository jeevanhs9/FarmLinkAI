import { Mail, Phone, MapPin, Calendar, Building2, LogOut, Shield } from 'lucide-react'
import { useApp } from '../context/useApp'
import { formatDate } from '../utils/format'
import Button from '../components/ui/Button'

export default function Profile() {
  const { user, logout } = useApp()

  const roleLabels = {
    farmer: 'Farmer / FPO',
    buyer: 'Buyer',
    logistics: 'Logistics Partner',
    admin: 'Platform Admin',
  }

  const rows = [
    { icon: Building2, label: 'Organization', value: user.orgName },
    { icon: MapPin, label: 'Location', value: user.location },
    { icon: Phone, label: 'Phone', value: user.phone },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Calendar, label: 'Member since', value: formatDate(user.joined) },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Profile Hero Card */}
      <div className="card overflow-hidden bg-white">
        <div className="h-24 bg-gradient-to-br from-forest-800 to-forest-950 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-leaf-500/20 to-transparent" />
        </div>
        <div className="px-6 pb-6 -mt-10 relative">
          <div className="flex items-end justify-between gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-20 w-20 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
            />
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 border border-leaf-200 px-3 py-1 text-xs font-bold text-forest-700">
                <Shield size={12} />
                {roleLabels[user.role] ?? user.role}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">{user.name}</h2>
            <p className="text-sm font-medium text-ink-500 mt-0.5">{user.orgName}</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="card bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-100 bg-sand-50/50">
          <h3 className="font-display font-bold text-base text-ink-900 tracking-tight">Account Information</h3>
        </div>
        <div className="divide-y divide-ink-100">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4 hover:bg-sand-50/50 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-sand-50 text-forest-700 border border-ink-100 flex items-center justify-center shrink-0">
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{label}</p>
                <p className="text-sm font-semibold text-ink-900 mt-0.5 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-4 flex gap-3">
        <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <Shield size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-900">Demo account</p>
          <p className="text-xs font-medium text-amber-700 mt-0.5">This is a prototype demo profile. Profile editing requires the production backend.</p>
        </div>
      </div>

      <Button variant="danger" onClick={logout} className="w-full sm:w-auto flex items-center gap-2">
        <LogOut size={16} /> Sign out of workspace
      </Button>
    </div>
  )
}
