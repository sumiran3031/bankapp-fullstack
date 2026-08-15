import { useState, useEffect } from 'react'
import { accountApi, transactionApi } from '../api/apiClient'
import Navbar from '../components/Navbar'

export default function Transfer() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: '',
    description: 'Fund Transfer'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    accountApi.getMyAccounts().then(res => {
      const active = res.data.filter(a => a.status === 'ACTIVE')
      setAccounts(active)
      if (active.length > 0) {
        setForm(f => ({ ...f, fromAccountNumber: active[0].accountNumber }))
      }
    })
  }, [])

  const fromAccount = accounts.find(a => a.accountNumber === form.fromAccountNumber)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.fromAccountNumber === form.toAccountNumber) {
      setError('Cannot transfer to same account')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await transactionApi.transfer({
        fromAccountNumber: form.fromAccountNumber,
        toAccountNumber: form.toAccountNumber,
        amount: Number(form.amount),
        description: form.description,
      })
      setResult(res.data)
      setForm(f => ({ ...f, amount: '', toAccountNumber: '', description: 'Fund Transfer' }))
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Navbar title="Fund Transfer" />

      <div className="p-6 max-w-xl">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl">
              🔄
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white">Fund Transfer</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transfer money between accounts
              </p>
            </div>
          </div>

          {/* Success */}
          {result && (
            <div className="mb-5 p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl">
              <p className="font-bold text-green-700 dark:text-green-400 mb-2">
                ✅ Transfer Successful!
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Amount Sent</p>
                  <p className="font-bold text-red-600">
                    -₹{Number(result.debit?.amount).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Your Balance</p>
                  <p className="font-bold text-green-600">
                    ₹{Number(result.debit?.balanceAfter).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
              <p className="text-red-600 dark:text-red-400 font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">From Account</label>
              <select value={form.fromAccountNumber}
                onChange={e => setForm({ ...form, fromAccountNumber: e.target.value })}
                className="input" required>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber} — ₹{Number(acc.balance).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
              {fromAccount && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Available: ₹{Number(fromAccount.balance).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <div>
              <label className="label">To Account Number</label>
              <input
                value={form.toAccountNumber}
                onChange={e => setForm({ ...form, toAccountNumber: e.target.value })}
                placeholder="e.g. BANK0001234567"
                required
                className="input font-mono"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Enter recipient's account number
              </p>
            </div>

            <div>
              <label className="label">Amount (₹)</label>
              <input type="number" min="1"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter amount"
                required className="input"
              />
            </div>

            <div>
              <label className="label">Description</label>
              <input value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="input" />
            </div>

            {/* Warning */}
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700 rounded-xl">
              <p className="text-xs text-yellow-700 dark:text-yellow-400 font-semibold">
                ⚠️ Please verify the account number before transferring. Transfers cannot be reversed.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? '⏳ Processing...' : '🔄 Transfer Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}