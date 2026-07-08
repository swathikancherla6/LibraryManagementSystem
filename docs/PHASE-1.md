# Phase 1 — Planning Documentation

See the conversation/plan for full details. Summary:

## Functional Requirements
- Auth: register, login, JWT, roles (ADMIN, LIBRARIAN, MEMBER)
- Books: CRUD, search, inventory (total/available copies)
- Categories: CRUD
- Members: CRUD, activate/deactivate
- Borrows: issue, return, renew, overdue tracking
- Fines: auto-calculate, mark paid/waived
- Wishlist: add/remove/view (MEMBER)
- Dashboard: stats for staff, summary for members

## Database Tables
`roles`, `users`, `user_roles`, `categories`, `books`, `members`, `borrow_records`, `fines`, `wishlist_items`

## API Base
`/api/v1` — see README for endpoint list

## Implementation Status
All phases implemented in codebase:
- Phase 2: Backend (complete)
- Phase 3: Frontend (complete)
- Phase 4: Integration via Axios + CORS + Vite proxy
- Phase 5: Unit/context tests
- Phase 6: Docker Compose deployment
