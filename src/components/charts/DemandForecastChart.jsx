import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function DemandForecastChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#ecefeb" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b756e' }} axisLine={{ stroke: '#d8ddd8' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6b756e' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #ecefeb' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="actual" name="Actual Demand" stroke="#256e41" strokeWidth={2} dot={{ r: 3 }} connectNulls />
        <Line type="monotone" dataKey="predicted" name="Predicted Demand" stroke="#c96a3a" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
