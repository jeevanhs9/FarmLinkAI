import { useNavigate } from 'react-router-dom'
import { PlusCircle, Package } from 'lucide-react'
import { useApp } from '../../context/useApp'
import ProductTable from '../../components/farmer/ProductTable'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

export default function MyProducts() {
  const { user, listings } = useApp()
  const navigate = useNavigate()
  const myProducts = listings.filter((p) => p.farmerId === user.id)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="font-display text-lg font-semibold text-ink-900">Your produce listings</h2><p className="text-sm text-ink-500">Only listings managed by {user.orgName} appear here.</p></div>
        <Button onClick={() => navigate('/farmer/listing/new')}>
          <PlusCircle size={16} /> Add New Listing
        </Button>
      </div>
      {myProducts.length > 0 ? (
        <><p className="text-sm text-ink-500">{myProducts.length} products listed on the marketplace</p><ProductTable products={myProducts} /></>
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
