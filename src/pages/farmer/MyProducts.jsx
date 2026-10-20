import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Package, Edit3, Trash2, TrendingUp, Truck } from 'lucide-react'
import { useApp } from '../../context/useApp'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { formatINR } from '../../utils/format'
import { demandTone } from '../../utils/demand'

export default function MyProducts() {
  const { user, listings, editListing, deleteListing } = useApp()
  const navigate = useNavigate()
  const myProducts = listings.filter((p) => p.farmerId === user.id)

  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [editForm, setEditForm] = useState({ price: '', quantity: '', quality: '', description: '' })

  const openEditModal = (p) => {
    setEditingProduct(p)
    setEditForm({
      price: p.price,
      quantity: p.quantity,
      quality: p.quality || 'Grade A',
      description: p.description || '',
    })
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingProduct) return
    editListing(editingProduct.id, {
      price: Number(editForm.price),
      quantity: Number(editForm.quantity),
      quality: editForm.quality,
      description: editForm.description,
    })
    setEditingProduct(null)
  }

  const handleConfirmDelete = () => {
    if (!deletingProduct) return
    deleteListing(deletingProduct.id)
    setDeletingProduct(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">My Produce Inventory</h2>
          <p className="text-sm font-medium text-ink-500 mt-1">
            {myProducts.length} active lot{myProducts.length !== 1 ? 's' : ''} listed by {user.orgName}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline" onClick={() => navigate('/farmer/offers')}>
            <TrendingUp size={15} className="mr-1.5" /> Buyer Offers
          </Button>
          <Button variant="outline" onClick={() => navigate('/farmer/pooling')}>
            <Truck size={15} className="mr-1.5" /> Load Pooling
          </Button>
          <Button onClick={() => navigate('/farmer/listing/new')}>
            <PlusCircle size={15} className="mr-1.5" /> Add New Listing
          </Button>
        </div>
      </div>

      {myProducts.length > 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {myProducts.map((p) => {
            const maxQty = p.quantity > 500 ? 1000 : 500
            const percent = Math.min(100, Math.round((p.quantity / maxQty) * 100))

            return (
              <div key={p.id} className="card bg-white overflow-hidden card-hover flex flex-col border border-ink-100">
                <div className="relative h-44 bg-sand-100 overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  <Badge
                    tone={demandTone(p.demand)}
                    className="absolute top-3 right-3 shadow-md backdrop-blur-md bg-white/90"
                  >
                    {p.demand} demand
                  </Badge>
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    Lot #{p.id}
                  </span>
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
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500 mb-1">Asking Price</p>
                      <p className="font-display font-bold text-ink-900">₹{p.price}<span className="text-xs font-medium text-ink-500 font-sans">/{p.unit}</span></p>
                    </div>
                    <div className="bg-sand-50 rounded-xl p-3 border border-ink-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500 mb-1">Quality</p>
                      <p className="text-sm font-bold text-ink-900">{p.quality}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-ink-500">Available Inventory</span>
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(p)}>
                        <Edit3 size={14} className="mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-clay-600 hover:bg-clay-50" onClick={() => setDeletingProduct(p)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
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

      {/* Edit Listing Modal */}
      <Modal
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title={`Edit Listing · ${editingProduct?.name} (#${editingProduct?.id})`}
        maxWidth="max-w-md"
      >
        {editingProduct && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-ink-600 mb-1">Asking Price (₹/{editingProduct.unit})</label>
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={editForm.price}
                onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-ink-600 mb-1">Available Quantity ({editingProduct.unit})</label>
              <input
                type="number"
                min="0"
                required
                value={editForm.quantity}
                onChange={(e) => setEditForm(f => ({ ...f, quantity: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-ink-600 mb-1">Quality Grade</label>
              <select
                value={editForm.quality}
                onChange={(e) => setEditForm(f => ({ ...f, quality: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
              >
                <option>Grade A</option>
                <option>Grade B</option>
                <option>Fair Average Quality</option>
                <option>Certified Organic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-ink-600 mb-1">Lot Notes / Handling</label>
              <textarea
                rows={2}
                value={editForm.description}
                onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-ink-100">
              <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Deactivate Listing Modal */}
      <Modal
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Deactivate Produce Listing"
        maxWidth="max-w-md"
      >
        {deletingProduct && (
          <div className="space-y-4">
            <p className="text-sm text-ink-700 leading-relaxed">
              Are you sure you want to deactivate <strong className="text-ink-900">{deletingProduct.name}</strong> (#{deletingProduct.id})? It will be immediately withdrawn from the buyer marketplace.
            </p>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-ink-100">
              <Button variant="outline" onClick={() => setDeletingProduct(null)}>
                Cancel
              </Button>
              <Button className="bg-clay-600 text-white hover:bg-clay-700" onClick={handleConfirmDelete}>
                Deactivate Listing
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
