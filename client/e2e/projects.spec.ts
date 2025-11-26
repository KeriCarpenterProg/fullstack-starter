import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
  let userEmail: string;
  let userPassword: string;

  test.beforeEach(async ({ page }) => {
    // Create a unique user for each test
    userEmail = `test${Date.now()}@example.com`;
    userPassword = 'testpassword123';

    // Navigate to signup
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign Up' }).first().click();
    
    // Register new user
    await page.getByPlaceholder(/your name/i).fill('Test User');
    await page.getByPlaceholder(/email/i).fill(userEmail);
    await page.getByPlaceholder(/password/i).fill(userPassword);
    await page.getByRole('button', { name: 'Sign Up', exact: true }).last().click();
    
    // Wait for dashboard
    await expect(page.getByRole('heading', { name: /my projects/i })).toBeVisible({ timeout: 5000 });
  });

  test('should create a new project', async ({ page }) => {
    // Fill in project form (inline in dashboard)
    await page.getByPlaceholder(/project title/i).fill('Test Project');
    await page.getByPlaceholder(/project description/i).fill('This is a test project for E2E testing');
    await page.getByPlaceholder(/category/i).fill('Development');
    
    // Submit
    await page.getByRole('button', { name: /add project/i }).click();
    
    // Verify project appears in list - use heading role for the project title
    await expect(page.getByRole('heading', { name: 'Test Project' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('This is a test project for E2E testing')).toBeVisible();
  });

  test('should display empty state when no projects', async ({ page }) => {
    await expect(page.getByText(/no projects yet/i)).toBeVisible();
    await expect(page.getByText(/create your first project/i)).toBeVisible();
  });

  test('should display project count', async ({ page }) => {
    // Create a project first
    await page.getByPlaceholder(/project title/i).fill('First Project');
    await page.getByPlaceholder(/project description/i).fill('First Description');
    await page.getByPlaceholder(/category/i).fill('Development');
    await page.getByRole('button', { name: /add project/i }).click();
    
    // Wait for project to appear - use heading role for h3
    await expect(page.getByRole('heading', { name: 'First Project' })).toBeVisible({ timeout: 5000 });
    
    // Verify count updates
    await expect(page.getByText(/your projects \(1\)/i)).toBeVisible();
    
    // Create another project
    await page.getByPlaceholder(/project title/i).fill('Second Project');
    await page.getByPlaceholder(/project description/i).fill('Second Description');
    await page.getByPlaceholder(/category/i).fill('Marketing');
    await page.getByRole('button', { name: /add project/i }).click();
    
    // Verify count updates
    await expect(page.getByText(/your projects \(2\)/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show ML category suggestion', async ({ page }) => {
    // Fill in description that should trigger ML suggestion
    await page.getByPlaceholder(/project description/i).fill('Build a new REST API with authentication and user management');
    
    // Wait for ML suggestion (with debounce + processing)
    await page.waitForTimeout(1500);
    
    // Check if suggestion appears
    const suggestion = page.getByText(/suggested:/i);
    const predicting = page.getByText(/predicting category/i);
    
    // Should see either loading or suggestion
    const hasSuggestion = await suggestion.isVisible().catch(() => false);
    const isPredicting = await predicting.isVisible().catch(() => false);
    
    expect(hasSuggestion || isPredicting).toBeTruthy();
  });

  test('should logout successfully', async ({ page }) => {
    await page.getByRole('button', { name: /logout/i }).click();
    
    // Should redirect to login page
    await expect(page.getByRole('heading', { name: /project manager/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: 'Login' }).first()).toHaveClass(/active/);
  });
});
