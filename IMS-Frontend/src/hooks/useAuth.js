import { createContext, createElement, useContext, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { canAccess } from '../utils/permissions'

const AuthContext = createContext(null)

function sanitizeUser(user) {
  if (!user) {
    return null
  }

  const nextUser = { ...user }
  delete nextUser.password
  return nextUser
}

export function AuthProvider({ children, users, roles, otpData, authActions }) {
  const [user, setUser] = useLocalStorage('ims-current-user', null)

  useEffect(() => {
    if (!user) {
      return
    }

    const latestUser = users.find((item) => item.id === user.id)
    const roleExists = roles.some((item) => item.name === latestUser?.role)

    if (!latestUser || !roleExists) {
      setUser(null)
      return
    }

    if (
      latestUser.name !== user.name ||
      latestUser.email !== user.email ||
      latestUser.role !== user.role
    ) {
      setUser(sanitizeUser(latestUser))
    }
  }, [roles, setUser, user, users])

  function login({ email, password }) {
    const matchedUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password,
    )

    if (!matchedUser) {
      return {
        success: false,
        message: 'Invalid email or password.',
      }
    }

    setUser(sanitizeUser(matchedUser))

    return {
      success: true,
    }
  }

  function logout() {
    setUser(null)
  }

  function hasPermission(moduleKey, action = 'view') {
    return canAccess(moduleKey, action, user?.role, roles)
  }

  return createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        users,
        roles,
        login,
        logout,
        hasPermission,
        otpData,
        register: authActions.register,
        requestPasswordReset: authActions.requestPasswordReset,
        verifyOtp: authActions.verifyOtp,
        resetPassword: authActions.resetPassword,
        clearOtpData: authActions.clearOtpData,
        isAuthenticated: Boolean(user),
      },
    },
    children,
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
