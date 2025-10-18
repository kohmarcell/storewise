# 🚀 StoreWise Backend Development Guidelines

> **Production-Ready Backend Architecture for StoreWise POS & Inventory Management System**

---

## 📋 Table of Contents

1. [Technology Stack Selection](#technology-stack-selection)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Database Design](#database-design)
5. [API Design Principles](#api-design-principles)
6. [Authentication & Security](#authentication--security)
7. [Development Workflow](#development-workflow)
8. [Deployment Strategy](#deployment-strategy)
9. [Testing Guidelines](#testing-guidelines)
10. [Performance Optimization](#performance-optimization)

---

## 🛠️ Technology Stack Selection

Based on the requirements from MVP.md, we've selected the following backend technology stack:

### **Core Technologies**

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Runtime** | Node.js 20.x LTS | Long-term support, excellent performance, large ecosystem |
| **Framework** | Express.js 4.19.0 | Minimal, flexible, widely adopted, easy to maintain |
| **Language** | TypeScript 5.5.0 | Type safety, better developer experience, easier maintenance |
| **ORM** | Prisma 5.18.0 | Type-safe database access, excellent migration system, auto-generated client |
| **Database** | PostgreSQL 16+ | Robust, ACID compliant, excellent JSON support, scalable |
| **Cache** | Redis 7.4.0 | Fast in-memory caching, session storage, queue management |
| **Queue** | BullMQ 5.12.0 | Reliable job processing, supports priorities, retries, and delays |

### **Why This Stack is Ideal for StoreWise**

1. **Easy to Use & Maintain**:
   - TypeScript provides type safety throughout the stack
   - Prisma eliminates raw SQL writing while maintaining performance
   - Express.js has minimal learning curve
   - Comprehensive documentation and community support

2. **Production-Ready**:
   - Battle-tested technologies used by enterprises
   - Excellent performance for retail operations
   - Strong security features and best practices
   - Scalable architecture for multi-store growth

3. **Developer Experience**:
   - Hot reload in development
   - Auto-completion and type checking
   - Rich debugging tools
   - Consistent code patterns

---

## 🏗️ Architecture Overview

### **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Cache/Queue   │
                       │   (Redis)       │
                       └─────────────────┘
```

### **Backend Architecture Pattern**

We'll use a **modular monolith** approach with feature-based organization:

```
src/
├── modules/          # Feature modules (POS, Inventory, etc.)
├── shared/           # Shared utilities and types
├── middleware/       # Express middleware
├── config/           # Configuration files
├── utils/            # Helper functions
└── tests/            # Test files
```

### **Key Architectural Principles**

1. **Separation of Concerns**: Each module handles a specific business domain
2. **Dependency Injection**: Easy testing and maintenance
3. **Layered Architecture**: Controllers → Services → Repositories
4. **Error Boundaries**: Centralized error handling
5. **Event-Driven**: Loose coupling between modules

---

## 📁 Project Structure

```
storewise-backend/
├── src/
│   ├── modules/                   # Feature modules
│   │   ├── auth/                  # Authentication module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── types/
│   │   ├── products/              # Product management
│   │   ├── sales/                 # POS & sales
│   │   ├── inventory/             # Inventory management
│   │   ├── customers/             # Customer management
│   │   ├── suppliers/             # Supplier management
│   │   ├── reports/               # Reporting & analytics
│   │   └── settings/              # System settings
│   ├── shared/                    # Shared code
│   │   ├── database/              # Database connection
│   │   ├── cache/                 # Redis connection
│   │   ├── queue/                 # Queue setup
│   │   ├── types/                 # Shared TypeScript types
│   │   ├── utils/                 # Utility functions
│   │   ├── errors/                # Error classes
│   │   └── validations/           # Zod schemas
│   ├── middleware/                # Express middleware
│   │   ├── auth.ts
│   │   ├── cors.ts
│   │   ├── rateLimit.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── config/                    # Configuration
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── auth.ts
│   │   └── app.ts
│   ├── routes/                    # API routes
│   │   ├── index.ts
│   │   └── v1/
│   │       ├── auth.ts
│   │       ├── products.ts
│   │       └── ...
│   ├── app.ts                     # Express app setup
│   └── server.ts                  # Server entry point
├── prisma/                        # Prisma ORM
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/                         # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                          # Documentation
├── scripts/                       # Utility scripts
├── .env.example                   # Environment variables template
├── package.json
├── tsconfig.json
├── jest.config.js
├── docker-compose.yml
└── README.md
```

---

## 🗄️ Database Design

### **Database Setup**

1. **Install PostgreSQL**:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**:
   ```sql
   CREATE DATABASE storewise;
   CREATE USER storewise_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE storewise TO storewise_user;
   ```

3. **Prisma Configuration**:
   ```prisma
   // prisma/schema.prisma
   generator client {
     provider = "prisma-client-js"
   }
   
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

### **Database Schema**

We'll use the comprehensive schema from MVP.md with these key considerations:

1. **UUID Primary Keys**: For distributed systems and security
2. **Soft Deletes**: `deleted_at` columns for data retention
3. **Audit Fields**: `created_at`, `updated_at` on all tables
4. **JSONB Fields**: For flexible metadata and settings
5. **Indexes**: Optimized for common query patterns
6. **Foreign Keys**: With proper cascade actions

### **Migration Strategy**

```bash
# Generate migration after schema changes
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

---

## 🔌 API Design Principles

### **RESTful API Standards**

1. **Resource Naming**: Use plural nouns for collections
   ```
   GET    /api/v1/products       # List products
   GET    /api/v1/products/:id   # Get single product
   POST   /api/v1/products       # Create product
   PUT    /api/v1/products/:id   # Update product
   DELETE /api/v1/products/:id   # Delete product
   ```

2. **HTTP Status Codes**:
   ```
   200 OK              - Successful request
   201 Created         - Resource created
   204 No Content      - Successful deletion
   400 Bad Request     - Validation error
   401 Unauthorized    - Authentication required
   403 Forbidden       - Permission denied
   404 Not Found       - Resource not found
   409 Conflict        - Resource conflict
   422 Unprocessable   - Validation failed
   500 Internal Error  - Server error
   ```

3. **Response Format**:
   ```json
   {
     "success": true,
     "data": {
       // Response data
     },
     "message": "Operation completed successfully",
     "meta": {
       "timestamp": "2025-01-16T10:30:00Z",
       "requestId": "req_123456789"
     }
   }
   ```

### **Error Handling**

```typescript
// Shared error response format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-16T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### **Validation**

We'll use **Zod** for runtime validation:

```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
  costPrice: z.number().positive().optional(),
});
```

---

## 🔐 Authentication & Security

### **JWT-Based Authentication**

1. **Access Token**: 15 minutes expiry
2. **Refresh Token**: 7 days expiry
3. **Token Rotation**: New refresh token on each refresh

### **Implementation**

```typescript
// JWT Service
class JWTService {
  generateAccessToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    });
  }
  
  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });
  }
}
```

### **Password Security**

1. **Hashing**: Argon2 (memory-hard, resistant to GPU attacks)
2. **Policy**: Minimum 8 characters, complexity requirements
3. **Reset**: Secure token-based password reset

### **API Security**

1. **Rate Limiting**: 100 requests per minute per IP
2. **CORS**: Configured for frontend domain
3. **Helmet**: Security headers
4. **Input Validation**: All inputs validated with Zod
5. **SQL Injection Prevention**: Prisma ORM parameterized queries

### **Role-Based Access Control (RBAC)**

```typescript
// Middleware for role-based access
const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const hasPermission = await checkPermission(user.id, permission);
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: { code: 'INSUFFICIENT_PERMISSIONS' }
      });
    }
    
    next();
  };
};
```

---

## 🔄 Development Workflow

### **Local Development Setup**

1. **Prerequisites**:
   ```bash
   # Required versions
   Node.js: 20.x LTS
   PostgreSQL: 16+
   Redis: 7+
   pnpm: 9+
   ```

2. **Installation**:
   ```bash
   # Clone repository
   git clone <repository-url>
   cd storewise-backend
   
   # Install dependencies
   pnpm install
   
   # Setup environment
   cp .env.example .env
   
   # Setup database
   pnpm db:setup
   
   # Seed database
   pnpm db:seed
   
   # Start development server
   pnpm dev
   ```

3. **Environment Variables**:
   ```bash
   # .env
   DATABASE_URL="postgresql://user:password@localhost:5432/storewise"
   REDIS_URL="redis://localhost:6379"
   JWT_ACCESS_SECRET="your-access-secret-min-32-chars"
   JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
   NODE_ENV="development"
   PORT=3001
   CORS_ORIGIN="http://localhost:3000"
   ```

### **Development Commands**

```bash
# Development
pnpm dev              # Start development server
pnpm dev:debug        # Start with debug mode

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Unit tests
pnpm test:integration # Integration tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report

# Code Quality
pnpm lint             # Lint code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
pnpm typecheck        # Type checking
```

### **Code Standards**

1. **TypeScript**: Strict mode enabled
2. **ESLint**: Airbnb config with custom rules
3. **Prettier**: Consistent formatting
4. **Husky**: Pre-commit hooks for code quality
5. **Conventional Commits**: Standardized commit messages

---

## 🚀 Deployment Strategy

### **Docker Deployment**

1. **Dockerfile**:
   ```dockerfile
   FROM node:20-alpine AS builder
   
   WORKDIR /app
   COPY package*.json ./
   COPY prisma ./prisma/
   
   RUN pnpm install --frozen-lockfile
   RUN pnpm db:generate
   
   COPY . .
   RUN pnpm build
   
   FROM node:20-alpine AS runner
   
   WORKDIR /app
   COPY --from=builder /app/dist ./dist
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json
   COPY --from=builder /app/prisma ./prisma
   
   EXPOSE 3001
   
   CMD ["node", "dist/server.js"]
   ```

2. **Docker Compose**:
   ```yaml
   version: '3.9'
   
   services:
     postgres:
       image: postgres:16-alpine
       environment:
         POSTGRES_DB: storewise
         POSTGRES_USER: storewise
         POSTGRES_PASSWORD: password
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"
   
     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
   
     api:
       build: .
       ports:
         - "3001:3001"
       environment:
         DATABASE_URL: postgresql://storewise:password@postgres:5432/storewise
         REDIS_URL: redis://redis:6379
       depends_on:
         - postgres
         - redis
   
   volumes:
     postgres_data:
   ```

### **Production Deployment Options**

1. **VPS (DigitalOcean, Linode)**:
   - Docker Compose deployment
   - Nginx reverse proxy
   - SSL with Let's Encrypt
   - Systemd service management

2. **Cloud Platform (Railway, Render)**:
   - Direct Git integration
   - Managed PostgreSQL
   - Automatic deployments
   - Built-in monitoring

3. **Container Orchestration (Kubernetes)**:
   - For large-scale deployments
   - Auto-scaling capabilities
   - High availability

### **Environment Management**

```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL="postgresql://user:password@prod-db:5432/storewise"
REDIS_URL="redis://prod-redis:6379"
JWT_ACCESS_SECRET="<strong-random-string>"
JWT_REFRESH_SECRET="<strong-random-string>"
```

---

## 🧪 Testing Guidelines

### **Testing Strategy**

1. **Unit Tests**: Individual functions and classes
2. **Integration Tests**: API endpoints and database operations
3. **E2E Tests**: Complete user workflows
4. **Performance Tests**: Load and stress testing

### **Testing Tools**

```json
{
  "jest": "^29.7.0",
  "supertest": "^7.0.0",
  "@faker-js/faker": "^8.4.0",
  "prisma-test-environment": "^1.7.0"
}
```

### **Test Examples**

```typescript
// Unit test example
describe('ProductService', () => {
  it('should create product successfully', async () => {
    const product = await productService.create(mockProductData);
    expect(product.sku).toBeDefined();
    expect(product.name).toBe(mockProductData.name);
  });
});

// Integration test example
describe('POST /api/v1/products', () => {
  it('should create product', async () => {
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send(mockProductData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(mockProductData.name);
  });
});
```

### **Coverage Requirements**

- **Statements**: > 85%
- **Branches**: > 80%
- **Functions**: > 85%
- **Lines**: > 85%

---

## ⚡ Performance Optimization

### **Database Optimization**

1. **Query Optimization**:
   - Use Prisma's `select` and `include` efficiently
   - Avoid N+1 queries
   - Implement proper indexing

2. **Connection Pooling**:
   ```typescript
   // prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     directUrl = env("DIRECT_URL") // For migrations
   }
   ```

3. **Caching Strategy**:
   ```typescript
   // Redis caching example
   const cachedProducts = await redis.get('products:all');
   if (cachedProducts) {
     return JSON.parse(cachedProducts);
   }
   
   const products = await productService.getAll();
   await redis.setex('products:all', 300, JSON.stringify(products));
   return products;
   ```

### **API Performance**

1. **Response Compression**: Gzip compression
2. **Pagination**: Cursor-based for large datasets
3. **Rate Limiting**: Prevent abuse
4. **Lazy Loading**: Load data as needed

### **Monitoring**

1. **Application Monitoring**:
   ```typescript
   import * as Sentry from '@sentry/node';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

2. **Performance Metrics**:
   - Response time tracking
   - Database query monitoring
   - Memory usage tracking
   - Error rate monitoring

---

## 📚 Documentation

### **API Documentation**

We'll use **Swagger/OpenAPI 3.0** for API documentation:

```typescript
// swagger configuration
const swaggerOptions = {
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
    ],
  },
  apis: ['./src/routes/*.ts'],
};
```

### **Code Documentation**

```typescript
/**
 * Creates a new product in the database
 * @param data - Product data to create
 * @returns Created product with ID
 * @throws {ValidationError} When validation fails
 * @example
 * ```typescript
 * const product = await productService.create({
 *   name: 'Coca Cola',
 *   sku: 'CC-001',
 *   price: 5000,
 *   categoryId: 'uuid-of-category'
 * });
 * ```
 */
async createProduct(data: CreateProductDto): Promise<Product> {
  // Implementation
}
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:coverage
      - run: pnpm build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Deployment commands
```

---

## 🎯 Next Steps

1. **Initialize Project Structure**
   ```bash
   mkdir storewise-backend
   cd storewise-backend
   npm init -y
   # Follow the project structure above
   ```

2. **Setup Development Environment**
   ```bash
   # Install dependencies
   pnpm add express prisma @prisma/client redis ioredis
   
   # Install dev dependencies
   pnpm add -D typescript @types/node ts-node nodemon
   pnpm add -D jest @types/jest supertest @types/supertest
   pnpm add -D eslint prettier husky lint-staged
   ```

3. **Configure Prisma**
   ```bash
   npx prisma init
   # Copy schema from MVP.md
   npx prisma migrate dev --name init
   ```

4. **Implement Core Modules**
   - Authentication
   - Products
   - Sales
   - Inventory

5. **Setup Testing**
   - Unit tests for services
   - Integration tests for API
   - E2E tests for critical flows

6. **Deploy to Production**
   - Setup production database
   - Configure environment variables
   - Deploy using Docker or cloud platform

---

## 📞 Support & Resources

- **Documentation**: [StoreWise API Docs](http://api.storewise.com/docs)
- **Repository**: [GitHub Repository](https://github.com/storewise/backend)
- **Issues**: [GitHub Issues](https://github.com/storewise/backend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/storewise/backend/discussions)

---

**This backend guideline provides a solid foundation for building the StoreWise CRUD web application with a focus on maintainability, scalability, and ease of use.**