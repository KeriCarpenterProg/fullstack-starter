# End-to-End Testing Guide

This guide covers the E2E testing setup using Playwright for the Fullstack Starter application.

## Overview

End-to-end tests verify the application works correctly from a user's perspective by simulating real user interactions in a browser.

## Tech Stack

- **Playwright** - Modern E2E testing framework
- **TypeScript** - Type-safe test code
- **Multiple Browsers** - Chromium, Firefox, and WebKit

## Prerequisites

Before running E2E tests, ensure you have:

1. All dependencies installed (`npm install` in the `client/` directory)
2. Backend server running on `http://localhost:4000`
3. ML service running on `http://localhost:5002`
4. Frontend dev server (Playwright will start it automatically)

## Installation

Playwright and its dependencies are already installed. To install browser binaries:

```bash
cd client
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers needed for testing.

## Running Tests

### Run all tests (headless)
```bash
cd client
npm run test:e2e
```

### Run tests with UI mode (recommended for development)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Debug tests
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test e2e/auth.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View test report
```bash
npm run test:e2e:report
```

## Test Structure

Tests are organized in the `client/e2e/` directory:

```
client/e2e/
├── auth.spec.ts          # Authentication flows
├── projects.spec.ts      # Project CRUD operations
└── ml-integration.spec.ts # ML service integration
```

## Test Suites

### Authentication Tests (`auth.spec.ts`)

Tests user authentication flows:
- ✅ Display login form
- ✅ Navigate to signup page
- ✅ Show error for invalid credentials
- ✅ Register new user
- ✅ Login with valid credentials

### Project Management Tests (`projects.spec.ts`)

Tests project CRUD operations:
- ✅ Create a new project
- ✅ Display empty state
- ✅ Edit a project
- ✅ Delete a project
- ✅ Show ML category suggestion
- ✅ Logout successfully

### ML Integration Tests (`ml-integration.spec.ts`)

Tests ML service integration:
- ✅ Get prediction for Development category
- ✅ Get prediction for Design category
- ✅ Get prediction for Marketing category
- ✅ Handle ML service errors gracefully

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await page.getByRole('button', { name: /click me/i }).click();
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Best Practices

1. **Use accessible selectors** - Prefer `getByRole`, `getByLabel`, `getByPlaceholder` over CSS selectors
2. **Wait for elements** - Use `waitForURL`, `waitForSelector`, or Playwright's auto-waiting
3. **Isolate tests** - Each test should be independent and not rely on others
4. **Clean state** - Use `beforeEach` to set up fresh state
5. **Descriptive names** - Test names should clearly describe what they test
6. **Timeouts** - Add appropriate timeouts for async operations

### Common Patterns

#### Authentication Helper

```typescript
async function authenticateUser(page, email, password) {
  await page.goto('/');
  await page.getByRole('link', { name: /sign up/i }).click();
  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/password/i).fill(password);
  await page.getByRole('button', { name: /sign up/i }).click();
  await page.waitForURL(/.*dashboard/);
}
```

#### Waiting for API calls

```typescript
await page.waitForResponse(
  response => response.url().includes('/api/projects') && response.status() === 200
);
```

#### Mocking API responses

```typescript
await page.route('**/api/ml/predict-category', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ category: 'Development', confidence: 0.95 })
  });
});
```

## Configuration

The `playwright.config.ts` file contains:

- **Test directory**: `./e2e`
- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit
- **Web server**: Automatically starts frontend dev server
- **Retries**: 2 retries on CI, 0 locally
- **Reporters**: HTML report

### Customize Configuration

Edit `client/playwright.config.ts` to:
- Change timeout values
- Add new browsers
- Configure screenshots/videos
- Adjust parallel execution

## CI/CD Integration

To run E2E tests in CI:

```yaml
- name: Install Playwright Browsers
  run: cd client && npx playwright install --with-deps

- name: Run E2E tests
  run: cd client && npm run test:e2e
  env:
    CI: true
```

## Troubleshooting

### Tests are flaky

- Add explicit waits: `await page.waitForTimeout(1000)`
- Use `waitForLoadState`: `await page.waitForLoadState('networkidle')`
- Increase timeouts in test config

### Browser not found

Run: `npx playwright install`

### Port already in use

Stop any running dev servers and let Playwright start them.

### ML service not responding

Ensure the ML service is running on `http://localhost:5002`:
```bash
cd ml-service
source venv/bin/activate
uvicorn app:app --reload --port 5002
```

### Database issues

Tests create real data. Consider using a test database:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/test_db"
```

## Debugging Tips

### Use Playwright Inspector

```bash
npm run test:e2e:debug
```

This opens a GUI where you can:
- Step through tests
- Inspect elements
- See network activity
- Take screenshots

### Use UI Mode

```bash
npm run test:e2e:ui
```

Interactive mode with time-travel debugging and watch mode.

### Screenshots on failure

Add to test:
```typescript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    await page.screenshot({ path: `screenshot-${testInfo.title}.png` });
  }
});
```

### Console logs

```typescript
page.on('console', msg => console.log(msg.text()));
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Next Steps

- Add visual regression tests with screenshots
- Set up test data fixtures
- Add performance testing
- Integrate with CI/CD pipeline
- Add accessibility testing with `@axe-core/playwright`
