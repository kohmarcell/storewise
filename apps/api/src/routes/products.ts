import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        uom: true,
        barcodes: true,
        productStocks: {
          include: {
            outlet: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: products.map(product => ({
        id: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        description: product.description,
        category: product.category,
        brand: product.brand,
        uom: product.uom,
        costPrice: product.costPrice,
        sellPrice: product.sellPrice,
        stockQty: product.productStocks.reduce((total, stock) => total + stock.quantity, 0),
        minQty: product.minQty,
        maxQty: product.maxQty,
        reorderPoint: product.reorderPoint,
        tags: JSON.parse(product.tags || '[]'),
        specifications: JSON.parse(product.specifications || '{}'),
        barcodes: product.barcodes,
        stockLevels: product.productStocks,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        uom: true,
        barcodes: true,
        productStocks: {
          include: {
            outlet: true
          }
        },
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        description: product.description,
        category: product.category,
        brand: product.brand,
        uom: product.uom,
        costPrice: product.costPrice,
        sellPrice: product.sellPrice,
        stockQty: product.productStocks.reduce((total, stock) => total + stock.quantity, 0),
        minQty: product.minQty,
        maxQty: product.maxQty,
        reorderPoint: product.reorderPoint,
        reorderQty: product.reorderQty,
        tags: JSON.parse(product.tags || '[]'),
        specifications: JSON.parse(product.specifications || '{}'),
        barcodes: product.barcodes,
        stockLevels: product.productStocks,
        images: product.images,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const productData = req.body;

    const product = await prisma.product.create({
      data: {
        ...productData,
        tags: JSON.stringify(productData.tags || []),
        specifications: JSON.stringify(productData.specifications || {}),
      },
      include: {
        category: true,
        uom: true,
        barcodes: true,
        productStocks: {
          include: {
            outlet: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        tags: JSON.stringify(productData.tags || []),
        specifications: JSON.stringify(productData.specifications || {}),
      },
      include: {
        category: true,
        uom: true,
        barcodes: true,
        productStocks: {
          include: {
            outlet: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        uom: true,
        productStocks: {
          include: {
            outlet: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        category: true,
        uom: true,
        productStocks: {
          include: {
            outlet: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;