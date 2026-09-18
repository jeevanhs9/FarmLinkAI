import { Mail, Phone, MapPin, Calendar, Building2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate } from '../utils/format'
import Button from '../components/ui/Button'

export default function Profile() {
  const { user, logout } = useApp()

  const rows = [
    { icon: Building2, label: 'Organization', value: user.orgName },
    { icon: MapPin, label: 'Location', value: user.location },
    { icon: Phone, label: 'Phone', value: user.phone },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Calendar, label: 'Member since', value: formatDate(user.joined) },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="card p-6 flex items-center gap-4">
        <img src={user.avatar} alt="" className="h-16 w-16 rounded-full object-cover border border-ink-100" />
        <div>
          <h2 className="font-display font-semibold text-lg text-ink-900">{user.name}</h2>
          <p className="text-sm text-ink-500 capitalize">{user.role} account</p>
        </div>
      </div>

      <div className="card p-5 divide-y divide-ink-100">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="h-8 w-8 rounded-lg bg-leaf-50 text-forest-700 flex items-center justify-center shrink-0">
              <Icon size={15} />
            </div>
            <div>
              <p className="text-xs text-ink-500">{label}</p>
              <p className="text-sm font-medium text-ink-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={logout}>Log out</Button>
    </div>
  )
}
