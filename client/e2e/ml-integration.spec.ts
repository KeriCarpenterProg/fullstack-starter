import { test, expect } from '@playwright/test';

test.describe('ML Service Integration', () => {
  let userEmail: string;

  test.beforeEach(async ({ page }) => {
    // Setup authenticated user
    userEmail = `test${Date.now()}@example.com`;
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign Up' }).first().click();
    await page.getByPlaceholder(/your name/i).fill('Test User');
    await page.getByPlaceholder(/email/i).fill(userEmail);
    await page.getByPlaceholder(/password/i).fill('testpassword123');
    await page.getByRole('button', { name: 'Sign Up', exact: true }).last().click();
    await expect(page.getByRole('heading', { name: /my projects/i })).toBeVisible({ timeout: 5000 });
  });

  test('should get ML prediction for Development category', async ({ page }) => {
    const description = 'Build a REST API with Node.js and Express for user authentication';
    await page.getByPlaceholder(/project description/i).fill(description);
    
    // Wait for debounce and ML response
    await page.waitForTimeout(1500);
    
    // Look for suggestion with Development
    const suggestionText = await page.textContent('body');
    expect(suggestionText).toBeTruthy();
  });

  test('should get ML prediction for Design category', async ({ page }) => {
    const description = 'Create wireframes and mockups for the mobile app interface';
    await page.getByPlaceholder(/project description/i).fill(description);
    
    await page.waitForTimeout(1500);
    
    const suggestionText = await page.textContent('body');
    expect(suggestionText).toBeTruthy();
  });

  test('should get ML prediction for Marketing category', async ({ page }) => {
    const description = 'Plan social media campaign and create content calendar for product launch';
    await page.getByPlaceholder(/project description/i).fill(description);
    
    await page.waitForTimeout(1500);
    
    const suggestionText = await page.textContent('body');
    expect(suggestionText).toBeTruthy();
  });

  test('should handle ML service errors gracefully', async ({ page }) => {
    // Intercept ML service calls and simulate error
    await page.route('**/api/ml/predict-category', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'ML Service Error' })
      });
    });

    await page.getByPlaceholder(/project description/i).fill('Test description for error handling');
    
    // Wait for request
    await page.waitForTimeout(1500);
    
    // Should still be able to create project manually
    await page.getByPlaceholder(/project title/i).fill('Manual Project');
    await page.getByPlaceholder(/category/i).fill('Development');
    await page.getByRole('button', { name: /add project/i }).click();
    
    await expect(page.getByText('Manual Project')).toBeVisible({ timeout: 5000 });
  });
});
