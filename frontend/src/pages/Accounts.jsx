import { useState, useEffect } from 'react'
import { accountApi } from '../api/apiClient'
import Navbar from '../components/Navbar'

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ accountType: 'SAVINGS', branchName: 'Main Branch' })
  const [formLoading, setFormLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const res = await accountApi.getMyAccounts()
      setAccounts(res.data)
    } catch {
      showMsg('Failed to load accounts', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAccounts() }, [])

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const handleOpen = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      await accountApi.openAccount(form)
      showMsg('Account opened successfully!')
      setShowForm(false)
      fetchAccounts()
    } catch (err) {
      showMsg(err.response?.data?.error || 'Failed to open account', 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleClose = async (accountNumber) => {
    if (!window.confirm('Close this account? Balance must be zero.')) return
    try {
      await accountApi.closeAccount(accountNumber)
      showMsg('Account closed!')
      fetchAccounts()
    } catch (err) {
      showMsg(err.response?.data?.error || 'Failed to close', 'error')
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <Navbar title="My Accounts" />

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

        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">{accounts.length} account(s)</p>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
            {showForm ? 'Cancel' : '+ Open Account'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card p-5">
            <h3 className="font-bold text-gray-800 mb-4">Open New Account</h3>
            <form onSubmit={handleOpen} className="space-y-3">
              <div>
                <label className="label">Account Type</label>
                <select value={form.accountType}
                  onChange={e => setForm({ ...form, accountType: e.target.value })}
                  className="input">
                  <option value="SAVINGS">Savings Account</option>
                  <option value="CURRENT">Current Account</option>
                  <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                </select>
              </div>
              <div>
                <label className="label">Branch</label>
                <input value={form.branchName}
                  onChange={e => setForm({ ...form, branchName: e.target.value })}
                  className="input" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={formLoading} className="btn-primary text-sm">
                  {formLoading ? 'Opening...' : 'Open Account'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Accounts */}
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">🏦</p>
            <p className="font-semibold text-gray-700 mb-1">No accounts yet</p>
            <p className="text-gray-400 text-sm mb-4">Open your first account to get started</p>
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
              + Open Account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map(account => (
              <div key={account.id} className="card overflow-hidden">
                {/* Top bar */}
                <div className="bg-blue-600 px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-blue-100 text-xs font-medium mb-1">
                        {account.accountType}
                      </p>
                      <p className="text-white font-mono text-lg font-bold">
                        {account.accountNumber}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      account.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {account.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-blue-200 text-xs">Balance</p>
                    <p className="text-white text-2xl font-bold">
                      ₹{Number(account.balance).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Holder', value: account.accountHolderName },
                      { label: 'IFSC', value: account.ifscCode },
                      { label: 'Branch', value: account.branchName },
                      { label: 'Min Balance', value: `₹${account.minimumBalance}` },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-700">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {account.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleClose(account.accountNumber)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
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