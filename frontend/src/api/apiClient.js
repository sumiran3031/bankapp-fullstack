import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ─── Request interceptor — attach JWT token ───────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bankapp-token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor — handle errors globally ────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bankapp-token')
      localStorage.removeItem('bankapp-user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// ─── Auth APIs ─────────────────────────────────────────────
export const authApi = {
  register: (data) =>
    apiClient.post('/api/auth/register', data),

  login: (data) =>
    apiClient.post('/api/auth/login', data),
}

// ─── Account APIs ──────────────────────────────────────────
export const accountApi = {
  openAccount: (data) =>
    apiClient.post('/api/accounts/open', data),

  getMyAccounts: () =>
    apiClient.get('/api/accounts/my'),

  getByNumber: (number) =>
    apiClient.get(`/api/accounts/${number}`),

  closeAccount: (number) =>
    apiClient.put(`/api/accounts/${number}/close`),
}

// ─── Transaction APIs ──────────────────────────────────────
export const transactionApi = {
  deposit: (data) =>
    apiClient.post('/api/transactions/deposit', data),

  withdraw: (data) =>
    apiClient.post('/api/transactions/withdraw', data),

  transfer: (data) =>
    apiClient.post('/api/transactions/transfer', data),

  getHistory: (accountNumber) =>
    apiClient.get(`/api/transactions/${accountNumber}`),

  getHistoryPaged: (accountNumber, page = 0, size = 10) =>
    apiClient.get(
      `/api/transactions/${accountNumber}/paged?page=${page}&size=${size}`
    ),
}

// ─── Admin APIs ────────────────────────────────────────────
export const adminApi = {
  getStats: () =>
    apiClient.get('/api/admin/stats'),

  getAllAccounts: () =>
    apiClient.get('/api/admin/accounts'),

  getAllUsers: () =>
    apiClient.get('/api/admin/users'),

  blockAccount: (number) =>
    apiClient.put(`/api/admin/accounts/${number}/block`),

  unblockAccount: (number) =>
    apiClient.put(`/api/admin/accounts/${number}/unblock`),
}

export default apiClient