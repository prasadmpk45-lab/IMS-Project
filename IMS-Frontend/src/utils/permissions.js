import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from 'lucide-react'
import defaultRoles from '../data/roles.json'

/* -----------------------------------
   PERMISSIONS CONFIG (NO CHANGE)
----------------------------------- */
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

/* -----------------------------------
   NAVIGATION (UPDATED WITH CATEGORIES)
----------------------------------- */
export const NAV_ITEMS = [
  // 🔹 Dashboard
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    category: 'dashboard',
  },

  // 🔹 Inventory
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

  // 🔹 People
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

  // 🔹 Management
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
    key: 'users',
    label: 'Users',
    path: '/users',
    icon: Users,
    category: 'management',
  },
  {
    key: 'roles',
    label: 'Roles',
    path: '/roles',
    icon: ShieldCheck,
    category: 'management',
  },
]

/* -----------------------------------
   HELPERS (NO CHANGE)
----------------------------------- */
function resolveRole(role, roleList = defaultRoles) {
  if (!role) return null

  if (typeof role === 'object' && role.permissions) {
    return role
  }

  return roleList.find((item) => item.name === role) ?? null
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