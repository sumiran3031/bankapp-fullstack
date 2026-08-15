export default function TransactionItem({ transaction }) {
  const isCredit = transaction.type === 'DEPOSIT' || transaction.type === 'TRANSFER_IN'

  const typeConfig = {
    DEPOSIT: { icon: '⬇️', label: 'Deposit', color: 'text-green-600 dark:text-green-400' },
    WITHDRAWAL: { icon: '⬆️', label: 'Withdrawal', color: 'text-red-600 dark:text-red-400' },
    TRANSFER_IN: { icon: '📥', label: 'Transfer In', color: 'text-green-600 dark:text-green-400' },
    TRANSFER_OUT: { icon: '📤', label: 'Transfer Out', color: 'text-red-600 dark:text-red-400' },
  }

  const config = typeConfig[transaction.type] || { icon: '💳', label: transaction.type, color: 'text-gray-600' }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors rounded-xl">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
        isCredit ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
      }`}>
        {config.icon}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 dark:text-white text-sm">{config.label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {transaction.description}
          {transaction.referenceAccountNumber && ` • Ref: ${transaction.referenceAccountNumber}`}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {formatDate(transaction.createdAt)}
        </p>
      </div>

      {/* Amount + Balance */}
      <div className="text-right flex-shrink-0">
        <p className={`font-bold text-sm ${config.color}`}>
          {isCredit ? '+' : '-'} ₹{Number(transaction.amount).toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Bal: ₹{Number(transaction.balanceAfter).toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">
          {transaction.transactionId}
        </p>
      </div>
    </div>
  )
}