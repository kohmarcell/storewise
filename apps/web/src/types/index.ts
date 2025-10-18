// User types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  photoUrl?: string
  roleId: string
  outletId?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  role?: Role
  outlet?: Outlet
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface Outlet {
  id: string
  code: string
  name: string
  address?: string
  phone?: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Product types
export interface Product {
  id: string
  sku: string
  name: string
  slug?: string
  description?: string
  categoryId: string
  brand?: string
  uomId: string
  costPrice: number
  sellPrice: number
  stockQty: number
  minQty: number
  maxQty?: number
  reorderPoint?: number
  reorderQty?: number
  tags: string[]
  specifications: Record<string, any>
  isActive: boolean
  isVariant: boolean
  parentProductId?: string
  createdAt: string
  updatedAt: string
  category?: Category
  uom?: UnitOfMeasure
  images?: ProductImage[]
  barcodes?: ProductBarcode[]
}

export interface Category {
  id: string
  parentId?: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  parent?: Category
  children?: Category[]
}

export interface UnitOfMeasure {
  id: string
  name: string
  abbreviation: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  productId: string
  imageUrl: string
  thumbnailUrl?: string
  sortOrder: number
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductBarcode {
  id: string
  productId: string
  barcode: string
  barcodeType: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

// Sales types
export interface Sale {
  id: string
  invoiceNumber: string
  outletId: string
  cashierId: string
  customerId?: string
  shiftId: string
  subtotal: number
  discountAmount: number
  discountPercent: number
  taxAmount: number
  grandTotal: number
  paidAmount: number
  changeAmount: number
  paymentMethod: string
  status: string
  syncStatus: string
  notes?: string
  voidedAt?: string
  voidedBy?: string
  voidReason?: string
  createdAt: string
  updatedAt: string
  outlet?: Outlet
  cashier?: User
  customer?: Customer
  shift?: Shift
  items?: SaleItem[]
  payments?: SalePayment[]
}

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  batchId?: string
  qty: number
  uomId: string
  price: number
  discountAmount: number
  discountPercent: number
  subtotal: number
  costPrice: number
  createdAt: string
  updatedAt: string
  product?: Product
  batch?: Batch
  uom?: UnitOfMeasure
}

export interface SalePayment {
  id: string
  saleId: string
  paymentMethod: string
  amount: number
  referenceNo?: string
  cardType?: string
  cardLastFour?: string
  approvalCode?: string
  createdAt: string
  updatedAt: string
}

export interface Shift {
  id: string
  shiftNo: string
  outletId: string
  cashierId: string
  openedAt: string
  closedAt?: string
  openingCash: number
  closingCash?: number
  expectedCash?: number
  variance?: number
  totalSales: number
  totalTransactions: number
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
  outlet?: Outlet
  cashier?: User
}

// Customer types
export interface Customer {
  id: string
  code: string
  name: string
  phone: string
  email?: string
  address?: string
  city?: string
  postalCode?: string
  birthday?: string
  gender?: string
  tierId?: string
  points: number
  lifetimePurchase: number
  totalTransactions: number
  lastTransactionAt?: string
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  tier?: CustomerTier
  sales?: Sale[]
}

export interface CustomerTier {
  id: string
  name: string
  minLifetimePurchase: number
  discountPercent: number
  pointMultiplier: number
  benefits: string[]
  color: string
  createdAt: string
  updatedAt: string
}

// Inventory types
export interface StockMovement {
  id: string
  productId: string
  batchId?: string
  outletId: string
  type: string
  qty: number
  qtyBefore: number
  qtyAfter: number
  refType: string
  refId?: string
  userId?: string
  notes?: string
  productName?: string
  batchNo?: string
  createdAt: string
  product?: Product
  batch?: Batch
  outlet?: Outlet
}

export interface Batch {
  id: string
  batchNo: string
  productId: string
  mfgDate?: string
  expDate?: string
  qty: number
  costPrice?: number
  receivedDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
  product?: Product
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
  outletId?: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Form types
export interface CreateProductRequest {
  sku: string
  name: string
  description?: string
  categoryId: string
  brand?: string
  uomId: string
  costPrice: number
  sellPrice: number
  minQty: number
  maxQty?: number
  reorderPoint?: number
  reorderQty?: number
  tags: string[]
  specifications?: Record<string, any>
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

export interface CreateCustomerRequest {
  name: string
  phone: string
  email?: string
  address?: string
  city?: string
  postalCode?: string
  birthday?: string
  gender?: string
  notes?: string
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string
}

// Dashboard types
export interface DashboardKPI {
  totalSales: number
  totalTransactions: number
  totalCustomers: number
  totalProducts: number
  lowStockProducts: number
  todaySales: number
  weekSales: number
  monthSales: number
}

export interface SalesChart {
  date: string
  sales: number
  transactions: number
}

export interface CategorySales {
  categoryName: string
  sales: number
  percentage: number
}

export interface TopProduct {
  productId: string
  productName: string
  quantity: number
  revenue: number
}