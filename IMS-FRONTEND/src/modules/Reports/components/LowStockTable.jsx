export default function LowStockTable({ lowStockProducts }) {
  return (
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
                  <p className="empty-message">
                    No low stock products.
                  </p>
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
  )
}