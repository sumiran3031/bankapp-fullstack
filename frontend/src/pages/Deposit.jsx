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
      setForm(f => ({ ...f, amount: '' }))
    } catch (err) {
      setError(err.response?.data?.error || 'Deposit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <Navbar title="Deposit" />

      <div className="p-6 max-w-lg">
        <div className="card p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-5">
            💰 Deposit Money
          </h2>

          {result && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-semibold text-green-700 text-sm mb-1">Deposit Successful!</p>
              <p className="text-green-600 text-sm">Amount: ₹{Number(result.amount).toLocaleString('en-IN')}</p>
              <p className="text-green-600 text-sm">New Balance: ₹{Number(result.balanceAfter).toLocaleString('en-IN')}</p>
              <p className="text-green-500 text-xs mt-1">Ref: {result.transactionId}</p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Account</label>
              <select value={form.accountNumber}
                onChange={e => setForm({ ...form, accountNumber: e.target.value })}
                className="input" required>
                <option value="">Select account...</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber} — ₹{Number(acc.balance).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Amount (₹)</label>
              <input type="number" min="1" max="1000000"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00" required className="input" />
            </div>

            <div>
              <label className="label">Quick Select</label>
              <div className="flex gap-2 flex-wrap">
                {[1000, 5000, 10000, 25000, 50000].map(amt => (
                  <button key={amt} type="button"
                    onClick={() => setForm(f => ({ ...f, amount: amt.toString() }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      Number(form.amount) === amt
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    ₹{(amt/1000).toFixed(0)}K
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <input value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="input" />
            </div>

            <button type="submit" disabled={loading} className="btn-success w-full py-2.5">
              {loading ? 'Processing...' : 'Deposit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}