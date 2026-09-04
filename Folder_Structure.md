glasses-web/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/                          # Axios instance + all endpoint functions
│   │   ├── axiosInstance.js          # Base axios, interceptors (JWT attach, 401 redirect)
│   │   ├── authApi.js                # POST /auth/login, POST /auth/register, GET /auth/me
│   │   ├── userApi.js                # CRUD /user
│   │   ├── customerApi.js            # CRUD /customers (+ filters)
│   │   ├── productApi.js             # CRUD /products (+ filters)
│   │   ├── inventoryApi.js           # CRUD /inventories, GET /low-stock
│   │   ├── orderApi.js               # CRUD /orders, POST /orders/{id}/status
│   │   ├── orderItemApi.js           # CRUD /order-items
│   │   ├── appointmentApi.js         # CRUD /appointments
│   │   ├── prescriptionApi.js        # CRUD /prescriptions, GET by customer/user
│   │   ├── attachmentApi.js          # Upload, CRUD /attachments, by-user/by-product
│   │   └── requestApi.js             # POST /requests (customer request flow, both branches)
│   │
│   ├── context/                      # React Context providers
│   │   ├── AuthContext.jsx           # JWT storage (localStorage), login/logout/register/getUser
│   │   └── ToastContext.jsx          # Global toast/notification state
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── useAuth.js                # Convenience wrapper around AuthContext
│   │   ├── useDebounce.js            # Debounce search input
│   │   ├── usePagination.js          # Page state management for paginated endpoints
│   │   └── useConfirmDialog.js       # Open/close delete confirmation state
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx           # Collapsible sidebar with role-based nav
│   │   │   ├── Header.jsx            # Top bar with user info + logout
│   │   │   └── DashboardLayout.jsx   # Wraps Sidebar + Header + main content area
│   │   │
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx    # Redirects to /login if not authenticated
│   │   │   └── RoleRoute.jsx         # Restricts route access by role (CUSTOMER/STAFF/ADMIN)
│   │   │
│   │   ├── ui/                       # Generic primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── data/                     # Data display
│   │   │   ├── DataTable.jsx         # Generic table with sort + pagination
│   │   │   ├── Pagination.jsx        # Page controls (prev/next/page size)
│   │   │   └── SearchBar.jsx         # Debounced search input
│   │   │
│   │   ├── uploads/
│   │   │   └── AttachmentUploader.jsx # Reusable file upload widget (used in Product + User forms)
│   │   │
│   │   └── forms/                    # Shared form components
│   │       ├── CustomerForm.jsx
│   │       ├── ProductForm.jsx       # Includes AttachmentUploader for product images
│   │       ├── OrderForm.jsx
│   │       ├── AppointmentForm.jsx
│   │       └── PrescriptionForm.jsx
│   │
│   ├── pages/                        # Route-level pages (one per backend domain)
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx          # Self-registration: creates User + Customer
│   │   ├── DashboardPage.jsx         # Summary cards + recent orders
│   │   │
│   │   ├── customers/
│   │   │   ├── CustomerListPage.jsx  # Paginated table, search, filters
│   │   │   └── CustomerDetailPage.jsx
│   │   │
│   │   ├── products/
│   │   │   ├── ProductListPage.jsx
│   │   │   └── ProductDetailPage.jsx # Includes attachment/image display
│   │   │
│   │   ├── inventory/
│   │   │   └── InventoryListPage.jsx # + low-stock badge/highlight
│   │   │
│   │   ├── orders/
│   │   │   ├── OrderListPage.jsx     # Paginated, filter by status/customer
│   │   │   ├── OrderDetailPage.jsx   # Status transitions, order items
│   │   │   └── OrderCreatePage.jsx   # Multi-item form (staff-side)
│   │   │
│   │   ├── appointments/
│   │   │   ├── AppointmentListPage.jsx
│   │   │   └── AppointmentFormPage.jsx
│   │   │
│   │   ├── prescriptions/
│   │   │   ├── PrescriptionListPage.jsx
│   │   │   └── PrescriptionDetailPage.jsx  # OD/OS values display
│   │   │
│   │   ├── requests/                 # Customer-facing QR scan flow
│   │   │   ├── RequestEntryPage.jsx      # Landing after QR scan; routes by prescription status
│   │   │   ├── EyeExamRequestPage.jsx    # No valid prescription → request eye exam
│   │   │   └── ProductRequestPage.jsx    # Has valid prescription → request product/order directly
│   │   │
│   │   └── users/                    # ADMIN only
│   │       ├── UserListPage.jsx
│   │       └── UserFormPage.jsx      # Includes AttachmentUploader for user profile pic
│   │
│   ├── utils/                        # Helper functions
│   │   ├── formatCurrency.js         # BigDecimal string → display
│   │   ├── formatDate.js             # ISO datetime → readable
│   │   ├── roles.js                  # Role labels, permission checks (CUSTOMER/STAFF/OPTOMETRIST/ADMIN)
│   │   ├── orderStatus.js            # Status labels, allowed transitions
│   │   └── validators.js             # Phone/email/required field validation
│   │
│   ├── router.jsx                    # React Router v6 route definitions incl. route guards
│   ├── App.jsx                       # Root: providers + router
│   ├── main.jsx                      # Vite entry point
│   └── index.css                     # Tailwind directives
│
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── .env.example