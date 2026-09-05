Optical Shop Management System - Backend API Documentation

This document describes the actual, working REST API surface of the Spring Boot
backend (spring_boot_project_api). It is written for a frontend (React / Vue)
developer and is derived directly from the source code (controllers, DTOs,
services, security config, and the global exception handler). Do not invent
endpoints or fields - if something you need is not listed here, it does not
exist in the backend.

---

1. Overview

A JWT-secured REST API managing customers, staff users, products, inventory,
prescriptions, appointments, order items, and orders. Files (avatars, product
images, lens/medical attachments) are stored on Cloudinary and linked to
users/products through junction tables (user_attachments and
product_attachments).

Item / Value
Base URL / http://localhost:8080 (configurable via APP_BASE_URL)
Default port / 8080
API prefix / /api
Auth scheme / Authorization: Bearer <JWT> (HTTP Bearer / OAuth2 resource server)
Swagger UI / http://localhost:8080/swagger-ui.html
OpenAPI JSON / http://localhost:8080/v3/api-docs
Data format / JSON (application/json), except file uploads (multipart/form-data)
Java / Stack / Java 21, Spring Boot 4.x, Spring Data JPA, MySQL, springdoc-openapi

---

2. Authentication and Security

2.1 Login

POST /api/auth/login - public (no token required).

Request body:

{
  "identifier": "admin@example.com",
  "password": "admin123"
}

- identifier (string, required): the user's email or phone.
- password (string, required): the plaintext password.

Validates credentials and, on success, returns a JWT access token plus a summary
of the signed-in user. On failure returns 401.

2.2 Customer self-registration

POST /api/customers/register - public (no token required).

Creates both a User (role CUSTOMER) and a linked Customer profile in one
transaction, then returns a JWT token so the new customer is logged in
immediately. See Customers (Section 6) for the body fields.

2.3 Current user ("me")

GET /api/auth/me - authenticated.

Returns the full profile of the user associated with the current token.

2.4 Token details

- Issued with claims: sub (email), uid (user id), role (e.g. ADMIN,
  STAFF, OPTOMETRIST, CUSTOMER), iat, exp.
- Signed with HS256 (HMAC with the app secret). Token lifetime defaults to
  60 minutes (JWT_EXPIRATION_MINUTES).
- The role claim becomes the Spring authority ROLE_<role> (e.g.
  ROLE_ADMIN). If the role claim is missing/null, the default authority is
  ROLE_STAFF.
- Roles: ADMIN, STAFF, OPTOMETRIST, CUSTOMER.

2.5 Common request header

Authorization: Bearer <access_token>

2.6 Protected / public routes

