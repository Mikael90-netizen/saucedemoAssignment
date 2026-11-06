# 01 – SauceDemo (Sauce Labs) Playwright Suite

End-to-end tests for the Sauce Labs demo app, **https://www.saucedemo.com**, written in Playwright and TypeScript.

## Structure

```
playwright.config.ts     # browsers, reporters, retries, baseURL from .env
src/
  data/testData.ts       # users, products, checkout data (env-overridable)
  pages/                 # Page Objects: Login, Inventory, Product, Cart, Checkout
  fixtures/test.ts       # custom fixtures (page objects + `loggedIn`)
tests/
  login.spec.ts          # valid/locked/invalid login, required fields, auth guard, logout
  inventory.spec.ts      # 4 sort orders, product details
  cart.spec.ts           # add/remove, badge, persistence, continue shopping
  checkout.spec.ts       # full purchase with totals math, field validation, cancel
.sauce/config.yml        # saucectl config for running on Sauce Labs cloud
../.github/workflows/saucedemo.yml   # CI pipeline
```

## Setup

```bash
npm install
npx playwright install          # browsers
cp .env.example .env            # defaults work as-is
```

## Run

| Command | What it does |
|---|---|
| `npm test` | All tests on Chromium, Firefox and WebKit |
| `npm run test:chromium` | Chromium only |
| `npm run test:smoke` / `test:regression` | Filter by tag |
| `npm run test:headed` | Watch it run |
| `npm run report` | Open the HTML report |
| `npm run typecheck` | TypeScript check |
| `npm run sauce:run` | Run on Sauce Labs cloud (needs `saucectl`, `SAUCE_USERNAME`, `SAUCE_ACCESS_KEY`) |

## CI pipeline (GitHub Actions)

`.github/workflows/saucedemo.yml` at the repo root:

- Triggers on push/PR that touch this folder, on a weekday schedule, and on manual dispatch.
- Runs `npm ci`, a type check, then the suite as a browser matrix (chromium/firefox/webkit) with 2 retries.
- Uploads the HTML report and JUnit XML as artifacts.
- **`sauce-cloud` job** runs the suite on Sauce Labs VMs (Windows 11 Chrome/Firefox, macOS WebKit) using `saucelabs/saucectl-run-action`. It runs on the schedule or when `run_sauce_cloud` is ticked on manual dispatch. Add the `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` repository secrets to use it.
