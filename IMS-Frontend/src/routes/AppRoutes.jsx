import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'

import ForgotPassword from '../modules/Auth/ForgotPassword'
import Login from '../modules/Auth/Login'
import Register from '../modules/Auth/Register'
import ResetPassword from '../modules/Auth/ResetPassword'
import VerifyOTP from '../modules/Auth/VerifyOTP'

import Customers from '../modules/Customers/Customers'
import Dashboard from '../modules/Dashboard/Dashboard'
import Products from '../modules/Products/Products'
import Purchases from '../modules/Purchases/Purchases'
import Reports from '../modules/Reports/Reports'
import Roles from '../modules/Roles/Roles'
import Sales from '../modules/Sales/Sales'
import Stock from '../modules/Stock/Stock'
import Suppliers from '../modules/Suppliers/Suppliers'
import Users from '../modules/Users/Users'
import Warehouses from '../modules/Warehouses/Warehouses'

import ProtectedRoute from './ProtectedRoute'
import { getDefaultPath } from '../utils/permissions'

export default function AppRoutes({ data, actions }) {
  const { user, roles } = useAuth()
  const homePath = getDefaultPath(user?.role, roles)

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={user ? <Navigate to={homePath} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={homePath} replace /> : <Register />}
      />
      <Route
        path="/forgot-password"
        element={user ? <Navigate to={homePath} replace /> : <ForgotPassword />}
      />
      <Route
        path="/verify-otp"
        element={user ? <Navigate to={homePath} replace /> : <VerifyOTP />}
      />
      <Route
        path="/reset-password"
        element={user ? <Navigate to={homePath} replace /> : <ResetPassword />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to={homePath} replace />} />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute moduleKey="dashboard">
                <Dashboard data={data} />
              </ProtectedRoute>
            }
          />

          {/* 🔥 Inventory Module */}
          <Route path="inventory">
            <Route
              path="products"
              element={
                <ProtectedRoute moduleKey="products">
                  <Products
                    products={data.products}
                    suppliers={data.suppliers}
                    warehouses={data.warehouses}
                    onSaveProduct={actions.saveProduct}
                    onDeleteProduct={actions.deleteProduct}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="stock"
              element={
                <ProtectedRoute moduleKey="stock">
                  <Stock
                    stock={data.stock}
                    products={data.products}
                    warehouses={data.warehouses}
                    stockMovements={data.stockMovements}
                    onSaveStockMovement={actions.saveStockMovement}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="purchases"
              element={
                <ProtectedRoute moduleKey="purchases">
                  <Purchases
                    purchases={data.purchases}
                    products={data.products}
                    suppliers={data.suppliers}
                    warehouses={data.warehouses}
                    onSavePurchase={actions.savePurchase}
                    onDeletePurchase={actions.deletePurchase}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="sales"
              element={
                <ProtectedRoute moduleKey="sales">
                  <Sales
                    sales={data.sales}
                    products={data.products}
                    customers={data.customers}
                    warehouses={data.warehouses}
                    onSaveSale={actions.saveSale}
                    onDeleteSale={actions.deleteSale}
                  />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 🔥 People Module */}
          <Route path="people">
            <Route
              path="suppliers"
              element={
                <ProtectedRoute moduleKey="suppliers">
                  <Suppliers
                    suppliers={data.suppliers}
                    onSaveSupplier={actions.saveSupplier}
                    onDeleteSupplier={actions.deleteSupplier}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="customers"
              element={
                <ProtectedRoute moduleKey="customers">
                  <Customers
                    customers={data.customers}
                    onSaveCustomer={actions.saveCustomer}
                    onDeleteCustomer={actions.deleteCustomer}
                  />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Other Modules (unchanged) */}
          <Route
            path="warehouses"
            element={
              <ProtectedRoute moduleKey="warehouses">
                <Warehouses
                  warehouses={data.warehouses}
                  onSaveWarehouse={actions.saveWarehouse}
                  onDeleteWarehouse={actions.deleteWarehouse}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute moduleKey="reports">
                <Reports data={data} />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute moduleKey="users">
                <Users
                  users={data.users}
                  roles={data.roles}
                  onSaveUser={actions.saveUser}
                  onDeleteUser={actions.deleteUser}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="roles"
            element={
              <ProtectedRoute moduleKey="roles">
                <Roles
                  roles={data.roles}
                  onSaveRole={actions.saveRole}
                  onDeleteRole={actions.deleteRole}
                />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={user ? homePath : '/login'} replace />}
      />
    </Routes>
  )
}