import { useEffect, useMemo, useState } from 'react'
import {
  CheckCheck,
  CheckCircle2,
  Clock3,
  DollarSign,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { showToast } from '../../components/common/toast'
import FormModal from '../../layouts/FormModal'
import SaleForm from './components/SaleForm'
import { createId, formatCurrency, formatDate, getToday } from '../../utils/helpers'
import './Sales.css'

const ORDER_STATUS_STORAGE_KEY = 'ims-order-status-map'
const ORDER_NOTIFICATION_STORAGE_KEY = 'ims-order-status-notifications'
const SALES_PAYMENT_STORAGE_KEY = 'ims-sales-payment-meta'
const ORDER_STATUS_EVENT = 'ims:order-status-notification'

const ORDER_STATUS_FLOW = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered']

const ORDER_STATUS_META = {
  Pending: {
    icon: Clock3,
    tone: 'pending',
    caption: 'Waiting for confirmation',
  },
  Confirmed: {
    icon: CheckCircle2,
    tone: 'confirmed',
    caption: 'Order approved',
  },
  Packed: {
    icon: Package,
    tone: 'packed',
    caption: 'Ready for dispatch',
  },
  Shipped: {
    icon: Truck,
    tone: 'shipped',
    caption: 'On the way',
  },
  Delivered: {
    icon: CheckCheck,
    tone: 'delivered',
    caption: 'Completed successfully',
  },
}

function readStorageValue(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

function writeStorageValue(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Keep the UI usable even if persistence fails.
  }
}

function addDays(dateValue, days) {
  const parsedDate = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return getToday()
  }

  parsedDate.setDate(parsedDate.getDate() + days)
  return parsedDate.toISOString().slice(0, 10)
}

function normalizeOrderStatus(status) {
  if (ORDER_STATUS_FLOW.includes(status)) {
    return status
  }

  if (status === 'Completed') {
    return 'Delivered'
  }

  return 'Pending'
}

function getPaymentStatus(paidAmount, total) {
  if (paidAmount <= 0) {
    return 'Pending'
  }

  if (paidAmount >= total) {
    return 'Paid'
  }

  return 'Partial'
}

function resolvePaymentMeta(order, paymentMetaMap) {
  const paymentMeta = paymentMetaMap[order.id] ?? {}
  const total = Number(order.total || 0)
  const paidAmount = Math.min(Number(paymentMeta.paidAmount || 0), total)
  const balanceAmount = Math.max(total - paidAmount, 0)

  return {
    invoiceNo: paymentMeta.invoiceNo || `SINV-${order.id.split('-').at(-1)}`,
    dueDate: paymentMeta.dueDate || addDays(order.date, 7),
    paidAmount,
    balanceAmount,
    paymentStatus: getPaymentStatus(paidAmount, total),
    paymentHistory: Array.isArray(paymentMeta.paymentHistory) ? paymentMeta.paymentHistory : [],
  }
}

function buildOrders(sales, statusMap, paymentMetaMap) {
  return sales.map((sale) => ({
    ...sale,
    orderStatus: statusMap[sale.id] ?? normalizeOrderStatus(sale.status),
    ...resolvePaymentMeta(sale, paymentMetaMap),
  }))
}

function persistOrderNotification(nextAlert) {
  const currentAlerts = readStorageValue(ORDER_NOTIFICATION_STORAGE_KEY, [])
  const dedupedAlerts = currentAlerts.filter((alert) => alert.id !== nextAlert.id)
  const nextAlerts = [nextAlert, ...dedupedAlerts].slice(0, 50)

  writeStorageValue(ORDER_NOTIFICATION_STORAGE_KEY, nextAlerts)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(ORDER_STATUS_EVENT, {
        detail: nextAlert,
      }),
    )
  }
}

function OrderMetricCard({ label, value, helper, status }) {
  const { icon: Icon } = ORDER_STATUS_META[status]

  return (
    <div className="card sales-page__metric-card">
      <div className="sales-page__metric-icon">
        <Icon size={18} />
      </div>
      <div>
        <p className="sales-page__metric-label">{label}</p>
        <strong className="sales-page__metric-value">{value}</strong>
        <p className="sales-page__metric-helper">{helper}</p>
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }) {
  const meta = ORDER_STATUS_META[status] ?? ORDER_STATUS_META.Pending
  const Icon = meta.icon

  return (
    <span className={`sales-page__status-badge sales-page__status-badge--${meta.tone}`}>
      <Icon size={14} />
      {status}
    </span>
  )
}

