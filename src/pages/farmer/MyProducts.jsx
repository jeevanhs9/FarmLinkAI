import { useNavigate } from 'react-router-dom'
import { PlusCircle, Package, Eye } from 'lucide-react'
import { useApp } from '../../context/useApp'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import { formatINR } from '../../utils/format'
import { demandTone } from '../../utils/demand'

export default function MyProducts() {
  const { user, listings } = useApp()
  const navigate = useNavigate()
  const myProducts = listings.filter((p) => p.farmerId === user.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">My Products</h2>
          <p className="text-sm font-medium text-ink-500 mt-1">
            {myProducts.length} listing{myProducts.length !== 1 ? 's' : ''} managed by {user.orgName}
          </p>
        </div>
        <Button onClick={() => navigate('/farmer/listing/new')}>
          <PlusCircle size={16} className="mr-2" /> Add New Listing
        </Button>
      </div>

      {myProducts.length > 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {myProducts.map((p) => {
            const maxQty = p.quantity > 500 ? 1000 : 500
            const percent = Math.min(100, Math.round((p.quantity / maxQty) * 100))

            return (
              <div key={p.id} className="card bg-white overflow-hidden card-hover flex flex-col">
                <div className="relative h-44 bg-sand-100 overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  <Badge
                    tone={demandTone(p.demand)}
                    className="absolute top-3 right-3 shadow-md backdrop-blur-md bg-white/90"
                  >
                    {p.demand} demand
                  </Badge>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-display font-bold text-ink-900 text-lg leading-tight">{p.name}</h3>
                    <span className="shrink-0 text-xs font-bold text-ink-500 bg-sand-100 px-2 py-0.5 rounded-lg border border-ink-100">
                      {p.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-sand-50 rounded-xl p-3 border border-ink-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500 mb-1">Price</p>
                      <p className="font-display font-bold text-ink-900">₹{p.price}<span className="text-xs font-medium text-ink-500 font-sans">/{p.unit}</span></p>
                    </div>
                    <div className="bg-sand-50 rounded-xl p-3 border border-ink-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500 mb-1">Quality</p>
                      <p className="text-sm font-bold text-ink-900">{p.quality}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-ink-500">Available Stock</span>
                      <span className="text-ink-900">{p.quantity.toLocaleString('en-IN')} {p.unit}</span>
                    </div>
                    <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${percent > 60 ? 'bg-forest-500' : percent > 30 ? 'bg-amber-500' : 'bg-clay-500'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-[11px] font-medium text-ink-500 mt-1">
                      Estimated value: <span className="font-bold text-forest-700">{formatINR(p.quantity * p.price)}</span>
                    </p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-ink-100">
                    <p className="text-xs font-medium text-ink-500 truncate mb-3 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink-300" />
                      {p.location}
                    </p>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/farmer/products')}>
                      <Eye size={15} className="mr-1.5" /> View Details
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="No listings yet"
          description="Add your first produce listing to appear on the buyer marketplace."
          action={<Button onClick={() => navigate('/farmer/listing/new')}>Add New Listing</Button>}
        />
      )}
    </div>
  )
}
