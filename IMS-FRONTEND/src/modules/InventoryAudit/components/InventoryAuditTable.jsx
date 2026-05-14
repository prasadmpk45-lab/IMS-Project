import SearchableSelect from '../../../components/SearchableSelect'
import { Warehouse } from 'lucide-react'

export default function InventoryAuditTable({
  audits,
  warehouses,
  filterWarehouseId,
  setFilterWarehouseId,
}) {
  const filteredAudits =
    filterWarehouseId === 'all'
      ? audits
      : audits.filter((item) => item.warehouseId === filterWarehouseId)

  return (
    <div className="card">
      <div className="inventory-audit__toolbar">
        <h2 className="section-title">Audit Log</h2>

        <SearchableSelect
          name="filter"
          icon={Warehouse}
          value={filterWarehouseId}
          onChange={(e) => setFilterWarehouseId(e.target.value || 'all')}
          options={[
            { value: 'all', label: 'All warehouses' },
            ...warehouses.map((w) => ({
              value: w.id,
              label: w.name,
            })),
          ]}
        />
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Warehouse</th>
              <th>Product</th>
              <th>System</th>
              <th>Actual</th>
              <th>Diff</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {filteredAudits.length === 0 ? (
              <tr>
                <td colSpan="7">No records</td>
              </tr>
            ) : (
              filteredAudits.map((a) => (
                <tr key={a.id}>
                  <td>{a.date}</td>
                  <td>{a.warehouseName}</td>
                  <td>{a.productName}</td>
                  <td>{a.systemQty}</td>
                  <td>{a.actualQty}</td>
                  <td>{a.difference}</td>
                  <td>{a.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}