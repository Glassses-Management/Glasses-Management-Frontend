# Order Flow Plan

Goal: give staff a real backend-driven "Create Order" page, and give logged-in
customers a way to order products themselves based on the prescription from
their eye exam.

Backend contract (API_DOCUMENT.md §10.1):

    POST /api/orders
    {
      "customer_id": 5,
      "items": [{ "product_id": 3, "quantity": 2, "len_type": "...",
                  "len_coating": "...", "len_index": "1.60", "len_price": 40.0 }]
    }

- Creates order with status PENDING, order_date today, total = sum((sale_price + len_price) * quantity); deducts stock.
- 400 on insufficient stock. Response includes the new order id.
- POST /orders ignores prescription_id, notes, request_type (only the customer /api/requests flow sets those).

Own customer id is resolved as: user?.customer_id ?? user?.id (Pattern used in ProfilePage, MyAccountPage, MyAppointmentPage).

## A. Admin Create Order (real backend)

1. src/pages/orders/OrderCreate.jsx — full rewrite
   - Drop mock imports (mockCustomers.json, mockInventory.json).
   - Load customers, products, inventory in one mount effect (inner async fn, data?.content ?? []).
   - Remove the Prescription Selection section (backend can't persist it here).
   - Keep customer search/select, multi-row line items (product, qty, lens type/coating/index),
     plus optional per-row Lens Price.
   - Submit payload via createOrder from @/api/orderApi; toast + navigate to /dashboard/orders on success;
     surface backend 400 messages (insufficient stock, field errors).
   - Restyle with shared Button/Select/Input/Card, dark-mode classes, max-w-5xl, submitting state.
   - Lint: no synchronous setState in effects.

2. Split per AGENTS.md (files under 150 lines)
   - New src/components/order/CustomerPicker.jsx (search + pick/change customer)
   - New src/components/order/OrderLineItems.jsx (table, add/remove rows, stock badge from inventory)

3. src/pages/orders/OrderList.jsx — add New Order button (+Plus -> /dashboard/orders/new) in the header.

## B. Customer places their own real order (Option B)

4. New src/pages/public/OrderNowPage.jsx (public branding: HomeHeader/HomeFooter, cream/serif)
   - Resolve own customerId via useAuth().getUser() -> user?.customer_id ?? user?.id.
   - Fetch prescriptions via getPrescriptionsByCustomer(customerId); show selectable read-only
     reference cards (the prescription from the eye exam).
   - Fetch real products; pick items + qty + lens options; live totals.
   - Submit POST /api/orders with own customer_id; success toast -> navigate to /account.
   - Requires login (redirect to /login if no token).

5. Route in src/App.jsx (public area) + entry link in MyAccountPage.jsx ("Order Glasses" CTA).

## C. Verify
- npm run build (and lint if configured).
- No new npm packages.