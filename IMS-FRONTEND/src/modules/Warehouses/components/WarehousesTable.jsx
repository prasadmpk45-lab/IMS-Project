import { Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../../../components/StatusBadge'
import TableComponent from '../../../components/tables/TableComponent'

export default function WarehousesTable({
  warehouses,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  emptyMessage = 'No warehouses available.',
}) {
  const columns = [
    {
      key: 'name',
      label: 'Warehouse',
      sortable: true,
      searchValue: (warehouse) =>
        `${warehouse.name} ${warehouse.location} ${warehouse.manager} ${warehouse.status}`,
      render: (warehouse) => (
        <div className="warehouses-page__table-stack">
          <strong>{warehouse.name}</strong>
          <span>{warehouse.location}</span>
        </div>
      ),
    },
    {
      key: 'manager',
      label: 'Manager',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (warehouse) => (
        <StatusBadge type={warehouse.status === 'Inactive' ? 'critical' : 'active'}>
          {warehouse.status || 'Active'}
        </StatusBadge>
      ),
    },
    {
      key: 'rackCount',
      label: 'Rack / Bin',
      sortable: true,
      render: (warehouse) => `${warehouse.rackCount || 0} / ${warehouse.binCount || 0}`,
    },
  ]

  if (canEdit || canDelete) {
    columns.push({
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (warehouse) => (
        <div className="table-actions">
          {canEdit ? (
            <button className="button" onClick={(event) => {
              event.stopPropagation()
              onEdit(warehouse)
            }}>
              <Pencil size={16} />
              Edit
            </button>
          ) : null}

          {canDelete ? (
            <button
              className="button button-danger"
              onClick={(event) => {
                event.stopPropagation()
                onDelete(warehouse.id)
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
        title="Warehouse Register"
        subtitle="Track warehouse profiles, operational status, and rack/bin capacity."
        rows={warehouses}
        columns={columns}
        searchPlaceholder="Search warehouses by name, location, manager, or status..."
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
