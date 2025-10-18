import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        tier: true
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        tier: true,
        pointsHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const customerData = req.body;

    // Generate customer code if not provided
    if (!customerData.code) {
      const lastCustomer = await prisma.customer.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      const lastNumber = parseInt(lastCustomer?.code?.split('-')[1] || '000');
      customerData.code = `CUST-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    const customer = await prisma.customer.create({
      data: customerData,
      include: {
        tier: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: customerData,
      include: {
        tier: true
      }
    });

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.customer.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get customer points history
router.get('/:id/points', async (req, res) => {
  try {
    const { id } = req.params;

    const pointsHistory = await prisma.customerPointsHistory.findMany({
      where: { customerId: id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      data: pointsHistory
    });
  } catch (error) {
    console.error('Error fetching customer points history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer points history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search customers
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        tier: true
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search customers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get customers by tier
router.get('/tier/:tierId', async (req, res) => {
  try {
    const { tierId } = req.params;

    const customers = await prisma.customer.findMany({
      where: { tierId },
      include: {
        tier: true
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers by tier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers by tier',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;