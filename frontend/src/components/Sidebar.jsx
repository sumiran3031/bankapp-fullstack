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
    <aside className={`${collapsed ? 'w-16' : 'w-56'} min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 flex flex-col transition-all duration-300 flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-blue-600">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏦</span>
            <span className="font-bold text-white text-lg">BankApp</span>
          </div>
        )}
        {collapsed && <span className="text-2xl mx-auto">🏦</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-blue-200 hover:text-white transition-colors ${collapsed ? 'mx-auto mt-2' : ''}`}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'text-blue-100 hover:bg-blue-600 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }>
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-blue-600">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl bg-blue-800">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
              {user?.fullName?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.fullName}</p>
              <p className="text-blue-300 text-xs truncate">{user?.role?.replace('ROLE_', '')}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}>
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}