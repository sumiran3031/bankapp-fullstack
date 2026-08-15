import { useState, useEffect } from 'react'
import { accountApi } from '../api/apiClient'
import Navbar from '../components/Navbar'

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ accountType: 'SAVINGS' })
  const [formLoading, setFormLoading] = useState(false)

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const res = await accountApi.getMyAccounts()
      setAccounts(res.data)
      setError(null)
    } catch (err) {
      setError('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAccounts() }, [])

  const showMsg = (msg, type = 'success') => {
    if (type === 'success') setSuccess(msg)
    else setError(msg)
    setTimeout(() => { setSuccess(null); setError(null) }, 3000)
  }

  const handleOpenAccount = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      await accountApi.openAccount(form)
      showMsg('✅ Account opened successfully!')
      setShowForm(false)
      fetchAccounts()
    } catch (err) {
      showMsg(err.response?.data?.error || 'Failed to open account', 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleClose = async (accountNumber) => {
    if (!window.confirm('Close this account? Make sure balance is zero.')) return
    try {
      await accountApi.closeAccount(accountNumber)
      showMsg('✅ Account closed successfully!')
      fetchAccounts()
    } catch (err) {
      showMsg(err.response?.data?.error || 'Failed to close account', 'error')
    }
  }

  const statusBadge = (status) => {
    const config = {
      ACTIVE: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      INACTIVE: 'bg-gray-100 dark:bg-gray-700 text-gray-500',
      BLOCKED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      CLOSED: 'bg-gray-100 dark:bg-gray-700 text-gray-400',
    }
    return config[status] || config.INACTIVE
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Navbar title="My Accounts" />

      <div className="p-6 space-y-6">
        {/* Notifications */}
        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl font-semibold text-green-700 dark:text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
            <p className="font-semibold text-red-700 dark:text-red-400">⚠️ {error}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} found
          </p>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? '✕ Cancel' : '+ Open Account'}
          </button>
        </div>

        {/* Open Account Form */}
        {showForm && (
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">🏦 Open New Account</h3>
            <form onSubmit={handleOpenAccount} className="space-y-4">
              <div>
                <label className="label">Account Type</label>
                <select value={form.accountType}
                  onChange={e => setForm({ ...form, accountType: e.target.value })}
                  className="input">
                  <option value="SAVINGS">💰 Savings Account</option>
                  <option value="CURRENT">🏢 Current Account</option>
                  <option value="FIXED_DEPOSIT">📈 Fixed Deposit</option>
                </select>
              </div>
              <div>
                <label className="label">Branch</label>
                <input value={form.branchName || 'Main Branch'}
                  onChange={e => setForm({ ...form, branchName: e.target.value })}
                  placeholder="Main Branch"
                  className="input" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={formLoading} className="btn-success">
                  {formLoading ? '⏳ Opening...' : '✅ Open Account'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Accounts List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🏦</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No Accounts Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Open your first account to get started
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              + Open Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map(account => (
              <div key={account.id} className="card overflow-hidden">
                {/* Card gradient header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-blue-200 text-xs font-semibold mb-1">
                        {account.accountType} ACCOUNT
                      </p>
                      <p className="font-mono text-lg font-bold tracking-wider">
                        {account.accountNumber}
                      </p>
                    </div>
                    <span className={`badge ${statusBadge(account.status)} text-xs`}>
                      {account.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-blue-200 text-xs">Available Balance</p>
                    <p className="text-3xl font-bold">
                      ₹{Number(account.balance).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Account Holder', value: account.accountHolderName },
                      { label: 'IFSC Code', value: account.ifscCode },
                      { label: 'Branch', value: account.branchName },
                      { label: 'Min Balance', value: `₹${account.minimumBalance}` },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {account.status === 'ACTIVE' && (
                    <button onClick={() => handleClose(account.accountNumber)}
                      className="btn-danger text-xs py-1.5 px-3">
                      Close Account
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}