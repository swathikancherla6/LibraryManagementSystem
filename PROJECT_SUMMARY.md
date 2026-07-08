# Library Management System — Final Project Summary

**Project Path:** `/Users/swaroop/Desktop/LibraryManagement`  
**Type:** Full-stack enterprise web application  
**Stack:** Spring Boot 3.3 (Java 21) + React 18 (Vite) + MySQL + Redux Toolkit + Material UI

---

## 1. How to Run

```bash
# Option A — Docker (recommended)
docker compose up --build

# Option B — Local
# 1. Start MySQL on port 3306, database: library_db
# 2. Backend
cd backend/library-management-api && mvn spring-boot:run
# 3. Frontend
cd frontend/library-management-ui && npm install && npm run dev
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:8080/api/v1 |
| Swagger  | N/A (REST JSON API) |

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@library.com | admin123 |
| Librarian | librarian@library.com | librarian123 |
| Member | member@library.com | member123 |

Additional seeded members: alice@library.com, bob@library.com, etc. (password: member123)

---

## 2. Implemented Features

### Authentication & Authorization
- JWT login/register
- Role-based access: ADMIN, LIBRARIAN, MEMBER
- Profile update page
- Admin user management (roles, active status)

### Dashboard
- Clickable stat cards (books, members, borrows, copies, overdue)
- Quick actions (Add Book, Add Member, Issue, Return)
- Recent borrow activity, recently added books, top borrowed, due today
- Recharts: books by category, monthly trends, member growth, borrow vs return
- Member summary dashboard
- Auto-refresh after mutations

### Books
- CRUD with soft delete
- Search: title, author, ISBN, publisher, category, availability
- Cover images, publisher field
- Detail page with borrow history
- Delete blocked when actively borrowed

### Members
- List with search, filter, pagination
- Member profile: borrows, fines, outstanding balance
- Activate/deactivate toggle

### Borrow Management
- Issue, return, renew (member)
- Overdue detection (hourly scheduler + API)
- Pending-fine block on new issues
- Auto dashboard/books refresh

### Fines
- Auto-calculation on overdue/return
- Pay (staff), waive (admin)
- Pending / paid / waived tabs

### Other
- Categories CRUD
- Member wishlist
- Dark mode
- Snackbar notifications
- 404 page, empty states, loading skeletons
- Sample data: 50+ books, 8 members, borrow history

---

## 3. Project Structure

```
LibraryManagement/
├── README.md
├── PROJECT_SUMMARY.md          ← this file
├── docker-compose.yml
├── pom.xml
├── docs/
├── backend/library-management-api/
│   └── src/main/java/com/library/management/
│       ├── config/               DataInitializer, Security, JWT, Scheduler
│       ├── controller/           9 REST controllers
│       ├── service/              Business logic + OverdueProcessor
│       ├── repository/           8 JPA repositories
│       ├── entity/               8 entities
│       ├── dto/                  Request/response DTOs
│       ├── mapper/               Manual mappers
│       ├── security/             JWT filter, ownership helpers
│       └── exception/            Global exception handler
└── frontend/library-management-ui/
    └── src/
        ├── api/                  Axios API modules
        ├── components/           Layout, common UI
        ├── hooks/                useAuth
        ├── pages/                Route pages
        ├── routes/               AppRoutes, ProtectedRoute
        ├── store/slices/         Redux slices
        ├── theme/                MUI theme + dark mode
        └── utils/                Constants, status colors
```

---

## 4. API Endpoints

Base: `http://localhost:8080/api/v1`

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | /auth/register | Public | Register |
| POST | /auth/login | Public | Login |
| GET/PUT | /auth/me | Auth | Profile |
| GET | /books | Auth | Search/list books |
| GET/POST/PUT/DELETE | /books/{id} | Auth/Staff | Book CRUD |
| GET/POST/PUT/DELETE | /categories | Auth/Staff | Categories |
| GET/POST/PUT/PATCH | /members | Staff | Members |
| POST | /borrows/issue | Staff | Issue book |
| POST | /borrows/{id}/return | Staff | Return |
| POST | /borrows/{id}/renew | Staff/Member | Renew |
| GET | /borrows, /borrows/overdue, /borrows/my | Role-based | Lists |
| GET | /borrows/member/{id}, /borrows/book/{id} | Staff | History |
| GET/PATCH | /fines | Role-based | Fines |
| GET | /dashboard/stats | Staff | Dashboard counts |
| GET | /dashboard/recent-borrows | Staff | Widget |
| GET | /dashboard/recent-books | Staff | Widget |
| GET | /dashboard/top-borrowed | Staff | Widget |
| GET | /dashboard/due-today | Staff | Widget |
| GET | /dashboard/statistics | Staff | Chart data |
| GET | /dashboard/member-summary | Member | Member dashboard |
| GET/PATCH | /users | Admin | User admin |
| GET/POST/DELETE | /wishlist | Member | Wishlist |

---

## 5. Database Schema

JPA auto-schema (`ddl-auto: update`). Main entities:

- **users** ↔ **roles** (M2M)
- **members** (1:1 users)
- **categories** → **books**
- **borrow_records** (member + book)
- **fines** (1:1 borrow_record)
- **wishlist_items**

Key fields on books: `total_copies`, `available_copies`, `publisher`, `cover_image_url`, `active`

---

## 6. Files Modified / Created (Completion Work)

### New Backend Files
- `OverdueProcessor.java`, `OverdueProcessorImpl.java`
- `OverdueScheduler.java`
- `BorrowSecurityHelper.java`, `FineSecurityHelper.java`
- `TopBookResponse.java`, `ChartDataPoint.java`, `StatisticsResponse.java`
- `BorrowFlowIntegrationTest.java`

### New Frontend Files
- `hooks/useAuth.js`
- `utils/statusColors.js`
- `store/slices/dashboardRefresh.js`, `themeSlice.js`, `notificationSlice.js`, `userSlice.js`
- `components/common/GlobalSnackbar.jsx`, `BookCover.jsx`, `DashboardCharts.jsx`, `EmptyState.jsx`
- `components/layout/AppThemeProvider.jsx`
- `pages/profile/ProfilePage.jsx`, `pages/users/UserListPage.jsx`, `pages/NotFoundPage.jsx`
- `pages/members/MemberDetailPage.jsx`
- `api/userApi.js`

### Key Modified Files
- All borrow/dashboard/book/fine slices and pages
- `DataInitializer.java` (50+ books, members, borrows)
- `DashboardServiceImpl`, `BorrowServiceImpl`, repositories

---

## 7. Testing

```bash
cd backend/library-management-api
mvn test -Dspring.profiles.active=test
```

- `LibraryManagementApplicationTests` — context load
- `FineCalculationTest` — fine math
- `BorrowFlowIntegrationTest` — issue/renew/return, publisher search

```bash
cd frontend/library-management-ui
npm install && npm run build
```

---

## 8. Environment Variables

| Variable | Description |
|----------|-------------|
| JWT_SECRET | JWT signing key (production) |
| SPRING_DATASOURCE_URL | MySQL JDBC URL |
| VITE_API_URL | Frontend API base (default: http://localhost:8080/api/v1) |

---

## 9. Architecture

```
React (MUI + Redux) ──axios/JWT──► Spring Boot REST API
                                        │
                                        ▼
                                   MySQL (JPA/Hibernate)
```

---

## 10. License

MIT — suitable for final-year engineering projects, portfolios, and interviews.
