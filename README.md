# Portfolio-Project-Trello-API

Automated API testing framework for the [Trello REST API](https://developer.atlassian.com/cloud/trello/rest/) built with Playwright and TypeScript.

> ⚠️ Work in progress — actively developed.

---

## Tech Stack

| Tool | Role |
|------|------|
| Playwright | API test framework + HTTP client (APIRequestContext) |
| TypeScript | Language |
| GitHub Actions | CI/CD |
| dotenv | Local environment variables |
| Postman | Manual API exploration |

---

## Project Structure

```
.github/
  workflows/
    playwright.yml            # GitHub Actions CI/CD pipeline
.husky/
  pre-commit                  # Git hook for lint-staged
  pre-push                    # Git hook for running tests
data/
  board.data.ts               # Test data and payloads for Boards
  endpoints.ts                # API endpoints definitions
  error_messages.ts           # Shared error messages dictionary
  lists.data.ts               # Test data and payloads for Lists
fixtures/
  board-fixtures.ts           # Test fixtures (Dependency Injection, setup & teardown)
helpers/
  api/
    base-api.ts               # Base API client (auth & request config)
    board-api.ts              # API wrappers for Board endpoints
    list-api.ts               # API wrappers for List endpoints
    member-api.ts             # API wrappers for Member endpoints
  setup/
    auth-setup.ts             # Authentication setup logic
    lists-setup.ts            # Pre-test setup helpers for lists
  assertions.ts               # Custom assertion functions
tests/
  boards/
    create-board.spec.ts
    delete-board.spec.ts
    get-board.spec.ts
    update-board.spec.ts
  lists/
    create-list.spec.ts
    list-ordering.spec.ts
  auth.spec.ts
  security-headers.spec.ts
.env.sample                   # Environment variables template
eslint.config.mts             # ESLint configuration
package.json                  # NPM dependencies and scripts
playwright.config.ts          # Playwright framework configuration
README.md                     # Project documentation
TEST-PLAN.md                  # Test plan documentation
tsconfig.json                 # TypeScript configuration
```

---

## Test Coverage

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Boards | ✅ | ✅ | ✅ | ✅ |
| Lists | ✅ | ✅ | 🔄 | — |
| Cards | — | — | — | — |
| Labels | — | — | — | — |
| Checklists | — | — | — | — |
| Members | — | — | — | — |

**Additional:**
- ✅ Authentication tests (401 / 400 scenarios)
- ✅ Security headers validation

---

## Authentication

Trello API uses API Key + Token passed as query parameters on every request. Credentials are stored in `.env` for local development and GitHub Secrets for CI/CD.

---

## Test Design Decisions

- **One file per endpoint** — modularity and easier debugging
- **`beforeAll` / `afterAll`** — one Board per test file for GET / UPDATE / DELETE tests
- **`beforeEach` / `afterEach`** — fresh Board per test for CREATE tests
- **Cascading cleanup** — deleting a List removes its Cards and Checklists automatically
- **Auth tested once** — `auth.spec.ts` covers all authentication scenarios globally
- **Security headers tested once** — `security-headers.spec.ts` uses `GET /members/me` as base request

---

## CI/CD

Tests run automatically on every push and pull request to `main` via GitHub Actions. Test reports are uploaded as artifacts (retention: 30 days).

---

## Related Projects

- [Portfolio-Playwright-API](https://github.com/Bayoc/Portfolio-Playwright-API) — API tests for Automation Exercise & Restful Booker
- [Portfolio-Playwright-Automation](https://github.com/Bayoc/Portfolio-Playwright-Automation) — UI automation tests
