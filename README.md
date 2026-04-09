# Test Plan — Trello REST API

## 1. Project Overview

**Objective:** To design and implement an automated API testing framework for the Trello REST API using Playwright and TypeScript, demonstrating best practices in test automation, resource management and documentation.

---

## 2. Scope

### In Scope

**Core Resources and Operations:**

| Resource    | Create | Read | Update | Delete |
|-------------|--------|------|--------|--------|
| Boards      | ✅     | ✅   | ✅     | ✅     |
| Lists       | ✅     | ✅   | ✅     | ➡️ Archive (close) instead of Delete |
| Cards       | ✅     | ✅   | ✅     | ✅     |
| Members     | ❌     | ✅   | ✅*    | ❌     |
| Labels      | ✅     | ✅   | ✅     | ✅     |
| Checklists  | ✅     | ✅   | ✅     | ✅     |

> \* `PUT /members/{id}` — Forge and OAuth2 apps cannot access this resource. See Known Risks.

**Validations:**
- Status codes
- Response body schema
- Data integrity
- Security headers

**Error Handling:**
- Negative scenarios (invalid IDs, unauthorized access)

### Out of Scope

- UI / Frontend testing
- Performance / Load testing
- Third-party Power-Up integrations
- Member assignment to Checklists

---

## 3. Test Environment & Tools

| Category          | Tool / Technology                          | Version     |
|-------------------|--------------------------------------------|-------------|
| Language          | TypeScript                                 | 6.0.2       |
| Framework         | Playwright                                 | 1.58.2      |
| Runtime           | Node.js                                    | v24.14.0    |
| Package Manager   | NPM                                        | 11.12.1     |
| CI/CD             | GitHub Actions + GitHub Secrets            | —           |
| Local Dev Secrets | dotenv                                     | —           |
| HTTP Client       | Playwright APIRequestContext (built-in)    | —           |
| Manual Exploration| Postman                                    | —           |
| IDE               | VS Code                                    | —           |

**Authentication:** Trello API Key + Token passed as query parameters (`key`, `token`).
Stored in `.env` for local development and GitHub Secrets for CI/CD.

---

## 4. Testing Strategy

### Approach
Functional API testing.

### Prioritization

| Priority | Scope |
|----------|-------|
| P0 | Core CRUD operations for Boards (blockers for all other tests) |
| P1 | Lists, Cards, Labels and Checklists management |
| P2 | Negative scenarios and Security Headers |

### Test Structure
Each test file covers one endpoint. Files are grouped by resource in dedicated folders:

```
tests/
├── boards/
├── lists/
├── cards/
├── labels/
├── checklists/
├── members/
└── security-headers.spec.ts
```

Each spec file is divided into:
- **Positive Scenarios**
- **Negative Scenarios**
- **Security Headers** (security-headers.spec.ts only)

### Cleanup Strategy

| Hook        | Action |
|-------------|--------|
| `beforeAll` | Create one Board for all tests in the file |
| `beforeEach`| Create a fresh List for each test |
| `afterEach` | Delete List (cascading deletion of Cards and Checklists) |
| `afterAll`  | Delete Board |

### Security Headers

Tested once in `security-headers.spec.ts` using `GET /members/me` as the base request.

| Header                       | Protection                          |
|------------------------------|-------------------------------------|
| `access-control-allow-methods` | CORS — verify allowed HTTP methods |
| `access-control-allow-headers` | CORS — verify allowed headers      |
| `x-frame-options: DENY`      | Clickjacking protection             |
| `x-content-type-options: nosniff` | MIME sniffing protection       |
| `strict-transport-security`  | Enforces HTTPS                      |

---

## 5. Endpoint List

To be defined during implementation.

Core resources: Boards, Lists, Cards, Labels, Checklists, Members.

---

## 6. Acceptance Criteria

- All resources defined in scope have at least one test per HTTP method
- Each test validates: status code, response body schema and data integrity
- All tests pass in CI/CD pipeline on every push to `main` branch

---

## 7. Known Risks

| Risk | Mitigation |
|------|------------|
| Rate limiting | Run tests sequentially; Trello limits: 100 req/10s per token, 300 req/10s per key |
| Members `PUT` restriction | Mark as known limitation, skip if 403 |
| Resource dependencies | Fixed execution order: Board → List → Card → Checklist / Label |
