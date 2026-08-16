import { useState, useEffect } from 'react'
import { accountApi, transactionApi } from '../api/apiClient'
import Navbar from '../components/Navbar'

export default function Transfer() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({
    fromAccountNumber: '', toAccountNumber: '',
    amount: '', description: 'Fund Transfer'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    accountApi.getMyAccounts().then(res => {
      const active = res.data.filter(a => a.status === 'ACTIVE')
      setAccounts(active)
      if (active.length > 0) setForm(f => ({ ...f, fromAccountNumber: active[0].accountNumber }))
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
      setForm(f => ({ ...f, amount: '', toAccountNumber: '' }))
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <Navbar title="Transfer" />

      <div className="p-6 max-w-lg">
        <div className="card p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-5">
            🔄 Fund Transfer
          </h2>

          {result && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-semibold text-green-700 text-sm mb-1">Transfer Successful!</p>
              <p className="text-green-600 text-sm">
                Amount: ₹{Number(result.debit?.amount).toLocaleString('en-IN')}
              </p>
              <p className="text-green-600 text-sm">
                Your Balance: ₹{Number(result.debit?.balanceAfter).toLocaleString('en-IN')}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">❌ {error}</p>
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
                <p className="text-xs text-gray-400 mt-1">
                  Available: ₹{Number(fromAccount.balance).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <div>
              <label className="label">To Account Number</label>
              <input value={form.toAccountNumber}
                onChange={e => setForm({ ...form, toAccountNumber: e.target.value })}
                placeholder="BANK0001234567"
                required className="input font-mono" />
              <p className="text-xs text-gray-400 mt-1">
                Enter recipient's account number
              </p>
            </div>

            <div>
              <label className="label">Amount (₹)</label>
              <input type="number" min="1"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00" required className="input" />
            </div>

            <div>
              <label className="label">Description</label>
              <input value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="input" />
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-xs font-medium">
                ⚠️ Verify account number before transfer. This action cannot be reversed.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Processing...' : 'Transfer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}