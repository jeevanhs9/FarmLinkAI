import { Users, ShoppingBag, ClipboardList, Package, Info, ArrowUpRight } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { useApp } from '../../context/useApp'
import { farmers } from '../../data/farmers'
import { buyers } from '../../data/buyers'
import { priceTrend, topCrops } from '../../data/insights'
import StatCard from '../../components/ui/StatCard'
import ChartCard from '../../components/charts/ChartCard'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { formatINR } from '../../utils/format'

const demandByCrop = [
  { crop: 'Tomato', demand: 82 }, { crop: 'Onion', demand: 64 }, { crop: 'Potato', demand: 58 },
  { crop: 'Spinach', demand: 71 }, { crop: 'Rice', demand: 45 }, { crop: 'Mango', demand: 76 },
]

export default function AdminDashboard() {
  const { orders, listings } = useApp()
  const activeBuyers = buyers.filter((buyer) => buyer.status === 'Active').length
  const memberFarmers = farmers.reduce((total, farmer) => total + farmer.members, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Platform Overview</h2>
          <p className="text-sm font-medium text-ink-500 mt-1">Cross-district activity and market health.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <StatCard label="Farmers / FPOs" value={farmers.length.toLocaleString('en-IN')} icon={Users} trend={8} sub={`${memberFarmers.toLocaleString('en-IN')} members mapped`} />
        <StatCard label="Active Buyers" value={activeBuyers.toLocaleString('en-IN')} icon={ShoppingBag} trend={14} tone="amber" sub={`From ${buyers.length} total signups`} />
        <StatCard label="Orders Processed" value={orders.length.toLocaleString('en-IN')} icon={ClipboardList} trend={22} sub="Last 30 days" />
        <StatCard label="Active Listings" value={listings.length.toLocaleString('en-IN')} icon={Package} trend={-3} tone="clay" sub="Available volume" />
      </div>

      <div className="card p-5 bg-gradient-to-r from-forest-950 to-forest-900 text-white border-none shadow-lg overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-leaf-500/10 blur-[50px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-full bg-leaf-400/20 flex items-center justify-center border border-leaf-400/30">
              <Info size={16} className="text-leaf-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base tracking-wide">Demo Platform Indicators</h3>
              <p className="text-xs text-leaf-100/70">Illustrative sample data for SIH prototype</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm pt-4 border-t border-white/10">
            <div>
              <p className="font-display text-2xl font-bold text-leaf-400">{farmers.length}</p>
              <p className="text-xs font-medium text-white/70 mt-1">FPO sample records</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-leaf-400">{memberFarmers.toLocaleString('en-IN')}</p>
              <p className="text-xs font-medium text-white/70 mt-1">Represented FPO members</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-leaf-400">{orders.length}</p>
              <p className="text-xs font-medium text-white/70 mt-1">Current demo orders</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-leaf-400">{listings.length}</p>
              <p className="text-xs font-medium text-white/70 mt-1">Marketplace listings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
        <ChartCard title="Relative Crop Demand" subtitle="Index score across districts">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={demandByCrop} margin={{ top: 10, left: -25, right: 0, bottom: 0 }}>
              <CartesianGrid stroke="#ecefeb" vertical={false} strokeDasharray="4 4" />
              <XAxis dataKey="crop" tick={{ fontSize: 11, fill: '#6b756e', fontWeight: 500 }} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis tick={{ fontSize: 11, fill: '#6b756e', fontWeight: 500 }} axisLine={false} tickLine={false} tickMargin={10} />
              <Tooltip
                cursor={{ fill: '#f1f8f1' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #ecefeb', boxShadow: '0 4px 20px -4px rgba(13,36,23,0.1)', padding: '12px', fontWeight: 600 }}
                itemStyle={{ color: '#1c5834' }}
              />
              <Bar dataKey="demand" fill="#256e41" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Price Spreads (Tomato)" subtitle="Market avg vs FarmLink median">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={priceTrend} margin={{ top: 10, left: -25, right: 0, bottom: 0 }}>
              <CartesianGrid stroke="#ecefeb" vertical={false} strokeDasharray="4 4" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b756e', fontWeight: 500 }} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis tick={{ fontSize: 11, fill: '#6b756e', fontWeight: 500 }} axisLine={false} tickLine={false} tickMargin={10} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #ecefeb', boxShadow: '0 4px 20px -4px rgba(13,36,23,0.1)', padding: '12px', fontWeight: 600 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#6b756e', paddingTop: '10px' }} />
              <Line dataKey="market" stroke="#a7b0a9" strokeWidth={3} dot={false} name="Wholesale Market" activeDot={{ r: 6 }} />
              <Line dataKey="farmlink" stroke="#256e41" strokeWidth={3} dot={false} name="FarmLink Direct" activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Traded Volume" subtitle="By cumulative weight (kg)">
          <div className="flex-1 flex flex-col justify-center px-2">
            <ul className="space-y-4">
              {topCrops.map((c, i) => {
                const max = topCrops[0].volume;
                const percent = (c.volume / max) * 100;
                return (
                  <li key={c.name} className="relative">
                    <div className="flex items-center justify-between text-sm mb-1.5 relative z-10">
                      <span className="font-bold text-ink-900 flex items-center gap-2">
                        <span className="text-ink-300 w-4">{i + 1}.</span> {c.name}
                      </span>
                      <span className="font-display font-bold text-forest-700">{c.volume.toLocaleString('en-IN')} <span className="text-xs text-ink-500 font-sans">kg</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-leaf-400 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </ChartCard>
      </div>

      <div className="card overflow-hidden bg-white flex flex-col">
        <div className="p-5 md:p-6 border-b border-ink-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-ink-900 tracking-tight">Recent Platform Orders</h3>
            <p className="text-xs font-medium text-ink-500 mt-1">Cross-sectional view of fulfillment</p>
          </div>
          <Button variant="outline" size="sm">
            View All <ArrowUpRight size={16} className="ml-1" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-sand-50/80 border-b border-ink-100 text-[11px] text-ink-500 uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Order ID</th>
                <th className="px-6 py-4">Buyer</th>
                <th className="px-6 py-4">Item & Qty</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-sand-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap font-display font-bold text-ink-900">{o.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-ink-700">{o.buyer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-ink-900">{o.product}</span>
                    <span className="text-xs font-medium text-ink-500 ml-1.5 bg-white border border-ink-100 px-1.5 py-0.5 rounded">{o.quantity} {o.unit}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-display font-bold text-ink-900">{formatINR(o.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge tone={o.stage === 'Delivered' ? 'success' : 'medium'} rounded="rounded-full">{o.stage}</Badge>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-sand-50 flex items-center justify-center mb-3">
                      <ClipboardList size={20} className="text-ink-300" />
                    </div>
                    <p className="text-sm font-bold text-ink-900">No orders recorded</p>
                    <p className="text-xs font-medium text-ink-500 mt-1">There are no orders in the current demo data.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
