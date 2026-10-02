import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Leaf, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/useApp'
import { CATEGORIES } from '../../data/products'
import Button from '../../components/ui/Button'

const FIELD_CLASS = 'w-full px-4 py-3 rounded-xl border border-ink-200 text-[15px] bg-sand-50/50 focus:bg-white focus-ring focus:border-forest-500 transition-all'
const LABEL_CLASS = 'block text-sm font-bold text-ink-700 mb-1.5'

export default function AddListing() {
  const { addListing, user } = useApp()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', category: 'Vegetables', quantity: '', unit: 'kg', price: '',
    location: '', harvestDate: '', quality: 'Grade A', description: '', image: '',
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
      image: form.image,
      demand: 'Medium',
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-10 text-center bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-leaf-50/40 pointer-events-none" />
          <div className="relative z-10">
            <div className="h-16 w-16 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-forest-200/50">
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Listing Published!</h2>
            <p className="text-[15px] text-ink-500 mt-2 max-w-xs mx-auto leading-relaxed">
              <strong className="text-ink-900">{form.name || 'Your produce'}</strong> is now live and visible to all buyers on the marketplace.
            </p>
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false)
                  setForm({ name: '', category: 'Vegetables', quantity: '', unit: 'kg', price: '', location: '', harvestDate: '', quality: 'Grade A', description: '', image: '' })
                }}
              >
                Add Another
              </Button>
              <Button onClick={() => navigate('/farmer/products')}>
                View Products <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="h-9 w-9 rounded-xl bg-leaf-50 text-forest-700 flex items-center justify-center border border-leaf-100">
            <Leaf size={18} />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">New Produce Listing</h2>
        </div>
        <p className="text-sm font-medium text-ink-500 ml-[52px]">Your listing goes live on the buyer marketplace immediately after submission.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="card p-6 bg-white">
          <h3 className="font-display font-bold text-base text-ink-900 mb-4 pb-3 border-b border-ink-100">Basic Information</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="listing-name" className={LABEL_CLASS}>Crop / Produce Name <span className="text-clay-500">*</span></label>
              <input id="listing-name" required maxLength={60} className={FIELD_CLASS} placeholder="e.g. Cherry Tomatoes" value={form.name} onChange={update('name')} />
            </div>
            <div>
              <label htmlFor="listing-category" className={LABEL_CLASS}>Category</label>
              <div className="relative">
                <select id="listing-category" className={FIELD_CLASS + ' appearance-none cursor-pointer'} value={form.category} onChange={update('category')}>
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Quantity */}
        <div className="card p-6 bg-white">
          <h3 className="font-display font-bold text-base text-ink-900 mb-4 pb-3 border-b border-ink-100">Pricing & Availability</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="listing-quantity" className={LABEL_CLASS}>Available Quantity <span className="text-clay-500">*</span></label>
              <div className="flex gap-2">
                <input id="listing-quantity" required type="number" min="1" step="1" className={FIELD_CLASS} placeholder="500" value={form.quantity} onChange={update('quantity')} />
                <div className="relative shrink-0">
                  <label htmlFor="listing-unit" className="sr-only">Unit</label>
                  <select id="listing-unit" className="h-full px-3 pr-8 rounded-xl border border-ink-200 bg-white text-sm font-bold focus-ring appearance-none cursor-pointer" value={form.unit} onChange={update('unit')}>
                    <option value="kg">kg</option>
                    <option value="litre">litre</option>
                    <option value="quintal">quintal</option>
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="listing-price" className={LABEL_CLASS}>Asking Price (₹ per unit) <span className="text-clay-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 font-bold text-base">₹</span>
                <input id="listing-price" required type="number" min="1" step="1" className={FIELD_CLASS + ' pl-8'} placeholder="30" value={form.price} onChange={update('price')} />
              </div>
            </div>
          </div>
        </div>

        {/* Location & Quality */}
        <div className="card p-6 bg-white">
          <h3 className="font-display font-bold text-base text-ink-900 mb-4 pb-3 border-b border-ink-100">Location & Quality</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="listing-location" className={LABEL_CLASS}>Pickup Location</label>
              <input id="listing-location" className={FIELD_CLASS} placeholder={`e.g. ${user?.location || 'Kolar, Karnataka'}`} value={form.location} onChange={update('location')} />
            </div>
            <div>
              <label htmlFor="listing-harvest-date" className={LABEL_CLASS}>Harvest Date</label>
              <input id="listing-harvest-date" type="date" className={FIELD_CLASS} value={form.harvestDate} onChange={update('harvestDate')} />
            </div>
            <div>
              <label htmlFor="listing-quality" className={LABEL_CLASS}>Quality Grade</label>
              <div className="relative">
                <select id="listing-quality" className={FIELD_CLASS + ' appearance-none cursor-pointer'} value={form.quality} onChange={update('quality')}>
                  <option>Grade A</option>
                  <option>Grade B</option>
                  <option>Premium</option>
                  <option>Certified Organic</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="listing-image" className={LABEL_CLASS}>
                Produce Image URL <span className="text-ink-400 font-medium">(optional)</span>
              </label>
              <input id="listing-image" type="url" className={FIELD_CLASS} placeholder="https://example.com/tomatoes.jpg" value={form.image} onChange={update('image')} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-6 bg-white">
          <h3 className="font-display font-bold text-base text-ink-900 mb-4 pb-3 border-b border-ink-100">Description</h3>
          <label htmlFor="listing-description" className="sr-only">Description</label>
          <textarea
            id="listing-description"
            rows={4}
            maxLength={500}
            className={FIELD_CLASS + ' resize-none'}
            placeholder="Harvest timing, growing practices, packaging, or handling notes..."
            value={form.description}
            onChange={update('description')}
          />
          <p className="text-[11px] text-ink-400 mt-2">{form.description.length}/500 characters</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/farmer/products')}>Cancel</Button>
          <Button type="submit" size="lg">
            Publish Listing <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </form>
    </div>
  )
}
