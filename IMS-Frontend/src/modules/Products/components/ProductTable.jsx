import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../utils/helpers'

export default function ProductTable({
  products,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}) {
  return (
    <div className="card">
      <h2 className="section-title">Product List</h2>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              {canEdit || canDelete ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={canEdit || canDelete ? 8 : 7} className="table-empty">
                  <p className="empty-message">No products available.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>{product.supplierName}</td>
                  <td>{product.stock}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        product.status === 'Low Stock' ? 'status-low' : 'status-active'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  {canEdit || canDelete ? (
                    <td>
                      <div className="table-actions">
                        {canEdit ? (
                          <button
                            type="button"
                            className="button"
                            onClick={() => onEdit(product)}
                          >
                            <Pencil size={16} />
                            Edit
                          </button>
                        ) : null}
                        {canDelete ? (
                          <button
                            type="button"
                            className="button button-danger"
                            onClick={() => onDelete(product.id)}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
