import axios from 'axios'

// Public axios instance for endpoints that should work without a token,
// e.g. browsing the product catalog before login.
// It never attaches an Authorization header.
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Normalise errors so callers always get a usable message (no token to clear).
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default axiosPublic
