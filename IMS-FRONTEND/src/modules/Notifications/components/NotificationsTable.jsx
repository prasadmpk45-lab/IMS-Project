export default function NotificationsTable({ alerts }) {
  return (
    <div className="card">
      <h2 className="section-title">Alerts</h2>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Type</th>
              <th>Source</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="5">No alerts available.</td>
              </tr>
            ) : (
              alerts.map((a) => (
                <tr key={a.id}>
                  <td>{a.date}</td>
                  <td>{a.title}</td>
                  <td>{a.type}</td>
                  <td>{a.source}</td>
                  <td>{a.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}