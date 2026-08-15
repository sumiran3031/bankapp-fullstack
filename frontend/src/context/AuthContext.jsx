import { createContext, useContext, useState } from 'react'
import { authApi } from '../api/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bankapp-user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authApi.login({ email, password })
      const { token, email: userEmail, fullName, role } = res.data
      const userData = { email: userEmail, fullName, role }

      localStorage.setItem('bankapp-token', token)
      localStorage.setItem('bankapp-user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Check credentials.'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const register = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authApi.register(data)
      const { token, email: userEmail, fullName, role } = res.data
      const userData = { email: userEmail, fullName, role }

      localStorage.setItem('bankapp-token', token)
      localStorage.setItem('bankapp-user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('bankapp-token')
    localStorage.removeItem('bankapp-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, loading, error, setError,
      login, register, logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ROLE_ADMIN',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)