function PaymentBadge({ status }) {
  return (
    <span className={`sales-page__payment-badge sales-page__payment-badge--${status.toLowerCase()}`}>
      {status}
    </span>
  )
}

export default function Sales({
  sales,
  products,
  customers,
  warehouses,
  onSaveSale,
  onDeleteSale,
  onQuickAddCustomer,
  onQuickAddProduct,
  onQuickAddWarehouse,
}) {
  const { hasPermission } = useAuth()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const [statusMap, setStatusMap] = useState(() =>
    readStorageValue(ORDER_STATUS_STORAGE_KEY, {}),
  )
  const [paymentMetaMap, setPaymentMetaMap] = useState(() =>
    readStorageValue(SALES_PAYMENT_STORAGE_KEY, {}),
  )
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [paymentDraft, setPaymentDraft] = useState({
    amount: '',
    date: getToday(),
  })

  const canCreate = hasPermission('sales', 'create')
  const canDelete = hasPermission('sales', 'delete')

  const orders = useMemo(
    () => buildOrders(sales, statusMap, paymentMetaMap),
    [paymentMetaMap, sales, statusMap],
  )

  useEffect(() => {
    writeStorageValue(ORDER_STATUS_STORAGE_KEY, statusMap)
  }, [statusMap])

  useEffect(() => {
    writeStorageValue(SALES_PAYMENT_STORAGE_KEY, paymentMetaMap)
  }, [paymentMetaMap])

  useEffect(() => {
    setSelectedOrderId((currentValue) =>
      orders.some((order) => order.id === currentValue) ? currentValue : orders[0]?.id || '',
    )
  }, [orders])

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null

  const orderSummary = useMemo(() => {
    const pendingCount = orders.filter((order) => order.orderStatus === 'Pending').length
    const packedCount = orders.filter((order) => order.orderStatus === 'Packed').length
    const shippedCount = orders.filter((order) => order.orderStatus === 'Shipped').length
    const deliveredCount = orders.filter((order) => order.orderStatus === 'Delivered').length
    const outstandingValue = orders.reduce(
      (total, order) => total + Number(order.balanceAmount || 0),
      0,
    )

    return {
      total: orders.length,
      pendingCount,
      inTransitCount: packedCount + shippedCount,
      deliveredCount,
      deliveredValue: formatCurrency(
        orders
          .filter((order) => order.orderStatus === 'Delivered')
          .reduce((total, order) => total + Number(order.total || 0), 0),
      ),
      outstandingValue: formatCurrency(outstandingValue),
    }
  }, [orders])

  function notify(result, title = 'Orders') {
    showToast({
      type: result.success ? 'success' : 'error',
      title,
      message: result.message,
    })
  }

  function handleSave(data) {
    const result = onSaveSale(data)
    setMessage(result)
    notify(result)

    if (result.success) {
      setIsFormOpen(false)
    }
  }

  function handleDelete(id) {
    onDeleteSale(id)

    setStatusMap((currentValue) => {
      const nextValue = { ...currentValue }
      delete nextValue[id]
      return nextValue
    })

    setPaymentMetaMap((currentValue) => {
      const nextValue = { ...currentValue }
      delete nextValue[id]
      return nextValue
    })

    const result = { success: true, message: 'Order deleted successfully.' }
    setMessage(result)
    notify(result)
  }

  function handleStatusChange(orderId, nextStatus) {
    const currentOrder = orders.find((order) => order.id === orderId)

    if (!currentOrder || currentOrder.orderStatus === nextStatus) {
      return
    }

    setStatusMap((currentValue) => ({
      ...currentValue,
      [orderId]: nextStatus,
    }))

    persistOrderNotification({
      id: createId('NTF'),
      title: 'Order status updated',
      type: nextStatus === 'Delivered' ? 'Info' : 'Action',
      message: `${currentOrder.id} for ${currentOrder.customerName} moved to ${nextStatus}.`,
      source: 'Orders',
      date: getToday(),
      orderId,
      status: nextStatus,
    })

    const result = {
      success: true,
      message: `Order ${currentOrder.id} updated to ${nextStatus}.`,
    }

    setMessage(result)
    notify(result)
  }

  function handlePaymentChange(event) {
    const { name, value } = event.target
    setPaymentDraft((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
  }

  function handleRecordPayment(event) {
    event.preventDefault()

    if (!selectedOrder) {
      return
    }

    const amount = Number(paymentDraft.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      const result = { success: false, message: 'Payment amount must be greater than 0.' }
      setMessage(result)
      notify(result, 'Payments')
      return
    }

    if (amount > selectedOrder.balanceAmount) {
      const result = { success: false, message: 'Payment amount cannot exceed the order balance.' }
      setMessage(result)
      notify(result, 'Payments')
      return
    }

    setPaymentMetaMap((currentValue) => {
      const currentMeta = resolvePaymentMeta(selectedOrder, currentValue)
      const nextPaidAmount = currentMeta.paidAmount + amount
      const nextBalanceAmount = Math.max(Number(selectedOrder.total || 0) - nextPaidAmount, 0)

      return {
        ...currentValue,
        [selectedOrder.id]: {
          ...currentMeta,
          paidAmount: nextPaidAmount,
          balanceAmount: nextBalanceAmount,
          paymentStatus: getPaymentStatus(nextPaidAmount, Number(selectedOrder.total || 0)),
          paymentHistory: [
            {
              id: createId('PMT'),
              date: paymentDraft.date,
              amount,
            },
            ...currentMeta.paymentHistory,
          ],
        },
      }
    })

    const result = {
      success: true,
      message: `Payment of ${formatCurrency(amount)} recorded for ${selectedOrder.invoiceNo}.`,
    }
    setMessage(result)
    notify(result, 'Payments')

    setPaymentDraft({
      amount: '',
      date: getToday(),
    })
  }

  return (
    <div className="page sales-page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title__icon">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h1>Orders</h1>
            <p className="page-subtitle">
              Track each customer order from confirmation through delivery with live invoice and payment visibility.
            </p>
          </div>
        </div>

        {canCreate ? (
          <div className="page-header__actions">
            <button className="button button-primary" onClick={() => setIsFormOpen(true)}>
              <Plus size={16} />
              Add Order
            </button>
          </div>
        ) : null}
      </div>

      {message ? (
        <div
          className={`message-box ${
            message.success ? 'message-box--success' : 'message-box--error'
          }`}
        >
          {message.message}
        </div>
      ) : null}

      <div className="sales-page__metrics-grid">
        <OrderMetricCard
          label="Total Orders"
          value={orderSummary.total}
          helper="All active and completed order records."
          status="Confirmed"
        />
        <OrderMetricCard
          label="Pending"
          value={orderSummary.pendingCount}
          helper="Orders waiting for confirmation."
          status="Pending"
        />
        <OrderMetricCard
          label="In Transit"
          value={orderSummary.inTransitCount}
          helper="Packed or shipped orders in motion."
          status="Shipped"
        />
        <OrderMetricCard
          label="Outstanding"
          value={orderSummary.outstandingValue}
          helper={`${orderSummary.deliveredCount} delivered order${
            orderSummary.deliveredCount === 1 ? '' : 's'
          } completed.`}
          status="Delivered"
        />
      </div>

      <div className="sales-page__content-grid">
        <div className="card sales-page__orders-card">
          <div className="sales-page__section-heading">
            <div>
              <h2 className="section-title">Order Status Register</h2>
              <p className="helper-text">
                Update statuses inline and track payment progress on each order invoice.
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table sales-page__orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Total</th>
                  <th>Invoice</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Update</th>
                  {canDelete ? <th>Actions</th> : null}
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={canDelete ? 9 : 8} className="table-empty">
                      <p className="empty-message">No orders available yet.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const statusMeta = ORDER_STATUS_META[order.orderStatus] ?? ORDER_STATUS_META.Pending

                    return (
                      <tr
                        key={order.id}
                        className={order.id === selectedOrderId ? 'sales-page__order-row is-selected' : 'sales-page__order-row'}
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <td className="sales-page__order-id-cell">
                          <strong>{order.id}</strong>
                        </td>
                        <td>{order.customerName}</td>
                        <td>{order.productName}</td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>
                          <div className="sales-page__status-stack">
                            <strong>{order.invoiceNo}</strong>
                            <span className="sales-page__status-caption">
                              Due {formatDate(order.dueDate)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="sales-page__status-stack">
                            <PaymentBadge status={order.paymentStatus} />
                            <span className="sales-page__status-caption">
                              Balance {formatCurrency(order.balanceAmount)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="sales-page__status-stack">
                            <OrderStatusBadge status={order.orderStatus} />
                            <span className="sales-page__status-caption">
                              {statusMeta.caption}
                            </span>
                          </div>
                        </td>
                        <td>
                          <label className="sales-page__status-control">
                            <span className="sales-page__status-label">Status</span>
                            <select
                              value={order.orderStatus}
                              onClick={(event) => event.stopPropagation()}
                              onChange={(event) => handleStatusChange(order.id, event.target.value)}
                            >
                              {ORDER_STATUS_FLOW.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </label>
                        </td>
                        {canDelete ? (
                          <td>
                            <button
                              className="button button-danger"
                              onClick={(event) => {
                                event.stopPropagation()
                                handleDelete(order.id)
                              }}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card sales-page__payment-card">
          <div className="sales-page__section-heading">
            <div>
              <h2 className="section-title">Invoice Summary</h2>
              <p className="helper-text">
                Review payment progress, balance, and payment history for the selected order.
              </p>
            </div>
          </div>

          {selectedOrder ? (
            <>
              <div className="sales-page__invoice-header">
                <div>
                  <h3>{selectedOrder.invoiceNo}</h3>
                  <p>
                    {selectedOrder.customerName} • {selectedOrder.productName}
                  </p>
                </div>
                <PaymentBadge status={selectedOrder.paymentStatus} />
              </div>

              <div className="sales-page__invoice-grid">
                <div>
                  <span>Total Amount</span>
                  <strong>{formatCurrency(selectedOrder.total)}</strong>
                </div>
                <div>
                  <span>Paid Amount</span>
                  <strong>{formatCurrency(selectedOrder.paidAmount)}</strong>
                </div>
                <div>
                  <span>Balance</span>
                  <strong>{formatCurrency(selectedOrder.balanceAmount)}</strong>
                </div>
                <div>
                  <span>Due Date</span>
                  <strong>{formatDate(selectedOrder.dueDate)}</strong>
                </div>
              </div>

              <form className="sales-page__payment-form" onSubmit={handleRecordPayment}>
                <label className="field">
                  <span>Payment Amount</span>
                  <div className="input-with-icon">
                    <DollarSign size={16} />
                    <input
                      name="amount"
                      type="number"
                      value={paymentDraft.amount}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </label>

                <label className="field">
                  <span>Payment Date</span>
                  <div className="input-with-icon">
                    <Clock3 size={16} />
                    <input
                      name="date"
                      type="date"
                      value={paymentDraft.date}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </label>

                <div className="button-row">
                  <button
                    type="submit"
                    className="button button-primary"
                    disabled={selectedOrder.balanceAmount === 0}
                  >
                    Record Payment
                  </button>
                </div>
              </form>

              <div className="sales-page__history-panel">
                <h3>Payment History</h3>
                {selectedOrder.paymentHistory.length === 0 ? (
                  <div className="sales-page__empty-history">No payments recorded yet.</div>
                ) : (
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.paymentHistory.map((entry) => (
                          <tr key={entry.id}>
                            <td>{formatDate(entry.date)}</td>
                            <td>{formatCurrency(entry.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="sales-page__empty-history">No order selected.</div>
          )}
        </div>
      </div>

      {isFormOpen ? (
        <FormModal title="Sales Form" onClose={() => setIsFormOpen(false)}>
          <SaleForm
            customers={customers}
            products={products}
            warehouses={warehouses}
            onSubmit={handleSave}
            onCancel={() => setIsFormOpen(false)}
            onQuickAddCustomer={onQuickAddCustomer}
            onQuickAddProduct={onQuickAddProduct}
            onQuickAddWarehouse={onQuickAddWarehouse}
          />
        </FormModal>
      ) : null}
    </div>
  )
}
