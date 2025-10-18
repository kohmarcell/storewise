import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    // Check if login form is visible
    await expect(page.locator('h1')).toContainText('Sign in');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign in');
  });

  test('should show validation errors for invalid inputs', async ({ page }) => {
    await page.goto('/login');

    // Submit form with empty inputs
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Invalid email address')).toBeVisible();
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Login failed')).toBeVisible();
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    await page.goto('/login');

    // Fill form with valid credentials (mock)
    await page.fill('input[type="email"]', 'admin@storewise.com');
    await page.fill('input[type="password"]', 'password123');

    // Mock successful login response
    await page.route('/api/v1/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: '1',
              email: 'admin@storewise.com',
              name: 'Admin User',
              role: { name: 'Admin' }
            },
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh-token'
          }
        })
      });
    });

    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/');

    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});