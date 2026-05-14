export default function ReturnsTable({ returns }) {
  return (
    <div className="card">
      <h2 className="section-title">Return & Damage Log</h2>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Quantity</th>
              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {returns.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  <p className="empty-message">
                    No return or damage records available.
                  </p>
                </td>
              </tr>
            ) : (
              returns.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.entryType === 'Damage'
                          ? 'status-critical'
                          : 'status-action'
                      }`}
                    >
                      {item.entryType}
                    </span>
                  </td>
                  <td>{item.productName}</td>
                  <td>{item.warehouseName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}