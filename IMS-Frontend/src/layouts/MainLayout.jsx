import {
  Boxes,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  getNavItem,
  getPageTitle,
  NAV_ITEMS,
} from '../utils/permissions'
import './MainLayout.css'

export default function MainLayout() {
  const { user, logout, hasPermission } = useAuth()
  const location = useLocation()

  // 🔥 Collapsible state
  const [openMenus, setOpenMenus] = useState({
    inventory: false,
    people: false,
    management: false,
  })

  // 🔥 Auto open active menu
  useEffect(() => {
    if (location.pathname.includes('/inventory')) {
      setOpenMenus((prev) => ({ ...prev, inventory: true }))
    }
    if (location.pathname.includes('/people')) {
      setOpenMenus((prev) => ({ ...prev, people: true }))
    }
  }, [location.pathname])

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  // RBAC filter
  const visibleItems = NAV_ITEMS.filter((item) =>
    hasPermission(item.key, 'view'),
  )

  const activeItem = getNavItem(location.pathname)
  const ActiveIcon = activeItem?.icon

  // 🔥 Collapsible group renderer
  const renderGroup = (category, title) => {
    const items = visibleItems.filter(
      (item) => item.category === category,
    )

    if (items.length === 0) return null

    return (
      <div className="layout__nav-group">
        {/* Parent clickable */}
        <div
          className="layout__nav-parent"
          onClick={() => toggleMenu(category)}
        >
          {openMenus[category] ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
          <span>{title}</span>
        </div>

        {/* Sub menu */}
        {openMenus[category] &&
          items.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `layout__nav-link sub ${
                    isActive ? 'is-active' : ''
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
      </div>
    )
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="layout__sidebar">
        <div className="layout__brand">
          <div className="layout__brand-mark">
            <Boxes size={22} />
          </div>
          <div>
            <h1>IMS</h1>
            <p>Inventory Management System</p>
          </div>
        </div>

        <nav className="layout__nav">
          {/* Dashboard */}
          {visibleItems
            .filter((item) => item.category === 'dashboard')
            .map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `layout__nav-link ${
                      isActive ? 'is-active' : ''
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}

          {/* Collapsible Groups */}
          {renderGroup('inventory', 'Inventory')}
          {renderGroup('people', 'People')}
          {renderGroup('management', 'Management')}
        </nav>
      </aside>

      {/* Content */}
      <div className="layout__content">
        <header className="layout__header">
          <div className="layout__page-title">
            {ActiveIcon && (
              <div className="layout__page-icon">
                <ActiveIcon size={20} />
              </div>
            )}

            <div>
              <h2>{getPageTitle(location.pathname)}</h2>
              <p>
                Manage inventory data with role-based access control.
              </p>
            </div>
          </div>

          <div className="layout__header-actions">
            <div className="layout__user">
              <ShieldCheck size={16} />
              <span>
                {user?.name} ({user?.role})
              </span>
            </div>

            <button
              type="button"
              className="button button-primary"
              onClick={logout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}