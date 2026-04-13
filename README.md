# Portfolio-Playwright-API-Trello

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
data/
  endpoints.ts        # ENDPOINTS object + HttpMethod enum
  board.data.ts       # Types and test data for Boards
  lists.data.ts       # Types and test data for Lists
helpers/
  auth-helpers.ts     # Shared auth params (API key + token)
  board-helpers.ts    # createBoard / deleteBoard functions
  lists-helpers.ts    # createList functions
tests/
  boards/
    create-board.spec.ts
    get-board.spec.ts
    update-board.spec.ts
    delete-board.spec.ts
  lists/
    create-list.spec.ts
  auth.spec.ts
  security-headers.spec.ts
TEST_PLAN.md
```

---

## Test Coverage

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Boards | ✅ | ✅ | ✅ | ✅ |
| Lists | 🔄 | — | — | — |
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

- [Portfolio-Playwright-API](https://github.com/<your-username>/Portfolio-Playwright-API) — API tests for Automation Exercise & Restful Booker
- [Portfolio-Playwright-Automation](https://github.com/<your-username>/Portfolio-Playwright-Automation) — UI automation tests
