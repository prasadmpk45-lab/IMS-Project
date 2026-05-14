import { Boxes } from 'lucide-react'
import {
  getCategoryChartData,
  getInventoryValue,
  getLowStockProducts,
  getMonthlyTransactionData,
} from '../../utils/helpers'

import StatsGrid from './components/StatsGrid'
import CategoryChart from './components/CategoryChart'
import TransactionChart from './components/TransactionChart'
import LowStockTable from './components/LowStockTable'

import './Dashboard.css'

export default function Dashboard({ data }) {
  const lowStockProducts = getLowStockProducts(data.products)
  const inventoryValue = getInventoryValue(data.products)
  const categoryData = getCategoryChartData(data.products)
  const transactionData = getMonthlyTransactionData(
    data.purchases,
    data.sales
  )

  return (
    <div className="page dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <Boxes size={20} />
          </div>
          <div>
            <h1>Dashboard</h1>
            <p className="page-subtitle">
              Overview of products, stock, purchases, and sales.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid
        products={data.products}
        sales={data.sales}
        lowStock={lowStockProducts}
        inventoryValue={inventoryValue}
      />

      {/* Charts */}
      <div className="dashboard-grid">
        <CategoryChart data={categoryData} />
        <TransactionChart data={transactionData} />
      </div>

      {/* Table */}
      <LowStockTable products={lowStockProducts} />
    </div>
  )
}
