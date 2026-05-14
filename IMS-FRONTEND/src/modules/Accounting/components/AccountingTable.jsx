import { formatCurrency } from '../../../utils/helpers'
import StatusBadge from '../../../components/StatusBadge'
import EmptyState from '../../../components/EmptyState'

export default function AccountingTable({ invoices }) {
  return (
    <div className="card">
      <h2 className="section-title">Invoice Register</h2>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Type</th>
              <th>Party</th>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <EmptyState colSpan={9} message="No invoices available." />
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNo}</td>
                  <td>{invoice.invoiceType}</td>
                  <td>{invoice.partyName}</td>
                  <td>{invoice.productName}</td>
                  <td>{invoice.warehouseName}</td>
                  <td>{invoice.quantity}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>{invoice.date}</td>
                  <td>
                    <StatusBadge type={invoice.status === 'Issued' ? 'active' : 'info'}>
                      {invoice.status}
                    </StatusBadge>
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
