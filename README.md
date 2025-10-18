# StoreWise - POS & Inventory Management System

## About

StoreWise is a comprehensive Point of Sale (POS) and Inventory Management System designed to help small to medium-sized businesses streamline their operations. Built with modern web technologies, it offers an intuitive interface for managing sales, inventory, customers, and business analytics.

## Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks and lazy loading
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Modern routing with lazy loading and Suspense
- **TanStack Query** - Server state management and caching
- **Tailwind CSS** - Utility-first CSS framework with custom theming
- **shadcn/ui** - Modern component library built on Radix UI
- **Lucide React** - Icon library
- **React Hook Form** - Form handling with validation
- **Zustand** - Lightweight state management
- **Sonner** - Toast notifications
- **date-fns** - Date manipulation utilities

### Backend
- **Express.js** - Web framework with TypeScript
- **Prisma** - Modern database ORM with SQLite
- **TanStack Query** - API client and caching
- **TypeScript** - Type-safe development

### Development Tools
- **Turbo** - Monorepo build system
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

## Features

### 🛒 Point of Sale (POS)
- Fast and intuitive sales interface with product search
- Real-time inventory updates and stock tracking
- Multiple payment methods (Cash, Card, Bank Transfer, Other)
- Customer selection and management
- Tax calculations (10% default) and discount support
- Cart management with item quantity adjustments
- Receipt generation and transaction history

### 📦 Product Management
- Complete CRUD operations for products
- Product categorization and organization
- SKU generation and tracking
- Pricing management (cost price, selling price)
- Stock quantity tracking with low-stock alerts
- Supplier information management
- Bulk product operations
- Advanced filtering and search

### 📊 Inventory Management
- Real-time stock level monitoring
- Stock adjustment functionality (add/remove with reasons)
- Low stock alerts and reorder point tracking
- Min/max stock level configuration
- Inventory valuation calculations
- Category-based inventory tracking
- Stock movement history
- Supplier management integration

### 💰 Sales Management
- Comprehensive sales history and tracking
- Advanced filtering by date, status, payment method
- Sales analytics and performance metrics
- Transaction details with item breakdown
- Customer sales tracking
- Payment method distribution analysis
- Export functionality (CSV format)
- Sales status management (completed, pending, refunded)

### 📈 Reports & Analytics
- Real-time KPIs (Revenue, Sales, Average Order Value, Conversion Rate)
- Revenue trend analysis with period comparisons
- Top performing products identification
- Sales distribution by category
- Payment method analytics
- Low stock alerts and inventory insights
- Daily revenue performance tracking
- Report export functionality
- Date range filtering (Today, 7 days, 30 days, 90 days)

### ⚙️ System Settings
- User preferences and configuration
- Theme switching (Light/Dark mode with proper theming)
- System customization options
- Store information management

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kohmarcell/storewise.git
   cd storewise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:setup
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the frontend and backend:
   - Frontend: http://localhost:3008
   - Backend: http://localhost:3009

### Database Setup

The project uses Prisma with SQLite for development. The database file will be automatically created when you first run the application.

To run migrations:
```bash
npm run db:migrate
```

To view the database in Prisma Studio:
```bash
npm run db:studio
```

## Project Structure

```
storewise/
├── apps/
│   ├── web/                 # Frontend React application
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components (Layout, POS components)
│   │   │   ├── pages/       # Page components (POS, Products, Inventory, Sales, Reports, Settings)
│   │   │   ├── lib/         # Utilities, API client, UI components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── store/       # Zustand state management
│   │   │   ├── router.tsx   # TanStack Router configuration with lazy loading
│   │   │   └── index.css    # Tailwind CSS with custom theme variables
│   │   ├── public/          # Static assets
│   │   └── package.json
│   └── api/                 # Backend Express application
│       ├── src/
│       │   ├── routes/      # API routes
│       │   ├── middleware/  # Express middleware
│       │   ├── services/    # Business logic
│       │   ├── utils/       # Utilities
│       │   ├── types/       # TypeScript types
│       │   └── index.ts     # Express server setup
│       ├── prisma/          # Database schema and migrations
│       │   └── schema.prisma # Database schema definition
│       └── package.json
├── docs/                    # Documentation (PRD, MVP, API spec)
├── package.json            # Root package.json
└── turbo.json              # Turbo configuration
```

## Available Scripts

### Root Commands
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm run dev:api` - Start backend only
- `npm run dev:web` - Start frontend only
- `npm run lint` - Run linting
- `npm run db:setup` - Set up the database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Frontend (apps/web)
- `npm run dev` - Start development server (port 3008)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting

### Backend (apps/api)
- `npm run dev` - Start development server (port 3009)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## API Documentation

The API runs on port 3009 and provides the following endpoints:

### Main API Endpoints

- **Products**: `/api/products` - CRUD operations for product management
- **Sales**: `/api/sales` - Sales transaction management
- **Customers**: `/api/customers` - Customer management
- **Categories**: `/api/categories` - Product category management
- **Reports**: `/api/reports` - Analytics and reporting data

### Database Schema

The application uses the following main entities:
- **Product**: Product information, pricing, and stock levels
- **Category**: Product categorization
- **Customer**: Customer information and purchase history
- **Sale**: Sales transactions and line items
- **User**: System users and authentication

## UI/UX Features

### Modern Interface
- Clean, responsive design with Tailwind CSS
- Dark/Light theme support with proper color schemes
- Smooth transitions and micro-interactions
- Loading states and error handling
- Consistent component library (shadcn/ui)

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly controls for tablet devices

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and descriptions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the documentation in the `docs/` folder
2. Search existing issues on GitHub
3. Create a new issue with detailed information

## Current Status

StoreWise is currently in active development with the following features implemented:

### ✅ Completed Features
- Complete POS system with cart functionality
- Product management with categorization
- Real-time inventory tracking
- Sales history and analytics
- Comprehensive reporting dashboard
- Customer management
- Responsive design with dark/light theme
- Database integration with Prisma
- API endpoints for all major operations

### 🔄 In Development
- User authentication and authorization
- Advanced reporting features
- Data export capabilities
- Performance optimizations

### 📋 Planned Features
- Employee management and permissions
- Multi-store support
- Mobile app support
- Offline mode capabilities
- Advanced integrations (payment gateways)
- AI-powered inventory forecasting

---

**StoreWise** - Simplifying retail management, one sale at a time. 🛒
