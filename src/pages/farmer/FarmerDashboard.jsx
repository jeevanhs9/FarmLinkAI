import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts'
import { BarChart3, ClipboardList, Lightbulb, Package, Plus, Wallet, TrendingUp, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/useApp'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { formatDate, formatINR } from '../../utils/format'
import { farmerForecast, farmerPriceSeries, nearbyMarketPrices } from '../../data/farmerDashboard'
import { demandTone } from '../../utils/demand'

export default function FarmerDashboard() {
  const { user, listings, orders } = useApp()
  const navigate = useNavigate()
  const [crop, setCrop] = useState('Tomato')

  const myProducts = listings.filter((p) => p.farmerId === user.id)
  const myOrders = orders.filter((o) => o.farmerId === user.id)
  const active = myOrders.filter((o) => o.stage !== 'Delivered')
  const sales = myOrders.reduce((sum, o) => sum + o.total, 0)
  const pending = active.reduce((sum, o) => sum + o.total, 0)
  const stockValue = myProducts.reduce((sum, p) => sum + p.quantity * p.price, 0)

  // Forecast value assumes tomato gets the predicted price, others stay same
  const forecastValue = myProducts.reduce((sum, p) => sum + p.quantity * (p.name === 'Tomato' ? farmerForecast.predicted : p.price), 0)

  const prices = farmerPriceSeries[crop]
  const current = prices.at(-2).price
  const prediction = prices.at(-1).price
  const change = ((prediction - prices[0].price) / prices[0].price * 100).toFixed(1)

  const shownOrders = myOrders.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[20px] bg-gradient-to-br from-forest-700 to-forest-900 border border-forest-600/50 p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg shadow-forest-900/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-6 items-center rounded-full bg-leaf-400/20 px-2.5 text-[10px] font-bold uppercase tracking-wider text-leaf-300 ring-1 ring-inset ring-leaf-400/30">
              Farmer Workspace
            </span>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Good morning, {user.name.split(' ')[0]}
          </h2>
          <p className="mt-2 text-sm text-leaf-100/80 max-w-lg leading-relaxed">
            Here's a clear view of your farm's sales, current inventory, and AI-driven market signals for today.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm shadow-none" onClick={() => navigate('/farmer/orders')}>
            <ClipboardList size={16} className="mr-2" /> View Orders
          </Button>
          <Button className="flex-1 md:flex-none bg-leaf-400 text-forest-950 hover:bg-leaf-300 shadow-lg shadow-leaf-500/20" onClick={() => navigate('/farmer/listing/new')}>
            <Plus size={16} className="mr-2" /> Add Listing
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <StatCard label="Total Sales Value" value={formatINR(sales)} icon={Wallet} trend={12} sub="Completed & active demo orders" />
        <StatCard label="Active Orders" value={active.length} icon={ClipboardList} tone="amber" sub="Awaiting delivery" />
        <StatCard label="Active Listings" value={myProducts.length} icon={Package} sub="Available on marketplace" />
        <StatCard label="Pending Value" value={formatINR(pending)} icon={TrendingUp} tone="clay" sub="Value tied in active orders" />
      </div>

      {/* Charts & Insights Row */}
      <div className="grid xl:grid-cols-[1.1fr_1.9fr] gap-5 lg:gap-6">
        <ForecastCard onInsights={() => navigate('/farmer/insights')} />
        <PriceChart crop={crop} setCrop={setCrop} prices={prices} current={current} prediction={prediction} change={change} />
      </div>

      {/* Inventory & Markets Row */}
      <div className="grid xl:grid-cols-[1.8fr_1.2fr] gap-5 lg:gap-6">
        <ProduceCard products={myProducts} onAdd={() => navigate('/farmer/listing/new')} />
        <MarketCard />
      </div>

      {/* Orders & Value Row */}
      <div className="grid xl:grid-cols-[2fr_1fr] gap-5 lg:gap-6 items-start">
        <RecentOrders orders={shownOrders} onViewAll={() => navigate('/farmer/orders')} />
        <div className="space-y-5 lg:space-y-6">
          <HarvestValue value={stockValue} forecastValue={forecastValue} />
          <QuickActions navigate={navigate} />
        </div>
      </div>
    </div>
  )
}

