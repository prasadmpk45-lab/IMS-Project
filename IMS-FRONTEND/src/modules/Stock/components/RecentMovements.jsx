import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'

function formatDateDisplay(value) {
  if (!value) return ''
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return value
  return `${match[3]}/${match[2]}/${match[1]}`
}

function parseDateDisplay(value) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return ''
  const [, day, month, year] = match
  const iso = `${year}-${month}-${day}`
  const parsed = new Date(iso)
  return Number.isNaN(parsed.getTime()) ? '' : iso
}

export default function RecentMovements({
  movements,
  products,
  title = 'Recent Movements',
  subtitle = 'Filter inventory movement history by date or product.',
}) {
  const [dateFilter, setDateFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')

  const filteredMovements = useMemo(() => {
    const filterDate = parseDateDisplay(dateFilter)

    return movements
      .filter((movement) => {
        if (productFilter && movement.productId !== productFilter) {
          return false
        }

        if (filterDate && movement.date !== filterDate) {
          return false
        }

        return true
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [movements, productFilter, dateFilter])

  return (
    <section className="step-panel">
      <div className="step-panel__header">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="step-panel__subtitle">{subtitle}</p>
        </div>

        <div className="step-panel__filters">
          <label className="field">
            <span>Date</span>
            <div className="input-with-icon date-input-wrapper">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                onBlur={() => {
                  const parsed = parseDateDisplay(dateFilter)
                  if (parsed) {
                    setDateFilter(formatDateDisplay(parsed))
                  }
                }}
              />
              <CalendarDays size={18} />
            </div>
          </label>

          <label className="field">
            <span>Product</span>
            <select
              value={productFilter}
              onChange={(event) => setProductFilter(event.target.value)}
              className="search-input"
            >
              <option value="">All products</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="table-wrapper stock-page__history-table">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan="4" className="table-empty">
                  No recent movements match the selected filters.
                </td>
              </tr>
            ) : (
              filteredMovements.map((movement) => (
                <tr key={movement.id}>
                  <td>{formatDateDisplay(movement.date)}</td>
                  <td>
                    <span
                      className="stock-page__cell-text"
                      title={movement.productName}
                    >
                      {movement.productName}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        movement.type === 'in' ? 'status-in' : 'status-out'
                      }`}
                    >
                      {movement.type.toUpperCase()}
                    </span>
                  </td>
                  <td>{movement.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
