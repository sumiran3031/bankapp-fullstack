import { useState, useEffect } from 'react'
import { accountApi, transactionApi } from '../api/apiClient'
import Navbar from '../components/Navbar'

export default function Deposit() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({ accountNumber: '', amount: '', description: 'Cash Deposit' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    accountApi.getMyAccounts().then(res => {
      const active = res.data.filter(a => a.status === 'ACTIVE')
      setAccounts(active)
      if (active.length > 0) setForm(f => ({ ...f, accountNumber: active[0].accountNumber }))
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await transactionApi.deposit({
        accountNumber: form.accountNumber,
        amount: Number(form.amount),
        description: form.description,
      })
      setResult(res.data)
      setForm(f => ({ ...f, amount: '', description: 'Cash Deposit' }))
    } catch (err) {
      setError(err.response?.data?.error || 'Deposit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Navbar title="Deposit Money" />

      <div className="p-6 max-w-xl">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white">Deposit Money</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add money to your account
              </p>
            </div>
          </div>

          {/* Success */}
          {result && (
            <div className="mb-5 p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl">
              <p className="font-bold text-green-700 dark:text-green-400 mb-2">
                ✅ Deposit Successful!
              </p>
              <div className="space-y-1 text-sm text-green-600 dark:text-green-400">
                <p>Amount: ₹{Number(result.amount).toLocaleString('en-IN')}</p>
                <p>New Balance: ₹{Number(result.balanceAfter).toLocaleString('en-IN')}</p>
                <p className="text-xs opacity-70">TXN: {result.transactionId}</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
              <p className="text-red-600 dark:text-red-400 font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Select Account</label>
              <select value={form.accountNumber}
                onChange={e => setForm({ ...form, accountNumber: e.target.value })}
                className="input" required>
                <option value="">Choose account...</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber} — {acc.accountType} — ₹{Number(acc.balance).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Amount (₹)</label>
              <input
                type="number"
                min="1"
                max="1000000"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter amount"
                required
                className="input"
              />
            </div>

            <div>
              <label className="label">Description</label>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Cash Deposit"
                className="input"
              />
            </div>

            {/* Quick amounts */}
            <div>
              <p className="label">Quick Amount</p>
              <div className="flex gap-2 flex-wrap">
                {[1000, 5000, 10000, 25000, 50000].map(amt => (
                  <button key={amt} type="button"
                    onClick={() => setForm(f => ({ ...f, amount: amt.toString() }))}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      Number(form.amount) === amt
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-400'
                    }`}>
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-success w-full py-3">
              {loading ? '⏳ Processing...' : '💰 Deposit Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}