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
          const txRes = await transactionApi.getHistory(
            accountsRes.data[0].accountNumber
          )
          setRecentTx(txRes.data.slice(0, 5))
        }
      } catch (err) {
        setError('Failed to load dashboard. Is backend running?')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance), 0
  )
  const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Navbar title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div className="card p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
          <h2 className="text-2xl font-bold mb-1">
            Welcome, {user?.fullName?.split(' ')[0]}! 👋
          </h2>
          <p className="text-blue-100 text-sm">
            Here's your financial overview for today.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="card p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
            <p className="text-red-600 dark:text-red-400 font-medium">⚠️ {error}</p>
            <p className="text-sm text-red-500 mt-1">
              Make sure Spring Boot is running on port 8080
            </p>
          </div>
        )}

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard icon="💰" label="Total Balance"
              value={`₹${totalBalance.toLocaleString('en-IN')}`}
              color="blue" />
            <StatsCard icon="🏦" label="Accounts"
              value={accounts.length}
              subValue={`${activeAccounts} active`}
              color="green" />
            <StatsCard icon="📋" label="Transactions"
              value={recentTx.length}
              subValue="Recent activity"
              color="purple" />
            <StatsCard icon="✅" label="Status"
              value="Verified"
              subValue="All systems normal"
              color="orange" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Accounts */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-white">🏦 My Accounts</h3>
              <Link to="/accounts" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🏦</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  No accounts yet
                </p>
                <Link to="/accounts" className="btn-primary text-sm">
                  Open Account
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map(account => (
                  <div key={account.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white text-sm">
                        {account.accountNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {account.accountType} • {account.branchName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        ₹{Number(account.balance).toLocaleString('en-IN')}
                      </p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        account.status === 'ACTIVE'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 text-red-600'
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
              <h3 className="font-bold text-gray-800 dark:text-white">
                📋 Recent Transactions
              </h3>
              <Link to="/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all →
              </Link>
            </div>

            {recentTx.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No transactions yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentTx.map(tx => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: '/deposit', icon: '💰', label: 'Deposit', color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
              { to: '/withdraw', icon: '💸', label: 'Withdraw', color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
              { to: '/transfer', icon: '🔄', label: 'Transfer', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
              { to: '/transactions', icon: '📋', label: 'History', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
            ].map(action => (
              <Link key={action.to} to={action.to}
                className={`${action.color} p-4 rounded-xl text-center hover:scale-105 transition-all`}>
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="text-sm font-bold">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}