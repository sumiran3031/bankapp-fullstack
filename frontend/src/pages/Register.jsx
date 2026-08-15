import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    confirmPassword: '', phone: '', address: ''
  })
  const [validationErrors, setValidationErrors] = useState({})
  const { register, loading, error, setError } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (form.password.length < 6) errs.password = 'Min 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match"
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Invalid Indian phone number'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }
    setValidationErrors({})
    const { confirmPassword, ...data } = form
    const result = await register(data)
    if (result.success) navigate('/dashboard')
  }

  const fields = [
    { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Sumiran Paparkar', col: 2 },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', col: 1 },
    { key: 'phone', label: 'Phone', type: 'tel', placeholder: '9876543210', col: 1 },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••', col: 1 },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••', col: 1 },
    { key: 'address', label: 'Address (Optional)', type: 'text', placeholder: 'Your address', col: 2 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🏦</div>
          <h1 className="text-3xl font-bold text-white">BankApp Pro</h1>
          <p className="text-blue-200 text-sm mt-1">Create your account today</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">
            📝 Create Account
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {fields.map(field => (
                <div key={field.key} className={field.col === 2 ? 'col-span-2' : ''}>
                  <label className="label">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className={`input ${validationErrors[field.key] ? 'input-error' : ''}`}
                  />
                  {validationErrors[field.key] && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}