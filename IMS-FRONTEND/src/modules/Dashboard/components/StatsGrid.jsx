import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingCart,
} from 'lucide-react'
import StatCard from './StatCard'
import { formatCurrency } from '../../../utils/helpers'

export default function StatsGrid({
  products,
  sales,
  lowStock,
  inventoryValue,
}) {
  return (
    <div className="stats-grid">
      <StatCard
        title="Total Products"
        value={products.length}
        icon={Package}
        caption="Active products tracked in the system."
      />

      <StatCard
        title="Low Stock Items"
        value={lowStock.length}
        icon={AlertTriangle}
        caption="Products at or below reorder level."
      />

      <StatCard
        title="Inventory Value"
        value={formatCurrency(inventoryValue)}
        icon={DollarSign}
        caption="Estimated stock value."
      />

      <StatCard
        title="Total Sales"
        value={sales.length}
        icon={ShoppingCart}
        caption="Completed and pending sales."
      />
    </div>
  )
}
