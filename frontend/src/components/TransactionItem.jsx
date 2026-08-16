export default function TransactionItem({ transaction }) {
  const isCredit = transaction.type === 'DEPOSIT' || transaction.type === 'TRANSFER_IN'

  const typeLabels = {
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal',
    TRANSFER_IN: 'Transfer In',
    TRANSFER_OUT: 'Transfer Out',
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
        isCredit ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {isCredit ? '↓' : '↑'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">
          {typeLabels[transaction.type]}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {transaction.description}
          {transaction.referenceAccountNumber && ` • ${transaction.referenceAccountNumber}`}
        </p>
        <p className="text-xs text-gray-300 mt-0.5">{formatDate(transaction.createdAt)}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
          {isCredit ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-400">
          ₹{Number(transaction.balanceAfter).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  )
}