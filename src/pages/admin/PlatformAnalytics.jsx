import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import ChartCard from '../../components/charts/ChartCard'
import { topCrops } from '../../data/insights'

const ordersByMonth = [
  { month: 'Apr', orders: 520 }, { month: 'May', orders: 640 }, { month: 'Jun', orders: 710 },
  { month: 'Jul', orders: 890 }, { month: 'Aug', orders: 1050 }, { month: 'Sep', orders: 980 },
]

const categorySplit = [
  { name: 'Vegetables', value: 48 }, { name: 'Fruits', value: 22 },
  { name: 'Grains', value: 15 }, { name: 'Dairy', value: 9 }, { name: 'Organic', value: 6 },
]
const COLORS = ['#256e41', '#4f9d5c', '#9bcd9f', '#c78a1f', '#c96a3a']

export default function PlatformAnalytics() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">Platform-wide analytics — figures shown are prototype / demo data.</p>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Orders per Month" subtitle="Platform-wide order volume">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ordersByMonth} margin={{ left: -20 }}>
              <CartesianGrid stroke="#ecefeb" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b756e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b756e' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="orders" fill="#256e41" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Produce Category Split" subtitle="Share of traded volume">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categorySplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {categorySplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top Crops Traded" subtitle="By volume (kg)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topCrops} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid stroke="#ecefeb" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#6b756e' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b756e' }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="volume" fill="#4f9d5c" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
