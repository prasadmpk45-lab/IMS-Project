import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ForgotPassword from '../modules/Auth/ForgotPassword'
import Login from '../modules/Auth/Login'
import Register from '../modules/Auth/Register'
import ResetPassword from '../modules/Auth/ResetPassword'
import VerifyOTP from '../modules/Auth/VerifyOTP'
import Accounting from '../modules/Accounting/Accounting'
import Barcode from '../modules/Barcode/Barcode'
import Customers from '../modules/Customers/Customers'
import Dashboard from '../modules/Dashboard/Dashboard'
import InventoryAudit from '../modules/InventoryAudit/InventoryAudit'
import Notifications from '../modules/Notifications/Notifications'
import Products from '../modules/Products/Products'
import Purchases from '../modules/Purchases/Purchases'
import Reports from '../modules/Reports/Reports'
import Returns from '../modules/Returns/Returns'
import Roles from '../modules/Roles/Roles'
import Sales from '../modules/Sales/Sales'
import Stock from '../modules/Stock/Stock'
import Suppliers from '../modules/Suppliers/Suppliers'
import Users from '../modules/Users/Users'
import Warehouses from '../modules/Warehouses/Warehouses'
import { useAuth } from '../hooks/useAuth'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes({ data, actions }) {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
      />
      <Route
        path="/verify-otp"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <VerifyOTP />}
      />
      <Route
        path="/reset-password"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPassword />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard data={data} />} />

          <Route
            path="/inventory/products"
            element={
              <Products
                products={data.products}
                suppliers={data.suppliers}
                warehouses={data.warehouses}
                onSaveProduct={actions.saveProduct}
                onDeleteProduct={actions.deleteProduct}
                onQuickAddSupplier={actions.quickAddSupplier}
                onQuickAddWarehouse={actions.quickAddWarehouse}
              />
            }
          />
          <Route
            path="/inventory/stock"
            element={
              <Stock
                stock={data.stock}
                products={data.products}
                warehouses={data.warehouses}
                stockMovements={data.stockMovements}
                onSaveStockMovement={actions.saveStockMovement}
                onQuickAddProduct={actions.quickAddProduct}
                onQuickAddWarehouse={actions.quickAddWarehouse}
              />
            }
          />
          <Route
            path="/inventory/purchases"
            element={
              <Purchases
                purchases={data.purchases}
                products={data.products}
                suppliers={data.suppliers}
                warehouses={data.warehouses}
                onSavePurchase={actions.savePurchase}
                onDeletePurchase={actions.deletePurchase}
                onQuickAddSupplier={actions.quickAddSupplier}
                onQuickAddProduct={actions.quickAddProduct}
                onQuickAddWarehouse={actions.quickAddWarehouse}
              />
            }
          />
          <Route
            path="/inventory/sales"
            element={
              <Sales
                sales={data.sales}
                products={data.products}
                customers={data.customers}
                warehouses={data.warehouses}
                onSaveSale={actions.saveSale}
                onDeleteSale={actions.deleteSale}
                onQuickAddCustomer={actions.quickAddCustomer}
                onQuickAddProduct={actions.quickAddProduct}
                onQuickAddWarehouse={actions.quickAddWarehouse}
              />
            }
          />
          <Route
            path="/inventory/audit"
            element={
              <InventoryAudit
                audits={data.inventoryAudits}
                stock={data.stock}
                products={data.products}
                warehouses={data.warehouses}
                onSaveInventoryAudit={actions.saveInventoryAudit}
                onQuickAddProduct={actions.quickAddProduct}
                onQuickAddWarehouse={actions.quickAddWarehouse}
              />
            }
          />
          <Route
            path="/inventory/barcode"
            element={
              <Barcode
                barcodes={data.barcodes}
                products={data.products}
                onSaveBarcode={actions.saveBarcode}
                onQuickAddProduct={actions.quickAddProduct}
              />
            }
          />

          <Route
            path="/people/suppliers"
            element={
              <Suppliers
                suppliers={data.suppliers}
                purchases={data.purchases}
                onSaveSupplier={actions.saveSupplier}
                onDeleteSupplier={actions.deleteSupplier}
              />
            }
          />
          <Route
            path="/people/customers"
            element={
              <Customers
                customers={data.customers}
                sales={data.sales}
                onSaveCustomer={actions.saveCustomer}
                onDeleteCustomer={actions.deleteCustomer}
              />
            }
          />

          <Route
            path="/warehouses"
            element={
              <Warehouses
                warehouses={data.warehouses}
                products={data.products}
                stock={data.stock}
                onSaveWarehouse={actions.saveWarehouse}
                onDeleteWarehouse={actions.deleteWarehouse}
                onSaveStockMovement={actions.saveStockMovement}
              />
            }
          />
          <Route path="/reports" element={<Reports data={data} />} />
          <Route
            path="/notifications"
            element={
              <Notifications
                notifications={data.notifications}
                products={data.products}
                sales={data.sales}
                onSaveNotification={actions.saveNotification}
              />
            }
          />
          <Route
            path="/accounting"
            element={
              <Accounting
                invoices={data.accountingInvoices}
                products={data.products}
                suppliers={data.suppliers}
                customers={data.customers}
                warehouses={data.warehouses}
                onSaveInvoice={actions.saveInvoice}
                onQuickAddSupplier={actions.quickAddSupplier}
                onQuickAddCustomer={actions.quickAddCustomer}
                onQuickAddProduct={actions.quickAddProduct}
                onQuickAddWarehouse={actions.quickAddWarehouse}
              />
            }
          />
          <Route
            path="/returns"
            element={
              <Returns
                returns={data.returns}
                products={data.products}
                warehouses={data.warehouses}
                onSaveReturn={actions.saveReturn}
                onQuickAddProduct={actions.quickAddProduct}
                onQuickAddWarehouse={actions.quickAddWarehouse}
              />
            }
          />
          <Route
            path="/users"
            element={
              <Users
                users={data.users}
                roles={data.roles}
                onSaveUser={actions.saveUser}
                onDeleteUser={actions.deleteUser}
              />
            }
          />
          <Route
            path="/roles"
            element={
              <Roles
                roles={data.roles}
                onSaveRole={actions.saveRole}
                onDeleteRole={actions.deleteRole}
              />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}
