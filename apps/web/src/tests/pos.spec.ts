import { test, expect } from '@playwright/test';

test.describe('POS Interface', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: { name: 'Cashier' }
      }));
    });

    // Mock API responses
    await page.route('/api/v1/auth/me', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: { name: 'Cashier' }
            }
          }
        })
      });
    });

    await page.route('/api/v1/products*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            data: [
              {
                id: '1',
                name: 'Test Product 1',
                sku: 'TP001',
                sellPrice: 10.99,
                stockQty: 100,
                images: [],
                category: { name: 'Electronics' }
              },
              {
                id: '2',
                name: 'Test Product 2',
                sku: 'TP002',
                sellPrice: 5.99,
                stockQty: 50,
                images: [],
                category: { name: 'Food' }
              }
            ],
            total: 2
          }
        })
      });
    });
  });

  test('should display POS interface with products', async ({ page }) => {
    await page.goto('/pos');

    // Check if POS page loads correctly
    await expect(page.locator('h1')).toContainText('Point of Sale');
    await expect(page.locator('text=Products')).toBeVisible();
    await expect(page.locator('text=Shopping Cart')).toBeVisible();
  });

  test('should search products', async ({ page }) => {
    await page.goto('/pos');

    // Search for a product
    await page.fill('input[placeholder="Search products..."]', 'Test Product 1');

    // Should show filtered results
    await expect(page.locator('text=Test Product 1')).toBeVisible();
  });

  test('should add products to cart', async ({ page }) => {
    await page.goto('/pos');

    // Click on first product
    await page.click('.cursor-pointer:has-text("Test Product 1")');

    // Should show success message and update cart
    await expect(page.locator('text=Test Product 1 added to cart')).toBeVisible();
    await expect(page.locator('text=1 items in cart')).toBeVisible();
  });

  test('should update cart quantity', async ({ page }) => {
    await page.goto('/pos');

    // Add product to cart
    await page.click('.cursor-pointer:has-text("Test Product 1")');

    // Increase quantity
    await page.click('button:has-text("+")');

    // Should update cart
    await expect(page.locator('text=2 items in cart')).toBeVisible();
  });

  test('should remove items from cart', async ({ page }) => {
    await page.goto('/pos');

    // Add product to cart
    await page.click('.cursor-pointer:has-text("Test Product 1")');

    // Remove from cart
    await page.click('button:has-text("-")');

    // Should update cart
    await expect(page.locator('text=0 items in cart')).toBeVisible();
  });

  test('should show checkout modal', async ({ page }) => {
    await page.goto('/pos');

    // Add product to cart
    await page.click('.cursor-pointer:has-text("Test Product 1")');

    // Click checkout
    await page.click('button:has-text("Checkout")');

    // Should show checkout modal
    await expect(page.locator('text=Complete Payment')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('should calculate totals correctly', async ({ page }) => {
    await page.goto('/pos');

    // Add two products
    await page.click('.cursor-pointer:has-text("Test Product 1")');
    await page.click('.cursor-pointer:has-text("Test Product 2")');

    // Should calculate totals
    await expect(page.locator('text=$16.98')).toBeVisible(); // $10.99 + $5.99
    await expect(page.locator('text=$1.70')).toBeVisible(); // Tax (10%)
    await expect(page.locator('text=$18.68')).toBeVisible(); // Total
  });

  test('should handle cash payment', async ({ page }) => {
    await page.goto('/pos');

    // Add product and checkout
    await page.click('.cursor-pointer:has-text("Test Product 1")');
    await page.click('button:has-text("Checkout")');

    // Select cash payment and enter amount
    await page.selectOption('select', 'CASH');
    await page.fill('input[placeholder="Enter amount received"]', '20.00');

    // Should show change
    await expect(page.locator('text=Change: $9.01')).toBeVisible();

    // Complete payment
    await page.click('button:has-text("Complete Payment")');

    // Should show success message
    await expect(page.locator('text=Payment successful!')).toBeVisible();
  });
});