import { useAuth } from '../context/AuthContext'

export default function Navbar({ title }) {
  const { user } = useAuth()

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">
          {user?.fullName}
        </span>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
          {user?.fullName?.[0] || 'U'}
        </div>
      </div>
    </div>
  )
}