# Folder Structure

Generated from the actual `dev` branch tree. If you add or move a file, update this doc.

```
glasses-web/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/                 # Axios clients + one module per backend domain (16 files)
│   ├── components/          # Reusable UI, grouped by feature area
│   ├── context/             # React Context providers (.jsx) + their store logic (.js)
│   ├── hook/                # Custom hooks (PascalCase filenames)
│   ├── lib/                 # Third-party integration glue
│   ├── pages/               # Route-level pages, one folder per domain
│   ├── utils/               # Pure helpers (no React)
│   ├── App.jsx              # Providers, <BrowserRouter>, and ALL route definitions
│   ├── index.css            # Tailwind import + design tokens
│   └── main.jsx             # Vite entry point
├── .env                     # Local API base URL
├── .env.production
├── eslint.config.js
├── index.html
├── jsconfig.json            # Enables the `@/` path alias
├── vercel.json
├── vite.config.js
└── package.json
```

## src/api/ — HTTP layer

Two axios clients: `axiosInstance.js` (authed, JWT attached, 401 handling) and
`axiosPublic.js` (no auth, used by the storefront).

| File | Purpose |
|---|---|
| `axiosInstance.js` | Authed base client + interceptors |
| `axiosPublic.js` | Unauthenticated base client for public pages |
| `authApi.js` | login / register / me / Google identity |
| `analyticsApi.js` | Dashboard business metrics |
| `appointmentApi.js` | CRUD /appointments |
| `attachmentApi.js` | Upload + CRUD /attachments, by user / by product |
| `customerApi.js` | CRUD /customers (+ filters) |
| `favoriteApi.js` | Customer wishlist |
| `inventoryApi.js` | CRUD /inventories, low-stock |
| `orderApi.js` | CRUD /orders, status transitions |
| `orderItemApi.js` | CRUD /orderitem |
| `prescriptionApi.js` | CRUD /prescriptions, by customer / user |
| `productApi.js` | CRUD /products (+ filters), staff side |
| `publicProductApi.js` | Public catalog reads, no auth |
| `requestApi.js` | POST /requests (the QR-scan request flow) |
| `userApi.js` | CRUD /user |

## src/components/ — reusable UI

| Folder | Contents |
|---|---|
| `analytics/` | `BusinessChartPanel`, `BusinessKpiRow`, `BusinessTrendChart`, `TrendLegend`, `TrendTooltip`, `chartTheme.js` (Recharts styling) |
| `appointment/` | `AppointmentFilter`, `AppointmentStats`, `AppointmentTable`, `CreateAppointmentModal`, `ScheduleAppointmentModal`, `PendingScheduleQueue`, `PendingScheduleRow`, `PendingScheduleEmptyState` |
| `auth/` | `ProtectedRoute.jsx`, `RoleRoute.jsx`, `GoogleSignInButton.jsx` |
| `data/` | `DataTable.jsx`, `FilterBar.jsx`, `SearchBar.jsx` |
| `dev/` | `ErrorOverlay.jsx` |
| `form/` | `CustomerForm`, `ProductForm`, `InventoryForm`, `PrescriptionForm`, `AppointmentFormPage`, `UserFormPage` |
| `inventory/` | `InventoryFilter`, `InventoryStats`, `InventoryTable` |
| `layout/` | `DashboardLayout.jsx` (Sidebar + Header + Outlet), `Sidebar.jsx`, `Header.jsx`, `Navbar.jsx` (public header) |
| `order/` | `OrderFilter`, `OrderStats`, `OrderTable`, `OrderLineItems`, `OrderItemsTable`, `CustomerPicker`, `PrescriptionPicker`, `orderLineItemOptions.js` |
| `prescription/` | `RefractionCard`, `AxisOrientationCard`, `SavedFrameCard` |
| `product/` | `ProductCard`, `ProductListRow`, `ProductTable`, `ProductStats`, `ProductImage`, `FavoriteButton`, `DeleteProductModal`, `badgeStyles.js`, `productImageUtils.js` |
| `request/` | `CustomerRequestModal`, `CustomerRequestSidebar`, `CustomerSearchSelect`, `RequestCard`, `RequestDetailsCard`, `RequestApprovalActions`, `RequestPrescriptionSection`, `RequestStepper`, `RequestTypePicker` |
| `ui/` | `Button`, `Input`, `Select`, `Field`, `Modal`, `Card`, `Badge`, `Spinner`, `Pagination`, `Avatar`, `StatsCard`, `DropdownMenu`, `ScrollToTop`, `AosSetup`, `ThemeToggle`, `ToastContainer`, `StoreMap`, `icons.jsx`, `badgeVariants.js`, `storeLocation.js` |
| `uploads/` | `AttachmentUploader.jsx` (used by product + user forms) |

