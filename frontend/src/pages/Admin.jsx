import { useState, useEffect } from 'react'
import { adminApi } from '../api/apiClient'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, accountsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAllAccounts(),
        adminApi.getAllUsers(),
      ])
      setStats(statsRes.data)
      setAccounts(accountsRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      console.error('Admin fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleBlock = async (accountNumber) => {
    try {
      await adminApi.blockAccount(accountNumber)
      setActionMsg({ type: 'success', msg: `Account ${accountNumber} blocked` })
      fetchData()
    } catch {
      setActionMsg({ type: 'error', msg: 'Action failed' })
    }
    setTimeout(() => setActionMsg(null), 3000)
  }

  const handleUnblock = async (accountNumber) => {
    try {
      await adminApi.unblockAccount(accountNumber)
      setActionMsg({ type: 'success', msg: `Account ${accountNumber} unblocked` })
      fetchData()
    } catch {
      setActionMsg({ type: 'error', msg: 'Action failed' })
    }
    setTimeout(() => setActionMsg(null), 3000)
  }

  const tabs = ['stats', 'accounts', 'users']

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Navbar title="Admin Dashboard" />

      <div className="p-6 space-y-5">
        {/* Admin badge */}
        <div className="card p-4 bg-gradient-to-r from-red-500 to-red-700 text-white border-0">
          <p className="font-bold">⚙️ Admin Control Panel</p>
          <p className="text-red-100 text-sm">
            Full access to manage accounts and users
          </p>
        </div>

        {/* Action message */}
        {actionMsg && (
          <div className={`p-4 rounded-xl font-semibold ${
            actionMsg.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700'
          }`}>
            {actionMsg.type === 'success' ? '✅' : '❌'} {actionMsg.msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl font-semibold text-sm capitalize transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Stats tab */}
        {activeTab === 'stats' && (
          loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatsCard icon="👥" label="Total Users"
                value={stats?.totalUsers} color="blue" />
              <StatsCard icon="🏦" label="Total Accounts"
                value={stats?.totalAccounts} color="green" />
              <StatsCard icon="✅" label="Active Accounts"
                value={stats?.activeAccounts} color="purple" />
              <StatsCard icon="💰" label="Total Deposits"
                value={`₹${Number(stats?.totalDeposits || 0).toLocaleString('en-IN')}`}
                color="orange" />
              <StatsCard icon="📋" label="Total Transactions"
                value={stats?.totalTransactions} color="red" />
            </div>
          )
        )}

        {/* Accounts tab */}
        {activeTab === 'accounts' && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="font-bold text-gray-800 dark:text-white">
                All Accounts ({accounts.length})
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {['Account No', 'Holder', 'Type', 'Balance', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {accounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-800 dark:text-white">
                        {acc.accountNumber}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">
                        {acc.accountHolderName}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {acc.accountType}
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400 text-sm">
                        ₹{Number(acc.balance).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${
                          acc.status === 'ACTIVE'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : acc.status === 'BLOCKED'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                        }`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {acc.status === 'ACTIVE' ? (
                            <button onClick={() => handleBlock(acc.accountNumber)}
                              className="px-2.5 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-100 transition">
                              🔒 Block
                            </button>
                          ) : acc.status === 'BLOCKED' ? (
                            <button onClick={() => handleUnblock(acc.accountNumber)}
                              className="px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold hover:bg-green-100 transition">
                              🔓 Unblock
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="font-bold text-gray-800 dark:text-white">
                All Users ({users.length})
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white text-sm">
                        {u.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {u.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${
                          u.role === 'ROLE_ADMIN'
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        }`}>
                          {u.role?.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${
                          u.isActive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}