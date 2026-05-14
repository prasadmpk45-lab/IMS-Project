import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Bell, Clock3, DollarSign } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { showToast } from '../../components/common/toast'
import NotificationsHeader from './components/NotificationsHeader'
import NotificationForm from './components/NotificationForm'
import StatusBadge from '../../components/StatusBadge'
import {
  formatCurrency,
  formatDate,
  getLowStockProducts,
  getToday,
} from '../../utils/helpers'
import './Notifications.css'

const APP_STORAGE_KEY = 'ims-frontend-data'
const ACCOUNTING_META_STORAGE_KEY = 'ims-accounting-invoice-meta'
const ORDER_NOTIFICATION_STORAGE_KEY = 'ims-order-status-notifications'
const ORDER_STATUS_EVENT = 'ims:order-status-notification'
const ACCOUNTING_META_EVENT = 'ims:accounting-meta-updated'

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

function addDays(dateValue, days) {
  const parsedDate = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return getToday()
  }

  parsedDate.setDate(parsedDate.getDate() + days)
  return parsedDate.toISOString().slice(0, 10)
}

function toDateValue(value) {
  const parsedDate = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

function buildPaymentReminders() {
  const appState = readStorageValue(APP_STORAGE_KEY, {})
  const invoiceMeta = readStorageValue(ACCOUNTING_META_STORAGE_KEY, {})
  const invoices = Array.isArray(appState.accountingInvoices)
    ? appState.accountingInvoices
    : []
  const todayValue = toDateValue(getToday())

  return invoices
    .map((invoice) => {
      const meta = invoiceMeta[invoice.id] ?? {}
      const dueDate = meta.dueDate ?? addDays(invoice.date, 7)
      const finalTotal = Number(meta.finalTotal ?? invoice.amount ?? 0)
      const paidAmount = Number(meta.paidAmount ?? 0)
      const balanceAmount = Math.max(finalTotal - paidAmount, 0)
      const isOverdue =
        balanceAmount > 0 &&
        todayValue &&
        toDateValue(dueDate) &&
        todayValue > toDateValue(dueDate)

      return {
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        partyName: invoice.partyName,
        dueDate,
        amount: balanceAmount,
        status: isOverdue ? 'Overdue' : 'Unpaid',
        isOverdue,
      }
    })
    .filter((invoice) => invoice.amount > 0)
    .sort((firstItem, secondItem) => {
      if (firstItem.isOverdue !== secondItem.isOverdue) {
        return firstItem.isOverdue ? -1 : 1
      }

      return String(firstItem.dueDate).localeCompare(String(secondItem.dueDate))
    })
}

function ReminderCard({ reminder }) {
  return (
    <article
      className={`notifications-page__reminder-card ${
        reminder.isOverdue ? 'notifications-page__reminder-card--overdue' : ''
      }`}
    >
      <div className="notifications-page__reminder-top">
        <div className="notifications-page__reminder-icon">
          <AlertTriangle size={18} />
        </div>
        <StatusBadge type={reminder.isOverdue ? 'overdue' : 'pending'}>
          {reminder.status}
        </StatusBadge>
      </div>

      <div className="notifications-page__reminder-body">
        <h3>{reminder.invoiceNo}</h3>
        <p>{reminder.partyName}</p>
      </div>

      <dl className="notifications-page__reminder-meta">
        <div>
          <dt>Due date</dt>
          <dd>{formatDate(reminder.dueDate)}</dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd>{formatCurrency(reminder.amount)}</dd>
        </div>
      </dl>
    </article>
  )
}

function NotificationMetricCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="card notifications-page__metric-card">
      <div className="notifications-page__metric-icon">
        <Icon size={18} />
      </div>
      <div>
        <p className="notifications-page__metric-label">{label}</p>
        <strong className="notifications-page__metric-value">{value}</strong>
        <p className="notifications-page__metric-helper">{helper}</p>
      </div>
    </div>
  )
}

