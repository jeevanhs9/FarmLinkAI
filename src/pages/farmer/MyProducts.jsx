import { useNavigate } from 'react-router-dom'
import { PlusCircle, Package } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import ProductTable from '../../components/farmer/ProductTable'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

export default function MyProducts() {
  const { user, listings } = useApp()
  const navigate = useNavigate()
  const myProducts = listings.filter((p) => p.farmerId === user.id)
  const shown = myProducts.length ? myProducts : listings.slice(0, 3)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{shown.length} products listed on the marketplace</p>
        <Button onClick={() => navigate('/farmer/listing/new')}>
          <PlusCircle size={16} /> Add New Listing
        </Button>
      </div>
      {shown.length > 0 ? (
        <ProductTable products={shown} />
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