function ForecastCard({ onInsights }) {
  const f = farmerForecast

  return (
    <div className="card p-6 bg-forest-950 border-none text-white relative overflow-hidden flex flex-col justify-between">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-leaf-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-leaf-400 uppercase">
              <Lightbulb size={12} className="text-leaf-400" /> AI Market Intel
            </p>
            <h3 className="mt-2 font-display text-xl font-bold tracking-tight">{f.crop} Forecast</h3>
          </div>
          <Badge tone="high" className="shrink-0 font-bold px-3 py-1 bg-clay-500/20 text-clay-200 border border-clay-500/30">
            {f.demand} Demand
          </Badge>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-5">
          <MetricDark label="Current Market" value={`₹${f.current}/kg`} />
          <MetricDark label="7-Day Target" value={`₹${f.predicted}/kg`} highlight />
          <MetricDark label="Confidence" value={`${f.confidence}%`} />
        </div>

        <p className="mt-5 text-sm leading-relaxed text-leaf-100/80">
          <strong className="text-white font-semibold">Recommendation:</strong> Tomato demand is expected to rise over the next 7 days. Target listing volume is <span className="text-leaf-300 font-semibold">{f.quantity} kg</span> to maximize returns.
        </p>
      </div>

      <div className="mt-6 pt-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <span className="w-2 h-2 rounded-full bg-leaf-400" />
            <span className="w-2 h-2 rounded-full bg-leaf-400/50" />
            <span className="w-2 h-2 rounded-full bg-leaf-400/20" />
          </div>
          <span className="text-xs font-medium text-leaf-300/80">+{f.change}% expected change</span>
        </div>
        <button
          onClick={onInsights}
          className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
        >
          View Full Report <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

function MetricDark({ label, value, highlight }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-leaf-300/70">{label}</p>
      <p className={`mt-1 font-display text-lg font-bold ${highlight ? 'text-leaf-300' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function PriceChart({ crop, setCrop, prices, current, prediction, change }) {
  return (
    <div className="card p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-ink-900 tracking-tight">Market Price Trend</h3>
          <p className="text-xs font-medium text-ink-500 mt-1">7-day historical + 1-day AI prediction</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-sand-100 p-1 border border-ink-100/50 shrink-0 self-start">
          {Object.keys(farmerPriceSeries).map((name) => (
            <button
              key={name}
              onClick={() => setCrop(name)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                crop === name
                  ? 'bg-white text-forest-700 shadow-sm ring-1 ring-ink-100'
                  : 'text-ink-500 hover:text-ink-900 hover:bg-ink-100/50'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 text-sm mb-6 pb-6 border-b border-ink-100">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-ink-200 rounded-full" />
          <div>
            <p className="text-[11px] font-medium text-ink-500 uppercase tracking-wide">Current Price</p>
            <p className="font-display font-bold text-lg text-ink-900 leading-none mt-1">₹{current}<span className="text-xs font-medium text-ink-500 ml-1">/kg</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-forest-500 rounded-full" />
          <div>
            <p className="text-[11px] font-medium text-ink-500 uppercase tracking-wide">Predicted Price</p>
            <p className="font-display font-bold text-lg text-forest-700 leading-none mt-1">₹{prediction}<span className="text-xs font-medium text-ink-500 ml-1">/kg</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto self-end bg-leaf-50 px-3 py-1.5 rounded-lg border border-leaf-100">
          <TrendingUp size={16} className="text-forest-600" />
          <span className="font-bold text-forest-700">+{change}%</span>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={prices} margin={{ top: 10, left: -25, right: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4f9d5c" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4f9d5c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#ecefeb" strokeDasharray="4 4" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#6b756e', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickMargin={12}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b756e', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #ecefeb', boxShadow: '0 4px 20px -4px rgba(13,36,23,0.1)', padding: '12px', fontWeight: 600, fontSize: '13px' }}
              itemStyle={{ color: '#1c5834' }}
              labelStyle={{ color: '#6b756e', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}
              formatter={(value) => [`₹${value}/kg`, 'Price']}
            />
            <ReferenceLine y={current} stroke="#d8ddd8" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#256e41"
              strokeWidth={3}
              fill="url(#priceFill)"
              activeDot={{ r: 6, fill: '#1c5834', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ProduceCard({ products, onAdd }) {
  return (
    <div className="card flex flex-col h-full overflow-hidden">
      <div className="p-5 md:p-6 border-b border-ink-100 flex items-center justify-between bg-white">
        <div>
          <h3 className="font-display text-lg font-bold text-ink-900 tracking-tight">Active Inventory</h3>
          <p className="text-xs font-medium text-ink-500 mt-1">Listed produce currently available for buyers</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-sand-100 text-forest-700 flex items-center justify-center border border-ink-100">
          <Package size={20} />
        </div>
      </div>

      <div className="flex-1 p-5 md:p-6 bg-sand-50/50">
        {products.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {products.map((p) => {
              const maxQty = p.quantity > 500 ? 1000 : 500;
              const percent = Math.min(100, Math.round((p.quantity / maxQty) * 100));

              return (
                <div key={p.id} className="card-hover bg-white rounded-[14px] border border-ink-100 p-4">
                  <div className="flex gap-4">
                    <img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover border border-ink-100 shadow-sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display font-bold text-sm text-ink-900 truncate">{p.name}</p>
                        <Badge tone={demandTone(p.demand)} className="shrink-0">{p.demand}</Badge>
                      </div>
                      <p className="font-display font-bold text-ink-900 mt-1.5">
                        ₹{p.price}<span className="text-[11px] font-normal text-ink-500 font-sans">/{p.unit}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-ink-100">
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span className="text-ink-500">Available Stock</span>
                      <span className="text-ink-900">{p.quantity.toLocaleString('en-IN')} {p.unit}</span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-forest-500 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-full rounded-[14px] border border-dashed border-ink-200 bg-white p-8 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-sand-100 text-ink-400 flex items-center justify-center mb-4">
              <Package size={24} />
            </div>
            <p className="text-sm font-bold text-ink-900">No produce listed yet</p>
            <p className="mt-1.5 text-xs text-ink-500 max-w-[200px] leading-relaxed">Add a harvest listing to reach buyers and create a stock record.</p>
            <Button size="sm" className="mt-5" onClick={onAdd}>
              <Plus size={16} className="mr-1.5" /> Create first listing
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function MarketCard() {
  return (
    <div className="card flex flex-col h-full overflow-hidden">
      <div className="p-5 md:p-6 border-b border-ink-100 bg-white">
        <h3 className="font-display text-lg font-bold text-ink-900 tracking-tight">Local Market Rates</h3>
        <p className="text-xs font-medium text-ink-500 mt-1">Today's wholesale baseline (₹/kg)</p>
      </div>

      <div className="p-5 md:p-6 flex-1 space-y-3 bg-white">
        {nearbyMarketPrices.map((m) => (
          <div
            key={m.market}
            className={`group rounded-xl p-3 border transition-colors ${
              m.reference
                ? 'bg-leaf-50 border-leaf-200 shadow-sm'
                : 'bg-sand-50 border-ink-100 hover:border-ink-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-ink-900 flex items-center gap-2">
                {m.market}
                {m.reference && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-forest-600 text-white">Reference</span>}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-white rounded-lg px-2.5 py-1.5 border border-ink-100/50">
                <span className="block text-[10px] font-bold text-ink-500 uppercase">Tomato</span>
                <span className="font-display font-bold text-ink-900 text-sm mt-0.5">₹{m.tomato}</span>
              </div>
              <div className="bg-white rounded-lg px-2.5 py-1.5 border border-ink-100/50">
                <span className="block text-[10px] font-bold text-ink-500 uppercase">Chilli</span>
                <span className="font-display font-bold text-ink-900 text-sm mt-0.5">₹{m.chilli}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentOrders({ orders, onViewAll }) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-5 md:p-6 border-b border-ink-100 bg-white">
        <div>
          <h3 className="font-display text-lg font-bold text-ink-900 tracking-tight">Recent Orders</h3>
          <p className="text-xs font-medium text-ink-500 mt-1">Latest demand arriving from buyers</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="hidden sm:flex text-forest-700">
          View all <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      {orders.length ? (
        <div className="overflow-x-auto flex-1 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-sand-50/80 border-b border-ink-100 text-xs text-ink-500 uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Order ID</th>
                <th className="px-6 py-4">Buyer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-sand-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap font-display font-bold text-ink-900">{o.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-ink-700">{o.buyer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-ink-900">{o.product}</span>
                    <span className="text-xs font-medium text-ink-500 ml-1.5 bg-sand-100 px-1.5 py-0.5 rounded">
                      {o.quantity} {o.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-display font-bold text-ink-900">{formatINR(o.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge tone={o.stage === 'Delivered' ? 'success' : 'medium'} rounded="rounded-full">{o.stage}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-ink-500">{formatDate(o.placedOn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center bg-sand-50/30 flex-1 flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-white border border-ink-100 flex items-center justify-center mb-3">
            <ClipboardList size={20} className="text-ink-300" />
          </div>
          <p className="text-sm font-bold text-ink-900">No orders yet</p>
          <p className="text-xs font-medium text-ink-500 mt-1 max-w-[250px]">New buyer orders for your listings will automatically appear here.</p>
        </div>
      )}

      <div className="sm:hidden p-4 border-t border-ink-100 bg-sand-50">
        <Button variant="outline" size="sm" className="w-full" onClick={onViewAll}>
          View all orders
        </Button>
      </div>
    </div>
  )
}

function HarvestValue({ value, forecastValue }) {
  const difference = forecastValue - value;
  const isPositive = difference > 0;

  return (
    <div className="card relative overflow-hidden bg-white group hover:border-leaf-300 transition-colors">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Wallet size={120} className="text-forest-700 -mt-10 -mr-10 rotate-12" />
      </div>

      <div className="p-6 md:p-8 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-1 rounded-full bg-forest-600" />
          <p className="text-xs font-bold tracking-widest text-forest-700 uppercase">Inventory Value</p>
        </div>

        <h3 className="font-display font-bold text-ink-900 mb-1">Current Stock Valuation</h3>
        <p className="text-sm font-medium text-ink-500 mb-6 focus-ring">Based on your listed asking prices</p>

        <p className="font-display text-4xl md:text-5xl font-bold text-ink-900 tracking-tight leading-none mb-6">
          {formatINR(value)}
        </p>

        <div className="pt-5 border-t border-ink-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-1">AI Optimized Potential</p>
              <p className="font-display font-bold text-lg text-forest-700">{formatINR(forecastValue)}</p>
            </div>
            {difference !== 0 && (
              <Badge tone="success" className="shadow-sm">
                +{formatINR(difference)} optimal
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActions({ navigate }) {
  return (
    <div className="card p-6 md:p-8 bg-gradient-to-b from-white to-sand-50">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-6 h-1 rounded-full bg-amber-500" />
        <h3 className="font-display text-base font-bold text-ink-900 tracking-tight uppercase">Quick Actions</h3>
      </div>

      <div className="grid gap-3">
        <Button
          variant="secondary"
          onClick={() => navigate('/farmer/listing/new')}
          className="justify-start py-3.5 shadow-sm border border-leaf-200"
        >
          <Plus size={18} className="mr-3 text-forest-600" />
          <span className="font-bold">Add New Component</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/farmer/orders')}
          className="justify-start py-3.5"
        >
          <ClipboardList size={18} className="mr-3 text-ink-400" />
          <span className="font-bold">Review Pipeline</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/farmer/insights')}
          className="justify-start py-3.5"
        >
          <BarChart3 size={18} className="mr-3 text-ink-400" />
          <span className="font-bold">AI Market Scenarios</span>
        </Button>
      </div>
    </div>
  )
}
