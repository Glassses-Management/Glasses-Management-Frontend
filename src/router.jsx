import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import DashboardShell from '@/components/layout/DashboardShell'
import RoleRoute from '@/components/auth/RoleRoute'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import CustomerListPage from '@/pages/customers/CustomerListPage'
import CustomerDetailPage from '@/pages/customers/CustomerDetailPage'
import ProductListPage from '@/pages/products/ProductListPage'
import ProductDetailPage from '@/pages/products/ProductDetailPage'
import InventoryListPage from '@/pages/inventory/InventoryListPage'
import OrderListPage from '@/pages/orders/OrderListPage'
import OrderDetailPage from '@/pages/orders/OrderDetailPage'
import OrderCreatePage from '@/pages/orders/OrderCreatePage'
import AppointmentListPage from '@/pages/appointments/AppointmentListPage'
import AppointmentFormPage from '@/pages/appointments/AppointmentFormPage'
import PrescriptionListPage from '@/pages/prescriptions/PrescriptionListPage'
import PrescriptionDetailPage from '@/pages/prescriptions/PrescriptionDetailPage'
import UserListPage from '@/pages/users/UserListPage'
import UserFormPage from '@/pages/users/UserFormPage'
import RequestEntryPage from '@/pages/requests/RequestEntryPage'
import EyeExamRequestPage from '@/pages/requests/EyeExamRequestPage'
import ProductRequestPage from '@/pages/requests/ProductRequestPage'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import NotFound from '@/pages/public/NotFound'
import { ROLES } from '@/utils/Roles'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <DashboardShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'customers', element: <CustomerListPage /> },
      { path: 'customers/:id', element: <CustomerDetailPage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'inventory', element: <InventoryListPage /> },
      { path: 'orders', element: <OrderListPage /> },
      { path: 'orders/new', element: <OrderCreatePage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'appointments', element: <AppointmentListPage /> },
      { path: 'appointments/new', element: <AppointmentFormPage /> },
      { path: 'prescriptions', element: <PrescriptionListPage /> },
      { path: 'prescriptions/:id', element: <PrescriptionDetailPage /> },
      {
        path: 'users',
        element: (
          <RoleRoute roles={[ROLES.ADMIN]}>
            <Outlet />
          </RoleRoute>
        ),
        children: [
          { index: true, element: <UserListPage /> },
          { path: 'new', element: <UserFormPage /> },
        ],
      },
      { path: 'requests', element: <RequestEntryPage /> },
      { path: 'requests/exam', element: <EyeExamRequestPage /> },
      { path: 'requests/product', element: <ProductRequestPage /> },
    ],
  },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/home', element: <Navigate to="/" replace /> },
  { path: '*', element: <NotFound /> },
])

export default router