import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Boxes,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  ReceiptText,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import './Sidebar.css'

const SIDEBAR_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    category: 'dashboard',
  },
  {
    key: 'products',
    label: 'Products',
    path: '/inventory/products',
    icon: Package,
    category: 'inventory',
  },
  {
    key: 'stock',
    label: 'Stock',
    path: '/inventory/stock',
    icon: Boxes,
    category: 'inventory',
  },
  {
    key: 'purchases',
    label: 'Purchases',
    path: '/inventory/purchases',
    icon: ReceiptText,
    category: 'inventory',
  },
  {
    key: 'sales',
    label: 'Sales',
    path: '/inventory/sales',
    icon: ShoppingCart,
    category: 'inventory',
  },
  {
    key: 'inventoryAudit',
    label: 'Inventory Audit',
    path: '/inventory/audit',
    icon: ClipboardList,
    category: 'inventory',
  },
  {
    key: 'barcode',
    label: 'Barcode / QR',
    path: '/inventory/barcode',
    icon: ScanLine,
    category: 'inventory',
  },
  {
    key: 'suppliers',
    label: 'Suppliers',
    path: '/people/suppliers',
    icon: Truck,
    category: 'people',
  },
  {
    key: 'customers',
    label: 'Customers',
    path: '/people/customers',
    icon: Users,
    category: 'people',
  },
  {
    key: 'warehouses',
    label: 'Warehouses',
    path: '/warehouses',
    icon: Warehouse,
    category: 'management',
  },
  {
    key: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
    category: 'management',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
    category: 'management',
  },
  {
    key: 'accounting',
    label: 'Accounting',
    path: '/accounting',
    icon: FileText,
    category: 'management',
  },
  {
    key: 'returns',
    label: 'Returns & Damage',
    path: '/returns',
    icon: RotateCcw,
    category: 'extra',
  },
  {
    key: 'users',
    label: 'Users',
    path: '/users',
    icon: Users,
    category: 'admin',
  },
  {
    key: 'roles',
    label: 'Roles',
    path: '/roles',
    icon: ShieldCheck,
    category: 'admin',
  },
]

const GROUPS = [
  { key: 'dashboard', label: 'Dashboard', defaultOpen: true },
  { key: 'inventory', label: 'Inventory', defaultOpen: false },
  { key: 'people', label: 'People', defaultOpen: false },
  { key: 'management', label: 'Management', defaultOpen: true },
  { key: 'extra', label: 'Extra', defaultOpen: false },
  { key: 'admin', label: 'Administration', defaultOpen: false },
]

export default function Sidebar() {
  const { hasPermission } = useAuth()
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState(
    GROUPS.reduce((acc, group) => {
      acc[group.key] = group.defaultOpen
      return acc
    }, {})
  )

  const visibleItems = SIDEBAR_ITEMS.filter((item) =>
    hasPermission(item.key, 'view')
  )

  function toggleGroup(groupKey) {
    setOpenGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }

  function renderGroup(group) {
    const items = visibleItems.filter((item) => item.category === group.key)

    if (items.length === 0) {
      return null
    }

    const isOpen = openGroups[group.key]

    return (
      <div key={group.key} className="sidebar__group">
        <button
          type="button"
          className="sidebar__group-header"
          onClick={() => toggleGroup(group.key)}
        >
          <span className="sidebar__group-label">{group.label}</span>
          <span className={`sidebar__group-arrow ${isOpen ? 'is-open' : ''}`}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="sidebar__group-items">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar__link ${isActive ? 'is-active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Boxes size={22} />
        <span>IMS</span>
      </div>

      <nav className="sidebar__nav">
        {GROUPS.map(renderGroup)}
      </nav>
    </aside>
  )
}
