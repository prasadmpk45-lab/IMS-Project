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
import defaultRoles from '../data/roles.json'

export const PERMISSION_OPTIONS = [
  { key: 'dashboard', label: 'Dashboard', actions: ['view'], icon: LayoutDashboard },
  {
    key: 'products',
    label: 'Products',
    actions: ['view', 'create', 'edit', 'delete'],
    icon: Package,
  },
  { key: 'stock', label: 'Stock', actions: ['view', 'create'], icon: Boxes },
  {
    key: 'purchases',
    label: 'Purchases',
    actions: ['view', 'create', 'delete'],
    icon: ReceiptText,
  },
  {
    key: 'sales',
    label: 'Sales',
    actions: ['view', 'create', 'delete'],
    icon: ShoppingCart,
  },
  {
    key: 'inventoryAudit',
    label: 'Inventory Audit',
    actions: ['view', 'create'],
    icon: ClipboardList,
  },
  {
    key: 'barcode',
    label: 'Barcode / QR',
    actions: ['view', 'create'],
    icon: ScanLine,
  },
  {
    key: 'suppliers',
    label: 'Suppliers',
    actions: ['view', 'create', 'edit', 'delete'],
    icon: Truck,
  },
  {
    key: 'customers',
    label: 'Customers',
    actions: ['view', 'create', 'edit', 'delete'],
    icon: Users,
  },
  {
    key: 'warehouses',
    label: 'Warehouses',
    actions: ['view', 'create', 'edit', 'delete'],
    icon: Warehouse,
  },
  { key: 'reports', label: 'Reports', actions: ['view'], icon: BarChart3 },
  {
    key: 'notifications',
    label: 'Notifications',
    actions: ['view', 'create'],
    icon: Bell,
  },
  {
    key: 'accounting',
    label: 'Accounting',
    actions: ['view', 'create'],
    icon: FileText,
  },
  {
    key: 'returns',
    label: 'Returns & Damage',
    actions: ['view', 'create'],
    icon: RotateCcw,
  },
  {
    key: 'users',
    label: 'Users',
    actions: ['view', 'create', 'edit', 'delete'],
    icon: Users,
  },
  {
    key: 'roles',
    label: 'Roles',
    actions: ['view', 'create', 'edit', 'delete'],
    icon: ShieldCheck,
  },
]

export const NAV_ITEMS = [
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

function mergeDefaultRole(roleObject) {
  const defaultRole = defaultRoles.find((item) => item.name === roleObject?.name)

  if (!defaultRole) {
    return roleObject
  }

  return {
    ...defaultRole,
    ...roleObject,
    permissions: {
      ...defaultRole.permissions,
      ...roleObject.permissions,
    },
  }
}

function resolveRole(role, roleList = defaultRoles) {
  if (!role) return null

  if (typeof role === 'object' && role.permissions) {
    return mergeDefaultRole(role)
  }

  const normalizedRole = String(role).toLowerCase()
  const matchedRole =
    roleList.find((item) => item.name.toLowerCase() === normalizedRole) ?? null

  return matchedRole ? mergeDefaultRole(matchedRole) : null
}

export function normalizePermissions(permissions = {}) {
  return PERMISSION_OPTIONS.reduce((result, moduleItem) => {
    result[moduleItem.key] = moduleItem.actions.filter((action) =>
      permissions[moduleItem.key]?.includes(action),
    )
    return result
  }, {})
}

export function canAccess(moduleKey, action, role, roleList = defaultRoles) {
  const roleObject = resolveRole(role, roleList)
  if (!roleObject) return false

  return roleObject.permissions?.[moduleKey]?.includes(action) ?? false
}

export function getDefaultPath(role, roleList = defaultRoles) {
  const allowedItem = NAV_ITEMS.find((item) =>
    canAccess(item.key, 'view', role, roleList),
  )

  return allowedItem?.path ?? '/login'
}

export function getPageTitle(pathname) {
  const matchedItem = NAV_ITEMS.find((item) =>
    pathname.startsWith(item.path),
  )
  return matchedItem?.label ?? 'Inventory Management System'
}

export function getNavItem(pathname) {
  return NAV_ITEMS.find((item) =>
    pathname.startsWith(item.path),
  ) ?? null
}
