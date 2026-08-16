import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    confirmPassword: '', phone: '', address: ''
  })
  const [errors, setErrors] = useState({})
  const { register, loading, error, setError } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Required'
    if (!form.email.trim()) errs.email = 'Required'
    if (form.password.length < 6) errs.password = 'Min 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match"
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Invalid phone number'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    const { confirmPassword, ...data } = form
    const result = await register(data)
    if (result.success) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-4xl">🏦</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join BankApp Pro today</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name</label>
                <input value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Sumiran Paparkar" className={`input ${errors.fullName ? 'input-error' : ''}`} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" className={`input ${errors.email ? 'input-error' : ''}`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="label">Phone</label>
                <input value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210" className={`input ${errors.phone ? 'input-error' : ''}`} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 chars" className={`input ${errors.password ? 'input-error' : ''}`} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat password" className={`input ${errors.confirmPassword ? 'input-error' : ''}`} />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              <div className="col-span-2">
                <label className="label">Address (Optional)</label>
                <input value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Your address" className="input" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-2.5">
              {loading ? '⏳ Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}