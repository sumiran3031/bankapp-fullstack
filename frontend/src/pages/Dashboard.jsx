import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { accountApi, transactionApi } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import TransactionItem from '../components/TransactionItem'

export default function Dashboard() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [recentTx, setRecentTx] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsRes = await accountApi.getMyAccounts()
        setAccounts(accountsRes.data)
        if (accountsRes.data.length > 0) {
          const txRes = await transactionApi.getHistory(accountsRes.data[0].accountNumber)
          setRecentTx(txRes.data.slice(0, 5))
        }
      } catch {
        setError('Failed to load. Is backend running on :8080?')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <Navbar title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Good day, {user?.fullName?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Here's your account overview.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-medium text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard icon="💰" label="Total Balance"
              value={`₹${totalBalance.toLocaleString('en-IN')}`} />
            <StatsCard icon="🏦" label="Total Accounts"
              value={accounts.length}
              subValue={`${accounts.filter(a => a.status === 'ACTIVE').length} active`} />
            <StatsCard icon="📋" label="Recent Transactions"
              value={recentTx.length} />
            <StatsCard icon="✅" label="Account Status"
              value="Active" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Accounts */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">My Accounts</h3>
              <Link to="/accounts"
                className="text-sm text-blue-600 hover:underline">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2].map(i => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm mb-3">No accounts yet</p>
                <Link to="/accounts" className="btn-primary text-sm">
                  Open Account
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map(account => (
                  <div key={account.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm font-mono">
                        {account.accountNumber}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {account.accountType} • {account.branchName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-sm">
                        ₹{Number(account.balance).toLocaleString('en-IN')}
                      </p>
                      <span className={`text-xs font-medium ${
                        account.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {account.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Recent Transactions</h3>
              <Link to="/transactions"
                className="text-sm text-blue-600 hover:underline">
                View all →
              </Link>
            </div>
            {recentTx.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentTx.map(tx => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: '/deposit', icon: '💰', label: 'Deposit' },
              { to: '/withdraw', icon: '💸', label: 'Withdraw' },
              { to: '/transfer', icon: '🔄', label: 'Transfer' },
              { to: '/transactions', icon: '📋', label: 'History' },
            ].map(action => (
              <Link key={action.to} to={action.to}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all text-center">
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}