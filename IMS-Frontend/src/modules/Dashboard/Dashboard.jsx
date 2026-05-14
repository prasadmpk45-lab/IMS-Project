import {
  Bar,
  BarChart,
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
  Boxes,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import {
  formatCurrency,
  getCategoryChartData,
  getInventoryValue,
  getLowStockProducts,
  getMonthlyTransactionData,
} from '../../utils/helpers'
import './Dashboard.css'

export default function Dashboard({ data }) {
  const lowStockProducts = getLowStockProducts(data.products)
  const inventoryValue = getInventoryValue(data.products)
  const categoryData = getCategoryChartData(data.products)
  const transactionData = getMonthlyTransactionData(data.purchases, data.sales)

  return (
    <div className="page dashboard-page">
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

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-card__top">
            <h3>Total Products</h3>
            <div className="stat-card__icon">
              <Package size={18} />
            </div>
          </div>
          <strong>{data.products.length}</strong>
          <p className="stat-card__caption">Active products tracked in the system.</p>
        </div>
        <div className="card stat-card">
          <div className="stat-card__top">
            <h3>Low Stock Items</h3>
            <div className="stat-card__icon">
              <AlertTriangle size={18} />
            </div>
          </div>
          <strong>{lowStockProducts.length}</strong>
          <p className="stat-card__caption">Products at or below their reorder level.</p>
        </div>
        <div className="card stat-card">
          <div className="stat-card__top">
            <h3>Inventory Value</h3>
            <div className="stat-card__icon">
              <DollarSign size={18} />
            </div>
          </div>
          <strong>{formatCurrency(inventoryValue)}</strong>
          <p className="stat-card__caption">Estimated stock value based on product cost.</p>
        </div>
        <div className="card stat-card">
          <div className="stat-card__top">
            <h3>Total Sales</h3>
            <div className="stat-card__icon">
              <ShoppingCart size={18} />
            </div>
          </div>
          <strong>{data.sales.length}</strong>
          <p className="stat-card__caption">Completed and pending sale records.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2 className="section-title">Stock by Category</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid stroke="#e5e5e5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#0ea5b7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Monthly Purchases vs Sales</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactionData}>
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
      </div>

      <div className="card">
        <div className="stat-card__top">
          <h2 className="section-title">Low Stock Products</h2>
          <div className="stat-card__icon">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Current Stock</th>
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
                    <td>{product.sku}</td>
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
  )
}
