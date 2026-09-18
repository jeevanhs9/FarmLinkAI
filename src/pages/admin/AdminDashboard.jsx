import { Users, ShoppingBag, ClipboardList, Package, Info } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useApp } from '../../context/AppContext'
import { farmers } from '../../data/farmers'
import { priceTrend, topCrops } from '../../data/insights'
import StatCard from '../../components/ui/StatCard'
import ChartCard from '../../components/charts/ChartCard'

const demandByCrop = [
  { crop: 'Tomato', demand: 82 }, { crop: 'Onion', demand: 64 }, { crop: 'Potato', demand: 58 },
  { crop: 'Spinach', demand: 71 }, { crop: 'Rice', demand: 45 }, { crop: 'Mango', demand: 76 },
]

export default function AdminDashboard() {
  const { orders } = useApp()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Farmers / FPOs" value="1,284" icon={Users} sub={`${farmers.length} shown in directory`} />
        <StatCard label="Active Buyers" value="327" icon={ShoppingBag} tone="amber" />
        <StatCard label="Total Orders" value={(8452).toLocaleString('en-IN')} icon={ClipboardList} />
        <StatCard label="Produce Traded" value="1,284 tonnes" icon={Package} tone="clay" />
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info size={14} className="text-ink-500" />
          <h3 className="font-display font-semibold text-sm text-ink-900">Demo platform indicators <span className="text-ink-500 font-normal">— illustrative sample data</span></h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="font-display text-lg font-bold text-forest-700">1,284</p><p className="text-xs text-ink-500">Registered FPOs</p></div>
          <div><p className="font-display text-lg font-bold text-clay-500">327</p><p className="text-xs text-ink-500">Active buyers</p></div>
          <div><p className="font-display text-lg font-bold text-forest-700">6</p><p className="text-xs text-ink-500">Orders in today’s demo route</p></div>
          <div><p className="font-display text-lg font-bold text-forest-700">7</p><p className="text-xs text-ink-500">Produce categories</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Crop Demand" subtitle="Relative demand index by crop">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={demandByCrop} margin={{ left: -20 }}>
              <CartesianGrid stroke="#ecefeb" vertical={false} />
              <XAxis dataKey="crop" tick={{ fontSize: 10, fill: '#6b756e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6b756e' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="demand" fill="#256e41" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Price Trends (Tomato)" subtitle="Market vs FarmLink price">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={priceTrend} margin={{ left: -20 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b756e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6b756e' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line dataKey="market" stroke="#a7b0a9" strokeWidth={2} dot={false} name="Market Price" />
              <Line dataKey="farmlink" stroke="#256e41" strokeWidth={2} dot={false} name="FarmLink Price" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Crops" subtitle="By traded volume (kg)">
          <ul className="space-y-2.5 mt-1">
            {topCrops.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between text-sm">
                <span className="text-ink-700">{i + 1}. {c.name}</span>
                <span className="font-medium text-ink-900">{c.volume.toLocaleString('en-IN')} kg</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <div className="card p-4">
        <h3 className="font-display font-semibold text-sm text-ink-900 mb-3">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-500 text-xs">
                <th className="py-2 pr-4">Order</th><th className="py-2 pr-4">Buyer</th><th className="py-2 pr-4">Product</th><th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t border-ink-100">
                  <td className="py-2 pr-4 font-medium text-ink-900">{o.id}</td>
                  <td className="py-2 pr-4 text-ink-700">{o.buyer}</td>
                  <td className="py-2 pr-4 text-ink-700">{o.product}</td>
                  <td className="py-2 text-ink-700">{o.stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
