import { Pencil, Trash2 } from 'lucide-react'
import TableComponent from '../../../components/tables/TableComponent'

export default function SuppliersTable({
  suppliers,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  emptyMessage = 'No suppliers available.',
}) {
  const columns = [
    {
      key: 'name',
      label: 'Supplier',
      sortable: true,
      searchValue: (supplier) =>
        `${supplier.name} ${supplier.contact} ${supplier.email} ${supplier.phone} ${supplier.category}`,
      render: (supplier) => (
        <div className="suppliers-page__table-stack">
          <strong>{supplier.name}</strong>
          <span>{supplier.category}</span>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contacts',
      sortable: true,
      render: (supplier) => (
        <div className="suppliers-page__table-stack">
          <strong>{supplier.contact}</strong>
          <span>{supplier.secondaryContact || supplier.phone}</span>
        </div>
      ),
    },
    {
      key: 'addressLine1',
      label: 'Address',
      sortable: true,
      render: (supplier) =>
        [supplier.addressLine1, supplier.city, supplier.state].filter(Boolean).join(', ') ||
        'Address not set',
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      sortable: true,
      render: (supplier) => supplier.paymentTerms || 'Net 30',
    },
  ]

  if (canEdit || canDelete) {
    columns.push({
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (supplier) => (
        <div className="table-actions">
          {canEdit ? (
            <button
              className="button"
              onClick={(event) => {
                event.stopPropagation()
                onEdit(supplier)
              }}
            >
              <Pencil size={16} />
              Edit
            </button>
          ) : null}
          {canDelete ? (
            <button
              className="button button-danger"
              onClick={(event) => {
                event.stopPropagation()
                onDelete(supplier.id)
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          ) : null}
        </div>
      ),
    })
  }

  return (
    <div className="card">
      <TableComponent
        title="Supplier Directory"
        subtitle="Search and manage supplier contacts, addresses, and commercial terms."
        rows={suppliers}
        columns={columns}
        searchPlaceholder="Search suppliers by name, contact, email, phone, or category..."
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
