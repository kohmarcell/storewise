import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Default Roles
  console.log('Creating default roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Full system access',
      permissions: JSON.stringify([
        'users.create', 'users.read', 'users.update', 'users.delete',
        'roles.create', 'roles.read', 'roles.update', 'roles.delete',
        'products.create', 'products.read', 'products.update', 'products.delete',
        'sales.create', 'sales.read', 'sales.update', 'sales.delete',
        'inventory.create', 'inventory.read', 'inventory.update', 'inventory.delete',
        'customers.create', 'customers.read', 'customers.update', 'customers.delete',
        'suppliers.create', 'suppliers.read', 'suppliers.update', 'suppliers.delete',
        'reports.read', 'reports.export',
        'settings.read', 'settings.update'
      ]),
      isSystem: true,
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Store Manager' },
    update: {},
    create: {
      name: 'Store Manager',
      description: 'Store management access',
      permissions: JSON.stringify([
        'users.read', 'users.update',
        'products.create', 'products.read', 'products.update',
        'sales.create', 'sales.read', 'sales.update',
        'inventory.create', 'inventory.read', 'inventory.update',
        'customers.create', 'customers.read', 'customers.update',
        'suppliers.create', 'suppliers.read', 'suppliers.update',
        'reports.read'
      ]),
      isSystem: true,
    },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: 'Cashier' },
    update: {},
    create: {
      name: 'Cashier',
      description: 'POS and basic sales access',
      permissions: JSON.stringify([
        'products.read',
        'sales.create', 'sales.read',
        'customers.create', 'customers.read',
        'inventory.read'
      ]),
      isSystem: true,
    },
  });

  // 2. Create Default Outlet
  console.log('Creating default outlet...');
  const defaultOutlet = await prisma.outlet.upsert({
    where: { code: 'OUTLET-001' },
    update: {},
    create: {
      code: 'OUTLET-001',
      name: 'Main Store',
      address: '123 Main Street, Jakarta, Indonesia',
      phone: '+62-21-1234-5678',
      email: 'main@storewise.com',
    },
  });

  // 3. Create Default Admin User
  console.log('Creating default admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@storewise.com' },
    update: {},
    create: {
      email: 'admin@storewise.com',
      name: 'System Administrator',
      phone: '+62-812-3456-7890',
      roleId: adminRole.id,
      outletId: defaultOutlet.id,
      isActive: true,
    },
  });

  // 4. Create Unit of Measures
  console.log('Creating unit of measures...');
  const uoms = [
    { name: 'Pieces', abbreviation: 'pcs', type: 'QUANTITY' },
    { name: 'Kilograms', abbreviation: 'kg', type: 'WEIGHT' },
    { name: 'Liters', abbreviation: 'L', type: 'VOLUME' },
    { name: 'Boxes', abbreviation: 'box', type: 'QUANTITY' },
    { name: 'Bottles', abbreviation: 'btl', type: 'VOLUME' },
    { name: 'Packs', abbreviation: 'pk', type: 'QUANTITY' },
  ];

  for (const uom of uoms) {
    await prisma.unitOfMeasure.upsert({
      where: { name: uom.name },
      update: {},
      create: uom,
    });
  }

  // 5. Create Product Categories
  console.log('Creating product categories...');
  const categories = [
    { name: 'Beverages', slug: 'beverages', description: 'Soft drinks, juices, water' },
    { name: 'Snacks', slug: 'snacks', description: 'Chips, cookies, candies' },
    { name: 'Dairy', slug: 'dairy', description: 'Milk, cheese, yogurt' },
    { name: 'Bakery', slug: 'bakery', description: 'Bread, cakes, pastries' },
    { name: 'Personal Care', slug: 'personal-care', description: 'Soap, shampoo, toothpaste' },
    { name: 'Household', slug: 'household', description: 'Cleaning supplies, paper products' },
    { name: 'Frozen Foods', slug: 'frozen-foods', description: 'Frozen meat, vegetables, desserts' },
    { name: 'Fresh Produce', slug: 'fresh-produce', description: 'Fruits, vegetables' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // 6. Create Customer Tiers
  console.log('Creating customer tiers...');
  const tiers = [
    {
      name: 'Regular',
      minLifetimePurchase: 0,
      discountPercent: 0,
      pointMultiplier: 1,
      benefits: JSON.stringify(['Basic membership']),
      color: '#6B7280',
    },
    {
      name: 'Silver',
      minLifetimePurchase: 500000,
      discountPercent: 5,
      pointMultiplier: 1.2,
      benefits: JSON.stringify(['5% discount', 'Birthday bonus']),
      color: '#9CA3AF',
    },
    {
      name: 'Gold',
      minLifetimePurchase: 1500000,
      discountPercent: 10,
      pointMultiplier: 1.5,
      benefits: JSON.stringify(['10% discount', 'Birthday bonus', 'Exclusive offers']),
      color: '#FCD34D',
    },
    {
      name: 'Platinum',
      minLifetimePurchase: 5000000,
      discountPercent: 15,
      pointMultiplier: 2,
      benefits: JSON.stringify(['15% discount', 'Priority service', 'Exclusive offers', 'Free delivery']),
      color: '#E5E7EB',
    },
  ];

  for (const tier of tiers) {
    await prisma.customerTier.upsert({
      where: { name: tier.name },
      update: {},
      create: tier,
    });
  }

  // 7. Create Sample Products
  console.log('Creating sample products...');
  const beveragesCategory = await prisma.category.findUnique({ where: { slug: 'beverages' } });
  const snacksCategory = await prisma.category.findUnique({ where: { slug: 'snacks' } });
  const dairyCategory = await prisma.category.findUnique({ where: { slug: 'dairy' } });
  const pcsUOM = await prisma.unitOfMeasure.findUnique({ where: { name: 'Pieces' } });
  const kgUOM = await prisma.unitOfMeasure.findUnique({ where: { name: 'Kilograms' } });
  const lUOM = await prisma.unitOfMeasure.findUnique({ where: { name: 'Liters' } });

  if (beveragesCategory && snacksCategory && dairyCategory && pcsUOM && kgUOM && lUOM) {
    const sampleProducts = [
      {
        sku: 'BVR-001',
        name: 'Coca Cola 390ml',
        categoryId: beveragesCategory.id,
        uomId: pcsUOM.id,
        costPrice: 4500,
        sellPrice: 6000,
        stockQty: 100,
        minQty: 20,
        brand: 'Coca Cola',
      },
      {
        sku: 'BVR-002',
        name: 'Aqua Mineral 600ml',
        categoryId: beveragesCategory.id,
        uomId: pcsUOM.id,
        costPrice: 2000,
        sellPrice: 3500,
        stockQty: 150,
        minQty: 30,
        brand: 'Aqua',
      },
      {
        sku: 'SNK-001',
        name: 'Chitato BBQ 75g',
        categoryId: snacksCategory.id,
        uomId: pcsUOM.id,
        costPrice: 5500,
        sellPrice: 7500,
        stockQty: 80,
        minQty: 15,
        brand: 'Chitato',
      },
      {
        sku: 'DRY-001',
        name: 'Ultra Milk Full Cream 1L',
        categoryId: dairyCategory.id,
        uomId: lUOM.id,
        costPrice: 12000,
        sellPrice: 15000,
        stockQty: 60,
        minQty: 10,
        brand: 'Ultra',
      },
    ];

    for (const product of sampleProducts) {
      const createdProduct = await prisma.product.upsert({
        where: { sku: product.sku },
        update: {
          ...product,
          tags: JSON.stringify([]), // Empty tags array
          specifications: "{}", // Empty specifications object
          isActive: true,
        },
        create: {
          ...product,
          tags: JSON.stringify([]), // Empty tags array
          specifications: "{}", // Empty specifications object
          isActive: true,
        },
      });

      // Create product stock for default outlet
      await prisma.productStock.upsert({
        where: {
          productId_outletId: {
            productId: createdProduct.id,
            outletId: defaultOutlet.id,
          },
        },
        update: {
          quantity: product.stockQty,
          minQty: product.minQty,
        },
        create: {
          productId: createdProduct.id,
          outletId: defaultOutlet.id,
          quantity: product.stockQty,
          minQty: product.minQty,
        },
      });

      // Create barcode
      await prisma.productBarcode.upsert({
        where: {
          productId_barcode: {
            productId: createdProduct.id,
            barcode: `899${product.sku.replace(/[^0-9]/g, '')}1234`,
          },
        },
        update: {
          barcodeType: 'EAN13',
          isPrimary: true,
        },
        create: {
          productId: createdProduct.id,
          barcode: `899${product.sku.replace(/[^0-9]/g, '')}1234`,
          barcodeType: 'EAN13',
          isPrimary: true,
        },
      });
    }
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Default credentials:');
  console.log('Email: admin@storewise.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });