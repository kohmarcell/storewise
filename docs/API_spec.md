# 📡 StoreWise API Specification

> **API Documentation for StoreWise Frontend-Backend Integration (Current Implementation)**

---

## 📋 Table of Contents

1. [API Overview](#api-overview)
2. [Base URL & Headers](#base-url--headers)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Pagination & Filtering](#pagination--filtering)
6. [Product Management](#product-management)
7. [Category Management](#category-management)
8. [Sales Management](#sales-management)
9. [Customer Management](#customer-management)
10. [Reports & Analytics](#reports--analytics)

---

## 🔍 API Overview

### **API Architecture (Current Implementation)**

- **RESTful Design**: Following REST conventions with proper HTTP methods
- **No Versioning**: Simple `/api/` endpoint structure
- **JSON Format**: All requests and responses use JSON
- **CORS Enabled**: Cross-origin requests supported
- **Express.js**: Built with Express and TypeScript
- **Prisma ORM**: Type-safe database operations

### **Base URL**

```
Development: http://localhost:3009/api
Production: [To be configured based on deployment]
```

---

## 🔐 Authentication

### **Authentication Flow**

1. User logs in with email/password
2. Server validates credentials
3. Server returns access token (15min) and refresh token (7days)
4. Client includes access token in Authorization header
5. Client refreshes token when access token expires

### **Token Management**

```typescript
// Access Token (15 minutes)
{
  "type": "access",
  "userId": "uuid",
  "email": "user@example.com",
  "roleId": "uuid",
  "permissions": ["pos.create_sale", "inventory.view_products"],
  "iat": 1642694400,
  "exp": 1642695300
}

// Refresh Token (7 days)
{
  "type": "refresh",
  "userId": "uuid",
  "tokenId": "uuid",
  "iat": 1642694400,
  "exp": 1643299200
}
```

---

## 🌐 Base URL & Headers

### **Common Headers**

```typescript
// Required headers for all authenticated requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <access_token>',
  'X-Request-ID': 'unique-request-id',
};
```

### **Request ID Generation**

```typescript
// Generate unique request ID for tracking
const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
```

---

## 📤 Response Format

### **Success Response**

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta: {
    timestamp: string;
    requestId: string;
    pagination?: PaginationMeta;
  };
}

// Example
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Coca Cola",
    "sku": "CC-001",
    "price": 5000
  },
  "message": "Product created successfully",
  "meta": {
    "timestamp": "2025-01-16T10:30:00Z",
    "requestId": "req_1642694400_abc123",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### **Error Response**

```typescript
interface ErrorResponse {
  success: false;
  error: {
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
  };
}

// Example
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-16T10:30:00Z",
    "requestId": "req_1642694400_abc123"
  }
}
```

---

## ⚠️ Error Handling

### **HTTP Status Codes**

| Status | Code | Description |
|--------|------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Successful deletion |
| 400 | BAD_REQUEST | Invalid request data |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict |
| 422 | UNPROCESSABLE_ENTITY | Validation failed |
| 429 | TOO_MANY_REQUESTS | Rate limit exceeded |
| 500 | INTERNAL_SERVER_ERROR | Server error |

### **Error Codes**

```typescript
enum ErrorCodes {
  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Authentication Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Permission Errors
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  FORBIDDEN = 'FORBIDDEN',
  
  // Resource Errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Business Logic Errors
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  INVALID_OPERATION = 'INVALID_OPERATION',
  
  // System Errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}
```

---

## 📄 Pagination & Filtering

### **Pagination Parameters**

```typescript
interface PaginationParams {
  page?: number;        // Page number (default: 1)
  limit?: number;       // Items per page (default: 20, max: 100)
  sortBy?: string;      // Sort field
  sortOrder?: 'asc' | 'desc'; // Sort direction (default: desc)
}

// Example: GET /api/v1/products?page=1&limit=20&sortBy=name&sortOrder=asc
```

### **Filtering Parameters**

```typescript
interface FilterParams {
  search?: string;      // Search query
  category?: string;    // Filter by category ID
  status?: 'active' | 'inactive'; // Filter by status
  dateFrom?: string;    // ISO date string
  dateTo?: string;      // ISO date string
}

// Example: GET /api/v1/products?search=coca&category=uuid&status=active
```

### **Pagination Response**

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

---

## 📝 TypeScript Types

### **Base Types**

```typescript
// UUID type for all IDs
type UUID = string;

// Timestamp format
type Timestamp = string; // ISO 8601 format

// Money amount (in smallest currency unit)
type Amount = number;

// Generic entity with timestamps
interface BaseEntity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
}
```

### **User & Authentication Types**

```typescript
interface User extends BaseEntity {
  email: string;
  name: string;
  phone?: string;
  photoUrl?: string;
  roleId: UUID;
  outletId?: UUID;
  isActive: boolean;
  lastLoginAt?: Timestamp;
}

interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
```

### **Product Types**

```typescript
interface Product extends BaseEntity {
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

interface Category extends BaseEntity {
  parentId?: UUID;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
}

interface ProductImage extends BaseEntity {
  productId: UUID;
  imageUrl: string;
  thumbnailUrl?: string;
  sortOrder: number;
  isPrimary: boolean;
}

interface ProductBarcode extends BaseEntity {
  productId: UUID;
  barcode: string;
  barcodeType: 'EAN13' | 'CODE128' | 'QR';
  isPrimary: boolean;
}

interface UnitOfMeasure extends BaseEntity {
  name: string;
  abbreviation: string;
  type: 'QUANTITY' | 'WEIGHT' | 'VOLUME';
}
```

### **Sales Types**

```typescript
interface Sale extends BaseEntity {
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

interface SaleItem extends BaseEntity {
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

interface SalePayment extends BaseEntity {
  saleId: UUID;
  paymentMethod: string;
  amount: Amount;
  referenceNo?: string;
  cardType?: string;
  cardLastFour?: string;
  approvalCode?: string;
}

interface Shift extends BaseEntity {
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
```

---

## 🔑 Authentication Endpoints

### **POST /auth/login**

Login user with email and password.

**Request:**
```typescript
POST /api/v1/auth/login
{
  "email": "cashier@storewise.com",
  "password": "securePassword123",
  "rememberMe": true
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "cashier@storewise.com",
      "name": "John Doe",
      "roleId": "550e8400-e29b-41d4-a716-446655440001"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

### **POST /auth/refresh**

Refresh access token using refresh token.

**Request:**
```typescript
POST /api/v1/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

### **POST /auth/logout**

Logout user and invalidate tokens.

**Request:**
```typescript
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "message": "Logged out successfully"
}
```

### **GET /auth/me**

Get current user profile.

**Request:**
```typescript
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "cashier@storewise.com",
    "name": "John Doe",
    "roleId": "550e8400-e29b-41d4-a716-446655440001",
    "permissions": ["pos.create_sale", "inventory.view_products"]
  }
}
```

---

## 📦 Product Management

### **GET /products**

Get list of products with pagination and filtering.

**Request:**
```typescript
GET /api/v1/products?page=1&limit=20&search=coca&category=uuid&status=active&sortBy=name&sortOrder=asc
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "sku": "CC-001",
      "name": "Coca Cola 330ml",
      "sellPrice": 5000,
      "stockQty": 150,
      "category": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Beverages"
      },
      "images": [
        {
          "imageUrl": "https://example.com/product.jpg",
          "isPrimary": true
        }
      ]
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### **GET /products/:id**

Get single product by ID.

**Request:**
```typescript
GET /api/v1/products/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "sku": "CC-001",
    "name": "Coca Cola 330ml",
    "description": "Refreshing cola drink",
    "sellPrice": 5000,
    "costPrice": 3500,
    "stockQty": 150,
    "category": {...},
    "images": [...],
    "barcodes": [...]
  }
}
```

### **POST /products**

Create new product.

**Request:**
```typescript
POST /api/v1/products
Authorization: Bearer <access_token>
{
  "name": "Coca Cola 330ml",
  "sku": "CC-001",
  "description": "Refreshing cola drink",
  "categoryId": "550e8400-e29b-41d4-a716-446655440001",
  "uomId": "550e8400-e29b-41d4-a716-446655440002",
  "sellPrice": 5000,
  "costPrice": 3500,
  "stockQty": 100,
  "minQty": 10,
  "tags": ["beverage", "cola"]
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "sku": "CC-001",
    "name": "Coca Cola 330ml",
    // ... other fields
  },
  "message": "Product created successfully"
}
```

### **PUT /products/:id**

Update existing product.

**Request:**
```typescript
PUT /api/v1/products/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <access_token>
{
  "name": "Coca Cola 330ml",
  "sellPrice": 5500,
  "description": "Refreshing cola drink - new formula"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    // Updated product object
  },
  "message": "Product updated successfully"
}
```

### **DELETE /products/:id**

Delete product (soft delete).

**Request:**
```typescript
DELETE /api/v1/products/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### **GET /products/barcode/:barcode**

Get product by barcode.

**Request:**
```typescript
GET /api/v1/products/barcode/1234567890123
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "sku": "CC-001",
    "name": "Coca Cola 330ml",
    "sellPrice": 5000,
    "stockQty": 150
  }
}
```

---

## 💰 Sales & POS

### **POST /sales**

Create new sale transaction.

**Request:**
```typescript
POST /api/v1/sales
Authorization: Bearer <access_token>
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "qty": 2,
      "price": 5000,
      "discountAmount": 0
    },
    {
      "productId": "550e8400-e29b-41d4-a716-446655440002",
      "qty": 1,
      "price": 3000,
      "discountAmount": 500
    }
  ],
  "payments": [
    {
      "paymentMethod": "CASH",
      "amount": 12500
    }
  ],
  "notes": "Customer requested extra bag"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "invoiceNumber": "INV-20250116-0001",
    "subtotal": 13000,
    "discountAmount": 500,
    "grandTotal": 12500,
    "paidAmount": 12500,
    "changeAmount": 0,
    "status": "COMPLETED",
    "items": [...],
    "payments": [...]
  },
  "message": "Sale completed successfully"
}
```

### **GET /sales**

Get list of sales with pagination and filtering.

**Request:**
```typescript
GET /api/v1/sales?page=1&limit=20&dateFrom=2025-01-15&dateTo=2025-01-16&status=COMPLETED&cashierId=uuid
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "invoiceNumber": "INV-20250116-0001",
      "grandTotal": 12500,
      "status": "COMPLETED",
      "createdAt": "2025-01-16T10:30:00Z",
      "cashier": {
        "name": "John Doe"
      },
      "customer": {
        "name": "Jane Smith"
      }
    }
  ],
  "meta": {
    "pagination": {...}
  }
}
```

### **GET /sales/:id**

Get single sale by ID.

**Request:**
```typescript
GET /api/v1/sales/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "invoiceNumber": "INV-20250116-0001",
    "subtotal": 13000,
    "discountAmount": 500,
    "grandTotal": 12500,
    "status": "COMPLETED",
    "items": [...],
    "payments": [...],
    "customer": {...},
    "cashier": {...}
  }
}
```

### **POST /sales/:id/void**

Void a sale transaction.

**Request:**
```typescript
POST /api/v1/sales/550e8400-e29b-41d4-a716-446655440000/void
Authorization: Bearer <access_token>
{
  "reason": "Customer requested cancellation"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "VOIDED",
    "voidedAt": "2025-01-16T10:45:00Z",
    "voidReason": "Customer requested cancellation"
  },
  "message": "Sale voided successfully"
}
```

### **POST /sales/:id/refund**

Process refund for a sale.

**Request:**
```typescript
POST /api/v1/sales/550e8400-e29b-41d4-a716-446655440000/refund
Authorization: Bearer <access_token>
{
  "items": [
    {
      "saleItemId": "550e8400-e29b-41d4-a716-446655440001",
      "qty": 1,
      "reason": "Product defective"
    }
  ],
  "reason": "Product quality issue"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "refundNo": "REF-20250116-0001",
    "totalAmount": 5000,
    "items": [...]
  },
  "message": "Refund processed successfully"
}
```

### **POST /sales/hold**

Hold a sale transaction for later completion.

**Request:**
```typescript
POST /api/v1/sales/hold
Authorization: Bearer <access_token>
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "qty": 2,
      "price": 5000
    }
  ],
  "notes": "Customer will pick up later"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "holdNumber": "HOLD-20250116-0001",
    "status": "HOLD"
  },
  "message": "Sale held successfully"
}
```

### **GET /sales/hold**

Get list of held sales.

**Request:**
```typescript
GET /api/v1/sales/hold
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "holdNumber": "HOLD-20250116-0001",
      "items": [...],
      "createdAt": "2025-01-16T10:30:00Z"
    }
  ]
}
```

---

## 📦 Inventory Management

### **GET /inventory/stock**

Get stock levels for products.

**Request:**
```typescript
GET /api/v1/inventory/stock?outletId=uuid&categoryId=uuid&lowStock=true
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "productName": "Coca Cola 330ml",
      "sku": "CC-001",
      "currentStock": 15,
      "minStock": 10,
      "maxStock": 100,
      "reorderPoint": 20,
      "status": "low_stock", // "normal", "low_stock", "out_of_stock", "overstock"
      "lastUpdated": "2025-01-16T10:30:00Z"
    }
  ]
}
```

### **POST /inventory/adjust**

Adjust stock levels.

**Request:**
```typescript
POST /api/v1/inventory/adjust
Authorization: Bearer <access_token>
{
  "type": "IN", // "IN", "OUT", "DAMAGED", "EXPIRED", "LOST"
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "batchId": "550e8400-e29b-41d4-a716-446655440001",
      "qty": 10,
      "notes": "New stock received"
    }
  ],
  "reason": "New stock from supplier",
  "referenceNo": "PO-20250116-0001"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "adjustmentNo": "ADJ-20250116-0001",
    "status": "PENDING",
    "items": [...]
  },
  "message": "Stock adjustment created successfully"
}
```

### **GET /inventory/movements**

Get stock movement history.

**Request:**
```typescript
GET /api/v1/inventory/movements?page=1&limit=20&productId=uuid&type=SALE&dateFrom=2025-01-15
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "productName": "Coca Cola 330ml",
      "type": "SALE",
      "qty": -2,
      "qtyBefore": 17,
      "qtyAfter": 15,
      "referenceType": "sales",
      "referenceId": "550e8400-e29b-41d4-a716-446655440002",
      "createdAt": "2025-01-16T10:30:00Z"
    }
  ],
  "meta": {
    "pagination": {...}
  }
}
```

### **GET /inventory/batches**

Get batch/lot information.

**Request:**
```typescript
GET /api/v1/inventory/batches?productId=uuid&expiring=true
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "batchNo": "CC20250101",
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "productName": "Coca Cola 330ml",
      "mfgDate": "2025-01-01",
      "expDate": "2025-12-31",
      "qty": 50,
      "status": "normal", // "normal", "expiring", "expired"
      "daysUntilExpiry": 349
    }
  ]
}
```

---

## 👥 Customer Management

### **GET /customers**

Get list of customers with pagination and filtering.

**Request:**
```typescript
GET /api/v1/customers?page=1&limit=20&search=john&tier=uuid&isActive=true
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "CUST-00001",
      "name": "John Doe",
      "phone": "+6281234567890",
      "email": "john@example.com",
      "tier": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Silver",
        "discountPercent": 5
      },
      "points": 150,
      "lifetimePurchase": 1500000,
      "totalTransactions": 25,
      "lastTransactionAt": "2025-01-15T14:30:00Z"
    }
  ],
  "meta": {
    "pagination": {...}
  }
}
```

### **POST /customers**

Create new customer.

**Request:**
```typescript
POST /api/v1/customers
Authorization: Bearer <access_token>
{
  "name": "Jane Smith",
  "phone": "+6281234567891",
  "email": "jane@example.com",
  "address": "123 Main Street",
  "birthday": "1990-01-15",
  "gender": "FEMALE",
  "notes": "Regular customer"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "CUST-00002",
    "name": "Jane Smith",
    "phone": "+6281234567891",
    "email": "jane@example.com",
    // ... other fields
  },
  "message": "Customer created successfully"
}
```

### **GET /customers/:id**

Get single customer by ID.

**Request:**
```typescript
GET /api/v1/customers/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "CUST-00001",
    "name": "John Doe",
    "phone": "+6281234567890",
    "email": "john@example.com",
    "address": "123 Main Street",
    "tier": {...},
    "points": 150,
    "lifetimePurchase": 1500000,
    "totalTransactions": 25
  }
}
```

### **GET /customers/:id/history`

Get customer purchase history.

**Request:**
```typescript
GET /api/v1/customers/550e8400-e29b-41d4-a716-446655440000/history?page=1&limit=20
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "saleId": "550e8400-e29b-41d4-a716-446655440001",
      "invoiceNumber": "INV-20250116-0001",
      "grandTotal": 12500,
      "itemsCount": 3,
      "pointsEarned": 1,
      "createdAt": "2025-01-16T10:30:00Z"
    }
  ],
  "meta": {
    "pagination": {...}
  }
}
```

---

## 🚚 Supplier Management

### **GET /suppliers**

Get list of suppliers with pagination and filtering.

**Request:**
```typescript
GET /api/v1/suppliers?page=1&limit=20&search=coca&isActive=true
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "SUP-00001",
      "name": "Coca Cola Company",
      "contactPerson": "John Supplier",
      "phone": "+6281234567890",
      "email": "supplier@cocacola.com",
      "paymentTerms": "NET30",
      "creditLimit": 10000000,
      "rating": 4.5,
      "isActive": true
    }
  ],
  "meta": {
    "pagination": {...}
  }
}
```

### **POST /suppliers**

Create new supplier.

**Request:**
```typescript
POST /api/v1/suppliers
Authorization: Bearer <access_token>
{
  "name": "PepsiCo Indonesia",
  "contactPerson": "Jane Supplier",
  "phone": "+6281234567891",
  "email": "supplier@pepsi.com",
  "address": "456 Supplier Street",
  "paymentTerms": "NET30",
  "creditLimit": 5000000,
  "taxId": "1234567890",
  "bankName": "BCA",
  "bankAccountNo": "1234567890",
  "bankAccountName": "PepsiCo Indonesia"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "SUP-00002",
    "name": "PepsiCo Indonesia",
    // ... other fields
  },
  "message": "Supplier created successfully"
}
```

---

## 📊 Reports & Analytics

### **GET /reports/sales/summary**

Get sales summary report.

**Request:**
```typescript
GET /api/v1/reports/sales/summary?dateFrom=2025-01-01&dateTo=2025-01-31&outletId=uuid
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "totalRevenue": 150000000,
    "totalTransactions": 3000,
    "averageTransactionValue": 50000,
    "totalItemsSold": 8500,
    "totalDiscount": 5000000,
    "totalTax": 15000000,
    "netRevenue": 145000000,
    "salesByPaymentMethod": [
      {
        "method": "CASH",
        "amount": 90000000,
        "count": 1800,
        "percentage": 60
      },
      {
        "method": "QRIS",
        "amount": 45000000,
        "count": 900,
        "percentage": 30
      }
    ],
    "salesByHour": [
      {
        "hour": 9,
        "revenue": 5000000,
        "transactions": 100
      }
    ]
  }
}
```

### **GET /reports/sales/top-products**

Get top selling products report.

**Request:**
```typescript
GET /api/v1/reports/sales/top-products?dateFrom=2025-01-01&dateTo=2025-01-31&limit=10
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "productName": "Coca Cola 330ml",
      "sku": "CC-001",
      "totalQty": 500,
      "totalRevenue": 2500000,
      "averagePrice": 5000,
      "rank": 1
    }
  ]
}
```

### **GET /reports/inventory/stock-value**

Get inventory stock value report.

**Request:**
```typescript
GET /api/v1/reports/inventory/stock-value?outletId=uuid&categoryId=uuid
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "totalProducts": 500,
    "totalStockValue": 50000000,
    "totalStockQty": 10000,
    "lowStockCount": 25,
    "outOfStockCount": 5,
    "categories": [
      {
        "categoryId": "550e8400-e29b-41d4-a716-446655440000",
        "categoryName": "Beverages",
        "stockValue": 15000000,
        "productCount": 100
      }
    ]
  }
}
```

---

## 👤 User Management

### **GET /users**

Get list of users with pagination and filtering.

**Request:**
```typescript
GET /api/v1/users?page=1&limit=20&role=uuid&outletId=uuid&isActive=true
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "cashier@storewise.com",
      "name": "John Doe",
      "phone": "+6281234567890",
      "role": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Cashier"
      },
      "outlet": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Main Store"
      },
      "isActive": true,
      "lastLoginAt": "2025-01-16T09:00:00Z"
    }
  ],
  "meta": {
    "pagination": {...}
  }
}
```

### **POST /users**

Create new user.

**Request:**
```typescript
POST /api/v1/users
Authorization: Bearer <access_token>
{
  "email": "newcashier@storewise.com",
  "name": "New Cashier",
  "phone": "+6281234567891",
  "password": "securePassword123",
  "roleId": "550e8400-e29b-41d4-a716-446655440001",
  "outletId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newcashier@storewise.com",
    "name": "New Cashier",
    // ... other fields
  },
  "message": "User created successfully"
}
```

---

## ⚙️ Settings & Configuration

### **GET /settings**

Get system settings.

**Request:**
```typescript
GET /api/v1/settings?group=GENERAL
Authorization: Bearer <access_token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "key": "STORE_NAME",
      "value": "StoreWise Demo Store",
      "type": "STRING",
      "group": "GENERAL",
      "description": "Store name for receipts and reports"
    },
    {
      "key": "TAX_RATE",
      "value": "11.00",
      "type": "NUMBER",
      "group": "TAX",
      "description": "Default tax rate percentage"
    }
  ]
}
```

### **PUT /settings/:key**

Update system setting.

**Request:**
```typescript
PUT /api/v1/settings/STORE_NAME
Authorization: Bearer <access_token>
{
  "value": "My StoreWise Store"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "key": "STORE_NAME",
    "value": "My StoreWise Store",
    "type": "STRING",
    "group": "GENERAL"
  },
  "message": "Setting updated successfully"
}
```

---

## 🔌 API Integration Examples

### **Frontend API Client Setup**

```typescript
// api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        config.headers['X-Request-ID'] = this.generateRequestId();
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshToken();
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }
  
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    
    try {
      const response = await this.client.post('/auth/refresh', {
        refreshToken,
      });
      
      localStorage.setItem('accessToken', response.data.accessToken);
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }
  
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }
  
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();
```

### **React Query Integration**

```typescript
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const useProducts = (params: ProductListParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => apiClient.get<ProductListResponse>('/products', { params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductRequest) => 
      apiClient.post<ProductResponse>('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      apiClient.put<ProductResponse>(`/products/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};
```

### **Error Handling in Components**

```typescript
// components/ErrorBoundary.tsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Something went wrong
          </h2>
          
          <p className="text-secondary-500 text-center mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Page
          </Button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

---

## 🧪 Testing API Integration

### **Mock API for Testing**

```typescript
// __mocks__/api.ts
import { rest } from 'msw';

export const apiHandlers = [
  // Authentication
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User',
          },
          tokens: {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token',
            expiresIn: 900,
          },
        },
      })
    );
  }),
  
  // Products
  rest.get('/api/v1/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          {
            id: 'test-product-id',
            sku: 'TEST-001',
            name: 'Test Product',
            sellPrice: 5000,
            stockQty: 100,
          },
        ],
        meta: {
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
          },
        },
      })
    );
  }),
];
```

### **Component Testing with API**

```typescript
// components/__tests__/ProductList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductList } from '../ProductList';
import { setupServer } from 'msw/node';
import { apiHandlers } from '../../__mocks__/api';

const server = setupServer(...apiHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProductList', () => {
  it('should display products from API', async () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('TEST-001')).toBeInTheDocument();
      expect(screen.getByText('Rp 5.000')).toBeInTheDocument();
    });
  });
});
```

---

## 📚 API Documentation Generation

### **OpenAPI/Swagger Configuration**

```typescript
// swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StoreWise API',
      version: '1.0.0',
      description: 'POS and Inventory Management API',
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.storewise.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
export const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
};
```

---

**This API specification provides a comprehensive bridge between the StoreWise frontend and backend, ensuring consistent integration and clear communication protocols.**