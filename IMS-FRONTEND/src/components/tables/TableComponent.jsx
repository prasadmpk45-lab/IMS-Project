import { ArrowUpDown, ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import SearchInput from '../SearchInput'
import './TableComponent.css'

function getValueFromColumn(column, row) {
  if (typeof column.sortValue === 'function') {
    return column.sortValue(row)
  }

  if (column.key) {
    return row[column.key]
  }

  return ''
}

function getSearchableText(row, columns, searchKeys) {
  if (searchKeys.length > 0) {
    return searchKeys
      .map((key) => String(row[key] ?? '').toLowerCase())
      .join(' ')
  }

  return columns
    .filter((column) => column.searchable !== false)
    .map((column) => {
      if (typeof column.searchValue === 'function') {
        return String(column.searchValue(row) ?? '').toLowerCase()
      }

      if (column.key) {
        return String(row[column.key] ?? '').toLowerCase()
      }

      return ''
    })
    .join(' ')
}

export default function TableComponent({
  title,
  subtitle,
  rows,
  columns,
  keyField = 'id',
  searchKeys = [],
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records available.',
  loading = false,
  defaultPageSize = 6,
  defaultSortKey = '',
  defaultSortDirection = 'asc',
  toolbarContent = null,
  footerContent = null,
  rowClassName,
  onRowClick,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [sortConfig, setSortConfig] = useState({
    key: defaultSortKey,
    direction: defaultSortDirection,
  })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, pageSize, rows.length])

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return rows
    }

    return rows.filter((row) =>
      getSearchableText(row, columns, searchKeys).includes(normalizedSearch),
    )
  }, [columns, rows, searchKeys, searchTerm])

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) {
      return filteredRows
    }

    const activeColumn = columns.find((column) => column.key === sortConfig.key)

    if (!activeColumn) {
      return filteredRows
    }

    return [...filteredRows].sort((firstRow, secondRow) => {
      const firstValue = getValueFromColumn(activeColumn, firstRow)
      const secondValue = getValueFromColumn(activeColumn, secondRow)

      const normalizedFirst =
        typeof firstValue === 'string' ? firstValue.toLowerCase() : firstValue
      const normalizedSecond =
        typeof secondValue === 'string' ? secondValue.toLowerCase() : secondValue

      if (normalizedFirst === normalizedSecond) {
        return 0
      }

      const nextValue = normalizedFirst > normalizedSecond ? 1 : -1
      return sortConfig.direction === 'asc' ? nextValue : -nextValue
    })
  }, [columns, filteredRows, sortConfig])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedRows = sortedRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  function handleSort(column) {
    if (!column.sortable) {
      return
    }

    setSortConfig((currentValue) => ({
      key: column.key,
      direction:
        currentValue.key === column.key && currentValue.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  return (
    <div className="table-component">
      {title || toolbarContent ? (
        <div className="table-component__header">
          <div>
            {title ? <h2 className="section-title">{title}</h2> : null}
            {subtitle ? <p className="helper-text">{subtitle}</p> : null}
          </div>

          <div className="table-component__toolbar">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={searchPlaceholder}
            />
            {toolbarContent}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="table-component__loading">
          <LoaderCircle size={20} className="animate-spin" />
          <p>Loading records...</p>
        </div>
      ) : paginatedRows.length === 0 ? (
        <div className="table-component__empty">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table table-component__table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key || column.label}>
                      {column.sortable ? (
                        <button
                          type="button"
                          className="table-component__sort-button"
                          onClick={() => handleSort(column)}
                        >
                          {column.label}
                          <ArrowUpDown size={14} />
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedRows.map((row) => (
                  <tr
                    key={row[keyField]}
                    className={`${
                      typeof rowClassName === 'function' ? rowClassName(row) : ''
                    } ${onRowClick ? 'is-clickable' : ''}`.trim()}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => (
                      <td key={column.key || column.label}>
                        {typeof column.render === 'function'
                          ? column.render(row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-component__pagination">
            <span className="table-component__status">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, sortedRows.length)} of {sortedRows.length}
            </span>

            <div className="table-component__filters">
              <label className="table-component__status">
                Rows
                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                >
                  {[5, 8, 10].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <div className="table-component__page-controls">
                <button
                  type="button"
                  className="button"
                  onClick={() => setPage((currentValue) => Math.max(currentValue - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <span className="table-component__status">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="button"
                  onClick={() =>
                    setPage((currentValue) =>
                      Math.min(currentValue + 1, totalPages),
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {footerContent}
    </div>
  )
}
