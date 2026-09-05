# Task Division — 2 Developers

## Rules
- Each person works ONLY on their assigned files
- Create a feature branch per task: `git checkout -b feat/<task-name>`
- Pull from `dev` before starting: `git pull origin dev`
- Merge into `dev` when done, never push directly to `master`
- If you need a file the other person owns, ask first

---

## Person A — Infrastructure & Auth

Owns: `src/utils/`, `src/api/`, `src/context/`, `src/hook/`, `src/components/layout/`, `src/components/auth/`, `src/App.jsx`, `src/router.jsx`, auth pages

### Phase 1 — Foundation (do first)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 1 | Install axios | `npm install axios` | [ ] |
| 2 | Axios instance with interceptors | `src/api/axiosInstance.js` | [ ] |
| 3 | Validators | `src/utils/validators.js` | [ ] |
| 4 | Formatters | `src/utils/formatDate.js`, `formatCurrency.js` | [ ] |
| 5 | Role helpers | `src/utils/roles.js` | [ ] |
| 6 | Order status helpers | `src/utils/orderStatus.js` | [ ] |

### Phase 2 — Auth & Context
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 7 | AuthContext (login/logout/register/getUser, JWT in localStorage) | `src/context/AuthContext.jsx` | [ ] |
| 8 | ToastContext | `src/context/ToastContext.jsx` | [ ] |
| 9 | useAuth hook | `src/hooks/useAuth.js` | [ ] |
| 10 | useDebounce hook | `src/hooks/useDebounce.js` | [ ] |
| 11 | usePagination hook | `src/hooks/usePagination.js` | [ ] |
| 12 | useConfirmDialog hook | `src/hooks/useConfirmDialog.js` | [ ] |

### Phase 3 — Layout & Route Guards
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 13 | Sidebar (role-based nav, collapsible) | `src/components/layout/Sidebar.jsx` | [ ] |
| 14 | Header (user info + logout) | `src/components/layout/Header.jsx` | [ ] |
| 15 | DashboardLayout (wraps Sidebar + Header) | `src/components/layout/DashboardLayout.jsx` | [ ] |
| 16 | ProtectedRoute | `src/components/auth/ProtectedRoute.jsx` | [ ] |
| 17 | RoleRoute | `src/components/auth/RoleRoute.jsx` | [ ] |

### Phase 4 — API Layer
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 18 | Auth API | `src/api/authApi.js` | [ ] |
| 19 | Customer API | `src/api/customerApi.js` | [ ] |
| 20 | User API | `src/api/userApi.js` | [ ] |
| 21 | Product API | `src/api/productApi.js` | [ ] |
| 22 | Inventory API | `src/api/inventoryApi.js` | [ ] |
| 23 | Order API | `src/api/orderApi.js` | [ ] |
| 24 | OrderItem API | `src/api/orderItemApi.js` | [ ] |
| 25 | Appointment API | `src/api/appointmentApi.js` | [ ] |
| 26 | Prescription API | `src/api/prescriptionApi.js` | [ ] |
| 27 | Attachment API | `src/api/attachmentApi.js` | [ ] |
| 28 | Request API | `src/api/requestApi.js` | [ ] |

### Phase 5 — Router & Entry
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 29 | Route definitions with guards | `src/router.jsx` | [ ] |
| 30 | Update App.jsx (providers + router) | `src/App.jsx` | [ ] |

### Phase 6 — Auth Pages
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 31 | Login page | `src/pages/auth/LoginPage.jsx` | [ ] |
| 32 | Register page (self-registration) | `src/pages/auth/RegisterPage.jsx` | [ ] |

---

## Person B — UI Components & Feature Pages

Owns: `src/components/ui/`, `src/components/data/`, `src/components/forms/`, `src/components/uploads/`, all `src/pages/` (except auth pages)

### Phase 1 — UI Primitives (can start immediately)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 1 | Button | `src/components/ui/Button.jsx` | [ ] |
| 2 | Input | `src/components/ui/Input.jsx` | [ ] |
| 3 | Select | `src/components/ui/Select.jsx` | [ ] |
| 4 | Modal | `src/components/ui/Modal.jsx` | [ ] |
| 5 | ConfirmDialog | `src/components/ui/ConfirmDialog.jsx` | [ ] |
| 6 | Spinner | `src/components/ui/Spinner.jsx` | [ ] |
| 7 | Badge | `src/components/ui/Badge.jsx` | [ ] |
| 8 | Toast | `src/components/ui/Toast.jsx` | [ ] |