Non-component logic lives in sibling `.js` files (`chartTheme`, `badgeStyles`,
`productImageUtils`, `orderLineItemOptions`, `badgeVariants`, `storeLocation`) so that
`.jsx` files export components only and Vite Fast Refresh stays happy.

## src/context/ — providers

Each context is split into a provider component and a plain store module.

| Provider | Store |
|---|---|
| `AuthContext.jsx` | `AuthContextStore.js` |
| `CartContext.jsx` | `CartContextStore.js` |
| `CustomerContext.jsx` | `CustomerContextStore.js` |
| `FavoritesContext.jsx` | `FavoritesContextStore.js` |
| `PrescriptionContext.jsx` | `PrescriptionContextStore.js` |
| `ThemeContext.jsx` | `ThemeContextStore.js` |
| `ToastContext.jsx` | `ToastContextStore.js` |

## src/hook/ — custom hooks (PascalCase)

`UseAuth`, `UseBusinessOverview`, `UseCart`, `UseCustomer`, `UseCustomerDetail`,
`UseCustomerOrders`, `UseDebounce`, `UseFavorites`, `UseOwnCustomerId`,
`UsePrescription`, `UseProductImages`, `UseScheduleTarget`, `UseTheme`,
`UseToast`, `UseUserAvatar`

## src/lib/

`googleIdentity.js` — Google Identity Services client bootstrap.

## src/pages/ — routes

| Folder | Pages |
|---|---|
| *(root)* | `DashboardPage.jsx` |
| `appointments/` | `AppointmentListPage`, `AppointmentDetailPage`, `MyAppointmentPage`, `OptometristCalendarPage` |
| `auth/` | `LoginPage`, `RegisterPage` + panel/card pieces, `RegisterData.js` |
| `customers/` | `CustomerList.jsx`, `CustomerDetail.jsx` + 12 sub-components, `customerDetailActivity/Data/Styles.js` |
| `dashboard/` | `BusinessOverviewCard`, `QuickDeskCard`, `RecentOrdersCard`, `StockAttentionCard`, `StatCard`, `StatusBar`, `businessOverviewData.js`, `businessOverviewRanges.js` |
| `inventory/` | `InventoryList.jsx` |
| `optometrist/` | `OptometristPage.jsx` |
| `orders/` | `OrderList.jsx`, `OrderDetail.jsx`, `OrderCreate.jsx` |
| `prescription/` | `PrescriptionList.jsx`, `PrescriptionDetail.jsx`, `BulkPrescriptionPage.jsx`, `BulkPrescriptionForm.jsx` |
| `products/` | `ProductListPage`, `ProductDetailPage`, `ProductCreatePage`, `ProductEditPage` |
| `profile/` | `ProfilePage` + edit modals, `MyRequestsSection` |
| `public/` | `Home`, `Catalog` pieces, `PublicProductList`, `PublicProductDetail`, `CartPage`, `FavoritesPage`, `About`, `Contact` pieces, `NotFound`, `CustomerRequestPage`, `CompleteProfilePage`, plus `about/` and `account/` sub-folders |
| `requests/` | `RequestListPage.jsx`, `RequestAddPage.jsx` |
| `staff/` | `StaffPage.jsx`, `ClinicianDashboardPage.jsx` + 4 clinic cards |
| `users/` | `UserListPage.jsx` |

## src/utils/ — pure helpers

| File | Purpose |
|---|---|
| `cn.js` | **Canonical** Tailwind class-name merger. Import this everywhere. |
| `FormatDate.js` | **Canonical** date formatting. |
| `format.js` | Thin compatibility wrappers over `FormatDate.js` (same fallback/option behaviour) |
| `FormatCurrency.js` | BigDecimal string → display |
| `Roles.js` | Role constants, `hasRole`, `ROLE_OPTIONS` |
| `OrderStatus.js` | Order status labels + allowed transitions |
| `InventoryStatus.js` | Inventory stock-state labels |
| `OrderAppointment.js` | Order/appointment status helpers |
| `RequestOrder.js` | Request → order helpers |
| `Validators.js` | Phone / email / required field validation |
| `avatar.js` | Avatar initials + image URL resolution |
| `upload.js` | File upload helpers |
| `postLogin.js` | Post-login redirect routing |

## Routing

There is **no `router.jsx`**. Every route, guard, and lazy import lives in
`src/App.jsx`. Auth/account/dashboard pages are code-split with `React.lazy`;
public storefront pages are imported eagerly so the first paint is not blocked.

Route order matters: `/appointments/:id/edit` is declared before `/appointments/:id`
so the more specific path wins.

## Conventions in this repo

`AGENTS.md` is the source of truth. Two deliberate deviations from it exist today:

- `src/index.css` holds the forest-green design tokens as CSS variables, not just
  the single `@import 'tailwindcss';` line. Components reference them via
  Tailwind utilities such as `bg-surface`, `text-primary`, `border-line`.
- The 150-line guidance is aspirational; a number of files exceed it.
