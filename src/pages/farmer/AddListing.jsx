import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../data/products'
import Button from '../../components/ui/Button'

const FIELD_CLASS = 'w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus-ring focus:border-forest-500'
const LABEL_CLASS = 'block text-xs font-medium text-ink-700 mb-1.5'

export default function AddListing() {
  const { addListing } = useApp()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', category: 'Vegetables', quantity: '', unit: 'kg', price: '',
    location: '', harvestDate: '', quality: 'Grade A', description: '',
  })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    addListing({
      name: form.name || 'New Produce',
      category: form.category,
      quantity: Number(form.quantity) || 0,
      unit: form.unit,
      price: Number(form.price) || 0,
      location: form.location,
      harvest: 'Fresh Harvest',
      harvestDate: form.harvestDate || new Date().toISOString().slice(0, 10),
      quality: form.quality,
      description: form.description,
      demand: 'Medium',
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto card p-8 text-center">
        <div className="h-12 w-12 rounded-full bg-leaf-100 text-forest-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="font-display font-semibold text-lg text-ink-900">Listing added</h2>
        <p className="text-sm text-ink-500 mt-1">{form.name || 'Your produce'} is now visible to buyers on the marketplace.</p>
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', category: 'Vegetables', quantity: '', unit: 'kg', price: '', location: '', harvestDate: '', quality: 'Grade A', description: '' }) }}>
            Add another
          </Button>
          <Button onClick={() => navigate('/farmer/products')}>View My Products</Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto card p-6 space-y-5">
      <div>
        <h2 className="font-display font-semibold text-lg text-ink-900">Add New Listing</h2>
        <p className="text-sm text-ink-500 mt-1">This listing appears on the buyer marketplace immediately.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Crop name</label>
          <input required className={FIELD_CLASS} placeholder="e.g. Tomato" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Category</label>
          <select className={FIELD_CLASS} value={form.category} onChange={update('category')}>
            {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS}>Quantity</label>
          <div className="flex gap-2">
            <input required type="number" min="1" className={FIELD_CLASS} placeholder="500" value={form.quantity} onChange={update('quantity')} />
            <select className="px-2 rounded-lg border border-ink-200 text-sm bg-white focus-ring" value={form.unit} onChange={update('unit')}>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="quintal">quintal</option>
            </select>
          </div>
        </div>
        <div>
          <label className={LABEL_CLASS}>Price (₹ per unit)</label>
          <input required type="number" min="1" className={FIELD_CLASS} placeholder="30" value={form.price} onChange={update('price')} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Location</label>
          <input className={FIELD_CLASS} placeholder="e.g. Kolar, Karnataka" value={form.location} onChange={update('location')} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Harvest date</label>
          <input type="date" className={FIELD_CLASS} value={form.harvestDate} onChange={update('harvestDate')} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Quality grade</label>
          <select className={FIELD_CLASS} value={form.quality} onChange={update('quality')}>
            <option>Grade A</option>
            <option>Grade B</option>
            <option>Premium</option>
            <option>Certified Organic</option>
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS}>Images</label>
          <input type="file" className="w-full text-sm text-ink-500" disabled title="Image upload will connect to storage once the backend is live" />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>Description</label>
        <textarea rows={3} className={FIELD_CLASS} placeholder="Add any details buyers should know..." value={form.description} onChange={update('description')} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => navigate('/farmer/products')}>Cancel</Button>
        <Button type="submit">Submit Listing</Button>
      </div>
    </form>
  )
}
