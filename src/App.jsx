import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/hook/UseAuth'
import { ROLES } from '@/utils/Roles'
import UserListPage from '@/pages/users/UserListPage'
import UserFormPage from '@/pages/users/UserFormPage'

import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RoleRoute from '@/components/auth/RoleRoute'

import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

import DashboardPage from '@/pages/DashboardPage'

import ProductListPage from '@/pages/products/ProductListPage'
import ProductDetailPage from '@/pages/products/ProductDetailPage'
import ProductCreatePage from '@/pages/products/ProductCreatePage'
import ProductEditPage from '@/pages/products/ProductEditPage'

import CustomerList from '@/pages/customers/CustomerList'
import CustomerDetail from '@/pages/customers/CustomerDetail'
import CustomerForm from '@/pages/customers/CustomerForm'
import InventoryList from '@/pages/inventory/InventoryList'

import OrderList from '@/pages/orders/OrderList'
import OrderDetail from '@/pages/orders/OrderDetail'
import OrderCreate from '@/pages/orders/OrderCreate'

import AppointmentListPage from '@/pages/appointments/AppointmentListPage'
import AppointmentDetailPage from '@/pages/appointments/AppointmentDetailPage'
import AppointmentFormPage from '@/pages/appointments/AppointmentFormPage'
import OptometristCalendarPage from '@/pages/appointments/OptometristCalendarPage'
import MyAppointmentPage from '@/pages/appointments/MyAppointmentPage'

import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import PublicProductList from '@/pages/public/PublicProductList'
import PublicProductDetail from '@/pages/public/PublicProductDetail'
import NotFound from '@/pages/public/NotFound'

import { AuthProvider } from '@/context/AuthContext.jsx'
import { CustomerProvider } from '@/context/CustomerContext.jsx'
import { ToastProvider } from '@/context/ToastContext.jsx'
import { ThemeProvider } from '@/context/ThemeContext.jsx'


const DASHBOARD_ROUTES = {
  '': 'dashboard',
  products: 'products',
  customers: 'customers',
  inventory: 'inventory',
  orders: 'orders',
  appointments: 'appointments',
  'my-appointments': 'my-appointments',
  users: 'users',
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
      <CustomerProvider>
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
              path="products/add"
              element={<ProductCreatePage />}
            />
            <Route
              path="products/edit/:id"
              element={<ProductEditPage />}
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
              path="customers/new"
              element={<CustomerForm />}
            />
            <Route
              path="customers/:id/edit"
              element={<CustomerForm />}
            />
            <Route
              path="customers/:id"
              element={<CustomerDetail />}
            />

             {/* Inventory */}
            <Route
              path="inventory"
              element={<InventoryList />}
            />

            {/* Users (Admin only) */}
            <Route
              path="users"
              element={
                <RoleRoute roles={[ROLES.ADMIN]}>
                  <Outlet />
                </RoleRoute>
              }
            >
              <Route index element={<UserListPage />} />
              <Route path="new" element={<UserFormPage />} />
            </Route>

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

            {/* Appointments */}
            <Route
              path="appointments"
              element={<RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF]}><AppointmentListPage /></RoleRoute>}
            />
            <Route
              path="appointments/calendar"
              element={<RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}><OptometristCalendarPage /></RoleRoute>}
            />
            <Route
              path="appointments/:id"
              element={<RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}><AppointmentDetailPage /></RoleRoute>}
            />
            <Route
              path="appointments/:id/edit"
              element={<RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF]}><AppointmentFormPage /></RoleRoute>}
            />
            <Route
              path="my-appointments"
              element={<RoleRoute roles={[ROLES.CUSTOMER]}><MyAppointmentPage /></RoleRoute>}
            />

            {/* Unknown dashboard page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </CustomerProvider>
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
            <Route path="/products" element={<PublicProductList />} />
            <Route path="/products/:id" element={<PublicProductDetail />} />

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