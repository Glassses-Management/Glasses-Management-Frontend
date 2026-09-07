import { useLocation, useNavigate, Routes, Route } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import NotFound from '@/pages/public/NotFound'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import CustomerList from '@/pages/customers/CustomerList'
import CustomerDetail from '@/pages/customers/CustomerDetail'
import InventoryList from '@/pages/inventory/InventoryList'
import OrderList from '@/pages/orders/OrderList'
import OrderDetail from '@/pages/orders/OrderDetail'
import OrderCreate from '@/pages/orders/OrderCreate'
import { AuthProvider } from '@/context/AuthContext.jsx'
import { ToastProvider } from '@/context/ToastContext.jsx'

// Map each sidebar key to its URL path so navigation and active styling stay in sync.
const NAV_PATH = {
  dashboard: '/',
  customers: '/customers',
  products: '/products',
  inventory: '/inventory',
  orders: '/orders',
  appointments: '/appointments',
  prescriptions: '/prescriptions',
  requests: '/requests',
  users: '/users',
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  // Derive the active sidebar key from the first URL segment.
  const activeRoute = Object.keys(NAV_PATH).find(
    (key) => location.pathname === NAV_PATH[key],
  ) ?? 'dashboard'

  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardLayout activeRoute={activeRoute} onNavigate={(key) => navigate(NAV_PATH[key])}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<OrderCreate />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            {/* "*" matches any path that didn't match a route above */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
