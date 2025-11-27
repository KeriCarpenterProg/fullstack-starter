import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /project manager/i })).toBeVisible();
    // Check that Login tab button has active class
    const loginTabButton = page.locator('.tab-buttons button', { hasText: 'Login' });
    await expect(loginTabButton).toHaveClass('active');
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login', exact: true }).last()).toBeVisible();
  });

  test('should switch to signup tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign Up' }).first().click();
    await expect(page.getByRole('button', { name: 'Sign Up' }).first()).toHaveClass(/active/);
    await expect(page.getByPlaceholder(/your name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Set up dialog handler BEFORE triggering the action
    let dialogMessage = '';
    page.once('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    
    await page.getByPlaceholder(/email/i).fill('invalid@example.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: 'Login', exact: true }).last().click();
    
    // Wait a bit for dialog to appear and be handled
    await page.waitForTimeout(1000);
    expect(dialogMessage.toLowerCase()).toContain('failed');
  });

  test('should register a new user', async ({ page }) => {
    const randomEmail = `test${Date.now()}@example.com`;
    
    // Switch to signup tab
    await page.getByRole('button', { name: 'Sign Up' }).first().click();
    
    // Fill form
    await page.getByPlaceholder(/your name/i).fill('Test User');
    await page.getByPlaceholder(/email/i).fill(randomEmail);
    await page.getByPlaceholder(/password/i).fill('testpassword123');
    await page.getByRole('button', { name: 'Sign Up', exact: true }).last().click();
    
    // Should show dashboard after successful signup
    await expect(page.getByRole('heading', { name: /my projects/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // First create a user
    const randomEmail = `test${Date.now()}@example.com`;
    await page.getByRole('button', { name: 'Sign Up' }).first().click();
    await page.getByPlaceholder(/your name/i).fill('Test User');
    await page.getByPlaceholder(/email/i).fill(randomEmail);
    await page.getByPlaceholder(/password/i).fill('testpassword123');
    await page.getByRole('button', { name: 'Sign Up', exact: true }).last().click();
    await expect(page.getByRole('heading', { name: /my projects/i })).toBeVisible({ timeout: 5000 });
    
    // Logout
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page.getByRole('heading', { name: /project manager/i })).toBeVisible();
    
    // Make sure we're on the Login tab
    await page.getByRole('button', { name: 'Login' }).first().click();
    
    // Login again
    await page.getByPlaceholder(/email/i).fill(randomEmail);
    await page.getByPlaceholder(/password/i).fill('testpassword123');
    await page.getByRole('button', { name: 'Login', exact: true }).last().click();
    
    // Wait a bit longer for login to complete
    await expect(page.getByRole('heading', { name: /my projects/i })).toBeVisible({ timeout: 10000 });
  });
});
