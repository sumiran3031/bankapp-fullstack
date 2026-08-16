import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Deposit from './pages/Deposit'
import Withdraw from './pages/Withdraw'
import Transfer from './pages/Transfer'
import Transactions from './pages/Transactions'
import Admin from './pages/Admin'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />


          {/* ================= PROTECTED ROUTES ================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <Layout>
                  <Accounts />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/deposit"
            element={
              <ProtectedRoute>
                <Layout>
                  <Deposit />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/withdraw"
            element={
              <ProtectedRoute>
                <Layout>
                  <Withdraw />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transfer"
            element={
              <ProtectedRoute>
                <Layout>
                  <Transfer />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* IMPORTANT: /transactions */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Layout>
                  <Transactions />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ================= ADMIN ROUTE ================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* ================= DEFAULT ROUTES ================= */}

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App