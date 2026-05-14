import { Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../utils/helpers'

export default function SalesTable({ sales, canDelete, onDelete }) {
  return (
    <div className="card">
      <h2 className="section-title">Sales List</h2>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              {canDelete && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={canDelete ? 8 : 7} className="table-empty">
                  <p className="empty-message">No sales available.</p>
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.customerName}</td>
                  <td>{sale.productName}</td>
                  <td>{sale.warehouseName}</td>
                  <td>{sale.quantity}</td>
                  <td>{formatCurrency(sale.total)}</td>
                  <td>{sale.date}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        sale.status === 'Completed'
                          ? 'status-completed'
                          : 'status-pending'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>

                  {canDelete && (
                    <td>
                      <button
                        className="button button-danger"
                        onClick={() => onDelete(sale.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}