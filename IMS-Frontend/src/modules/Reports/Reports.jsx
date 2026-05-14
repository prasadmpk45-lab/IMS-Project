import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AlertTriangle,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Warehouse,
} from 'lucide-react'
import {
  formatCurrency,
  getLowStockProducts,
  getMonthlyTransactionData,
} from '../../utils/helpers'
import './Reports.css'

export default function Reports({ data }) {
  const lowStockProducts = getLowStockProducts(data.products)
  const reportData = getMonthlyTransactionData(data.purchases, data.sales)
  const purchaseValue = data.purchases.reduce(
    (total, item) => total + Number(item.total || 0),
    0,
  )
  const salesValue = data.sales.reduce((total, item) => total + Number(item.total || 0), 0)

  return (
    <div className="page reports-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1>Reports</h1>
            <p className="page-subtitle">Review summary figures and stock alerts.</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-card__top">
            <h3>Total Purchase Value</h3>
            <div className="stat-card__icon">
              <DollarSign size={18} />
            </div>
          </div>
          <strong>{formatCurrency(purchaseValue)}</strong>
          <p className="stat-card__caption">Combined value of all purchase entries.</p>
        </div>
        <div className="card stat-card">
          <div className="stat-card__top">
            <h3>Total Sales Value</h3>
            <div className="stat-card__icon">
              <ShoppingCart size={18} />
            </div>
          </div>
          <strong>{formatCurrency(salesValue)}</strong>
          <p className="stat-card__caption">Combined value of all sales entries.</p>
        </div>
        <div className="card stat-card">
          <div className="stat-card__top">
            <h3>Low Stock Count</h3>
            <div className="stat-card__icon">
              <AlertTriangle size={18} />
            </div>
          </div>
          <strong>{lowStockProducts.length}</strong>
          <p className="stat-card__caption">Products that need replenishment soon.</p>
        </div>
        <div className="card stat-card">
          <div className="stat-card__top">
            <h3>Warehouses</h3>
            <div className="stat-card__icon">
              <Warehouse size={18} />
            </div>
          </div>
          <strong>{data.warehouses.length}</strong>
          <p className="stat-card__caption">Configured warehouse locations in the app.</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="card">
          <h2 className="section-title">Transactions Trend</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData}>
                <CartesianGrid stroke="#e5e5e5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="purchases" stroke="#0ea5b7" />
                <Line type="monotone" dataKey="sales" stroke="#64748b" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Low Stock Report</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Warehouse</th>
                  <th>Stock</th>
                  <th>Reorder Level</th>
                </tr>
              </thead>
            <tbody>
              {lowStockProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="table-empty">
                    <p className="empty-message">No low stock products.</p>
                  </td>
                </tr>
              ) : (
                  lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.warehouseName}</td>
                      <td>{product.stock}</td>
                      <td>{product.reorderLevel}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
