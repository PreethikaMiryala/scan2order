# Scan2Order Upgrade TODO

## Phase 0 — Socket + Orders foundation
- [x] Update `server/server.js` to initialize HTTP server + Socket.IO.
- [x] Add `server/routes/orderRoutes.js` and `server/controllers/orderController.js`.
- [x] Implement Supabase-backed orders CRUD:
  - [x] `POST /api/orders` (default status NEW; emit `new-order`).
  - [x] `GET /api/orders` (admin filtering by restaurant_id/table/status as needed).
  - [x] `PATCH /api/orders/:orderId/status` (emit `order-status-updated`).



## Phase 1 — Supabase schema
- [ ] Add SQL schema file for:
  - [ ] `orders` table with columns: id, restaurant_id, table_number, customer_name, items (jsonb), total_amount, special_instructions, status, created_at.
  - [ ] `restaurant_tables` (or existing equivalent) for QR mapping: restaurant_id + table_number.
  - [ ] RLS policies for customer/admin access.

## Phase 2 — QR Option A routing
- [ ] Implement customer menu endpoint to support `/menu/table/:tableNumber`:
  - [ ] Lookup table_number -> restaurant_id.
  - [ ] Fetch menu items for restaurant_id.
- [ ] Update QR generation in `client/src/services/qrService.js` to build `/menu/table/:tableNumber`.
- [ ] Update `client/src/pages/CustomerMenuPage.jsx` and routing in `client/src/App.jsx` to use `menu/table/:tableNumber`.
- [ ] Ensure `tableNumber` is stored in `CartContext` throughout checkout.

## Phase 3 — Cart + Checkout routes
- [ ] Cart UI: ensure add/remove/quantity + session persistence.
- [ ] Add navbar cart badge (uses `itemCount`).
- [ ] Create `/checkout` route + `client/src/pages/CheckoutPage.jsx`:
  - [ ] Table Number auto from QR.
  - [ ] Optional customer name.
  - [ ] Special instructions.
  - [ ] Order summary.
  - [ ] Place Order calls `POST /api/orders`.
- [ ] Update redirect to `/order-success/:orderId`.

## Phase 4 — Customer order tracking
- [ ] Update `client/src/pages/OrderSuccessPage.jsx`:
  - [ ] Read `orderId` from URL.
  - [ ] Fetch order from API.
  - [ ] Subscribe via Socket.IO for live status updates.
- [ ] Replace all `Completed` references with `DELIVERED` in UI.

## Phase 5 — Admin orders page + status management
- [ ] Add sidebar item + route `/admin/orders`.
- [ ] Create `client/src/pages/AdminOrdersPage.jsx`:
  - [ ] Load initial orders for the logged-in restaurant.
  - [ ] Subscribe to `new-order` and `order-status-updated`.
  - [ ] Render order cards and status color mapping.
  - [ ] Buttons: Accept, Preparing, Ready, Delivered, Cancel (for NEW).
  - [ ] Calls `PATCH /api/orders/:orderId/status`.
- [ ] Update status workflow consistency everywhere.

## Phase 6 — Dashboard metrics (real Supabase)
- [ ] Update `client/src/pages/AdminDashboardPage.jsx` to call backend metrics endpoints.
- [ ] Implement backend metrics endpoints if missing (today’s orders, revenue today, pending/preparing/delivered counts).

## Phase 7 — Cleanup + verification
- [ ] Remove any obsolete localStorage order logic (OrderContext/service).
- [ ] Ensure no “Completed” status remains.
- [ ] Manual testing checklist:
  - [ ] Place order → admin receives instantly.
  - [ ] Admin transitions statuses → customer page updates instantly.
  - [ ] QR `/menu/table/:tableNumber` loads correct menu.
  - [ ] `/checkout` places order and redirects with correct orderId.

