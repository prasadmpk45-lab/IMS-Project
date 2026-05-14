import {
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Warehouse,
} from 'lucide-react'

import ReportCard from './ReportCard'

export default function StatsCards({ stats, formatCurrency }) {
  const cards = [
    {
      title: 'Total Purchase Value',
      value: formatCurrency(stats.purchaseValue),
      caption: 'Combined value of all purchase entries.',
      icon: <DollarSign size={18} />,
    },
    {
      title: 'Total Sales Value',
      value: formatCurrency(stats.salesValue),
      caption: 'Combined value of all sales entries.',
      icon: <ShoppingCart size={18} />,
    },
    {
      title: 'Low Stock Count',
      value: stats.lowStockCount,
      caption: 'Products that need replenishment soon.',
      icon: <AlertTriangle size={18} />,
    },
    {
      title: 'Warehouses',
      value: stats.warehouseCount,
      caption: 'Configured warehouse locations in the app.',
      icon: <Warehouse size={18} />,
    },
  ]

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <ReportCard key={index} {...card} />
      ))}
    </div>
  )
}