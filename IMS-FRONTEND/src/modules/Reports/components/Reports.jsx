import {
  formatCurrency,
  getLowStockProducts,
  getMonthlyTransactionData,
} from '../../../utils/helpers'

import StatsCards from './StatsCards'
import TransactionChart from './TransactionChart'
import LowStockTable from './LowStockTable'

import './Reports.css'

export default function Reports({ data }) {
  const lowStockProducts = getLowStockProducts(data.products)

  const reportData = getMonthlyTransactionData(
    data.purchases,
    data.sales,
  )

  const purchaseValue = data.purchases.reduce(
    (total, item) => total + Number(item.total || 0),
    0,
  )

  const salesValue = data.sales.reduce(
    (total, item) => total + Number(item.total || 0),
    0,
  )

  const statsData = {
    purchaseValue,
    salesValue,
    lowStockCount: lowStockProducts.length,
    warehouseCount: data.warehouses.length,
  }

  return (
    <div className="page reports-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Reports</h1>
          <p className="page-subtitle">
            Review summary figures and stock alerts.
          </p>
        </div>
      </div>

      <StatsCards stats={statsData} formatCurrency={formatCurrency} />

      <div className="reports-grid">
        <TransactionChart reportData={reportData} />

        <LowStockTable lowStockProducts={lowStockProducts} />
      </div>
    </div>
  )
}