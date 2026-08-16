import { useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../api/apiClient'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await apiClient.post('/api/auth/forgot-password', {
        email,
      })

      setMessage(
        response.data ||
          'If an account exists with this email, a reset link has been sent.'
      )
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data ||
          'Unable to process your request. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <span className="text-5xl">🏦</span>

          <h1 className="text-2xl font-bold text-gray-800 mt-3">
            BankApp Pro
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Reset your password
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">
                ✅ {message}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                ❌ {error}
              </p>
            </div>
          )}

          <p className="text-gray-600 text-sm mb-5">
            Enter your registered email address and we'll send you a
            password reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="label">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? '⏳ Sending...' : 'Send Reset Link'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Remember your password?{' '}

            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}