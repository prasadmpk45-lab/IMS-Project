function formatDateDisplay(value) {
  if (!value) return ''
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return value
  return `${match[3]}/${match[2]}/${match[1]}`
}

export default function StockMovementsTable({ movements }) {
  return (
    <>
      <h2 className="section-title stock-page__history">
        Recent Movements
      </h2>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  No stock movements available.
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id}>
                  <td>{m.productName}</td>
                  <td>{m.warehouseName}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        m.type === 'in' ? 'status-in' : 'status-out'
                      }`}
                    >
                      {m.type.toUpperCase()}
                    </span>
                  </td>
                  <td>{m.quantity}</td>
                  <td>{formatDateDisplay(m.date)}</td>
                  <td>{m.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