### Phase 2 — Data Components
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 9 | SearchBar (uses useDebounce from Person A) | `src/components/data/SearchBar.jsx` | [ ] |
| 10 | Pagination | `src/components/data/Pagination.jsx` | [ ] |
| 11 | DataTable (sort + pagination + search) | `src/components/data/DataTable.jsx` | [ ] |

### Phase 3 — Upload & Forms
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 12 | AttachmentUploader | `src/components/uploads/AttachmentUploader.jsx` | [ ] |
| 13 | CustomerForm | `src/components/forms/CustomerForm.jsx` | [ ] |
| 14 | ProductForm (uses AttachmentUploader) | `src/components/forms/ProductForm.jsx` | [ ] |
| 15 | OrderForm | `src/components/forms/OrderForm.jsx` | [ ] |
| 16 | AppointmentForm | `src/components/forms/AppointmentForm.jsx` | [ ] |
| 17 | PrescriptionForm | `src/components/forms/PrescriptionForm.jsx` | [ ] |

### Phase 4 — Dashboard & Public Pages
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 18 | Dashboard page (summary cards + recent orders) | `src/pages/DashboardPage.jsx` | [ ] |
| 19 | Home page (update for glasses app) | `src/pages/public/Home.jsx` | [ ] |
| 20 | About page | `src/pages/public/About.jsx` | [ ] |
| 21 | Contact page | `src/pages/public/Contact.jsx` | [ ] |
| 22 | NotFound page | `src/pages/public/NotFound.jsx` | [ ] |

### Phase 5 — Feature Pages
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 23 | Customer list page (paginated, search, filters) | `src/pages/customers/CustomerListPage.jsx` | [ ] |
| 24 | Customer detail page | `src/pages/customers/CustomerDetailPage.jsx` | [ ] |
| 25 | Product list page | `src/pages/products/ProductListPage.jsx` | [ ] |
| 26 | Product detail page (images/attachments) | `src/pages/products/ProductDetailPage.jsx` | [ ] |
| 27 | Inventory list page (low-stock badge) | `src/pages/inventory/InventoryListPage.jsx` | [ ] |
| 28 | Order list page (filter by status/customer) | `src/pages/orders/OrderListPage.jsx` | [ ] |
| 29 | Order detail page (status transitions) | `src/pages/orders/OrderDetailPage.jsx` | [ ] |
| 30 | Order create page (multi-item) | `src/pages/orders/OrderCreatePage.jsx` | [ ] |
| 31 | Appointment list page | `src/pages/appointments/AppointmentListPage.jsx` | [ ] |
| 32 | Appointment form page | `src/pages/appointments/AppointmentFormPage.jsx` | [ ] |
| 33 | Prescription list page | `src/pages/prescriptions/PrescriptionListPage.jsx` | [ ] |
| 34 | Prescription detail page (OD/OS values) | `src/pages/prescriptions/PrescriptionDetailPage.jsx` | [ ] |
| 35 | User list page (admin only) | `src/pages/users/UserListPage.jsx` | [ ] |
| 36 | User form page (profile pic upload) | `src/pages/users/UserFormPage.jsx` | [ ] |

### Phase 6 — Request Flow (QR scan pages)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 37 | Request entry page (landing after QR scan) | `src/pages/requests/RequestEntryPage.jsx` | [ ] |
| 38 | Eye exam request page | `src/pages/requests/EyeExamRequestPage.jsx` | [ ] |
| 39 | Product request page | `src/pages/requests/ProductRequestPage.jsx` | [ ] |

---

## Shared Files (coordinate before editing)
- `src/App.jsx` — Person A owns
- `src/router.jsx` — Person A owns
- `src/main.jsx` — rarely changes
- `src/index.css` — only Tailwind directives
- `package.json` — ask before installing new packages

## Git Workflow
```
git checkout dev && git pull origin dev
git checkout -b feat/my-task
# ... work ...
git add . && git commit -m "feat: describe what you did"
git push origin feat/my-task
# Merge on GitHub or locally:
git checkout dev && git merge feat/my-task
git push origin dev
```

## Completion Checklist
- [ ] Person A: All API files tested against backend
- [ ] Person B: All UI components match design
- [ ] Both: `npm run build` passes with no errors
- [ ] Both: `npm run lint` passes
- [ ] Together: Final integration test on `dev` branch
