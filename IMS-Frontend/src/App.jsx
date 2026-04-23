import { BrowserRouter } from 'react-router-dom'
import productsData from './data/products.json'
import customersData from './data/customers.json'
import suppliersData from './data/suppliers.json'
import usersData from './data/users.json'
import rolesData from './data/roles.json'
import stockData from './data/stock.json'
import { AuthProvider } from './hooks/useAuth'
import { useLocalStorage } from './hooks/useLocalStorage'
import AppRoutes from './routes/AppRoutes'
import {
  adjustStockQuantity,
  buildInitialState,
  createOtp,
  createId,
  getEmailError,
  getNameError,
  getPasswordError,
  getToday,
  isOtpExpired,
  normalizeEmail,
  setProductStockQuantity,
  syncProductsWithStock,
  upsertById,
} from './utils/helpers'

const initialData = buildInitialState({
  products: productsData,
  customers: customersData,
  suppliers: suppliersData,
  users: usersData,
  roles: rolesData,
  stock: stockData,
})

function toNumber(value) {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

function finalizeState(nextState) {
  return {
    ...nextState,
    products: syncProductsWithStock(
      nextState.products,
      nextState.stock,
      nextState.warehouses,
    ),
  }
}

function App() {
  const [users, setUsers] = useLocalStorage('users', usersData)
  const [roles, setRoles] = useLocalStorage('roles', rolesData)
  const [otpData, setOtpData] = useLocalStorage('otpData', null)
  const [data, setData] = useLocalStorage('ims-frontend-data', initialData)
  const appData = {
    ...(data?.products ? data : initialData),
    users,
    roles,
  }

  function updateData(updater) {
    setData((currentValue) => {
      const safeValue = currentValue?.products
        ? { ...currentValue, users, roles }
        : { ...initialData, users, roles }
      return finalizeState(updater(safeValue))
    })
  }

  const authActions = {
    register: (values) => {
      const nameError = getNameError(values.name)
      const emailError = getEmailError(values.email)
      const passwordError = getPasswordError(values.password)

      if (nameError || emailError || passwordError) {
        return {
          success: false,
          message: nameError || emailError || passwordError,
        }
      }

      const email = normalizeEmail(values.email)
      const emailExists = users.some((item) => normalizeEmail(item.email) === email)

      if (emailExists) {
        return {
          success: false,
          message: 'This email is already registered.',
        }
      }

      const nextUser = {
        id: createId('USR'),
        name: values.name.trim(),
        email,
        password: values.password,
        role: 'Staff',
      }
      const nextUsers = [nextUser, ...users]

      setUsers(nextUsers)
      setData((currentValue) => {
        const safeValue = currentValue?.products ? currentValue : initialData
        return {
          ...safeValue,
          users: nextUsers,
        }
      })

      return {
        success: true,
        message: 'Registration successful. Please log in with your new account.',
      }
    },

    requestPasswordReset: (emailValue) => {
      const emailError = getEmailError(emailValue)

      if (emailError) {
        return {
          success: false,
          message: emailError,
        }
      }

      const email = normalizeEmail(emailValue)
      const matchingUser = users.find((item) => normalizeEmail(item.email) === email)

      if (!matchingUser) {
        return {
          success: false,
          message: 'No user was found with that email address.',
        }
      }

      const nextOtpData = {
        email: matchingUser.email,
        otp: createOtp(),
        verified: false,
        expiresAt: Date.now() + 10 * 60 * 1000,
      }

      setOtpData(nextOtpData)

      return {
        success: true,
        message: 'OTP generated successfully.',
        otp: nextOtpData.otp,
      }
    },

    verifyOtp: (otpValue) => {
      if (!otpData?.email) {
        return {
          success: false,
          message: 'No password reset request is available.',
        }
      }

      if (isOtpExpired(otpData.expiresAt)) {
        setOtpData(null)
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.',
        }
      }

      if (otpData.otp !== otpValue.trim()) {
        return {
          success: false,
          message: 'Invalid OTP. Please try again.',
        }
      }

      setOtpData({
        ...otpData,
        verified: true,
      })

      return {
        success: true,
        message: 'OTP verified successfully.',
      }
    },

    resetPassword: (passwordValue) => {
      if (!otpData?.email || !otpData.verified) {
        return {
          success: false,
          message: 'OTP verification is required before resetting the password.',
        }
      }

      const passwordError = getPasswordError(passwordValue)

      if (passwordError) {
        return {
          success: false,
          message: passwordError,
        }
      }

      const nextUsers = users.map((item) =>
        normalizeEmail(item.email) === normalizeEmail(otpData.email)
          ? { ...item, password: passwordValue }
          : item,
      )

      setUsers(nextUsers)
      setOtpData(null)
      setData((currentValue) => {
        const safeValue = currentValue?.products ? currentValue : initialData
        return {
          ...safeValue,
          users: nextUsers,
        }
      })

      return {
        success: true,
        message: 'Password reset successful. Please log in again.',
      }
    },

    clearOtpData: () => {
      setOtpData(null)
    },
  }

  const actions = {
    saveProduct: (values, editingId = null) => {
      updateData((currentValue) => {
        const supplier =
          currentValue.suppliers.find((item) => item.id === values.supplierId) ?? null
        const warehouse =
          currentValue.warehouses.find((item) => item.id === values.warehouseId) ??
          null

        const nextProduct = {
          id: editingId ?? createId('PRD'),
          name: values.name.trim(),
          sku: values.sku.trim().toUpperCase(),
          category: values.category.trim(),
          supplierId: supplier?.id ?? '',
          supplierName: supplier?.name ?? '',
          price: toNumber(values.price),
          cost: toNumber(values.cost),
          stock: toNumber(values.stock),
          unit: values.unit.trim(),
          reorderLevel: toNumber(values.reorderLevel),
          warehouseId: warehouse?.id ?? '',
          warehouseName: warehouse?.name ?? '',
          status: 'Active',
        }

        const nextProducts = upsertById(currentValue.products, nextProduct)
        const nextStock = setProductStockQuantity({
          stock: currentValue.stock,
          products: nextProducts,
          warehouses: currentValue.warehouses,
          productId: nextProduct.id,
          quantity: nextProduct.stock,
          warehouseId: nextProduct.warehouseId,
          date: getToday(),
        })

        return {
          ...currentValue,
          products: nextProducts,
          stock: nextStock,
        }
      })

      return {
        success: true,
        message: editingId ? 'Product updated successfully.' : 'Product added successfully.',
      }
    },

    deleteProduct: (productId) => {
      updateData((currentValue) => ({
        ...currentValue,
        products: currentValue.products.filter((item) => item.id !== productId),
        stock: currentValue.stock.filter((item) => item.productId !== productId),
      }))
    },

    saveStockMovement: (values) => {
      let result = { success: true, message: 'Stock updated successfully.' }

      updateData((currentValue) => {
        const quantityChange =
          values.type === 'out' ? -toNumber(values.quantity) : toNumber(values.quantity)

        const stockResponse = adjustStockQuantity({
          stock: currentValue.stock,
          products: currentValue.products,
          warehouses: currentValue.warehouses,
          productId: values.productId,
          quantityChange,
          warehouseId: values.warehouseId,
          date: values.date,
        })

        if (!stockResponse.success) {
          result = stockResponse
          return currentValue
        }

        const product = currentValue.products.find(
          (item) => item.id === values.productId,
        )
        const warehouse = currentValue.warehouses.find(
          (item) => item.id === values.warehouseId,
        )

        const movement = {
          id: createId('MOV'),
          productId: values.productId,
          productName: product?.name ?? '',
          warehouseId: values.warehouseId,
          warehouseName: warehouse?.name ?? '',
          type: values.type,
          quantity: toNumber(values.quantity),
          date: values.date,
          notes: values.notes.trim(),
        }

        return {
          ...currentValue,
          stock: stockResponse.stock,
          stockMovements: [movement, ...currentValue.stockMovements],
        }
      })

      return result
    },

    savePurchase: (values) => {
      let result = { success: true, message: 'Purchase entry added successfully.' }

      updateData((currentValue) => {
        const product = currentValue.products.find(
          (item) => item.id === values.productId,
        )
        const supplier = currentValue.suppliers.find(
          (item) => item.id === values.supplierId,
        )
        const warehouse = currentValue.warehouses.find(
          (item) => item.id === values.warehouseId,
        )

        if (!product || !supplier || !warehouse) {
          result = {
            success: false,
            message: 'Choose a supplier, product, and warehouse.',
          }
          return currentValue
        }

        let nextStock = currentValue.stock

        if (values.status === 'Received') {
          const stockResponse = adjustStockQuantity({
            stock: currentValue.stock,
            products: currentValue.products,
            warehouses: currentValue.warehouses,
            productId: values.productId,
            quantityChange: toNumber(values.quantity),
            warehouseId: values.warehouseId,
            date: values.date,
          })

          if (!stockResponse.success) {
            result = stockResponse
            return currentValue
          }

          nextStock = stockResponse.stock
        }

        const nextPurchase = {
          id: createId('PUR'),
          supplierId: values.supplierId,
          supplierName: supplier.name,
          productId: values.productId,
          productName: product.name,
          warehouseId: values.warehouseId,
          warehouseName: warehouse.name,
          quantity: toNumber(values.quantity),
          unitCost: toNumber(values.unitCost),
          total: toNumber(values.quantity) * toNumber(values.unitCost),
          date: values.date,
          status: values.status,
          notes: values.notes.trim(),
        }

        return {
          ...currentValue,
          purchases: [nextPurchase, ...currentValue.purchases],
          stock: nextStock,
        }
      })

      return result
    },

    deletePurchase: (purchaseId) => {
      let result = { success: true }

      updateData((currentValue) => {
        const purchase = currentValue.purchases.find((item) => item.id === purchaseId)

        if (!purchase) {
          return currentValue
        }

        let nextStock = currentValue.stock

        if (purchase.status === 'Received') {
          const stockResponse = adjustStockQuantity({
            stock: currentValue.stock,
            products: currentValue.products,
            warehouses: currentValue.warehouses,
            productId: purchase.productId,
            quantityChange: -toNumber(purchase.quantity),
            warehouseId: purchase.warehouseId,
            date: getToday(),
          })

          if (!stockResponse.success) {
            result = {
              success: false,
              message:
                'This purchase cannot be removed because the received quantity has already been used.',
            }
            return currentValue
          }

          nextStock = stockResponse.stock
        }

        return {
          ...currentValue,
          purchases: currentValue.purchases.filter((item) => item.id !== purchaseId),
          stock: nextStock,
        }
      })

      return result
    },

    saveSale: (values) => {
      let result = { success: true, message: 'Sale entry added successfully.' }

      updateData((currentValue) => {
        const product = currentValue.products.find(
          (item) => item.id === values.productId,
        )
        const customer = currentValue.customers.find(
          (item) => item.id === values.customerId,
        )
        const warehouse = currentValue.warehouses.find(
          (item) => item.id === values.warehouseId,
        )

        if (!product || !customer || !warehouse) {
          result = {
            success: false,
            message: 'Choose a customer, product, and warehouse.',
          }
          return currentValue
        }

        const stockResponse = adjustStockQuantity({
          stock: currentValue.stock,
          products: currentValue.products,
          warehouses: currentValue.warehouses,
          productId: values.productId,
          quantityChange: -toNumber(values.quantity),
          warehouseId: values.warehouseId,
          date: values.date,
        })

        if (!stockResponse.success) {
          result = stockResponse
          return currentValue
        }

        const nextSale = {
          id: createId('SAL'),
          customerId: values.customerId,
          customerName: customer.name,
          productId: values.productId,
          productName: product.name,
          warehouseId: values.warehouseId,
          warehouseName: warehouse.name,
          quantity: toNumber(values.quantity),
          unitPrice: toNumber(values.unitPrice),
          total: toNumber(values.quantity) * toNumber(values.unitPrice),
          date: values.date,
          status: values.status,
          notes: values.notes.trim(),
        }

        return {
          ...currentValue,
          sales: [nextSale, ...currentValue.sales],
          stock: stockResponse.stock,
        }
      })

      return result
    },

    deleteSale: (saleId) => {
      updateData((currentValue) => {
        const sale = currentValue.sales.find((item) => item.id === saleId)

        if (!sale) {
          return currentValue
        }

        const stockResponse = adjustStockQuantity({
          stock: currentValue.stock,
          products: currentValue.products,
          warehouses: currentValue.warehouses,
          productId: sale.productId,
          quantityChange: toNumber(sale.quantity),
          warehouseId: sale.warehouseId,
          date: getToday(),
        })

        return {
          ...currentValue,
          sales: currentValue.sales.filter((item) => item.id !== saleId),
          stock: stockResponse.success ? stockResponse.stock : currentValue.stock,
        }
      })
    },

    saveSupplier: (values, editingId = null) => {
      updateData((currentValue) => ({
        ...currentValue,
        suppliers: upsertById(currentValue.suppliers, {
          id: editingId ?? createId('SUP'),
          name: values.name.trim(),
          contact: values.contact.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          category: values.category.trim(),
        }),
      }))
    },

    deleteSupplier: (supplierId) => {
      let result = { success: true }

      updateData((currentValue) => {
        const linkedProducts = currentValue.products.some(
          (item) => item.supplierId === supplierId,
        )

        if (linkedProducts) {
          result = {
            success: false,
            message: 'This supplier is linked to one or more products.',
          }
          return currentValue
        }

        return {
          ...currentValue,
          suppliers: currentValue.suppliers.filter((item) => item.id !== supplierId),
        }
      })

      return result
    },

    saveCustomer: (values, editingId = null) => {
      updateData((currentValue) => ({
        ...currentValue,
        customers: upsertById(currentValue.customers, {
          id: editingId ?? createId('CUS'),
          name: values.name.trim(),
          company: values.company.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          city: values.city.trim(),
        }),
      }))
    },

    deleteCustomer: (customerId) => {
      let result = { success: true }

      updateData((currentValue) => {
        const linkedSales = currentValue.sales.some(
          (item) => item.customerId === customerId,
        )

        if (linkedSales) {
          result = {
            success: false,
            message: 'This customer already has sales records.',
          }
          return currentValue
        }

        return {
          ...currentValue,
          customers: currentValue.customers.filter((item) => item.id !== customerId),
        }
      })

      return result
    },

    saveWarehouse: (values, editingId = null) => {
      updateData((currentValue) => ({
        ...currentValue,
        warehouses: upsertById(currentValue.warehouses, {
          id: editingId ?? createId('WH'),
          name: values.name.trim(),
          location: values.location.trim(),
          manager: values.manager.trim(),
        }),
      }))
    },

    deleteWarehouse: (warehouseId) => {
      let result = { success: true }

      updateData((currentValue) => {
        const linkedStock = currentValue.stock.some(
          (item) => item.warehouseId === warehouseId,
        )

        if (linkedStock) {
          result = {
            success: false,
            message: 'This warehouse is still linked to stock items.',
          }
          return currentValue
        }

        return {
          ...currentValue,
          warehouses: currentValue.warehouses.filter((item) => item.id !== warehouseId),
        }
      })

      return result
    },

    saveUser: (values, editingId = null) => {
      let result = { success: true, message: 'User saved successfully.' }

      updateData((currentValue) => {
        const emailExists = currentValue.users.some(
          (item) =>
            item.email.toLowerCase() === values.email.trim().toLowerCase() &&
            item.id !== editingId,
        )

        if (emailExists) {
          result = {
            success: false,
            message: 'This email is already assigned to another user.',
          }
          return currentValue
        }

        const currentUser = currentValue.users.find((item) => item.id === editingId)
        const passwordError = getPasswordError(values.password, {
          required: !editingId,
        })

        if (passwordError) {
          result = {
            success: false,
            message: passwordError,
          }
          return currentValue
        }

        const nextUsers = upsertById(currentValue.users, {
          id: editingId ?? createId('USR'),
          name: values.name.trim(),
          email: normalizeEmail(values.email),
          password: values.password || currentUser?.password || 'Admin123',
          role: values.role,
        })

        setUsers(nextUsers)

        return {
          ...currentValue,
          users: nextUsers,
        }
      })

      return result
    },

    deleteUser: (userId) => {
      let result = { success: true }

      updateData((currentValue) => {
        const user = currentValue.users.find((item) => item.id === userId)
        const adminCount = currentValue.users.filter(
          (item) => item.role === 'Admin',
        ).length

        if (user?.role === 'Admin' && adminCount === 1) {
          result = {
            success: false,
            message: 'At least one admin user must remain in the system.',
          }
          return currentValue
        }

        const nextUsers = currentValue.users.filter((item) => item.id !== userId)
        setUsers(nextUsers)

        return {
          ...currentValue,
          users: nextUsers,
        }
      })

      return result
    },

    saveRole: (values, editingId = null) => {
      let result = { success: true, message: 'Role saved successfully.' }

      updateData((currentValue) => {
        const nameExists = currentValue.roles.some(
          (item) =>
            item.name.toLowerCase() === values.name.trim().toLowerCase() &&
            item.id !== editingId,
        )

        if (nameExists) {
          result = {
            success: false,
            message: 'A role with this name already exists.',
          }
          return currentValue
        }

        const existingRole = currentValue.roles.find((item) => item.id === editingId)
        const nextRole = {
          id: editingId ?? createId('ROL'),
          name: values.name.trim(),
          permissions: values.permissions,
        }
        const nextRoles = upsertById(currentValue.roles, nextRole)
        const nextUsers = currentValue.users.map((item) =>
          existingRole && item.role === existingRole.name
            ? { ...item, role: nextRole.name }
            : item,
        )

        setRoles(nextRoles)
        setUsers(nextUsers)

        return {
          ...currentValue,
          roles: nextRoles,
          users: nextUsers,
        }
      })

      return result
    },

    deleteRole: (roleId) => {
      let result = { success: true }

      updateData((currentValue) => {
        const role = currentValue.roles.find((item) => item.id === roleId)

        if (!role) {
          return currentValue
        }

        const assignedUsers = currentValue.users.some((item) => item.role === role.name)

        if (assignedUsers) {
          result = {
            success: false,
            message: 'Reassign users before deleting this role.',
          }
          return currentValue
        }

        const nextRoles = currentValue.roles.filter((item) => item.id !== roleId)
        setRoles(nextRoles)

        return {
          ...currentValue,
          roles: nextRoles,
        }
      })

      return result
    },
  }

  return (
    <AuthProvider
      users={users}
      roles={roles}
      otpData={otpData}
      authActions={authActions}
    >
      <BrowserRouter>
        <AppRoutes data={appData} actions={actions} />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
