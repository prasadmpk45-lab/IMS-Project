import { createContext, createElement, useContext } from 'react'
import { canAccess } from '../utils/permissions'
import { useLocalStorage } from './useLocalStorage'

const AuthContext = createContext(null)
const AUTH_TOKEN_KEY = 'ims-auth-token'
const AUTH_USER_KEY = 'ims-current-user'

export function AuthProvider({ children, roles = [], authActions = {} }) {
  const [user, setUser] = useLocalStorage(AUTH_USER_KEY, null)

  async function login({ email, password }) {
    try {
      const res = await fetch(
        'https://trimestral-flusteredly-patrice.ngrok-free.dev/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      )

      const data = await res.json()

      if (!res.ok) {
        return {
          success: false,
          message: data?.message || 'Invalid email or password',
        }
      }

      const token = data?.token ?? data?.accessToken ?? ''
      const apiUser = data?.user ?? data ?? {}
      const userData = {
        id: apiUser.id ?? apiUser._id ?? null,
        name: apiUser.name ?? '',
        email: apiUser.email ?? email.trim(),
        role: apiUser.role ?? 'User',
      }

      if (!token) {
        return {
          success: false,
          message: 'Invalid login response: token missing.',
        }
      }

      localStorage.setItem(AUTH_TOKEN_KEY, token)
      setUser(userData)

      return { success: true, user: userData, token }
    } catch {
      return {
        success: false,
        message: 'Server error',
      }
    }
  }

  function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
  }

  function hasPermission(moduleKey, action = 'view') {
    return canAccess(moduleKey, action, user?.role, roles)
  }

  const isAuthenticated = Boolean(user && localStorage.getItem(AUTH_TOKEN_KEY))

  return createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        roles,
        login,
        logout,
        hasPermission,
        isAuthenticated,
        ...authActions,
      },
    },
    children,
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
