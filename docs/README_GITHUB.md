# StoreWise - POS & Inventory Management System

<div align="center">

![StoreWise Logo](https://via.placeholder.com/200x80/3b82f6/ffffff?text=StoreWise)

**Modern Web-Based Point of Sale & Inventory Management**

Built with React 18, TypeScript, Express.js, and Prisma

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)](https://reactjs.org/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

## ✨ Features

### 🛒 Point of Sale (POS)
- Fast and intuitive sales interface
- Real-time inventory updates
- Multiple payment methods (Cash, Card, Bank Transfer)
- Customer management
- Tax calculations and discounts
- Receipt generation

### 📦 Product Management
- Complete CRUD operations
- Product categorization
- SKU generation and tracking
- Pricing management
- Stock quantity tracking
- Supplier information

### 📊 Inventory Management
- Real-time stock monitoring
- Stock adjustments with reasons
- Low stock alerts
- Inventory valuation
- Category-based tracking

### 💰 Sales Management
- Comprehensive sales history
- Advanced filtering and search
- Sales analytics
- Transaction details
- Export functionality (CSV)

### 📈 Reports & Analytics
- Real-time KPIs and metrics
- Revenue trend analysis
- Top performing products
- Payment method analytics
- Low stock alerts
- Date range filtering

### ⚙️ System Settings
- Dark/Light theme support
- User preferences
- Store configuration
- Responsive design

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI with hooks and lazy loading
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Modern routing with lazy loading
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Zustand** - Lightweight state management
- **Sonner** - Toast notifications

### Backend
- **Express.js** - Web framework with TypeScript
- **Prisma** - Modern database ORM
- **SQLite** - Database for development
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Turbo** - Monorepo build system
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/storewise.git
   cd storewise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the frontend and backend:
   - Frontend: http://localhost:3008
   - Backend: http://localhost:3009

### Database Setup

The project uses SQLite for development. The database file will be automatically created when you first run the application.

To run migrations:
```bash
npm run db:migrate
```

To view the database in Prisma Studio:
```bash
npm run db:studio
```

## 📁 Project Structure

```
storewise/
├── apps/
│   ├── web/                 # Frontend React application
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── lib/         # Utilities and API client
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── store/       # Zustand state management
│   │   │   └── router.tsx   # TanStack Router configuration
│   │   └── package.json
│   └── api/                 # Backend Express application
│       ├── src/
│       │   ├── routes/      # API routes
│       │   ├── middleware/  # Express middleware
│       │   ├── services/    # Business logic
│       │   ├── utils/       # Utilities
│       │   └── types/       # TypeScript types
│       ├── prisma/          # Database schema
│       └── package.json
├── docs/                    # Documentation
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Root package.json
└── turbo.json              # Turbo configuration
```

## 🎯 Usage

### Starting the Application

**Development Mode:**
```bash
npm run dev          # Start both frontend and backend
npm run dev:web      # Start frontend only
npm run dev:api      # Start backend only
```

**Production Mode:**
```bash
npm run build        # Build both applications
npm run start        # Start production servers
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development |
| `npm run build` | Build both applications for production |
| `npm run lint` | Run linting |
| `npm run db:setup` | Set up the database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

### Navigation

Once the application is running, you can access:

- **POS System**: http://localhost:3008/pos
- **Products**: http://localhost:3008/products
- **Inventory**: http://localhost:3008/inventory
- **Sales**: http://localhost:3008/sales
- **Reports**: http://localhost:3008/reports
- **Settings**: http://localhost:3008/settings

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example`):

- `DATABASE_URL`: Database connection string
- `PORT`: Backend server port (default: 3009)
- `VITE_API_URL`: Frontend API URL
- `VITE_APP_NAME`: Application name
- `CORS_ORIGIN`: Allowed frontend origin

### Database Configuration

The application uses SQLite for development. For production, you can switch to PostgreSQL by updating the `DATABASE_URL` in your `.env` file.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Prisma](https://www.prisma.io/) - Database ORM
- [Express.js](https://expressjs.com/) - Web framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/yourusername/storewise/issues)
3. Create a [new issue](https://github.com/yourusername/storewise/issues/new)

---

<div align="center">

**Built with ❤️ by the StoreWise Team**

[⭐ Star this repo](https://github.com/yourusername/storewise) • [🐛 Report issues](https://github.com/yourusername/storewise/issues) • [💬 Discuss](https://github.com/yourusername/storewise/discussions)

</div>