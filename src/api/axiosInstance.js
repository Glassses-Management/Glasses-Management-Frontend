import axios from 'axios'

// Single shared axios instance for the whole app.
// Base URL = backend host + /api prefix (see API_DOCUMENT.md).
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  // Abort requests that never get a response so UI state (e.g. auth "checking")
  // cannot hang forever on an unreachable backend.
  timeout: 15000,
})

// Endpoints that must be reachable while signed out.
//
// Sending an Authorization header here is actively harmful: Spring Security's
// bearer token filter authenticates before authorization is evaluated, so a
// stale or expired token left in localStorage makes the backend answer 401 for
// an endpoint that is permitAll(). The result is that signing in fails until
// the stale token is cleared.
const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/google']

// Request interceptor: attach the JWT to every outgoing request if present.
axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || ''
    const isPublicAuth = PUBLIC_AUTH_PATHS.some((path) => url.includes(path))
    const token = localStorage.getItem('token')
    if (token && !isPublicAuth) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.data && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: normalise errors so callers always get a usable message.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Notify AuthContext so the React state is cleared too (forces re-login).
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
