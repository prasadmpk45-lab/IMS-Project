import CodePreview from './CodePreview'

export default function BarcodeTable({ barcodes }) {
  return (
    <div className="card">
      <h2 className="section-title">Generated Codes</h2>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Value</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {barcodes.length === 0 ? (
              <tr>
                <td colSpan="5" className="table-empty">
                  <p className="empty-message">No barcode or QR records available.</p>
                </td>
              </tr>
            ) : (
              barcodes.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.productName}</td>
                  <td>{item.codeType}</td>
                  <td className="barcode-page__code">{item.value}</td>
                  <td className="barcode-page__preview">
                    <CodePreview codeType={item.codeType} value={item.value} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
