import { useState, useEffect } from 'react'
import { accountApi, transactionApi } from '../api/apiClient'
import Navbar from '../components/Navbar'
import TransactionItem from '../components/TransactionItem'

export default function Transactions() {
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    accountApi.getMyAccounts().then(res => {
      setAccounts(res.data)
      if (res.data.length > 0) {
        setSelectedAccount(res.data[0].accountNumber)
      }
    })
  }, [])

  useEffect(() => {
    if (!selectedAccount) return
    setLoading(true)
    transactionApi.getHistory(selectedAccount)
      .then(res => setTransactions(res.data))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false))
  }, [selectedAccount])

  const filtered = transactions.filter(tx => {
    if (filter === 'all') return true
    if (filter === 'credit') return tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN'
    if (filter === 'debit') return tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER_OUT'
    return true
  })

  const totalCredit = transactions
    .filter(t => t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN')
    .reduce((s, t) => s + Number(t.amount), 0)

  const totalDebit = transactions
    .filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER_OUT')
    .reduce((s, t) => s + Number(t.amount), 0)

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Navbar title="Transaction History" />

      <div className="p-6 space-y-5">
        {/* Account selector */}
        <div className="card p-4 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-48">
            <label className="label text-xs">Select Account</label>
            <select value={selectedAccount}
              onChange={e => setSelectedAccount(e.target.value)}
              className="input text-sm">
              {accounts.map(acc => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} — {acc.accountType}
                </option>
              ))}
            </select>
          </div>

          {/* Filter */}
          <div>
            <label className="label text-xs">Filter</label>
            <div className="flex gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'credit', label: '📥 Credit' },
                { id: 'debit', label: '📤 Debit' },
              ].map(f => (
                <button key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    filter === f.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Transactions', value: transactions.length, color: 'text-gray-800 dark:text-white' },
            { label: 'Total Credit', value: `+₹${totalCredit.toLocaleString('en-IN')}`, color: 'text-green-600 dark:text-green-400' },
            { label: 'Total Debit', value: `-₹${totalDebit.toLocaleString('en-IN')}`, color: 'text-red-600 dark:text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Transactions list */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="font-bold text-gray-800 dark:text-white">
              Transactions ({filtered.length})
            </p>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No transactions found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(tx => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}