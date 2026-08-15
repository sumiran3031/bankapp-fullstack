import { useAuth } from '../context/AuthContext'

export default function Navbar({ title }) {
  const { user } = useAuth()

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {user?.fullName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {user?.fullName?.[0] || 'U'}
        </div>
      </div>
    </div>
  )
}