import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function PriceTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b756e' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#6b756e' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #ecefeb' }} />
        <Line type="monotone" dataKey="market" name="Market Price" stroke="#a7b0a9" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="farmlink" name="FarmLink Price" stroke="#256e41" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
