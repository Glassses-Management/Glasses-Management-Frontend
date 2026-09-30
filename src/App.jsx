import { lazy, Suspense, useCallback } from 'react'
import { Routes, Route, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/hook/UseAuth'
import { ROLES } from '@/utils/Roles'
import Spinner from '@/components/ui/Spinner'

// The public storefront is loaded eagerly: it is the landing page, so its
// chunks are needed immediately and code-splitting them would only add a
// waterfall on first paint.
import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import PublicProductList from '@/pages/public/PublicProductList'
import PublicProductDetail from '@/pages/public/PublicProductDetail'
import CartPage from '@/pages/public/CartPage'
import NotFound from '@/pages/public/NotFound'

// Everything behind a sign-in boundary is lazy. A visitor browsing frames was
// previously forced to download the whole staff dashboard, which is the bulk of
// the bundle.
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const PatientAccountPage = lazy(() => import('@/pages/public/account/PatientAccountPage'))
const FavoritesPage = lazy(() => import('@/pages/public/FavoritesPage'))
const CompleteProfilePage = lazy(() => import('@/pages/public/CompleteProfilePage'))
const CustomerRequestPage = lazy(() => import('@/pages/public/CustomerRequestPage'))

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))

const ProductListPage = lazy(() => import('@/pages/products/ProductListPage'))
const ProductDetailPage = lazy(() => import('@/pages/products/ProductDetailPage'))
const ProductCreatePage = lazy(() => import('@/pages/products/ProductCreatePage'))
const ProductEditPage = lazy(() => import('@/pages/products/ProductEditPage'))

const CustomerList = lazy(() => import('@/pages/customers/CustomerList'))
const CustomerDetail = lazy(() => import('@/pages/customers/CustomerDetail'))
const CustomerForm = lazy(() => import('@/components/form/CustomerForm'))
const PrescriptionList = lazy(() => import('@/pages/prescription/PrescriptionList'))
const BulkPrescriptionPage = lazy(() => import('@/pages/prescription/BulkPrescriptionPage'))
const PrescriptionForm = lazy(() => import('@/components/form/PrescriptionForm'))
const PrescriptionDetail = lazy(() => import('@/pages/prescription/PrescriptionDetail'))
const InventoryList = lazy(() => import('@/pages/inventory/InventoryList'))
const InventoryForm = lazy(() => import('@/components/form/InventoryForm'))

const OrderList = lazy(() => import('@/pages/orders/OrderList'))
const OrderDetail = lazy(() => import('@/pages/orders/OrderDetail'))
const OrderCreate = lazy(() => import('@/pages/orders/OrderCreate'))

const AppointmentListPage = lazy(() => import('@/pages/appointments/AppointmentListPage'))
const AppointmentDetailPage = lazy(() => import('@/pages/appointments/AppointmentDetailPage'))
const AppointmentFormPage = lazy(() => import('@/components/form/AppointmentFormPage'))
const OptometristCalendarPage = lazy(() => import('@/pages/appointments/OptometristCalendarPage'))
const MyAppointmentPage = lazy(() => import('@/pages/appointments/MyAppointmentPage'))

