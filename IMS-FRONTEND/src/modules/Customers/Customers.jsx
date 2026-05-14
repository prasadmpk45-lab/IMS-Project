import { useEffect, useMemo, useState } from 'react'
import { CircleDollarSign, History, Users } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { showToast } from '../../components/common/toast'
import FormModal from '../../layouts/FormModal'
import { formatCurrency } from '../../utils/helpers'
import CustomersHeader from './components/CustomersHeader'
import CustomersTable from './components/CustomersTable'
import CustomerForm from './components/CustomerForm'
import CustomerDetailCard from './components/CustomerDetailCard'
import StepperComponent from './components/StepperComponent'
import StatusBadge from './components/StatusBadge'
import './Customers.css'

function SummaryCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="card customers-page__summary-card">
      <div className="customers-page__summary-icon">
        <Icon size={18} />
      </div>
      <div>
        <p className="customers-page__summary-label">{label}</p>
        <strong className="customers-page__summary-value">{value}</strong>
        <p className="customers-page__summary-helper">{helper}</p>
      </div>
    </div>
  )
}

export default function Customers({
  customers,
  sales = [],
  onSaveCustomer,
  onDeleteCustomer,
}) {
  const { hasPermission } = useAuth()

  const [editingCustomer, setEditingCustomer] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [historyProductFilter, setHistoryProductFilter] = useState('')
  const [historyDateFilter, setHistoryDateFilter] = useState('')

  const canCreate = hasPermission('customers', 'create')
  const canEdit = hasPermission('customers', 'edit')
  const canDelete = hasPermission('customers', 'delete')

  const summary = useMemo(
    () => ({
      totalCustomers: customers.length,
      totalCredit: customers.reduce(
        (total, customer) => total + Number(customer.creditLimit || 0),
        0,
      ),
      totalOutstanding: customers.reduce(
        (total, customer) => total + Number(customer.balance || 0),
        0,
      ),
    }),
    [customers],
  )

  useEffect(() => {
    setSelectedCustomerId((currentValue) =>
      customers.some((customer) => customer.id === currentValue)
        ? currentValue
        : customers[0]?.id || '',
    )
  }, [customers])

  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? null
  const purchaseHistory = useMemo(
    () =>
      sales
        .filter((sale) => sale.customerId === selectedCustomerId)
        .sort((firstItem, secondItem) => secondItem.date.localeCompare(firstItem.date)),
    [sales, selectedCustomerId],
  )

  const filteredHistory = useMemo(() => {
    return purchaseHistory.filter((sale) => {
      const byProduct = historyProductFilter
        ? sale.productName.toLowerCase().includes(historyProductFilter.toLowerCase())
        : true
      const byDate = historyDateFilter ? sale.date === historyDateFilter : true
      return byProduct && byDate
    })
  }, [purchaseHistory, historyDateFilter, historyProductFilter])

  const outstandingStatus = useMemo(() => {
    if (!selectedCustomer) return null
    const creditLimit = Number(selectedCustomer.creditLimit || 0)
    const balance = Number(selectedCustomer.balance || 0)
    if (creditLimit > 0 && balance >= creditLimit * 0.8) {
      return 'High Outstanding'
    }
    return 'Good'
  }, [selectedCustomer])

  function notify(result) {
    showToast({
      type: result.success ? 'success' : 'error',
      title: 'Customers',
      message: result.message,
    })
  }

  function handleOpenCreate() {
    setEditingCustomer(null)
    setIsFormOpen(true)
  }

  function handleSelectCustomer(customerId) {
    setSelectedCustomerId(customerId)
    setCurrentStep(2)
  }

  function handleViewHistory() {
    setCurrentStep(3)
  }

  function handleEdit(customer) {
    setEditingCustomer(customer)
    setIsFormOpen(true)
  }

  function handleClose() {
    setEditingCustomer(null)
    setIsFormOpen(false)
  }

  function handleSave(values) {
    onSaveCustomer(values, editingCustomer?.id ?? null)

    const result = {
      success: true,
      message: editingCustomer
        ? 'Customer updated successfully.'
        : 'Customer added successfully.',
    }

    setMessage(result)
    notify(result)
    handleClose()
  }

  function handleDelete(id) {
    const result = onDeleteCustomer(id)
    const nextMessage = result || { success: true, message: 'Deleted successfully' }
    setMessage(nextMessage)
    notify(nextMessage)
  }

  return (
    <div className="page customers-page">
      <CustomersHeader canCreate={canCreate} onAdd={handleOpenCreate} />

      {message ? (
        <div
          className={`message-box ${
            message.success ? 'message-box--success' : 'message-box--error'
          }`}
        >
          {message.message}
        </div>
      ) : null}

      <div className="customers-page__summary-grid">
        <SummaryCard
          icon={Users}
          label="Customers"
          value={summary.totalCustomers}
          helper="Customer accounts managed in IMS."
        />
        <SummaryCard
          icon={CircleDollarSign}
          label="Credit Limit"
          value={formatCurrency(summary.totalCredit)}
          helper="Combined configured credit exposure."
        />
        <SummaryCard
          icon={History}
          label="Outstanding"
          value={formatCurrency(summary.totalOutstanding)}
          helper="Current unpaid balance across all customers."
        />
      </div>

      <StepperComponent
        steps={['Directory', 'Details', 'History']}
        activeStep={currentStep}
        onChange={setCurrentStep}
      />

      <div className="content-grid content-grid--single">
        {currentStep === 1 ? (
          <CustomersTable
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelect={handleSelectCustomer}
            toolbarContent={
              canCreate ? (
                <button className="button button-primary" onClick={handleOpenCreate}>
                  Add Customer
                </button>
              ) : null
            }
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : null}

        {currentStep === 2 && selectedCustomer ? (
          <div className="customers-page__detail-section">
            <div className="customers-page__detail-intro">
              <div>
                <h2 className="section-title">Customer Details</h2>
                <p className="helper-text">
                  Review the selected customer profile and credit summary.
                </p>
              </div>
              <div className="customers-page__detail-actions">
                <button className="button button-secondary" onClick={() => setCurrentStep(1)}>
                  Back to Directory
                </button>
                <button className="button button-primary" onClick={handleViewHistory}>
                  View History
                </button>
              </div>
            </div>

            <div className="customers-page__detail-grid">
              <CustomerDetailCard
                label="Customer Name"
                value={selectedCustomer.name}
                helper={selectedCustomer.email}
              />
              <CustomerDetailCard
                label="Company"
                value={selectedCustomer.company || '—'}
                helper={selectedCustomer.city}
              />
              <CustomerDetailCard
                label="Credit Limit"
                value={formatCurrency(selectedCustomer.creditLimit || 0)}
                status={outstandingStatus}
              />
              <CustomerDetailCard
                label="Outstanding Balance"
                value={formatCurrency(selectedCustomer.balance || 0)}
                status={outstandingStatus}
              />
              <CustomerDetailCard
                label="Contact Phone"
                value={selectedCustomer.phone || '—'}
              />
              <CustomerDetailCard
                label="Email"
                value={selectedCustomer.email || '—'}
              />
            </div>
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="customers-page__history-card card">
            <div className="customers-page__history-header">
              <div>
                <h2 className="section-title">Purchase History</h2>
                <p className="helper-text">
                  Filter customer purchases by date or product and review current status.
                </p>
              </div>
            </div>

            <div className="customers-page__history-filters">
              <label>
                Date
                <input
                  type="date"
                  value={historyDateFilter}
                  onChange={(event) => setHistoryDateFilter(event.target.value)}
                />
              </label>
              <label>
                Product
                <input
                  type="text"
                  value={historyProductFilter}
                  onChange={(event) => setHistoryProductFilter(event.target.value)}
                  placeholder="Filter by product"
                />
              </label>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  setHistoryDateFilter('')
                  setHistoryProductFilter('')
                }}
              >
                Reset
              </button>
            </div>

            {selectedCustomer ? (
              <div className="customers-page__history-profile">
                <div>
                  <span>Selected</span>
                  <strong>{selectedCustomer.name}</strong>
                </div>
                <div>
                  <span>Outstanding</span>
                  <strong>{formatCurrency(selectedCustomer.balance || 0)}</strong>
                </div>
                <div>
                  <span>Credit Limit</span>
                  <strong>{formatCurrency(selectedCustomer.creditLimit || 0)}</strong>
                </div>
              </div>
            ) : null}

            <div className="table-container">
              <table className="table table-compact">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="table-empty">
                        <p className="empty-message">
                          No purchase history matches the selected filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((sale) => (
                      <tr key={sale.id}>
                        <td>{sale.date}</td>
                        <td>{sale.productName}</td>
                        <td>{sale.quantity}</td>
                        <td>{formatCurrency(sale.total)}</td>
                        <td>
                          <StatusBadge status={sale.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
      {isFormOpen || editingCustomer ? (
        <FormModal
          title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
          onClose={handleClose}
        >
          <CustomerForm
            initialValues={editingCustomer}
            canSubmit={editingCustomer ? canEdit : canCreate}
            onSubmit={handleSave}
            onCancel={handleClose}
          />
        </FormModal>
      ) : null}
    </div>
  )
}
