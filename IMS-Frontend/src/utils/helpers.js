export const DEFAULT_WAREHOUSES = [
  {
    id: 'WH-01',
    name: 'Central Hub',
    location: 'Bengaluru',
    manager: 'Anita Rao',
  },
  {
    id: 'WH-02',
    name: 'North Depot',
    location: 'Delhi NCR',
    manager: 'Manav Sethi',
  },
  {
    id: 'WH-03',
    name: 'Packaging Yard',
    location: 'Pune',
    manager: 'Ishita Kulkarni',
  },
  {
    id: 'WH-04',
    name: 'Retail Buffer',
    location: 'Hyderabad',
    manager: 'Neeraj Sharma',
  },
]

export const DEFAULT_PURCHASES = [
  {
    id: 'PUR-1001',
    supplierId: 'SUP-1001',
    supplierName: 'MetalWorks Supply',
    productId: 'PRD-1001',
    productName: 'Aluminium Coil 5mm',
    warehouseId: 'WH-01',
    warehouseName: 'Central Hub',
    quantity: 20,
    unitCost: 3600,
    total: 72000,
    date: '2026-04-10',
    status: 'Received',
    notes: 'Monthly replenishment',
  },
  {
    id: 'PUR-1002',
    supplierId: 'SUP-1003',
    supplierName: 'VoltEdge Electronics',
    productId: 'PRD-1003',
    productName: 'Smart Sensor Panel',
    warehouseId: 'WH-02',
    warehouseName: 'North Depot',
    quantity: 12,
    unitCost: 7600,
    total: 91200,
    date: '2026-04-13',
    status: 'Ordered',
    notes: 'Pending delivery',
  },
]

export const DEFAULT_SALES = [
  {
    id: 'SAL-1001',
    customerId: 'CUS-1001',
    customerName: 'Apex Retail',
    productId: 'PRD-1004',
    productName: 'Packaging Carton XL',
    warehouseId: 'WH-03',
    warehouseName: 'Packaging Yard',
    quantity: 30,
    unitPrice: 420,
    total: 12600,
    date: '2026-04-12',
    status: 'Completed',
    notes: 'Retail supply order',
  },
  {
    id: 'SAL-1002',
    customerId: 'CUS-1005',
    customerName: 'Horizon Traders',
    productId: 'PRD-1002',
    productName: 'Industrial Bearing Set',
    warehouseId: 'WH-01',
    warehouseName: 'Central Hub',
    quantity: 8,
    unitPrice: 1860,
    total: 14880,
    date: '2026-04-18',
    status: 'Completed',
    notes: 'Spare parts order',
  },
]

export const DEFAULT_STOCK_MOVEMENTS = [
  {
    id: 'MOV-1001',
    productId: 'PRD-1006',
    productName: 'Copper Wiring Roll',
    warehouseId: 'WH-01',
    warehouseName: 'Central Hub',
    type: 'in',
    quantity: 10,
    date: '2026-04-14',
    notes: 'Manual stock correction',
  },
  {
    id: 'MOV-1002',
    productId: 'PRD-1007',
    productName: 'Retail Display Stand',
    warehouseId: 'WH-04',
    warehouseName: 'Retail Buffer',
    type: 'out',
    quantity: 2,
    date: '2026-04-19',
    notes: 'Showroom transfer',
  },
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})

export function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}

export function formatDate(value) {
  if (!value) {
    return ''
  }

  return dateFormatter.format(new Date(value))
}

export function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function normalizeEmail(value) {
  return value.trim().toLowerCase()
}

export function getNameError(value, label = 'Name') {
  const cleanValue = value.trim()

  if (!cleanValue) {
    return `${label} is required.`
  }

  if (cleanValue.length < 3) {
    return `${label} must be at least 3 characters.`
  }

  return ''
}

export function getEmailError(value) {
  if (!value.trim()) {
    return 'Email is required.'
  }

  if (!isEmail(value)) {
    return 'Enter a valid email address.'
  }

  return ''
}

export function getRequiredError(value, label = 'Field') {
  if (!String(value ?? '').trim()) {
    return `${label} is required.`
  }

  return ''
}

export function getNumberError(value, label, options = {}) {
  const { min = 0, allowZero = true } = options

  if (!String(value ?? '').trim()) {
    return `${label} is required.`
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return `${label} must be a valid number.`
  }

  if (!allowZero && numericValue <= 0) {
    return `${label} must be greater than 0.`
  }

  if (numericValue < min) {
    return `${label} must be ${min} or more.`
  }

  return ''
}

export function getPasswordError(value, options = {}) {
  const { required = true } = options
  const cleanValue = value.trim()

  if (!cleanValue) {
    return required ? 'Password is required.' : ''
  }

  if (cleanValue.length < 6 || !/[A-Z]/.test(cleanValue) || !/\d/.test(cleanValue)) {
    return 'Password must be at least 6 characters and include 1 uppercase letter and 1 number.'
  }

  return ''
}

export function getConfirmPasswordError(password, confirmPassword) {
  if (!confirmPassword.trim()) {
    return 'Confirm password is required.'
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.'
  }

  return ''
}

