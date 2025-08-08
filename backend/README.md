# Backend (Express + Sequelize)

Scripts:
- npm run dev — start dev server
- npm run start — start prod server
- npm run migrate — run migrations
- npm run seed — run seeds
- npm test — run tests

Setup:
1. cp .env.example .env and fill values
2. npm install
3. npm run migrate && npm run seed
4. npm run dev

Manual verification checklist:
- Admin can login (admin@example.com / Admin@123 from seed)
- Admin can create employee
- Admin can create menu and combo (with photo upload)
- Employee can login and create order; totals computed and order saved
- Expenses can be created and listed
- Inventory can be added/updated and adjusted; decrements on order is TODO
- Uploaded photos are accessible under /uploads