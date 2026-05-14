import { Trash2 } from 'lucide-react'
import StatusBadge from '../../../components/StatusBadge'
import TableComponent from '../../../components/tables/TableComponent'
import { formatCurrency } from '../../../utils/helpers'

export default function PurchasesTable({ purchases, canDelete, onDelete }) {
  const columns = [
    {
      key: 'supplierName',
      label: 'Supplier',
      sortable: true,
      searchValue: (purchase) =>
        `${purchase.supplierName} ${purchase.productName} ${purchase.warehouseName} ${purchase.status}`,
    },
    {
      key: 'productName',
      label: 'Product',
      sortable: true,
    },
    {
      key: 'warehouseName',
      label: 'Warehouse',
      sortable: true,
    },
    {
      key: 'quantity',
      label: 'Ordered Qty',
      sortable: true,
      render: (purchase) => (
        <div className="purchases-page__table-stack">
          <strong>{purchase.quantity}</strong>
          <span>Received {purchase.receivedQty ?? (purchase.status === 'Received' ? purchase.quantity : 0)}</span>
        </div>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (purchase) => formatCurrency(purchase.total),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (purchase) => (
        <StatusBadge
          type={
            purchase.status === 'Received'
              ? 'received'
              : purchase.status === 'Partial'
                ? 'info'
                : purchase.status === 'Draft'
                  ? 'pending'
                  : 'ordered'
          }
        >
          {purchase.status}
        </StatusBadge>
      ),
    },
  ]

  if (canDelete) {
    columns.push({
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (purchase) => (
        <button
          className="button button-danger"
          onClick={(event) => {
            event.stopPropagation()
            onDelete(purchase.id)
          }}
        >
          <Trash2 size={16} />
          Delete
        </button>
      ),
    })
  }

  return (
    <div className="card">
      <TableComponent
        title="Purchase Register"
        subtitle="Track each PO line through ordered, partial GRN, and received stages."
        rows={purchases}
        columns={columns}
        searchPlaceholder="Search purchases by supplier, product, warehouse, or status..."
        emptyMessage="No purchases available."
      />
    </div>
  )
}
