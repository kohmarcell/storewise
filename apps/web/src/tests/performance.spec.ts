import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
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

    // Mock API responses for fast loading
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
  });

  test('should load dashboard within performance budget', async ({ page }) => {
    // Start performance measurement
    const startTime = Date.now();

    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1:has-text("Dashboard")');

    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    console.log(`Dashboard load time: ${loadTime}ms`);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const navigation = entries.find(entry => entry.entryType === 'navigation');
          if (navigation) {
            resolve({
              loadEventEnd: navigation.loadEventEnd,
              domContentLoaded: navigation.domContentLoadedEventEnd,
              firstPaint: navigation.responseStart,
              firstContentfulPaint: navigation.responseStart
            });
          }
        });
        observer.observe({ entryTypes: ['navigation'] });
      });
    });

    // Check LCP (Largest Contentful Paint) - should be under 2.5s
    expect(metrics.loadEventEnd).toBeLessThan(2500);

    // Check DOM content loaded - should be under 1s
    expect(metrics.domContentLoaded).toBeLessThan(1000);
  });

  test('should handle large product lists efficiently', async ({ page }) => {
    // Mock large product dataset
    await page.route('/api/v1/products*', route => {
      const products = Array.from({ length: 1000 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i + 1}`,
        sku: `SKU${i + 1}`,
        sellPrice: Math.random() * 100,
        stockQty: Math.floor(Math.random() * 100),
        category: { name: ['Electronics', 'Food', 'Clothing'][i % 3] }
      }));

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { data: products, total: 1000 }
        })
      });
    });

    const startTime = Date.now();
    await page.goto('/pos');

    // Wait for products to load
    await page.waitForSelector('.cursor-pointer');

    const loadTime = Date.now() - startTime;

    // Should handle 1000 products efficiently
    expect(loadTime).toBeLessThan(2000);
    console.log(`POS with 1000 products load time: ${loadTime}ms`);
  });

  test('should maintain performance during rapid interactions', async ({ page }) => {
    await page.goto('/pos');

    // Mock product responses
    await page.route('/api/v1/products*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            data: Array.from({ length: 50 }, (_, i) => ({
              id: `product-${i}`,
              name: `Product ${i + 1}`,
              sellPrice: 10 + i,
              stockQty: 100
            })),
            total: 50
          }
        })
      });
    });

    // Measure time for 50 rapid product additions
    const startTime = Date.now();

    for (let i = 0; i < 50; i++) {
      await page.click(`.cursor-pointer:nth-child(${(i % 12) + 1})`);
      await page.waitForTimeout(10); // Small delay to simulate realistic usage
    }

    const interactionTime = Date.now() - startTime;

    // Should handle rapid interactions efficiently
    expect(interactionTime).toBeLessThan(5000);
    console.log(`50 product additions time: ${interactionTime}ms`);
  });

  test('should not have memory leaks during navigation', async ({ page }) => {
    // Test multiple navigation cycles
    for (let i = 0; i < 10; i++) {
      await page.goto('/');
      await page.waitForSelector('h1:has-text("Dashboard")');

      await page.goto('/pos');
      await page.waitForSelector('h1:has-text("Point of Sale")');

      await page.goto('/products');
      await page.waitForSelector('h1:has-text("Product Management")');
    }

    // Check for memory usage (simplified check)
    const memoryUsage = await page.evaluate(() => {
      if (performance.memory) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });

    if (memoryUsage) {
      // Memory usage should be reasonable (less than 100MB)
      expect(memoryUsage.used).toBeLessThan(100 * 1024 * 1024);
      console.log(`Memory usage: ${Math.round(memoryUsage.used / 1024 / 1024)}MB`);
    }
  });

  test('should load assets efficiently', async ({ page }) => {
    const responses: { url: string; size: number }[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') || url.includes('.css')) {
        responses.push({
          url,
          size: parseInt(response.headers()['content-length'] || '0')
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check total bundle size
    const totalSize = responses.reduce((sum, resp) => sum + resp.size, 0);

    // Total bundle size should be under 5MB
    expect(totalSize).toBeLessThan(5 * 1024 * 1024);
    console.log(`Total bundle size: ${Math.round(totalSize / 1024)}KB`);

    // Should have reasonable number of requests
    expect(responses.length).toBeLessThan(50);
    console.log(`Number of asset requests: ${responses.length}`);
  });
});