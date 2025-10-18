import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createSaleSchema = z.object({
  customerId: z.string().optional(),
  outletId: z.string(),
  cashierId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    discount: z.number().min(0).default(0),
    subtotal: z.number().positive(),
  })),
  subtotal: z.number().positive(),
  discountAmount: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
  grandTotal: z.number().positive(),
  paymentMethod: z.enum(['CASH', 'CARD', 'MOBILE', 'BANK_TRANSFER']),
  paymentStatus: z.enum(['PENDING', 'PAID', 'REFUNDED']).default('PAID'),
  notes: z.string().optional(),
});

// Get all sales with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      outletId,
      cashierId,
      customerId,
      status,
      startDate,
      endDate
    } = req.query;

    const where: any = {};

    if (outletId) where.outletId = outletId;
    if (cashierId) where.cashierId = cashierId;
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          customer: true,
          cashier: true,
          outlet: true,
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.sale.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        sales,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get single sale by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        cashier: true,
        outlet: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sale',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new sale
router.post('/', async (req, res) => {
  try {
    const saleData = createSaleSchema.parse(req.body);

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the sale
      const sale = await tx.sale.create({
        data: {
          customerId: saleData.customerId,
          outletId: saleData.outletId,
          cashierId: saleData.cashierId,
          subtotal: saleData.subtotal,
          discountAmount: saleData.discountAmount,
          taxAmount: saleData.taxAmount,
          grandTotal: saleData.grandTotal,
          paymentMethod: saleData.paymentMethod,
          paymentStatus: saleData.paymentStatus,
          notes: saleData.notes,
          status: 'COMPLETED',
          items: {
            create: saleData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              subtotal: item.subtotal,
            }))
          }
        },
        include: {
          customer: true,
          cashier: true,
          outlet: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Update product stock for each item
      for (const item of saleData.items) {
        // Find current stock for this product and outlet
        const currentStock = await tx.productStock.findFirst({
          where: {
            productId: item.productId,
            outletId: saleData.outletId
          }
        });

        if (currentStock) {
          // Update existing stock
          const newQuantity = currentStock.quantity - item.quantity;
          await tx.productStock.update({
            where: { id: currentStock.id },
            data: { quantity: Math.max(0, newQuantity) }
          });

          // Create stock movement record
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              outletId: saleData.outletId,
              type: 'OUT',
              qty: -item.quantity,
              qtyBefore: currentStock.quantity,
              qtyAfter: newQuantity,
              reason: `Sale #${sale.id}`,
              userId: saleData.cashierId,
            }
          });
        } else {
          // Create new stock record if it doesn't exist
          await tx.productStock.create({
            data: {
              productId: item.productId,
              outletId: saleData.outletId,
              quantity: Math.max(0, -item.quantity),
              minStock: 0,
            }
          });
        }
      }

      return sale;
    });

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sale',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update sale (void/refund)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const sale = await prisma.sale.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(notes && { notes }),
      },
      include: {
        customer: true,
        cashier: true,
        outlet: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Sale updated successfully',
      data: sale
    });
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sale',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Void sale
router.post('/:id/void', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Get the original sale
      const originalSale = await tx.sale.findUnique({
        where: { id },
        include: {
          items: true
        }
      });

      if (!originalSale) {
        throw new Error('Sale not found');
      }

      if (originalSale.status === 'VOIDED') {
        throw new Error('Sale is already voided');
      }

      // Update sale status
      const voidedSale = await tx.sale.update({
        where: { id },
        data: {
          status: 'VOIDED',
          paymentStatus: 'REFUNDED',
          notes: reason || 'Sale voided',
        }
      });

      // Restore product stock
      for (const item of originalSale.items) {
        const currentStock = await tx.productStock.findFirst({
          where: {
            productId: item.productId,
            outletId: originalSale.outletId
          }
        });

        if (currentStock) {
          const newQuantity = currentStock.quantity + item.quantity;
          await tx.productStock.update({
            where: { id: currentStock.id },
            data: { quantity: newQuantity }
          });

          // Create stock movement record
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              outletId: originalSale.outletId,
              type: 'IN',
              qty: item.quantity,
              qtyBefore: currentStock.quantity,
              qtyAfter: newQuantity,
              reason: `Voided Sale #${id}`,
              userId: originalSale.cashierId,
            }
          });
        }
      }

      return voidedSale;
    });

    res.json({
      success: true,
      message: 'Sale voided successfully',
      data: result
    });
  } catch (error) {
    console.error('Error voiding sale:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to void sale',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;