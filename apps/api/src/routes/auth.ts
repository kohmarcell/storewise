import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               rememberMe:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (req, res) => {
  // Mock login for development
  const { email, password } = req.body;

  // Simple mock validation
  if (email && password) {
    res.json({
      success: true,
      data: {
        user: {
          id: '1',
          email: email,
          name: 'Admin User',
          phone: '+1234567890',
          photoUrl: '',
          roleId: '1',
          outletId: '1',
          isActive: true,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          role: {
            id: '1',
            name: 'Administrator',
            description: 'System administrator',
            permissions: ['*'],
            isSystem: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          outlet: {
            id: '1',
            code: 'MAIN',
            name: 'Main Store',
            address: '123 Main St',
            phone: '+1234567890',
            email: 'store@storewise.com',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', (req, res) => {
  res.json({ message: 'Auth refresh endpoint - to be implemented' });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user and invalidate tokens
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Auth logout endpoint - to be implemented' });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', (req, res) => {
  // Mock user data for development - matching frontend User interface
  res.json({
    success: true,
    data: {
      id: '1',
      email: 'admin@storewise.com',
      name: 'Admin User',
      phone: '+1234567890',
      photoUrl: '',
      roleId: '1',
      outletId: '1',
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: {
        id: '1',
        name: 'Administrator',
        description: 'System administrator',
        permissions: ['*'],
        isSystem: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      outlet: {
        id: '1',
        code: 'MAIN',
        name: 'Main Store',
        address: '123 Main St',
        phone: '+1234567890',
        email: 'store@storewise.com',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  });
});

export default router;