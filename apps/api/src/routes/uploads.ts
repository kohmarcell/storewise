import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const logosDir = path.join(uploadsDir, 'logos');
const productsDir = path.join(uploadsDir, 'products');

[uploadsDir, logosDir, productsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.params;
    if (type === 'logo') {
      cb(null, logosDir);
    } else if (type === 'product') {
      cb(null, productsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const name = path.basename(file.originalname, extension);
    cb(null, `${name}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload image
router.post('/:type', upload.single('image'), async (req, res) => {
  try {
    const { type } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create file record in database if needed
    if (type === 'product' && req.body.productId) {
      // Save to product images table
      await prisma.productImage.create({
        data: {
          productId: req.body.productId,
          imageUrl: `/uploads/products/${file.filename}`,
          thumbnailUrl: `/uploads/products/${file.filename}`, // You can generate thumbnails here
          sortOrder: parseInt(req.body.sortOrder) || 0,
          isPrimary: req.body.isPrimary === 'true',
        }
      });
    }

    const fileUrl = `/uploads/${type}s/${file.filename}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete image
router.delete('/:type/:filename', async (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(uploadsDir, `${type}s`, filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database if it's a product image
    if (type === 'product') {
      await prisma.productImage.deleteMany({
        where: {
          imageUrl: `/uploads/products/${filename}`
        }
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all uploaded files of a type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const dirPath = path.join(uploadsDir, `${type}s`);

    if (!fs.existsSync(dirPath)) {
      return res.json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(dirPath).map(filename => {
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        url: `/uploads/${type}s/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    });

    res.json({
      success: true,
      data: files.sort((a, b) => b.createdAt - a.createdAt)
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch files',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;