const UserListPage = lazy(() => import('@/pages/users/UserListPage'))
const UserFormPage = lazy(() => import('@/components/form/UserFormPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))

const RequestListPage = lazy(() => import('@/pages/requests/RequestListPage'))
const RequestAddPage = lazy(() => import('@/pages/requests/RequestAddPage'))
const StaffPage = lazy(() => import('@/pages/staff/StaffPage'))
const ClinicianDashboardPage = lazy(() => import('@/pages/staff/ClinicianDashboardPage'))
const OptometristPage = lazy(() => import('@/pages/optometrist/OptometristPage'))

// Eager: the shell wraps every dashboard route, so it is needed the moment the
// guard lets anyone through.
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RoleRoute from '@/components/auth/RoleRoute'

import { AuthProvider } from '@/context/AuthContext.jsx'
import { CartProvider } from '@/context/CartContext.jsx'
import { CustomerProvider } from '@/context/CustomerContext.jsx'
import { PrescriptionProvider } from '@/context/PrescriptionContext.jsx'
import { ToastProvider } from '@/context/ToastContext.jsx'
import { ThemeProvider } from '@/context/ThemeContext.jsx'
import { FavoritesProvider } from '@/context/FavoritesContext.jsx'
import AosSetup from '@/components/ui/AosSetup'
import ScrollToTop from '@/components/ui/ScrollToTop'


// Maps the first URL segment under /dashboard onto the sidebar's active key.
const DASHBOARD_ROUTES = {
  '': 'dashboard',
  products: 'products',
  customers: 'customers',
  inventory: 'inventory',
  orders: 'orders',
  appointments: 'appointments',
  prescriptions: 'prescriptions',
  requests: 'requests',
  'my-appointments': 'my-appointments',
  users: 'users',
  profile: 'profile',
  staff: 'staff',
  clinician: 'clinician',
  optometrist: 'optometrist',
}


function resolveActiveRoute(pathname) {
  const segment = pathname
    .replace('/dashboard', '')
    .replace(/^\//, '')
    .split('/')[0]

  return DASHBOARD_ROUTES[segment] || 'dashboard'
}


// Placeholder while a lazy page chunk downloads. Matches the full-height
// centering the route guards use so the layout does not jump.
function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" color="gray" />
    </div>
  )
}


function DashboardRoutes() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // useCallback matters here: this is handed to pages as the `onNavigate` prop
  // and listed in their effect dependency arrays, so a new identity each render
  // would re-trigger their data fetches.
  const handleNavigate = useCallback((key) => {
    if (key === 'dashboard') {
      navigate('/dashboard')
    } else if (key === 'profile') {
      // The profile UI is the public account page, not a dashboard route.
      navigate('/account')
    } else {
      navigate(`/dashboard/${key}`)
    }
  }, [navigate])

  return (
    <DashboardLayout
      activeRoute={resolveActiveRoute(pathname)}
      onNavigate={handleNavigate}
      user={user}
      onLogout={handleLogout}
    >
      <Suspense fallback={<PageFallback />}>
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
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}>
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
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
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
          <Route path="prescriptions/bulk" element={<BulkPrescriptionPage />} />
          <Route path="prescriptions/new" element={<PrescriptionForm />} />
          <Route path="prescriptions/:id/edit" element={<PrescriptionForm />} />
          <Route path="prescriptions/:id" element={<PrescriptionDetail />} />

          <Route
            path="requests"
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
                <Outlet />
              </RoleRoute>
            }
          >
            <Route index element={<RequestListPage />} />
            <Route path="add" element={<RequestAddPage />} />
          </Route>

          <Route
            path="clinician"
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}>
                <Outlet />
              </RoleRoute>
            }
          >
            <Route index element={<ClinicianDashboardPage />} />
          </Route>
          <Route
            path="staff"
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
                <Outlet />
              </RoleRoute>
            }
          >
            <Route index element={<StaffPage />} />
          </Route>

          <Route
            path="optometrist"
            element={
              <RoleRoute allowedRoles={[ROLES.OPTOMETRIST]}>
                <Outlet />
              </RoleRoute>
            }
          >
            <Route index element={<OptometristPage />} />
          </Route>

          <Route path="appointments" element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}><AppointmentListPage /></RoleRoute>} />
          <Route path="appointments/calendar" element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}><OptometristCalendarPage /></RoleRoute>} />
          {/* `edit` is declared before the bare `:id` so the more specific path
              wins without relying on react-router's ranking. */}
          <Route path="appointments/:id/edit" element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}><AppointmentFormPage /></RoleRoute>} />
          <Route path="appointments/:id" element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]}><AppointmentDetailPage /></RoleRoute>} />
          <Route path="my-appointments" element={<RoleRoute allowedRoles={[ROLES.CUSTOMER]}><MyAppointmentPage /></RoleRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  )
}


function App() {
  return (
    <ThemeProvider>
      <AosSetup />
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <CustomerProvider>
              <PrescriptionProvider>
                {/* Inside AuthProvider: the wishlist loads only for a signed-in
                    customer and is cleared on sign-out. */}
                <FavoritesProvider>
                  <Suspense fallback={<PageFallback />}>
                    <Routes>

                      {/* Public pages */}
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/products" element={<PublicProductList />} />
                      <Route path="/products/:id" element={<PublicProductDetail />} />
                      <Route path="/explore" element={<PublicProductList />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route
                        path="/request"
                        element={
                          // POST /api/requests requires ROLE_CUSTOMER
                          // (API_DOCUMENT.md section 12), so staff must not reach
                          // this form - the submit would just fail with 403 and
                          // create nothing.
                          <RoleRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <CustomerRequestPage />
                          </RoleRoute>
                        }
                      />

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

                      {/* Wishlist. Customer-only because the backend scopes every
                          favourite to the signed-in customer's own record. */}
                      <Route
                        path="/favorites"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <FavoritesPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Google signups land here until the customer profile exists,
                          because Google cannot supply the required phone number. */}
                      <Route
                        path="/complete-profile"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <CompleteProfilePage />
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
                  </Suspense>
                </FavoritesProvider>
              </PrescriptionProvider>
            </CustomerProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}


export default App
