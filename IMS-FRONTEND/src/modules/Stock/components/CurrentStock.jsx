import { useMemo } from 'react'
import { ArrowLeftRight, PackageMinus, PackagePlus } from 'lucide-react'
import StatusBadge from '../../../components/StatusBadge'
import TableComponent from '../../../components/tables/TableComponent'
import { formatCurrency } from '../../../utils/helpers'

function renderCellText(value) {
  const text = value || '-'

  return (
    <span className="stock-page__cell-text" title={text}>
      {text}
    </span>
  )
}

export default function CurrentStock({
  stock,
  products,
  canCreate,
  onStockIn,
  onStockOut,
  onStockAdjustment,
}) {
  const rows = useMemo(
    () =>
      stock.map((item) => {
        const product = products.find((entry) => entry.id === item.productId) || {}
        const availableQty = Number(item.availableQty || 0)
        const reorderLevel = Number(item.reorderLevel || 0)

        return {
          ...item,
          category: product.category || 'Uncategorized',
          price: product.price != null ? product.price : 0,
          status:
            availableQty === 0
              ? 'Out of Stock'
              : availableQty <= reorderLevel
                ? 'Low Stock'
                : 'Healthy',
        }
      }),
    [products, stock],
  )

  return (
    <section className="step-panel">
      <TableComponent
        title="Current Stock"
        subtitle="Search live stock positions and capture stock actions from a single, clean toolbar."
        rows={rows}
        columns={[
          {
            key: 'productName',
            label: 'Product Name',
            sortable: true,
            render: (item) => renderCellText(item.productName),
            searchValue: (item) =>
              `${item.productName} ${item.category} ${item.warehouseName}`,
          },
          {
            key: 'category',
            label: 'Category',
            sortable: true,
            render: (item) => renderCellText(item.category),
          },
          {
            key: 'warehouseName',
            label: 'Warehouse',
            sortable: true,
            render: (item) => renderCellText(item.warehouseName),
          },
          {
            key: 'availableQty',
            label: 'Available Qty',
            sortable: true,
          },
          {
            key: 'reorderLevel',
            label: 'Reorder Level',
            sortable: true,
          },
          {
            key: 'price',
            label: 'Value',
            sortable: true,
            render: (item) => formatCurrency(Number(item.price) * Number(item.availableQty)),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item) => (
              <StatusBadge
                type={
                  item.status === 'Out of Stock'
                    ? 'critical'
                    : item.status === 'Low Stock'
                      ? 'low'
                      : 'active'
                }
              >
                {item.status}
              </StatusBadge>
            ),
          },
        ]}
        toolbarContent={
          canCreate ? (
            <div className="stock-page__table-actions">
              <button type="button" className="button button-primary" onClick={onStockIn}>
                <PackagePlus size={16} />
                Stock In
              </button>
              <button type="button" className="button button-secondary" onClick={onStockOut}>
                <PackageMinus size={16} />
                Stock Out
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={onStockAdjustment}
              >
                <ArrowLeftRight size={16} />
                Stock Adjustment
              </button>
            </div>
          ) : null
        }
        searchPlaceholder="Search stock by product, category, or warehouse..."
        emptyMessage="No current stock items match your search."
        rowClassName={(item) =>
          item.status === 'Low Stock'
            ? 'stock-page__row--low'
            : item.status === 'Out of Stock'
              ? 'stock-page__row--out'
              : ''
        }
      />
    </section>
  )
}
