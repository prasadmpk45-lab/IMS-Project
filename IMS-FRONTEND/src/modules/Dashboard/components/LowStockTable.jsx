import { TrendingUp } from 'lucide-react'

export default function LowStockTable({ products }) {
  return (
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
              <th>Stock</th>
              <th>Reorder Level</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="table-empty">
                  No low stock products.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.stock}</td>
                  <td>{p.reorderLevel}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
