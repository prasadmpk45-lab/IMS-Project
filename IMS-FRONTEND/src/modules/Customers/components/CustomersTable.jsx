import { Pencil, Trash2 } from 'lucide-react'
import TableComponent from '../../../components/tables/TableComponent'
import { formatCurrency } from '../../../utils/helpers'

export default function CustomersTable({
  customers,
  selectedCustomerId,
  onSelect,
  toolbarContent,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      searchValue: (customer) =>
        `${customer.name} ${customer.company} ${customer.email} ${customer.phone} ${customer.city}`,
      render: (customer) => (
        <div className="customers-page__table-stack">
          <strong>{customer.name}</strong>
          <span>{customer.company}</span>
        </div>
      ),
    },
    {
      key: 'city',
      label: 'Location',
      sortable: true,
      render: (customer) => customer.city,
    },
    {
      key: 'creditLimit',
      label: 'Credit Limit',
      sortable: true,
      render: (customer) => formatCurrency(customer.creditLimit || 0),
    },
    {
      key: 'balance',
      label: 'Outstanding',
      sortable: true,
      render: (customer) => formatCurrency(customer.balance || 0),
    },
  ]

  if (canEdit || canDelete) {
    columns.push({
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (customer) => (
        <div className="table-actions">
          {canEdit ? (
            <button
              className="button"
              onClick={(event) => {
                event.stopPropagation()
                onEdit(customer)
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
                onDelete(customer.id)
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
        title="Customer Directory"
        subtitle="Search customers, review outstanding balances, and pick a record to inspect history below."
        rows={customers}
        columns={columns}
        searchPlaceholder="Search customers by name, company, email, phone, or city..."
        emptyMessage="No customers available."
        rowClassName={(customer) =>
          customer.id === selectedCustomerId ? 'customers-page__row--selected' : ''
        }
        onRowClick={(customer) => onSelect(customer.id)}
        toolbarContent={toolbarContent}
      />
    </div>
  )
}
