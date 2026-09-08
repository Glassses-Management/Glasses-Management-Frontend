import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/hook/UseAuth'

import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

import DashboardPage from '@/pages/DashboardPage'

import ProductListPage from '@/pages/products/ProductListPage'
import ProductDetailPage from '@/pages/products/ProductDetailPage'

import CustomerList from '@/pages/customers/CustomerList'
import CustomerDetail from '@/pages/customers/CustomerDetail'

import InventoryList from '@/pages/inventory/InventoryList'

import OrderList from '@/pages/orders/OrderList'
import OrderDetail from '@/pages/orders/OrderDetail'
import OrderCreate from '@/pages/orders/OrderCreate'

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
  customers: 'customers',
  inventory: 'inventory',
  orders: 'orders',
}


function resolveActiveRoute(pathname) {
  const segment = pathname
    .replace('/dashboard', '')
    .replace(/^\//, '')
    .split('/')[0]

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
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Products */}
          <Route
            path="products"
            element={<ProductListPage onNavigate={handleNavigate} />}
          />
          <Route
            path="products/:id"
            element={<ProductDetailPage />}
          />

          {/* Customers */}
          <Route
            path="customers"
            element={<CustomerList onNavigate={handleNavigate} />}
          />
          <Route
            path="customers/:id"
            element={<CustomerDetail onNavigate={handleNavigate} />}
          />

          {/* Inventory */}
          <Route
            path="inventory"
            element={<InventoryList />}
          />

          {/* Orders */}
          <Route
            path="orders"
            element={<OrderList />}
          />
          <Route
            path="orders/new"
            element={<OrderCreate />}
          />
          <Route
            path="orders/:id"
            element={<OrderDetail />}
          />

          {/* Unknown dashboard page */}
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

            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected dashboard */}
            <Route
              path="/dashboard/*"
              element={<DashboardRoutes />}
            />

            {/* 404 */}
            <Route
              path="*"
              element={<NotFound />}
            />

          </Routes>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}


export default App