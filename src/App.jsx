import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ProductListPage from '@/pages/products/ProductListPage'
import ProductDetailPage from '@/pages/products/ProductDetailPage'
import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import NotFound from '@/pages/public/NotFound'
import { AuthProvider } from '@/context/AuthContext.jsx'
import { ToastProvider } from '@/context/ToastContext.jsx'
import { ThemeProvider } from '@/context/ThemeContext.jsx'

const DASHBOARD_ROUTES = {
  '': 'dashboard',
  products: 'products',
}

function resolveActiveRoute(pathname) {
  const segment = pathname.replace('/dashboard', '').replace(/^\//, '').split('/')[0]
  return DASHBOARD_ROUTES[segment] || 'dashboard'
}

function DashboardRoutes() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavigate = (key) => {
    if (key === 'dashboard') {
      navigate('/dashboard')
    } else {
      navigate(`/dashboard/${key}`)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        activeRoute={resolveActiveRoute(pathname)}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      >
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductListPage onNavigate={handleNavigate} />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public pages — accessible with no login */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
            {/* "*" matches any other path still not matched */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App