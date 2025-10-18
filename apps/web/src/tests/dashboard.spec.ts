import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: { name: 'Admin' }
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
              role: { name: 'Admin' }
            }
          }
        })
      });
    });

    await page.route('/api/v1/reports/dashboard/kpi*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            todaySales: 1250.50,
            totalTransactions: 45,
            totalCustomers: 120,
            totalProducts: 85,
            lowStockProducts: 3,
            weekSales: 8750.25,
            monthSales: 35420.75,
            totalSales: 125480.90
          }
        })
      });
    });

    await page.route('/api/v1/reports/sales/chart*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { date: '2024-01-01', sales: 1000, transactions: 20 },
            { date: '2024-01-02', sales: 1500, transactions: 30 },
            { date: '2024-01-03', sales: 1200, transactions: 25 },
            { date: '2024-01-04', sales: 1800, transactions: 35 },
            { date: '2024-01-05', sales: 2000, transactions: 40 },
            { date: '2024-01-06', sales: 1700, transactions: 32 },
            { date: '2024-01-07', sales: 1250, transactions: 28 }
          ]
        })
      });
    });

    await page.route('/api/v1/reports/sales/by-category*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { categoryName: 'Electronics', sales: 5000, percentage: 35 },
            { categoryName: 'Food', sales: 3000, percentage: 21 },
            { categoryName: 'Clothing', sales: 2500, percentage: 17 },
            { categoryName: 'Other', sales: 3800, percentage: 27 }
          ]
        })
      });
    });

    await page.route('/api/v1/reports/products/top*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { productName: 'Product A', quantity: 50, revenue: 750 },
            { productName: 'Product B', quantity: 40, revenue: 600 },
            { productName: 'Product C', quantity: 35, revenue: 525 },
            { productName: 'Product D', quantity: 30, revenue: 450 },
            { productName: 'Product E', quantity: 25, revenue: 375 }
          ]
        })
      });
    });
  });

  test('should display dashboard with KPI cards', async ({ page }) => {
    await page.goto('/');

    // Check if dashboard loads
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Check KPI cards
    await expect(page.locator('text=Today\'s Sales')).toBeVisible();
    await expect(page.locator('text=$1,250.50')).toBeVisible();
    await expect(page.locator('text=Total Transactions')).toBeVisible();
    await expect(page.locator('text=45')).toBeVisible();
    await expect(page.locator('text=Total Customers')).toBeVisible();
    await expect(page.locator('text=120')).toBeVisible();
    await expect(page.locator('text=Low Stock Items')).toBeVisible();
    await expect(page.locator('text=3')).toBeVisible();
  });

  test('should display sales trend chart', async ({ page }) => {
    await page.goto('/');

    // Check if chart is rendered
    await expect(page.locator('text=Sales Trend (7 Days)')).toBeVisible();

    // Should show chart canvas
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should display category sales pie chart', async ({ page }) => {
    await page.goto('/');

    // Check if pie chart is rendered
    await expect(page.locator('text=Sales by Category')).toBeVisible();

    // Should show category breakdown
    await expect(page.locator('text=Electronics')).toBeVisible();
    await expect(page.locator('text=Food')).toBeVisible();
  });

  test('should display top products chart', async ({ page }) => {
    await page.goto('/');

    // Check if top products chart is rendered
    await expect(page.locator('text=Top Products This Week')).toBeVisible();

    // Should show product names
    await expect(page.locator('text=Product A')).toBeVisible();
    await expect(page.locator('text=Product B')).toBeVisible();
  });

  test('should display quick stats', async ({ page }) => {
    await page.goto('/');

    // Check quick stats section
    await expect(page.locator('text=Quick Stats')).toBeVisible();
    await expect(page.locator('text=Total Products')).toBeVisible();
    await expect(page.locator('text=Week Sales')).toBeVisible();
    await expect(page.locator('text=Month Sales')).toBeVisible();
    await expect(page.locator('text=Total Sales')).toBeVisible();
  });

  test('should show real-time updates badge', async ({ page }) => {
    await page.goto('/');

    // Check if real-time updates are indicated
    await expect(page.locator('text=45 items in cart')).toBeVisible();
  });

  test('should navigate between sections', async ({ page }) => {
    await page.goto('/');

    // Navigate to POS
    await page.click('a:has-text("POS")');
    await expect(page).toHaveURL('/pos');

    // Navigate back to Dashboard
    await page.click('a:has-text("Dashboard")');
    await expect(page).toHaveURL('/');
  });

  test('should handle user menu', async ({ page }) => {
    await page.goto('/');

    // Click user avatar
    await page.click('button[aria-label="User menu"]');

    // Should show dropdown menu
    await expect(page.locator('text=Profile')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=Log out')).toBeVisible();
  });
});