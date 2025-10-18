import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Reports index endpoint - to be implemented' });
});

// Dashboard KPI endpoint
router.get('/dashboard/kpi', (req, res) => {
  res.json({
    success: true,
    data: {
      totalSales: 125750.50,
      totalTransactions: 342,
      totalCustomers: 1245,
      totalProducts: 486,
      lowStockProducts: 12,
      todaySales: 3250.75,
      weekSales: 22580.25,
      monthSales: 98540.50
    }
  });
});

// Sales chart data
router.get('/sales/chart', (req, res) => {
  const { period = 'week' } = req.query;

  const weekData = [
    { date: '2025-10-13', sales: 2850.50, transactions: 42 },
    { date: '2025-10-14', sales: 3200.75, transactions: 48 },
    { date: '2025-10-15', sales: 2750.25, transactions: 38 },
    { date: '2025-10-16', sales: 4100.00, transactions: 56 },
    { date: '2025-10-17', sales: 3650.25, transactions: 51 },
    { date: '2025-10-18', sales: 3250.75, transactions: 45 },
    { date: '2025-10-19', sales: 2800.50, transactions: 39 },
  ];

  const monthData = [
    { date: '2025-09-20', sales: 8500.50, transactions: 120 },
    { date: '2025-09-27', sales: 9200.75, transactions: 135 },
    { date: '2025-10-04', sales: 10500.25, transactions: 145 },
    { date: '2025-10-11', sales: 11850.50, transactions: 162 },
    { date: '2025-10-18', sales: 9850.75, transactions: 138 },
  ];

  res.json({
    success: true,
    data: period === 'month' ? monthData : weekData
  });
});

// Category sales data
router.get('/sales/by-category', (req, res) => {
  res.json({
    success: true,
    data: [
      { categoryName: 'Electronics', sales: 45000.00, percentage: 35.8 },
      { categoryName: 'Clothing', sales: 28000.00, percentage: 22.3 },
      { categoryName: 'Food & Beverages', sales: 22000.00, percentage: 17.5 },
      { categoryName: 'Home & Garden', sales: 15000.00, percentage: 11.9 },
      { categoryName: 'Sports & Outdoors', sales: 10000.00, percentage: 8.0 },
      { categoryName: 'Other', sales: 5750.50, percentage: 4.5 }
    ]
  });
});

// Top products data
router.get('/products/top', (req, res) => {
  const { period = 'week', limit = 5 } = req.query;

  res.json({
    success: true,
    data: [
      { productId: '1', productName: 'Wireless Headphones Pro', quantity: 45, revenue: 13500.00 },
      { productId: '2', productName: 'Smart Watch Ultra', quantity: 38, revenue: 11400.00 },
      { productId: '3', productName: 'Laptop Stand Adjustable', quantity: 62, revenue: 6200.00 },
      { productId: '4', productName: 'USB-C Hub Multi-Port', quantity: 78, revenue: 4680.00 },
      { productId: '5', productName: 'Mechanical Keyboard RGB', quantity: 28, revenue: 5600.00 }
    ]
  });
});

// Additional endpoints that frontend is requesting
router.get('/dashboard/sales', (req, res) => {
  const { period = 'week' } = req.query;

  const weekData = [
    { date: '2025-10-13', sales: 2850.50, transactions: 42 },
    { date: '2025-10-14', sales: 3200.75, transactions: 48 },
    { date: '2025-10-15', sales: 2750.25, transactions: 38 },
    { date: '2025-10-16', sales: 4100.00, transactions: 56 },
    { date: '2025-10-17', sales: 3650.25, transactions: 51 },
    { date: '2025-10-18', sales: 3250.75, transactions: 45 },
    { date: '2025-10-19', sales: 2800.50, transactions: 39 },
  ];

  const monthData = [
    { date: '2025-09-20', sales: 8500.50, transactions: 120 },
    { date: '2025-09-27', sales: 9200.75, transactions: 135 },
    { date: '2025-10-04', sales: 10500.25, transactions: 145 },
    { date: '2025-10-11', sales: 11850.50, transactions: 162 },
    { date: '2025-10-18', sales: 9850.75, transactions: 138 },
  ];

  res.json({
    success: true,
    data: period === 'month' ? monthData : weekData
  });
});

router.get('/dashboard/categories', (req, res) => {
  res.json({
    success: true,
    data: [
      { categoryName: 'Electronics', sales: 45000.00, percentage: 35.8 },
      { categoryName: 'Clothing', sales: 28000.00, percentage: 22.3 },
      { categoryName: 'Food & Beverages', sales: 22000.00, percentage: 17.5 },
      { categoryName: 'Home & Garden', sales: 15000.00, percentage: 11.9 },
      { categoryName: 'Sports & Outdoors', sales: 10000.00, percentage: 8.0 },
      { categoryName: 'Other', sales: 5750.50, percentage: 4.5 }
    ]
  });
});

router.get('/dashboard/products', (req, res) => {
  const { period = 'week', limit = 5 } = req.query;

  res.json({
    success: true,
    data: [
      { productId: '1', productName: 'Wireless Headphones Pro', quantity: 45, revenue: 13500.00 },
      { productId: '2', productName: 'Smart Watch Ultra', quantity: 38, revenue: 11400.00 },
      { productId: '3', productName: 'Laptop Stand Adjustable', quantity: 62, revenue: 6200.00 },
      { productId: '4', productName: 'USB-C Hub Multi-Port', quantity: 78, revenue: 4680.00 },
      { productId: '5', productName: 'Mechanical Keyboard RGB', quantity: 28, revenue: 5600.00 }
    ]
  });
});

export default router;