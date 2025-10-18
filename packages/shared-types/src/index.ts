// Base Types
export type UUID = string;
export type Timestamp = string;
export type Amount = number;

// Base Entity Interface
export interface BaseEntity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
}

// Authentication Types
export interface User extends BaseEntity {
  email: string;
  name: string;
  phone?: string;
  photoUrl?: string;
  roleId: UUID;
  outletId?: UUID;
  isActive: boolean;
  lastLoginAt?: Timestamp;
}

export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// Product Types
export interface Product extends BaseEntity {
  sku: string;
  name: string;
  slug?: string;
  description?: string;
  categoryId: UUID;
  brand?: string;
  uomId: UUID;
  costPrice: Amount;
  sellPrice: Amount;
  stockQty: number;
  minQty: number;
  maxQty?: number;
  reorderPoint?: number;
  reorderQty?: number;
  tags: string[];
  specifications: Record<string, any>;
  isActive: boolean;
  isVariant: boolean;
  parentProductId?: UUID;
  images: ProductImage[];
  barcodes: ProductBarcode[];
  category?: Category;
  uom?: UnitOfMeasure;
}

export interface Category extends BaseEntity {
  parentId?: UUID;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
}

export interface ProductImage extends BaseEntity {
  productId: UUID;
  imageUrl: string;
  thumbnailUrl?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductBarcode extends BaseEntity {
  productId: UUID;
  barcode: string;
  barcodeType: 'EAN13' | 'CODE128' | 'QR';
  isPrimary: boolean;
}

export interface UnitOfMeasure extends BaseEntity {
  name: string;
  abbreviation: string;
  type: 'QUANTITY' | 'WEIGHT' | 'VOLUME';
}

// Sales & POS Types
export interface Sale extends BaseEntity {
  invoiceNumber: string;
  outletId: UUID;
  cashierId: UUID;
  customerId?: UUID;
  shiftId: UUID;
  subtotal: Amount;
  discountAmount: Amount;
  discountPercent: number;
  taxAmount: Amount;
  grandTotal: Amount;
  paidAmount: Amount;
  changeAmount: Amount;
  paymentMethod: 'CASH' | 'CARD' | 'QRIS' | 'EWALLET' | 'SPLIT';
  status: 'HOLD' | 'COMPLETED' | 'VOIDED' | 'REFUNDED';
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
  notes?: string;
  voidedAt?: Timestamp;
  voidedBy?: UUID;
  voidReason?: string;
  items: SaleItem[];
  payments: SalePayment[];
  customer?: Customer;
  cashier?: User;
}

export interface SaleItem extends BaseEntity {
  saleId: UUID;
  productId: UUID;
  batchId?: UUID;
  qty: number;
  uomId: UUID;
  price: Amount;
  discountAmount: Amount;
  discountPercent: number;
  subtotal: Amount;
  costPrice: Amount;
  product?: Product;
  batch?: Batch;
}

export interface SalePayment extends BaseEntity {
  saleId: UUID;
  paymentMethod: string;
  amount: Amount;
  referenceNo?: string;
  cardType?: string;
  cardLastFour?: string;
  approvalCode?: string;
}

export interface Shift extends BaseEntity {
  shiftNo: string;
  outletId: UUID;
  cashierId: UUID;
  openedAt: Timestamp;
  closedAt?: Timestamp;
  openingCash: Amount;
  closingCash?: Amount;
  expectedCash?: Amount;
  variance?: Amount;
  totalSales: Amount;
  totalTransactions: number;
  status: 'OPEN' | 'CLOSED';
  notes?: string;
  cashier?: User;
}

// Customer Types
export interface Customer extends BaseEntity {
  code: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  birthday?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  tierId?: UUID;
  points: number;
  lifetimePurchase: Amount;
  totalTransactions: number;
  lastTransactionAt?: Timestamp;
  notes?: string;
  isActive: boolean;
  tier?: CustomerTier;
}

export interface CustomerTier extends BaseEntity {
  name: string;
  minLifetimePurchase: Amount;
  discountPercent: number;
  pointMultiplier: number;
  benefits: string[];
  color: string;
}

export interface CustomerPointsHistory extends BaseEntity {
  customerId: UUID;
  type: 'EARN' | 'REDEEM' | 'EXPIRE' | 'ADJUST';
  points: number;
  referenceType?: string;
  referenceId?: UUID;
  description?: string;
  balanceAfter: number;
  expiresAt?: Timestamp;
}

// Inventory Types
export interface StockMovement extends BaseEntity {
  productId: UUID;
  batchId?: UUID;
  outletId: UUID;
  type: 'SALE' | 'PURCHASE' | 'ADJUSTMENT' | 'TRANSFER_OUT' | 'TRANSFER_IN';
  qty: number;
  qtyBefore: number;
  qtyAfter: number;
  refType: string;
  refId?: UUID;
  userId?: UUID;
  notes?: string;
  productName?: string;
  batchNo?: string;
}

export interface Batch extends BaseEntity {
  batchNo: string;
  productId: UUID;
  mfgDate?: string;
  expDate?: string;
  qty: number;
  costPrice?: Amount;
  receivedDate?: string;
  notes?: string;
}

export interface StockAdjustment extends BaseEntity {
  adjustmentNo: string;
  outletId: UUID;
  type: 'IN' | 'OUT' | 'DAMAGED' | 'EXPIRED' | 'LOST' | 'FOUND';
  reason?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  totalItems: number;
  adjustedBy?: UUID;
  approvedBy?: UUID;
  approvedAt?: Timestamp;
  notes?: string;
  items: StockAdjustmentItem[];
}

export interface StockAdjustmentItem extends BaseEntity {
  adjustmentId: UUID;
  productId: UUID;
  batchId?: UUID;
  qty: number;
  notes?: string;
  productName?: string;
}

export interface StockOpname extends BaseEntity {
  opnameNo: string;
  outletId: UUID;
  scheduledDate: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalItems: number;
  totalVariance: number;
  createdBy?: UUID;
  completedBy?: UUID;
  completedAt?: Timestamp;
  notes?: string;
  items: StockOpnameItem[];
}

export interface StockOpnameItem extends BaseEntity {
  opnameId: UUID;
  productId: UUID;
  systemQty: number;
  physicalQty?: number;
  variance: number;
  notes?: string;
  countedBy?: UUID;
  countedAt?: Timestamp;
  productName?: string;
}

export interface StockTransfer extends BaseEntity {
  transferNo: string;
  fromOutletId: UUID;
  toOutletId: UUID;
  status: 'DRAFT' | 'PENDING' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
  totalItems: number;
  requestedBy?: UUID;
  approvedBy?: UUID;
  sentBy?: UUID;
  receivedBy?: UUID;
  requestedAt?: Timestamp;
  approvedAt?: Timestamp;
  sentAt?: Timestamp;
  receivedAt?: Timestamp;
  notes?: string;
  items: StockTransferItem[];
}

export interface StockTransferItem extends BaseEntity {
  transferId: UUID;
  productId: UUID;
  batchId?: UUID;
  qtyRequested: number;
  qtySent?: number;
  qtyReceived?: number;
  notes?: string;
  productName?: string;
}

// Supplier Types
export interface Supplier extends BaseEntity {
  code: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: Amount;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountName?: string;
  rating?: number;
  notes?: string;
  isActive: boolean;
}

export interface PurchaseOrder extends BaseEntity {
  poNumber: string;
  supplierId: UUID;
  outletId: UUID;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'SENT' | 'CONFIRMED' | 'RECEIVED' | 'CANCELLED';
  subtotal: Amount;
  discount: Amount;
  tax: Amount;
  grandTotal: Amount;
  paymentTerms?: string;
  expectedDate?: string;
  notes?: string;
  orderedBy?: UUID;
  approvedBy?: UUID;
  orderedAt?: Timestamp;
  approvedAt?: Timestamp;
  sentAt?: Timestamp;
  receivedAt?: Timestamp;
  items: PurchaseOrderItem[];
  supplier?: Supplier;
}

export interface PurchaseOrderItem extends BaseEntity {
  poId: UUID;
  productId: UUID;
  qty: number;
  uomId: UUID;
  costPrice: Amount;
  discount: Amount;
  tax: Amount;
  subtotal: Amount;
  notes?: string;
  productName?: string;
}

export interface GoodsReceipt extends BaseEntity {
  grnNumber: string;
  poId?: UUID;
  outletId: UUID;
  receivedBy: UUID;
  receivedAt: Timestamp;
  notes?: string;
  items: GoodsReceiptItem[];
}

export interface GoodsReceiptItem extends BaseEntity {
  grnId: UUID;
  poItemId?: UUID;
  productId: UUID;
  batchNo?: string;
  mfgDate?: string;
  expDate?: string;
  qtyOrdered: number;
  qtyReceived: number;
  qtyDamaged: number;
  costPrice?: Amount;
  notes?: string;
  productName?: string;
}

export interface SupplierPayment extends BaseEntity {
  paymentNo: string;
  supplierId: UUID;
  poId?: UUID;
  amount: Amount;
  paymentMethod: 'CASH' | 'TRANSFER' | 'CHECK' | 'GIRO';
  referenceNo?: string;
  paymentDate: string;
  notes?: string;
  paidBy?: UUID;
  supplier?: Supplier;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
  meta: {
    timestamp: string;
    requestId: string;
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Report Types
export interface DailySalesSummary {
  date: string;
  outletId: UUID;
  totalTransactions: number;
  totalRevenue: Amount;
  averageTransactionValue: Amount;
  totalItemsSold: number;
  totalDiscount: Amount;
  totalTax: Amount;
  netRevenue: Amount;
  salesByHour: SalesByHour[];
  salesByPaymentMethod: SalesByPaymentMethod[];
}

export interface SalesByHour {
  hour: number;
  revenue: Amount;
  transactions: number;
}

export interface SalesByPaymentMethod {
  method: string;
  amount: Amount;
  count: number;
  percentage: number;
}

export interface TopProduct {
  productId: UUID;
  productName: string;
  sku: string;
  totalQty: number;
  totalRevenue: Amount;
  averagePrice: Amount;
  rank: number;
}

export interface StockValueReport {
  totalProducts: number;
  totalStockValue: Amount;
  totalStockQty: number;
  lowStockCount: number;
  outOfStockCount: number;
  categories: CategoryStockValue[];
}

export interface CategoryStockValue {
  categoryId: UUID;
  categoryName: string;
  stockValue: Amount;
  productCount: number;
}

export interface StockInfo {
  productId: UUID;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  status: 'normal' | 'low_stock' | 'out_of_stock' | 'overstock';
  lastUpdated: Timestamp;
}

// UI State Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: Amount;
  discount: Amount;
  subtotal: Amount;
}

export interface CartState {
  items: CartItem[];
  total: Amount;
  totalItems: number;
  customer?: Customer;
  discount: Amount;
  tax: Amount;
  grandTotal: Amount;
}

export interface Notification {
  id: UUID;
  type: 'info' | 'warning' | 'error' | 'success';
  category: string;
  title: string;
  message: string;
  link?: string;
  data?: any;
  read: boolean;
  readAt?: Timestamp;
  createdAt: Timestamp;
}

export interface SystemSettings {
  storeName: string;
  storeLogo?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  currency: string;
  timezone: string;
  taxRate: number;
}

// Form Types
export interface CreateProductRequest {
  name: string;
  sku?: string;
  description?: string;
  categoryId: UUID;
  brand?: string;
  uomId: UUID;
  costPrice: Amount;
  sellPrice: Amount;
  stockQty: number;
  minQty: number;
  maxQty?: number;
  reorderPoint?: number;
  reorderQty?: number;
  tags?: string[];
  specifications?: Record<string, any>;
  barcodes?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  categoryId?: UUID;
  brand?: string;
  uomId?: UUID;
  costPrice?: Amount;
  sellPrice?: Amount;
  minQty?: number;
  maxQty?: number;
  reorderPoint?: number;
  reorderQty?: number;
  tags?: string[];
  specifications?: Record<string, any>;
  isActive?: boolean;
}

export interface CreateSaleRequest {
  customerId?: UUID;
  items: CreateSaleItemRequest[];
  payments: CreatePaymentRequest[];
  notes?: string;
}

export interface CreateSaleItemRequest {
  productId: UUID;
  qty: number;
  price?: Amount;
  discountAmount?: Amount;
  discountPercent?: number;
}

export interface CreatePaymentRequest {
  paymentMethod: string;
  amount: Amount;
  referenceNo?: string;
  cardType?: string;
  cardLastFour?: string;
  approvalCode?: string;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  birthday?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  notes?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  birthday?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  notes?: string;
  isActive?: boolean;
}

// Zod Schemas
import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  brand: z.string().max(100).optional(),
  uomId: z.string().uuid(),
  costPrice: z.number().positive().optional(),
  sellPrice: z.number().positive(),
  stockQty: z.number().min(0),
  minQty: z.number().min(0),
  maxQty: z.number().positive().optional(),
  reorderPoint: z.number().min(0).optional(),
  reorderQty: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
  barcodes: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createSaleSchema = z.object({
  customerId: z.string().uuid().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    qty: z.number().positive(),
    price: z.number().positive().optional(),
    discountAmount: z.number().min(0).optional(),
    discountPercent: z.number().min(0).max(100).optional(),
  })),
  payments: z.array(z.object({
    paymentMethod: z.string(),
    amount: z.number().positive(),
    referenceNo: z.string().optional(),
    cardType: z.string().optional(),
    cardLastFour: z.string().optional(),
    approvalCode: z.string().optional(),
  })),
  notes: z.string().optional(),
});

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(255),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  notes: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();