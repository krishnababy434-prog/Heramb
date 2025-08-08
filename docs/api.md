# API Documentation

Base URL: http://localhost:4000/api

Auth
- POST /auth/login — body: { email, password } → { token, user }
- POST /auth/register (Admin) — body: { name, email, password, role?, mobile? } → creates employee/admin
- GET /auth/me — returns current user

Admin
- GET /admin/employees — list employees
- POST /admin/employees — create employee
- PUT /admin/employees/:id — update
- DELETE /admin/employees/:id — delete

Menus
- GET /menus — list
- POST /menus (Admin) — multipart/form-data: name, price, description?, is_available?, photo
- PUT /menus/:id (Admin) — same fields
- DELETE /menus/:id (Admin)

Combos
- GET /combos — list (includes items)
- POST /combos (Admin) — multipart/form-data: name, price, items(JSON), photo
- PUT /combos/:id (Admin) — update; can send items(JSON) to replace
- DELETE /combos/:id (Admin)

Orders
- POST /orders — body: { customer_name, mobile?, items: [{ menu_id?, combo_id?, quantity, unit_price }] }
- GET /orders?from=&to=&employee_id=&mobile=&limit=&offset=

Expenses
- POST /expenses — body: { title, amount, note?, category? }
- GET /expenses?from=&to=&employee_id=&limit=&offset=

Inventory
- GET /inventory — list
- POST /inventory — { name, unit, quantity, threshold_alert? }
- PUT /inventory/:id — update
- POST /inventory/:id/adjust — { delta }

Uploads
- POST /uploads (Admin) — multipart file field "file" → { url }

Auth: Authorization: Bearer <token>
