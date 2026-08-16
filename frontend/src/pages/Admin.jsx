import { useState, useEffect } from 'react'
import { adminApi } from '../api/apiClient'
import Navbar from '../components/Navbar'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)

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
    } catch { }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const handleBlock = async (number) => {
    try {
      await adminApi.blockAccount(number)
      showMsg(`Account ${number} blocked`)
      fetchData()
    } catch { showMsg('Action failed', 'error') }
  }

  const handleUnblock = async (number) => {
    try {
      await adminApi.unblockAccount(number)
      showMsg(`Account ${number} unblocked`)
      fetchData()
    } catch { showMsg('Action failed', 'error') }
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <Navbar title="Admin Panel" />

      <div className="p-6 space-y-5">
        {msg && (
          <div className={`p-3 rounded-lg border text-sm font-medium ${
            msg.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-0">
          {['stats', 'accounts', 'users'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-all -mb-px ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Stats */}
        {activeTab === 'stats' && (
          loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Users', value: stats?.totalUsers },
                { label: 'Total Accounts', value: stats?.totalAccounts },
                { label: 'Active Accounts', value: stats?.activeAccounts },
                { label: 'Total Deposits', value: `₹${Number(stats?.totalDeposits || 0).toLocaleString('en-IN')}` },
                { label: 'Total Transactions', value: stats?.totalTransactions },
              ].map(s => (
                <div key={s.label} className="card p-5">
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )
        )}

        {/* Accounts */}
        {activeTab === 'accounts' && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-800 text-sm">
                All Accounts ({accounts.length})
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Account No', 'Holder', 'Type', 'Balance', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {accounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">
                        {acc.accountNumber}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {acc.accountHolderName}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{acc.accountType}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                        ₹{Number(acc.balance).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          acc.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : acc.status === 'BLOCKED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-500'
                        }`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {acc.status === 'ACTIVE' ? (
                          <button onClick={() => handleBlock(acc.accountNumber)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-all">
                            Block
                          </button>
                        ) : acc.status === 'BLOCKED' ? (
                          <button onClick={() => handleUnblock(acc.accountNumber)}
                            className="text-xs text-green-600 hover:text-green-800 font-medium border border-green-200 px-2.5 py-1 rounded-lg hover:bg-green-50 transition-all">
                            Unblock
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-800 text-sm">
                All Users ({users.length})
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{u.fullName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{u.phone}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {u.role?.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
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