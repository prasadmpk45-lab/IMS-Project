import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

function ReportTable({ title, subtitle, headers, rows, emptyMessage }) {
  return (
    <div className="card reports-page__report-card">
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="helper-text">{subtitle}</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="table-empty">
                  <p className="empty-message">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {row.cells.map((cell, index) => (
                    <td key={`${row.id}-${index}`}>{cell}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Reports({ data }) {
  const lowStockProducts = getLowStockProducts(data.products)
  const monthlyTransactions = getMonthlyTransactionData(data.purchases, data.sales)
  const purchaseValue = data.purchases.reduce(
    (total, item) => total + Number(item.total || 0),
    0,
  )
  const salesValue = data.sales.reduce(
    (total, item) => total + Number(item.total || 0),
    0,
  )

  const warehouseReport = data.warehouses.map((warehouse) => ({
    name: warehouse.name,
    stock: data.stock
      .filter((item) => item.warehouseId === warehouse.id)
      .reduce((total, item) => total + Number(item.availableQty || 0), 0),
  }))

  const salesReportRows = [...data.sales]
    .sort((firstItem, secondItem) => Number(secondItem.total) - Number(firstItem.total))
    .slice(0, 6)
    .map((sale) => ({
      id: sale.id,
      cells: [sale.date, sale.customerName, sale.productName, sale.quantity, formatCurrency(sale.total)],
    }))

  const purchaseReportRows = [...data.purchases]
    .sort((firstItem, secondItem) => Number(secondItem.total) - Number(firstItem.total))
    .slice(0, 6)
    .map((purchase) => ({
      id: purchase.id,
      cells: [
        purchase.date,
        purchase.supplierName,
        purchase.productName,
        purchase.quantity,
        formatCurrency(purchase.total),
      ],
    }))

  const lowStockRows = lowStockProducts.map((product) => ({
    id: product.id,
    cells: [product.name, product.warehouseName, product.stock, product.reorderLevel],
  }))

  return (
    <div className="page reports-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1>Reports</h1>
            <p className="page-subtitle">
              Review sales, purchases, stock trends, and warehouse distribution from one reporting view.
            </p>
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
              <LineChart data={monthlyTransactions}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="purchases" stroke="#0ea5b7" strokeWidth={3} />
                <Line type="monotone" dataKey="sales" stroke="#1d4ed8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Stock By Warehouse</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseReport}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="reports-page__tables">
        <ReportTable
          title="Sales Report"
          subtitle="Top customer orders by invoice value."
          headers={['Date', 'Customer', 'Product', 'Qty', 'Total']}
          rows={salesReportRows}
          emptyMessage="No sales records available."
        />

        <ReportTable
          title="Purchase Report"
          subtitle="Largest supplier purchase entries in the current dataset."
          headers={['Date', 'Supplier', 'Product', 'Qty', 'Total']}
          rows={purchaseReportRows}
          emptyMessage="No purchase records available."
        />

        <ReportTable
          title="Low Stock Report"
          subtitle="Products currently at or below their reorder threshold."
          headers={['Product', 'Warehouse', 'Stock', 'Reorder Level']}
          rows={lowStockRows}
          emptyMessage="No low stock products."
        />
      </div>
    </div>
  )
}
