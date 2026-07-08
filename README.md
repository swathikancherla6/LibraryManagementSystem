# Library Management System

Full-stack enterprise Library Management System built with **Spring Boot 3** (Java 21) and **React** (Vite).

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Java 21, Spring Boot 3.3, Spring Security, JWT, JPA/Hibernate, MySQL, Maven, Lombok |
| Frontend | React 18, Vite, Redux Toolkit, React Router, Axios, MUI, Recharts |
| DevOps | Docker, Docker Compose |

## Features

- JWT authentication with role-based access (ADMIN, LIBRARIAN, MEMBER)
- Professional admin dashboard with Recharts, quick actions, widgets
- Book CRUD, search (title/author/ISBN/publisher), cover images, inventory tracking
- Category management
- Member management with profile page (borrows, fines)
- Issue, return, renew books with due dates
- Automatic overdue fine calculation + hourly scheduler
- Fine pay/waive, pending/paid tabs
- Member wishlist, dark mode, snackbar notifications
- Admin user management (roles, status)
- Profile update page
- Sample data: 50+ books, 8 members, borrow history
- Integration tests (H2)

See **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** for the full deliverable document.

## Project Structure

```
LibraryManagement/
├── backend/library-management-api/    # Spring Boot REST API
├── frontend/library-management-ui/    # React SPA
├── docs/                              # Phase 1 planning docs
└── docker-compose.yml                 # Full stack deployment
```

## Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 18+
- MySQL 8 (or use Docker Compose)

## Quick Start (Local)

### 1. Database

```bash
# Using Docker
docker run -d --name library-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=library_db \
  -p 3306:3306 mysql:8.0
```

Update `backend/library-management-api/src/main/resources/application-dev.yml` if your MySQL credentials differ.

### 2. Backend

```bash
cd backend/library-management-api
mvn spring-boot:run
```

API runs at `http://localhost:8080`

### 3. Frontend

```bash
cd frontend/library-management-ui
cp .env.example .env
npm install
npm run dev
```

UI runs at `http://localhost:5173`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@library.com | admin123 |
| Librarian | librarian@library.com | librarian123 |
| Member | member@library.com | member123 |

## API Base URL

```
http://localhost:8080/api/v1
```

All protected endpoints require: `Authorization: Bearer <jwt_token>`

## Docker Compose (Full Stack)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- MySQL: localhost:3306

## Running Tests

```bash
cd backend/library-management-api
mvn test -Dspring.profiles.active=test
```

Uses in-memory H2 database for tests.

## Architecture

```
Controller → Service Interface → Service Impl → Repository → Entity
                ↓
              DTO + Manual Mapper
                ↓
         Global Exception Handler
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| JWT_SECRET | (see application.yml) | JWT signing key (min 256 bits) |
| SPRING_DATASOURCE_URL | jdbc:mysql://localhost:3306/library_db | Database URL |
| VITE_API_URL | http://localhost:8080/api/v1 | Frontend API base URL |

## License

MIT — suitable for learning, portfolios, and interviews.
