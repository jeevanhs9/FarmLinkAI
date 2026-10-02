import Badge from '../ui/Badge'
import { formatDate } from '../../utils/format'
import { demandTone } from '../../utils/demand'

export default function ProductTable({ products }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand-100 text-left text-ink-500 text-xs font-medium">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Quality</th>
              <th className="px-4 py-3">Harvest Date</th>
              <th className="px-4 py-3">Demand</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-ink-100 hover:bg-sand-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <img src={p.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                    <span className="font-medium text-ink-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-700">{p.quantity.toLocaleString('en-IN')} {p.unit}</td>
                <td className="px-4 py-3 text-ink-700 font-medium">₹{p.price}/{p.unit}</td>
                <td className="px-4 py-3 text-ink-700">{p.quality}</td>
                <td className="px-4 py-3 text-ink-500">{formatDate(p.harvestDate)}</td>
                <td className="px-4 py-3"><Badge tone={demandTone(p.demand)}>{p.demand}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
