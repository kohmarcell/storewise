import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all units of measure
router.get('/uom', async (req, res) => {
  try {
    const uoms = await prisma.unitOfMeasure.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: uoms
    });
  } catch (error) {
    console.error('Error fetching UOMs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch units of measure',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get stock movements
router.get('/stock-movements', async (req, res) => {
  try {
    const { productId, outletId, type, startDate, endDate, page = 1, limit = 50 } = req.query;

    const where: any = {};
    if (productId) where.productId = productId;
    if (outletId) where.outletId = outletId;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        include: {
          product: {
            include: {
              category: true
            }
          },
          outlet: true,
          batch: true,
          user: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.stockMovement.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        movements,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock movements',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create stock movement
router.post('/stock-movements', async (req, res) => {
  try {
    const movementData = req.body;

    // Get current stock
    const currentStock = await prisma.productStock.findFirst({
      where: {
        productId: movementData.productId,
        outletId: movementData.outletId
      }
    });

    const qtyBefore = currentStock?.quantity || 0;
    const qtyAfter = qtyBefore + movementData.qty;

    // Create stock movement
    const movement = await prisma.stockMovement.create({
      data: {
        ...movementData,
        qtyBefore,
        qtyAfter
      },
      include: {
        product: true,
        outlet: true,
        batch: true,
        user: true
      }
    });

    // Update product stock
    if (currentStock) {
      await prisma.productStock.update({
        where: { id: currentStock.id },
        data: { quantity: qtyAfter }
      });
    } else {
      await prisma.productStock.create({
        data: {
          productId: movementData.productId,
          outletId: movementData.outletId,
          quantity: qtyAfter
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Stock movement created successfully',
      data: movement
    });
  } catch (error) {
    console.error('Error creating stock movement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create stock movement',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get batches
router.get('/batches', async (req, res) => {
  try {
    const { productId, outletId, expiringSoon, page = 1, limit = 50 } = req.query;

    const where: any = {};
    if (productId) where.productId = productId;
    if (outletId) {
      // If outletId provided, get batches that have stock in that outlet
      where.productStocks = {
        some: { outletId: outletId as string }
      };
    }
    if (expiringSoon === 'true') {
      where.expDate = {
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        gte: new Date()
      };
    }

    const [batches, total] = await Promise.all([
      prisma.batch.findMany({
        where,
        include: {
          product: {
            include: {
              category: true
            }
          }
        },
        orderBy: { expDate: 'asc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.batch.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        batches,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batches',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;