function AlertsTable({ alerts }) {
  return (
    <div className="card notifications-page__alerts-card">
      <div className="notifications-page__section-heading">
        <div>
          <h2 className="section-title">Alert Feed</h2>
          <p className="helper-text">
            System alerts, order updates, and manual notifications in one view.
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table notifications-page__alerts-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Type</th>
              <th>Source</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="5" className="table-empty">
                  <p className="empty-message">No alerts available.</p>
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{formatDate(alert.date)}</td>
                  <td>{alert.title}</td>
                  <td>
                    <StatusBadge type={String(alert.type || 'Info').toLowerCase()}>
                      {alert.type}
                    </StatusBadge>
                  </td>
                  <td>{alert.source}</td>
                  <td>{alert.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Notifications({
  notifications,
  products,
  sales,
  onSaveNotification,
}) {
  const { hasPermission } = useAuth()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [message, setMessage] = useState(null)
  const [isBellOpen, setIsBellOpen] = useState(false)
  const [orderStatusAlerts, setOrderStatusAlerts] = useState(() =>
    readStorageValue(ORDER_NOTIFICATION_STORAGE_KEY, []),
  )
  const [paymentReminders, setPaymentReminders] = useState(() => buildPaymentReminders())

  const canCreate = hasPermission('notifications', 'create')

  useEffect(() => {
    function syncNotifications() {
      setOrderStatusAlerts(readStorageValue(ORDER_NOTIFICATION_STORAGE_KEY, []))
      setPaymentReminders(buildPaymentReminders())
    }

    syncNotifications()

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', syncNotifications)
      window.addEventListener(ORDER_STATUS_EVENT, syncNotifications)
      window.addEventListener(ACCOUNTING_META_EVENT, syncNotifications)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', syncNotifications)
        window.removeEventListener(ORDER_STATUS_EVENT, syncNotifications)
        window.removeEventListener(ACCOUNTING_META_EVENT, syncNotifications)
      }
    }
  }, [])

  const lowStockAlerts = useMemo(
    () =>
      getLowStockProducts(products).map((product) => ({
        id: `low-${product.id}`,
        title: 'Low stock',
        type: 'Critical',
        message: `${product.name} is at or below reorder level.`,
        source: 'System',
        date: getToday(),
      })),
    [products],
  )

  const saleAlerts = useMemo(
    () =>
      sales.slice(0, 3).map((sale) => ({
        id: `sale-${sale.id}`,
        title: 'Recent sale',
        type: 'Action',
        message: `${sale.productName} was sold to ${sale.customerName}.`,
        source: 'System',
        date: sale.date,
      })),
    [sales],
  )

  const alerts = useMemo(
    () =>
      [...orderStatusAlerts, ...notifications, ...lowStockAlerts, ...saleAlerts].sort(
        (firstItem, secondItem) =>
          String(secondItem.date).localeCompare(String(firstItem.date)),
      ),
    [lowStockAlerts, notifications, orderStatusAlerts, saleAlerts],
  )

  const notificationSummary = useMemo(
    () => ({
      reminders: paymentReminders.length,
      overdue: paymentReminders.filter((invoice) => invoice.isOverdue).length,
      alerts: alerts.length,
    }),
    [alerts.length, paymentReminders],
  )

  const dropdownItems = useMemo(
    () => [
      ...alerts.slice(0, 3).map((alert) => ({
        id: alert.id,
        label: alert.title,
        detail: alert.message,
        tone: alert.type,
      })),
      ...paymentReminders.slice(0, 2).map((reminder) => ({
        id: reminder.id,
        label: reminder.invoiceNo,
        detail: `${reminder.status} • ${formatCurrency(reminder.amount)}`,
        tone: reminder.status,
      })),
    ],
    [alerts, paymentReminders],
  )

  function handleSave(data) {
    const result = onSaveNotification(data)
    setMessage(result)
    showToast({
      type: result.success ? 'success' : 'error',
      title: 'Notifications',
      message: result.message,
    })

    if (result.success) {
      setIsFormOpen(false)
    }
  }

  return (
    <div className="page notifications-page">
      <NotificationsHeader
        canCreate={canCreate}
        onAdd={() => setIsFormOpen(true)}
        extraActions={
          <div className="notifications-page__dropdown">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setIsBellOpen((currentValue) => !currentValue)}
            >
              <Bell size={16} />
              Alerts
            </button>

            {isBellOpen ? (
              <div className="notifications-page__dropdown-panel">
                <div className="notifications-page__dropdown-header">
                  <strong>Notification Preview</strong>
                  <span>{notificationSummary.alerts} total alerts</span>
                </div>

                {dropdownItems.length === 0 ? (
                  <div className="notifications-page__dropdown-empty">
                    No recent alerts.
                  </div>
                ) : (
                  dropdownItems.map((item) => (
                    <div className="notifications-page__dropdown-item" key={item.id}>
                      <strong>{item.label}</strong>
                      <span>{item.detail}</span>
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </div>
        }
      />

      {message ? (
        <div
          className={`message-box ${
            message.success ? 'message-box--success' : 'message-box--error'
          }`}
        >
          {message.message}
        </div>
      ) : null}

      {isFormOpen ? (
        <NotificationForm
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      ) : null}

      <div className="notifications-page__metrics-grid">
        <NotificationMetricCard
          icon={Bell}
          label="Active Alerts"
          value={notificationSummary.alerts}
          helper="Combined manual and automated notifications."
        />
        <NotificationMetricCard
          icon={Clock3}
          label="Payment Reminders"
          value={notificationSummary.reminders}
          helper="Invoices that still need payment follow-up."
        />
        <NotificationMetricCard
          icon={DollarSign}
          label="Overdue Invoices"
          value={notificationSummary.overdue}
          helper="High-priority reminders needing immediate action."
        />
      </div>

      <div className="card notifications-page__reminders-panel">
        <div className="notifications-page__section-heading">
          <div>
            <h2 className="section-title">Payment Reminders</h2>
            <p className="helper-text">
              Unpaid invoices are tracked automatically, with overdue items pushed
              to the top.
            </p>
          </div>
        </div>

        {paymentReminders.length === 0 ? (
          <div className="notifications-page__empty-state">
            <AlertTriangle size={20} />
            <p>No unpaid or overdue invoices right now.</p>
          </div>
        ) : (
          <div className="notifications-page__reminders-grid">
            {paymentReminders.map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))}
          </div>
        )}
      </div>

      <AlertsTable alerts={alerts} />
    </div>
  )
}