export function getOtpError(value) {
  if (!value.trim()) {
    return 'OTP is required.'
  }

  if (!/^\d{6}$/.test(value.trim())) {
    return 'OTP must be 6 digits.'
  }

  return ''
}

export function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function isOtpExpired(expiresAt) {
  return !expiresAt || Date.now() > expiresAt
}

export function upsertById(list, item) {
  const exists = list.some((entry) => entry.id === item.id)

  if (exists) {
    return list.map((entry) => (entry.id === item.id ? item : entry))
  }

  return [item, ...list]
}

export function getWarehouseName(warehouses, warehouseId) {
  return warehouses.find((item) => item.id === warehouseId)?.name ?? ''
}

export function syncProductsWithStock(products, stock, warehouses) {
  return products.map((product) => {
    const stockRecord = stock.find((item) => item.productId === product.id)
    const quantity = Number(stockRecord?.availableQty) || 0

    return {
      ...product,
      stock: quantity,
      warehouseId: stockRecord?.warehouseId ?? product.warehouseId ?? '',
      warehouseName:
        stockRecord?.warehouseName ??
        getWarehouseName(warehouses, product.warehouseId) ??
        '',
      status: quantity <= Number(product.reorderLevel || 0) ? 'Low Stock' : 'Active',
    }
  })
}

export function setProductStockQuantity({
  stock,
  products,
  warehouses,
  productId,
  quantity,
  warehouseId,
  date,
}) {
  const product = products.find((item) => item.id === productId)

  if (!product) {
    return stock
  }

  const currentRecord = stock.find((item) => item.productId === productId)
  const warehouseName =
    getWarehouseName(warehouses, warehouseId) ||
    currentRecord?.warehouseName ||
    product.warehouseName ||
    ''

  const nextRecord = {
    id: currentRecord?.id ?? createId('STK'),
    productId,
    productName: product.name,
    sku: product.sku,
    warehouseId: warehouseId || currentRecord?.warehouseId || product.warehouseId || '',
    warehouseName,
    availableQty: Math.max(0, Number(quantity) || 0),
    reservedQty: Number(currentRecord?.reservedQty) || 0,
    reorderLevel: Number(product.reorderLevel) || 0,
    lastUpdated: date || getToday(),
  }

  if (currentRecord) {
    return stock.map((item) => (item.productId === productId ? nextRecord : item))
  }

  return [nextRecord, ...stock]
}

export function adjustStockQuantity({
  stock,
  products,
  warehouses,
  productId,
  quantityChange,
  warehouseId,
  date,
}) {
  const currentRecord = stock.find((item) => item.productId === productId)
  const currentQty = Number(currentRecord?.availableQty) || 0
  const nextQty = currentQty + (Number(quantityChange) || 0)

  if (nextQty < 0) {
    return {
      success: false,
      message: 'Not enough stock available for this action.',
    }
  }

  return {
    success: true,
    stock: setProductStockQuantity({
      stock,
      products,
      warehouses,
      productId,
      quantity: nextQty,
      warehouseId,
      date,
    }),
  }
}

export function getLowStockProducts(products) {
  return products.filter(
    (item) => Number(item.stock) <= Number(item.reorderLevel || 0),
  )
}

export function getInventoryValue(products) {
  return products.reduce(
    (total, item) => total + Number(item.stock || 0) * Number(item.cost || 0),
    0,
  )
}

export function getCategoryChartData(products) {
  const categoryMap = new Map()

  products.forEach((item) => {
    const currentValue = categoryMap.get(item.category) ?? 0
    categoryMap.set(item.category, currentValue + Number(item.stock || 0))
  })

  return [...categoryMap.entries()].map(([name, stock]) => ({
    name,
    stock,
  }))
}

export function getMonthlyTransactionData(purchases, sales) {
  const monthMap = new Map()

  purchases.forEach((item) => {
    const month = item.date.slice(0, 7)
    const currentValue = monthMap.get(month) ?? {
      month,
      purchases: 0,
      sales: 0,
    }

    monthMap.set(month, {
      ...currentValue,
      purchases: currentValue.purchases + Number(item.total || 0),
    })
  })

  sales.forEach((item) => {
    const month = item.date.slice(0, 7)
    const currentValue = monthMap.get(month) ?? {
      month,
      purchases: 0,
      sales: 0,
    }

    monthMap.set(month, {
      ...currentValue,
      sales: currentValue.sales + Number(item.total || 0),
    })
  })

  return [...monthMap.values()]
    .sort((firstItem, secondItem) => firstItem.month.localeCompare(secondItem.month))
    .map((item) => ({
      ...item,
      month: new Date(`${item.month}-01`).toLocaleString('en-US', {
        month: 'short',
      }),
    }))
}

export function buildInitialState({
  products,
  customers,
  suppliers,
  users,
  roles,
  stock,
}) {
  return {
    products: syncProductsWithStock(products, stock, DEFAULT_WAREHOUSES),
    customers,
    suppliers,
    users,
    roles,
    stock,
    warehouses: DEFAULT_WAREHOUSES,
    purchases: DEFAULT_PURCHASES,
    sales: DEFAULT_SALES,
    stockMovements: DEFAULT_STOCK_MOVEMENTS,
  }
}
