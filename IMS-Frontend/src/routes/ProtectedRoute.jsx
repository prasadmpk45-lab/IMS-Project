import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getDefaultPath } from '../utils/permissions'

export default function ProtectedRoute({
  children,
  moduleKey = null,
  action = 'view',
}) {
  const { user, roles, hasPermission } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (moduleKey && !hasPermission(moduleKey, action)) {
    return <Navigate to={getDefaultPath(user.role, roles)} replace />
  }

  return children ?? <Outlet />
}
