import { Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../../../components/StatusBadge'
import TableComponent from '../../../components/tables/TableComponent'
import { formatCurrency } from '../../../utils/helpers'

export default function ProductTable({
  products,
  toolbarContent,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  emptyMessage = 'No products available.',
}) {
  const columns = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      searchValue: (product) =>
        `${product.name} ${product.sku} ${product.barcode} ${product.category} ${product.brand}`,
      render: (product) => (
        <div className="products-table__product">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="products-table__thumb"
            />
          ) : (
            <div className="products-table__thumb products-table__thumb--placeholder">
              {product.name.charAt(0)}
            </div>
          )}
          <div>
            <strong>{product.name}</strong>
            <div className="products-table__meta">{product.brand || 'Generic brand'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'sku',
      label: 'SKU / Barcode',
      sortable: true,
      render: (product) => (
        <div className="products-table__stack">
          <strong>{product.sku}</strong>
          <span>{product.barcode || 'Barcode pending'}</span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (product) => (
        <div className="products-table__stack">
          <strong>{product.category}</strong>
          <span>{product.unit || 'Unit not set'}</span>
        </div>
      ),
    },
    {
      key: 'variantColor',
      label: 'Variant',
      sortable: true,
      render: (product) =>
        product.variantSize || product.variantColor ? (
          <div className="products-table__stack">
            <strong>{product.variantSize || 'Standard'}</strong>
            <span>{product.variantColor || 'Default color'}</span>
          </div>
        ) : (
          'Standard'
        ),
    },
    {
      key: 'supplierName',
      label: 'Supplier',
      sortable: true,
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (product) => (
        <div className="products-table__stack">
          <strong>{product.stock}</strong>
          <span>Reorder at {product.reorderLevel}</span>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (product) => formatCurrency(product.price),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (product) => (
        <StatusBadge
          type={
            product.status === 'Inactive'
              ? 'critical'
              : product.status === 'Low Stock'
                ? 'low'
                : 'active'
          }
        >
          {product.status}
        </StatusBadge>
      ),
    },
  ]

  if (canEdit || canDelete) {
    columns.push({
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (product) => (
        <div className="table-actions table-actions--nowrap" style={{ minWidth: '120px' }}>
          {canEdit ? (
            <button
              type="button"
              className="button"
              onClick={(event) => {
                event.stopPropagation()
                onEdit(product)
              }}
            >
              <Pencil size={16} />
              Edit
            </button>
          ) : null}
          {canDelete ? (
            <button
              type="button"
              className="button button-danger"
              onClick={(event) => {
                event.stopPropagation()
                onDelete(product.id)
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
        title="Product List"
        subtitle="Search, sort, and paginate the catalog while filtering by category, brand, and unit."
        rows={products}
        columns={columns}
        searchPlaceholder="Search products by name, SKU, barcode, brand, or category..."
        emptyMessage={emptyMessage}
        toolbarContent={toolbarContent}
        rowClassName={(product) =>
          product.status === 'Low Stock' ? 'products-table__row--low' : ''
        }
      />
    </div>
  )
}
