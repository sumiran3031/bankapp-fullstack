import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/accounts', icon: '🏦', label: 'Accounts' },
    { to: '/deposit', icon: '💰', label: 'Deposit' },
    { to: '/withdraw', icon: '💸', label: 'Withdraw' },
    { to: '/transfer', icon: '🔄', label: 'Transfer' },
    { to: '/transactions', icon: '📋', label: 'History' },
    ...(isAdmin ? [{ to: '/admin', icon: '⚙️', label: 'Admin' }] : []),
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} min-h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl">🏦</span>
            <span className="font-bold text-gray-800 text-base">BankApp</span>
          </div>
        )}
        {collapsed && <span className="text-xl mx-auto">🏦</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-700 transition-colors text-sm"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } ${collapsed ? 'justify-center' : ''}`
            }>
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg bg-gray-50">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
              {user?.fullName?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-gray-800 text-xs font-semibold truncate">{user?.fullName}</p>
              <p className="text-gray-500 text-xs truncate">{user?.role?.replace('ROLE_', '')}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}