- Public (no token):
  - POST /api/auth/login
  - POST /api/customers/register
  - GET /api/qr/** (+ /request-form, /request-form/*, /qr-dashboard,
    /qr-dashboard/* - the HTML pages)
  - Swagger paths (/swagger-ui/**, /v3/api-docs/**, ...)
- Role-restricted:
  - POST /api/requests requires ROLE_CUSTOMER
  - UserController write endpoints (POST, POST /bulk, PUT, DELETE on
    /api/user) require ROLE_ADMIN
- All other /api/** endpoints require a valid token (any authenticated user).

2.7 CORS

Allowed origins: https://*.trycloudflare.com and http://localhost:*.
Allowed methods: GET, POST, PUT, DELETE, OPTIONS. Credentials allowed.

---

3. Common Response and Error Formats

3.1 Success formats

Most GET/PUT endpoints return the object directly. Create endpoints return
201 Created with the created object. DELETE endpoints return 204 No Content.

Response DTOs are annotated with @JsonInclude(NON_NULL) - null fields are
omitted from the JSON body.

3.2 Error format

Errors are returned as a JSON object. There are two shapes:

- Field validation error (400), one entry per invalid field:

{
  "name": "Name is required",
  "email": "Email must be a valid email address"
}

- Generic error (400, 401, 403, 404, 413) - a single error field:

{ "error": "Customer not found" }

3.3 HTTP status codes (summary)

Code / Meaning / Typical source
200 / OK / successful GET or POST /login
201 / Created / successful POST create endpoints
204 / No content / successful DELETE
400 / Bad request / validation failure, IllegalArgumentException, invalid file operation
401 / Unauthorized / missing or invalid token, bad credentials (Invalid email or password)
403 / Forbidden / authenticated but missing required role
404 / Not found / EntityNotFoundException (resource id not found)
413 / Payload too large / upload exceeds 10MB (MaxUploadSizeExceededException)

3.4 Global exception handler mapping

Exception / Status / Body
BadCredentialsException / 401 / {"error": "Invalid email or password"}
AccessDeniedException / 403 / {"error": "You do not have permission to perform this action"}
EntityNotFoundException / 404 / {"error": "<message>"}
IllegalArgumentException / EntityExistsException / 400 / {"error": "<message>"}
MethodArgumentNotValidException / 400 / { "<field>": "<message>", ... }
MaxUploadSizeExceededException / 413 / {"error": "File is too large"}
java.io.IOException / 400 / {"error": "File operation failed"}

Note: EntityExistsException (duplicate SKU in products, duplicate user) is
thrown but is not mapped explicitly in the handler, so it falls through to
the container default (typically 500). Treat duplicate-key conflicts as a
known backend gap (see Known Limitations, Section 19).

---

4. Pagination, Sorting and Filtering

Endpoints that take a Pageable return a Spring Data Page wrapper and accept
the standard query parameters. The global defaults are configured as
spring.data.web.pageable.default-page-size=20 and
spring.data.web.pageable.max-page-size=100.

4.1 Query parameters

Param / Type / Default / Notes
page / int (0-based) / 0 / zero-based page index
size / int / 20 / records per page (max 100)
sort / String / id,asc / property,(asc|desc); repeatable for multiple criteria

Sort examples: ?sort=name,asc, ?sort=createdAt,desc, ?sort=name,asc&sort=id,desc.

4.2 Sortable properties (enforced by backend)

Each Pageable endpoint restricts sortable properties; sorting by any other
property returns 400.

Endpoint / Allowed sort properties
GET /api/customers / id, name, createdAt, updatedAt
GET /api/products / id, sku, model, brand, category, sale_price, createdAt, updatedAt
GET /api/orders / id, order_date, status, created_at, updated_at
GET /api/attachments / id, fileName, fileType, fileSize, createdAt, updatedAt

4.3 Page response shape

{
  "content": [ ... ],
  "pageable": { "sort": { "sorted": true, "unsorted": false, "empty": false },
                "pageNumber": 0, "pageSize": 20, "offset": 0,
                "paged": true, "unpaged": false },
  "totalElements": 45,
  "totalPages": 3,
  "last": false,
  "first": true,
  "size": 20,
  "number": 0,
  "numberOfElements": 20,
  "sort": { "sorted": true, "unsorted": false, "empty": false },
  "empty": false
}

---

5. Auth Endpoints

Method / URL / Auth / Description
POST / /api/auth/login / Public / Login with email/phone + password, returns JWT
GET / /api/auth/me / Bearer / Current user full profile

POST /api/auth/login - 200 response:

{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_at": "2026-09-03T13:00:00Z",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}

GET /api/auth/me - 200 response: a UserResponse (see Users, Section 7).

---

6. Customers

Base path: /api/customers

6.1 POST /api/customers - Create customer

Auth: Bearer. Validates uniqueness of phone and email (400 on duplicate).

Request body (CustomerRequest):

{
  "name": "John Doe",
  "phone": "0123456789",
  "email": "john@example.com",
  "address": "123 Main St",
  "date_of_birth": "1990-01-01"
}

Validation: name required (max 20); phone required (max 15); email required
(max 100); address optional; date_of_birth optional (YYYY-MM-DD).

Response 201:

{
  "id": 5,
  "name": "John Doe",
  "phone": "0123456789",
  "email": "john@example.com",
  "address": "123 Main St",
  "date_of_birth": "1990-01-01",
  "created_at": "2026-09-03T10:00:00"
}

6.2 POST /api/customers/register - Customer self-registration

Auth: Public. Creates a CUSTOMER user + customer profile, returns a JWT
(AuthResponse). Body fields same shape as above plus password
(required, 6-100 chars):

{
  "name": "John Doe",
  "phone": "0123456789",
  "email": "john@example.com",
  "address": "123 Main St",
  "date_of_birth": "1990-01-01",
  "password": "secret123"
}

Response 201: AuthResponse (see Section 5).

6.3 POST /api/customers/bulk - Bulk create

Auth: Bearer. Body is an array of CustomerRequest. Each element must be valid
and unique; the whole array is saved. Response 201 is an array of
CustomerResponse.

6.4 GET /api/customers - Search customers (paged)

Auth: Bearer.

Query params:

Param / Type / Notes
name / String / case-insensitive, SQL LIKE %name%
phone / String / case-insensitive LIKE
email / String / case-insensitive LIKE
createdFrom / Date (YYYY-MM-DD) / created_at >=
createdTo / Date (YYYY-MM-DD) / created_at <=

Plus pagination params (page, size, sort). Returns a Page of CustomerResponse.

6.5 GET /api/customers/{id} - Get customer

Auth: Bearer. 404 if not found. Returns CustomerResponse (with updated_at).

6.6 PUT /api/customers/{id} - Update customer

Auth: Bearer. Body: CustomerRequest (all fields; phone/email uniqueness
checked excluding the current customer). Response: CustomerResponse with
updated_at (create-related fields may be null/omitted).

6.7 DELETE /api/customers/{id} - Delete customer

Auth: Bearer. 204 on success, 404 if not found.

Customer response fields:

id, name, phone, email, address, date_of_birth, created_at,
updated_at.

---

7. Users (Staff accounts)

Base path: /api/user

Backend note: GET endpoints are open to any authenticated user, but the
POST, PUT, and DELETE endpoints require ROLE_ADMIN
(@PreAuthorize("hasRole('ADMIN')")).

Method / URL / Auth
POST / /api/user / ADMIN
POST / /api/user/bulk / ADMIN
GET / /api/user / Bearer
GET / /api/user/{id} / Bearer
PUT / /api/user/{id} / ADMIN
DELETE / /api/user/{id} / ADMIN

Request body (UserRequest):

{
  "userName": "Staff One",
  "email": "staff@example.com",
  "password_hash": "secret123",
  "role": "STAFF"
}

- userName required, max 20.
- email required, valid email, max 100.
- password_hash required, 8-20 chars, must contain at least one letter and
  one number (regex (?=.*[A-Za-z])(?=.*\d).+$).
- role required; one of ADMIN, STAFF, OPTOMETRIST (service uppercases and
  trims; anything else -> 400 "Invalid role. Allowed values: ADMIN, STAFF, OPTOMETRIST").

Known limitation: the field is literally named password_hash, but you send
the plaintext password here - it is BCrypt-hashed by the backend. See
Section 13.

Responses (UserResponse):

id, name, email, role, created_at, updated_at. password_hash is
never returned.

- Create (POST) -> 201, includes created_at, updated_at omitted.
- Update (PUT) -> 200, includes updated_at, created_at omitted.
- Login summary (AuthResponse.user, /login) -> only id, name, email, role.

Duplicate email -> 400 "Email is already registered".

---

8. Products

Base path: /api/products

8.1 POST /api/products - Create (Auth: Bearer)

Request body (ProductRequest):

{
  "sku": "FRM-001",
  "model": "Wayfarer",
  "brand": "Ray-Ban",
  "color": "Black",
  "material": "Acetate",
  "size": "52",
  "cost_price": 50.00,
  "sale_price": 120.00,
  "supplier_name": "Acme Optical",
  "supplier_contact": "0123456789",
  "category": "Frames"
}

Validation: sku, model, brand, category required (max 50/100/50/50);
cost_price and sale_price required, > 0; others optional. Duplicate sku ->
400 (EntityExistsException, see known limitations).

Response 201 (ProductResponse): id, sku, model, brand, color,
material, size, cost_price, sale_price, supplier_name,
supplier_contact, category, created_at, updated_at.

8.2 POST /api/products/bulk - Bulk create (Auth: Bearer)

Body: array of ProductRequest. Response 201, array of ProductResponse.

8.3 GET /api/products - Search products (paged, Auth: Bearer)

Query params:

Param / Type / Notes
category / String / exact, case-insensitive match
brand / String / case-insensitive LIKE %brand%
model / String / case-insensitive LIKE %model%
search / String / case-insensitive LIKE across sku, model, and brand

Plus pagination (page, size, sort). Returns a Page of ProductResponse.

8.4 GET /api/products/{id} - Get (Auth: Bearer)

8.5 PUT /api/products/{id} - Update (Auth: Bearer)

Body: ProductRequest. Duplicate sku on another product -> 400. Response:
ProductResponse with updated_at.

8.6 DELETE /api/products/{id} - Delete (Auth: Bearer)

204.

---

9. Inventory

Base path: /api/inventories

Method / URL / Auth / Description
POST / /api/inventories / Bearer / Create
POST / /api/inventories/bulk / Bearer / Bulk create
GET / /api/inventories / Bearer / List all
GET / /api/inventories/low-stock / Bearer / Items with quantity <= reorder_threshold
GET / /api/inventories/{id} / Bearer / Get by id
PUT / /api/inventories/{id} / Bearer / Update
DELETE / /api/inventories/{id} / Bearer / Delete

Request body (InventoryRequest):

{
  "product_id": 3,
  "quantity": 25,
  "reorder_threshold": 5
}

Validation: product_id required, > 0; quantity required, >= 0;
reorder_threshold required, >= 0. One inventory row per product (a product
already in inventory -> 400 "This product already exists in the inventory").

Response (InventoryResponse):

id, product_id, quantity, reorder_threshold, last_restocked_at,
created_at, updated_at.

last_restocked_at is set to now on create, and on update only when the new
quantity increases relative to the old value.

---

10. Orders and Order Items

10.1 Orders

Base path: /api/orders

Method / URL / Auth / Description
POST / /api/orders / Bearer / Create order (deducts stock)
POST / /api/orders/bulk / Bearer / Bulk create
GET / /api/orders / Bearer / Search orders (paged)
GET / /api/orders/{id} / Bearer / Get by id
PUT / /api/orders/{id} / Bearer / Update (customer only)
POST / /api/orders/{id}/status / Bearer / Transition status
DELETE / /api/orders/{id} / Bearer / Delete (restores stock)

POST /api/orders - Create

Request body (OrderRequest):

{
  "customer_id": 5,
  "items": [
    {
      "product_id": 3,
      "quantity": 2,
      "len_type": "Single Vision",
      "len_coating": "Anti-Reflective",
      "len_index": "1.60",
      "len_price": 40.00
    }
  ]
}

- customer_id required (must exist -> else 404 "Customer not found").
- items required, at least one item.
- items[].product_id required (must exist -> 404).
- items[].quantity required, > 0.
- Stock check: if inventory.quantity < item.quantity -> 400
  "Insufficient stock for product <id>. Available: <n>, requested: <m>".
- On success the inventory quantity is deducted, the order is created with
  status PENDING, order_date = today, and total computed as
  sum (sale_price + len_price) x quantity.

Response 201 (OrderResponse) - see below.

GET /api/orders - Search (paged)

Query params:

Param / Type / Notes
customerId / Long / filter by customer id
status / String / case-insensitive exact match on status
dateFrom / Date / order_date >=
dateTo / Date / order_date <=

Plus pagination. Returns Page of OrderResponse.

POST /api/orders/{id}/status - Change status

Query param status (required). Valid statuses:
PENDING, CONFIRMED, IN_PROGRESS, READY_FOR_PICKUP, COMPLETED,
CANCELLED.

Allowed transitions (anything else -> 400):

PENDING            -> CONFIRMED or CANCELLED
CONFIRMED          -> IN_PROGRESS or CANCELLED
IN_PROGRESS        -> READY_FOR_PICKUP or CANCELLED
READY_FOR_PICKUP   -> COMPLETED or CANCELLED
COMPLETED / CANCELLED -> (terminal, no transitions)

DELETE /api/orders/{id} - Delete

Restores the deducted inventory quantity for each line item, then deletes. 204.

Order response fields:

id, customer_id, items (array of OrderItemResponse), total, status,
request_type, notes, payment_method, payment_status, order_date,
created_at, updated_at (only non-null).

Note: request_type, notes, user, and prescription are set only by the
customer request flow (see Section 12). The regular
POST /api/orders create does not set them, and payment_method /
payment_status are not populated by any current endpoint (see known
limitations).

10.2 OrderItems

Base path: /api/orderitem

Method / URL / Auth / Description
POST / /api/orderitem / Bearer / Create
POST / /api/orderitem/bulk / Bearer / Bulk create
GET / /api/orderitem?orderId=&productId= / Bearer / List all / by order / by product
GET / /api/orderitem/{id} / Bearer / Get by id
PUT / /api/orderitem/{id} / Bearer / Update
DELETE / /api/orderitem/{id} / Bearer / Delete

GET /api/orderitem:
- ?orderId=<id> returns items for that order.
- ?productId=<id> returns items for that product.
- with neither -> all items. (orderId takes precedence if both are passed.)

Request body (OrderItemRequest):

{
  "order_id": 1,
  "product_id": 3,
  "quantity": 2,
  "len_type": "Single Vision",
  "len_coating": "Anti-Reflective",
  "len_index": "1.60",
  "len_price": 40.00
}

Validation: order_id/product_id required; quantity required, > 0;
len_price optional, > 0.

Response (OrderItemResponse): id, order_id, product_id, quantity,
len_type, len_coating, len_index (String), len_price, unit_price,
total_price, created_at, updated_at (only non-null).

---

11. Prescriptions and Appointments

11.1 Prescriptions

Base path: /api/prescriptions

Method / URL / Auth / Description
POST / /api/prescriptions / Bearer / Create
POST / /api/prescriptions/bulk / Bearer / Bulk create
GET / /api/prescriptions / Bearer / List all
GET / /api/prescriptions/{id} / Bearer / Get by id
GET / /api/prescriptions/customer/{customerId} / Bearer / By customer
GET / /api/prescriptions/user/{userId} / Bearer / By user (optometrist)
PUT / /api/prescriptions/{id} / Bearer / Update
DELETE / /api/prescriptions/{id} / Bearer / Delete

Request body (PrescriptionRequest):

{
  "customer_id": 5,
  "user_id": 2,
  "od_sphere": -1.5,
  "od_cylinder": -0.25,
  "od_axis": 180,
  "os_sphere": -1.25,
  "os_cylinder": -0.5,
  "os_axis": 175,
  "near_addition": 1.0,
  "pupillary_distance": 62.0,
  "notes": "Progressive lenses",
  "prescription_date": "2026-09-03"
}

Validation: customer_id required; od_axis/os_axis between 0 and 180
(inclusive); pupillary_distance >= 0; notes max 255. All lens numeric fields
are optional floats.

Response (PrescriptionResponse): id, customer_id, user_id, od_sphere,
od_cylinder, od_axis, os_sphere, os_cylinder, os_axis,
near_addition, pupillary_distance, notes, prescription_date,
created_at, updated_at.

11.2 Appointments

Base path: /api/appointments

Method / URL / Auth / Description
POST / /api/appointments / Bearer / Create
POST / /api/appointments/bulk / Bearer / Bulk create
GET / /api/appointments / Bearer / List all
GET / /api/appointments/{id} / Bearer / Get by id
PUT / /api/appointments/{id} / Bearer / Update
DELETE / /api/appointments/{id} / Bearer / Delete

Request body (AppointmentRequest):

{
  "customer_id": 5,
  "optometrist_id": 2,
  "scheduled_at": "2026-09-15T10:30:00",
  "status": "SCHEDULED",
  "notes": "Regular check-up"
}

Validation: customer_id required; scheduled_at required (ISO local date-time);
status required, max 20 chars (free-form string, no enum enforced); notes
max 255; optometrist_id optional.

Known limitation: status has no allowed-value constraint in the backend, so
any non-blank string is accepted.

Response (AppointmentResponse): id, customer_id, optometrist_id,
scheduled_at, status, notes, created_at.

---

12. Customer Requests

Base path: /api/requests

Method / URL / Auth / Description
POST / /api/requests / ROLE_CUSTOMER / Submit an exam or product request

This is how a logged-in customer requests an eye exam or a product purchase. The
customer's uid is read from the JWT (must be present, or 400
"Invalid token: missing user id"). The customer must already have a linked
Customer profile (else 404 "Customer profile not found").

Request body (CustomerRequestRequest):

{
  "type": "exam",
  "notes": "Need new reading glasses",
  "prescriptionId": 12
}

- type (string, required): exam or product (case-insensitive). Anything else
  -> 400 "Request type must be 'exam' or 'product'".
- notes (string, optional, max 1000).
- prescriptionId (Long, optional): if provided, the prescription must exist
  and belong to the requesting customer (else 404).

Behavior: creates an Order with status = "PENDING_REVIEW", the customer
linked, the user (requesting customer's user account) linked, the optional
prescription linked, request_type set, notes set, and order_date = today.

Response 201 is an OrderResponse (see Section 10.1).

---

13. Attachments and Cloudinary

13.1 Model

Attachment is an independent entity with no product_id/user_id
columns. Links are stored in two junction tables:

- user_attachments (user <-> attachment)
- product_attachments (product <-> attachment)

An attachment can be linked to either a user or a product (not both at
once, and one is required when uploading).

13.2 Attachments

Base path: /api/attachments

Method / URL / Auth / Description
POST / /api/attachments / Bearer / Create record (no file)
POST / /api/attachments/bulk / Bearer / Bulk create records
POST / /api/attachments/upload / Bearer / Upload file to Cloudinary (+ link to user/product)
GET / /api/attachments/by-user/{userId} / Bearer / Attachments linked to a user
GET / /api/attachments/by-product/{productId} / Bearer / Attachments linked to a product
GET / /api/attachments / Bearer / Search (paged)
GET / /api/attachments/{id} / Bearer / Get by id
PUT / /api/attachments/{id} / Bearer / Update record
DELETE / /api/attachments/{id} / Bearer / Delete record + physical file

POST /api/attachments/upload - Upload to Cloudinary

Content-Type: multipart/form-data. Form fields:

Field / Type / Required
file / file / Yes (non-empty)
userId / Long / Exactly one of userId / productId
productId / Long / Exactly one of userId / productId

Rules:
- Exactly one owner must be present - both or neither -> 400
  "Exactly one owner must be provided: provide either userId or productId (not both, not neither)".
- The referenced user/product must exist (else 404).
- File uploads are limited to 10MB (413 "File is too large" if exceeded).
- On success the file is uploaded to Cloudinary, an Attachment row is created,
  and a junction row is inserted linking it to the user or product.

Response 201 (AttachmentResponse):

{
  "id": 9,
  "fileName": "avatar.jpg",
  "fileType": "image/jpeg",
  "filePath": "https://res.cloudinary.com/...",
  "fileSize": 102400,
  "created_at": "2026-09-03T10:00:00"
}

GET /api/attachments - Search (paged)

Query params: fileName (LIKE), fileType (LIKE) + pagination.
Returns Page of AttachmentResponse.

DELETE /api/attachments/{id} - Delete

Deletes the junction records (user_attachments, product_attachments), the
physical file from Cloudinary, and the Attachment row. 204.

POST /api/attachments (JSON) and PUT /api/attachments/{id} only manage the
metadata record (fileName, fileType, filePath, fileSize) - they do not
touch Cloudinary or create/update junction links.

AttachmentRequest (JSON body): fileName (required, max 255), fileType
(max 100), filePath (max 500), fileSize (Long).

13.3 User attachment links

Base path: /api (note: not /api/attachments)

Method / URL / Auth / Description
POST / /api/users/{userId}/attachments/{attachmentId} / Bearer / Link existing attachment to user
GET / /api/users/{userId}/attachments / Bearer / Junction rows for a user
GET / /api/user-attachments/{id} / Bearer / Junction row by id
DELETE / /api/user-attachments/{id} / Bearer / Delete junction row

UserAttachmentResponse: id, userId, attachmentId, created_at.
Deleting a junction row does not delete the attachment or the file.

13.4 Product attachment links

Base path: /api

Method / URL / Auth / Description
POST / /api/products/{productId}/attachments/{attachmentId} / Bearer / Link existing attachment to product
GET / /api/products/{productId}/attachments / Bearer / Junction rows for a product
GET / /api/product-attachments/{id} / Bearer / Junction row by id
DELETE / /api/product-attachments/{id} / Bearer / Delete junction row

ProductAttachmentResponse: id, productId, attachmentId, created_at.

These junction endpoints do not validate link uniqueness in the backend's
public surface, and GET .../attachments on both links returns junction rows
rather than the attachment metadata. For attachment metadata of a user/product,
prefer the getByUserId/getByProductId endpoints on /api/attachments.

---

14. QR Code and Pages

These power the customer "request-form" flow (e.g. printing a QR code to place in
the store). These endpoints are public (GET).

Method / URL / Produces / Description
GET / /api/qr/request / image/png / Dynamically generated QR encoding the request-form URL
GET / /api/qr/current / image/png / Pre-generated QR PNG (if a tunnel QR file is configured), else falls back to /api/qr/request
GET / /api/qr/tunnel-url / application/json / Returns the resolved tunnel/base URL for the request form
GET / /request-form / text/html / The customer request-form HTML page
GET / /qr-dashboard / text/html / A QR dashboard HTML page

GET /api/qr/tunnel-url - 200 response:

{
  "tunnelUrl": "https://xxxx.trycloudflare.com",
  "qrUrl": "https://xxxx.trycloudflare.com/request-form",
  "source": "cloudflare-tunnel"
}

source is "cloudflare-tunnel" when a tunnel URL file is configured, otherwise
"app-base-url".

---

15. Cloudinary

- Provider: Cloudinary (image/file hosting).
- Configuration (via env, see application.properties):
  CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_FOLDER (default "attachments").
- Flow: POST /api/attachments/upload uploads the file, stores the returned URL
  in Attachment.filePath, and records ownership through a junction table.
- DELETE /api/attachments/{id} removes the physical file from Cloudinary.
- Max upload size: 10MB (server-wide, spring.servlet.multipart.max-file-size).

---

16. Swagger / OpenAPI

- UI: http://localhost:8080/swagger-ui.html
- Docs JSON: http://localhost:8080/v3/api-docs
- Fully public (no auth required): /swagger-ui/**, /swagger-ui.html,
  /v3/api-docs, /v3/api-docs/**, /swagger-resources/**, /webjars/**.
- A global bearerAuth security scheme is defined - add the JWT via the
  "Authorize" button to try authenticated endpoints.
- The Pageable parameters are fleshed out automatically (page, size, sort).
  Note the Swagger sort help text is generic ("Allowed properties: id, name,
  createdAt, updatedAt.") and does not reflect each endpoint's real allowed
  sort set - rely on the tables in Section 4.2.

---

17. Frontend Integration Examples

17.1 Login and store the token

const res = await fetch("http://localhost:8080/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ identifier: "admin@example.com", password: "admin123" }),
});
const data = await res.json();
localStorage.setItem("token", data.access_token);

17.2 Authenticated request (React)

async function searchProducts(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`http://localhost:8080/api/products?${qs}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json(); // Page of ProductResponse
}

17.3 Create an order (React)

await fetch("http://localhost:8080/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    customer_id: 5,
    items: [{ product_id: 3, quantity: 2, len_price: 40.0 }],
  }),
});

17.4 Upload an attachment (Vue, axios)

const form = new FormData();
form.append("file", fileInput.files[0]);
form.append("userId", "2");
// or form.append("productId", "3");

const { data } = await axios.post("/api/attachments/upload", form, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
});

17.5 Handle errors

const res = await fetch(url, opts);
if (!res.ok) {
  const body = await res.json();
  // body is either { error: "..." } or { <field>: "message", ... } for 400 validation
}

---

18. Environment / Configuration (relevant to base URL and limits)

Env var / Default / Purpose
APP_BASE_URL / http://localhost:8080 / Base URL used for QR generation / request-form
APP_TUNNEL_URL_FILE / (empty) / Path to file holding the Cloudflare tunnel URL
APP_TUNNEL_QR_FILE / (empty) / Path to a pre-generated tunnel QR PNG
JWT_SECRET / (required) / HMAC secret (base64) used to sign/verify JWTs
JWT_EXPIRATION_MINUTES / 60 / Access token lifetime in minutes
CLOUDINARY_* / (required for uploads) / Cloudinary credentials
ADMIN_EMAIL / ADMIN_PASSWORD / (empty) / Seeded admin account on startup

---

19. Known Limitations

These reflect the current backend code and should be considered before relying on
them in a frontend:

1. EntityExistsException -> 500. Duplicate product SKU, duplicate
   customer/User email+phone, etc. are reported inconsistently. Catch the
   non-ok status and show a generic message.

2. password_hash naming. UserRequest uses the field name
   password_hash, but the value sent is the plaintext password (it is
   BCrypt-hashed server-side).

3. Appointment status is free-form (no enum validation) - backend accepts
   any non-blank string.

4. No paginated list for several resources. GET /api/user, inventory,
   prescriptions, appointments, and orderitem return plain (unpaged) arrays.
   Only customers, products, orders, and attachments support Pageable.

5. Order payment fields not populated. OrderResponse.payment_method and
   payment_status exist in the DTO but no current endpoint sets them; they are
   omitted (null) from responses.

6. OrderService.update is partial. PUT /api/orders/{id} only updates the
   linked customer (and updated_at); it does not touch items, totals, or stock.
   Use DELETE + POST for destructive changes.

7. Attachment junction endpoints don't de-duplicate and their
   GET .../attachments return junction rows rather than attachment metadata.

8. GET /api/attachments search omits getAll - a GET /api/attachments
   without filters returns a paged result (the search method), not the
   getAll list (that method is unused by the controller).

9. Attachment upload requires exactly one owner (userId XOR productId);
   a standalone attachment with no owner cannot be created via upload.
