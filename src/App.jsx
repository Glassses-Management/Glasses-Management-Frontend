import { Routes, Route, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/hook/UseAuth'
import { ROLES } from '@/utils/Roles'
import UserListPage from '@/pages/users/UserListPage'
import UserFormPage from '@/components/form/UserFormPage'
import ProfilePage from '@/pages/profile/ProfilePage'

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
import CustomerForm from '@/components/form/CustomerForm'
import PrescriptionList from '@/pages/prescription/PrescriptionList'
import PrescriptionForm from '@/components/form/PrescriptionForm'
import PrescriptionDetail from '@/pages/prescription/PrescriptionDetail'
import InventoryList from '@/pages/inventory/InventoryList'
import InventoryForm from '@/components/form/InventoryForm'

import OrderList from '@/pages/orders/OrderList'
import OrderDetail from '@/pages/orders/OrderDetail'
import OrderCreate from '@/pages/orders/OrderCreate'

import AppointmentListPage from '@/pages/appointments/AppointmentListPage'
import AppointmentDetailPage from '@/pages/appointments/AppointmentDetailPage'
import AppointmentFormPage from '@/components/form/AppointmentFormPage'
import OptometristCalendarPage from '@/pages/appointments/OptometristCalendarPage'
import MyAppointmentPage from '@/pages/appointments/MyAppointmentPage'

import RequestListPage from '@/pages/requests/RequestListPage'
import StaffPage from '@/pages/staff/StaffPage'
import OptometristPage from '@/pages/optometrist/OptometristPage'

import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import PublicProductList from '@/pages/public/PublicProductList'
import PublicProductDetail from '@/pages/public/PublicProductDetail'
import PatientAccountPage from '@/pages/public/account/PatientAccountPage'
import CartPage from '@/pages/public/CartPage'
import CustomerRequestPage from '@/pages/public/CustomerRequestPage'
import NotFound from '@/pages/public/NotFound'

import { AuthProvider } from '@/context/AuthContext.jsx'
import { CartProvider } from '@/context/CartContext.jsx'
import { CustomerProvider } from '@/context/CustomerContext.jsx'
import { PrescriptionProvider } from '@/context/PrescriptionContext.jsx'
import { ToastProvider } from '@/context/ToastContext.jsx'
import { ThemeProvider } from '@/context/ThemeContext.jsx'


const DASHBOARD_ROUTES = {
  '': 'dashboard',
  products: 'products',
  customers: 'customers',
  inventory: 'inventory',
  orders: 'orders',
  appointments: 'appointments',
  prescriptions: 'prescriptions',
  requests: 'requests',
  'my-requests': 'my-requests',
  'my-appointments': 'my-appointments',
  users: 'users',
  profile: 'profile',
  staff: 'staff',
  optometrist: 'optometrist',
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
    <DashboardLayout
      activeRoute={resolveActiveRoute(pathname)}
      onNavigate={handleNavigate}
      user={user}
      onLogout={handleLogout}
    >
      <Routes>
        <Route index element={<DashboardPage />} />

        <Route path="products" element={<ProductListPage onNavigate={handleNavigate} />} />
        <Route path="products/add" element={<ProductCreatePage />} />
        <Route path="products/edit/:id" element={<ProductEditPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        <Route path="customers" element={<CustomerList onNavigate={handleNavigate} />} />
        <Route path="customers/new" element={<CustomerForm />} />
        <Route path="customers/:id/edit" element={<CustomerForm />} />
        <Route path="customers/:id" element={<CustomerDetail />} />

        <Route
          path="inventory"
          element={
            <RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}>
              <Outlet />
            </RoleRoute>
          }
        >
          <Route index element={<InventoryList />} />
          <Route path="new" element={<InventoryForm />} />
          <Route path=":id/edit" element={<InventoryForm />} />
        </Route>

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

        <Route path="profile" element={<ProfilePage />} />

        <Route path="orders" element={<OrderList />} />
        <Route path="orders/new" element={<OrderCreate />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        <Route path="prescriptions" element={<PrescriptionList onNavigate={handleNavigate} />} />
        <Route path="prescriptions/new" element={<PrescriptionForm />} />
        <Route path="prescriptions/:id/edit" element={<PrescriptionForm />} />
        <Route path="prescriptions/:id" element={<PrescriptionDetail />} />

        <Route
          path="requests"
          element={<RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF]}><RequestListPage /></RoleRoute>}
        />

        <Route
          path="staff"
          element={
            <RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF]}>
              <Outlet />
            </RoleRoute>
          }
        >
          <Route index element={<StaffPage />} />
        </Route>

        <Route
          path="optometrist"
          element={
            <RoleRoute roles={[ROLES.OPTOMETRIST]}>
              <Outlet />
            </RoleRoute>
          }
        >
          <Route index element={<OptometristPage />} />
        </Route>

        <Route path="appointments" element={<RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF]}><AppointmentListPage /></RoleRoute>} />
        <Route path="appointments/calendar" element={<RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}><OptometristCalendarPage /></RoleRoute>} />
        <Route path="appointments/:id" element={<RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}><AppointmentDetailPage /></RoleRoute>} />
        <Route path="appointments/:id/edit" element={<RoleRoute roles={[ROLES.ADMIN, ROLES.STAFF]}><AppointmentFormPage /></RoleRoute>} />
        <Route path="my-appointments" element={<RoleRoute roles={[ROLES.CUSTOMER]}><MyAppointmentPage /></RoleRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  )
}


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <CustomerProvider>
              <PrescriptionProvider>
              <Routes>

                {/* Public pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<PublicProductList />} />
                <Route path="/products/:id" element={<PublicProductDetail />} />
                <Route path="/explore" element={<PublicProductList />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/request" element={<CustomerRequestPage />} />

                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Public account (logged-in customers & staff) */}
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <PatientAccountPage />
                    </ProtectedRoute>
                  }
                />

                {/* Staff/Admin/Optometrist dashboard */}
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}>
                      <DashboardRoutes />
                    </ProtectedRoute>
                  }
                />

                {/* Legacy customer request URLs now live inside the profile page */}
                <Route path="/my-requests" element={<Navigate to="/account" replace />} />
                <Route path="/my-requests/:id" element={<Navigate to="/account" replace />} />
                <Route path="/requests/*" element={<Navigate to="/account" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            </PrescriptionProvider>
          </CustomerProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}


export default App
