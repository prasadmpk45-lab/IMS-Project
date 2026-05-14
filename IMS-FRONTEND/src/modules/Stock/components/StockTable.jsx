export default function StockTable({ stock }) {
  return (
    <>
      <h2 className="section-title">Current Stock</h2>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Warehouse</th>
              <th>Available Qty</th>
              <th>Reorder Level</th>
            </tr>
          </thead>

          <tbody>
            {stock.length === 0 ? (
              <tr>
                <td colSpan="5" className="table-empty">
                  No stock records available.
                </td>
              </tr>
            ) : (
              stock.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.sku}</td>
                  <td>{item.warehouseName}</td>
                  <td>{item.availableQty}</td>
                  <td>{item.reorderLevel}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
