import {
  Boxes,
  ChevronDown,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getNavItem, getPageTitle, NAV_ITEMS } from '../utils/permissions'
import './MainLayout.css'

function getActiveMenus(pathname) {
  return {
    inventory: pathname.startsWith('/inventory'),
    people: pathname.startsWith('/people'),
    management: ['/warehouses', '/reports', '/notifications', '/accounting'].some(
      (path) => pathname.startsWith(path),
    ),
    extra: pathname.startsWith('/returns'),
    admin: ['/users', '/roles'].some((path) => pathname.startsWith(path)),
  }
}

export default function MainLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOverrides, setMenuOverrides] = useState({})

  const activeMenus = getActiveMenus(location.pathname)

  // ✅ FIX: remove permission blocking
  const visibleItems = NAV_ITEMS

  const activeItem = getNavItem(location.pathname)
  const ActiveIcon = activeItem?.icon

  function isMenuOpen(menu) {
    return menuOverrides[menu] ?? activeMenus[menu] ?? false
  }

  function toggleMenu(menu) {
    setMenuOverrides((prev) => ({
      ...prev,
      [menu]: !isMenuOpen(menu),
    }))
  }

  function renderGroup(category, title) {
    const items = visibleItems.filter((item) => item.category === category)

    if (items.length === 0) return null

    return (
      <div className="layout__nav-group">
        <div className="layout__nav-parent" onClick={() => toggleMenu(category)}>
          {isMenuOpen(category) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span>{title}</span>
        </div>

        {isMenuOpen(category) &&
          items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `layout__nav-link sub ${isActive ? 'is-active' : ''}`
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
          {visibleItems
            .filter((item) => item.category === 'dashboard')
            .map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `layout__nav-link ${isActive ? 'is-active' : ''}`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}

          {renderGroup('inventory', 'Inventory')}
          {renderGroup('people', 'People')}
          {renderGroup('management', 'Management')}
          {renderGroup('extra', 'Extra')}
          {renderGroup('admin', 'Administration')}
        </nav>
      </aside>

      <div className="layout__content">
        <header className="layout__header">
          <div className="layout__page-title">
            {ActiveIcon && (
              <div className="layout__page-icon">
                <ActiveIcon size={20} />
              </div>
            )}

            <div>
              <h2>{getPageTitle(location.pathname) || "Dashboard"}</h2>
              <p>Manage inventory data with role-based access control.</p>
            </div>
          </div>

          <div className="layout__header-actions">
            <div className="layout__user">
              <ShieldCheck size={16} />
              <span>
                {user?.email} ({user?.role})
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