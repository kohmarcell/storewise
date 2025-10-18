# 🎨 StoreWise Frontend Development Guidelines

> **Implementation Guide for StoreWise Modern Web Interface (Current Implementation)**

---

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Technology Stack](#technology-stack)
3. [Design System](#design-system)
4. [UI Components Library](#ui-components-library)
5. [Layout & Navigation](#layout--navigation)
6. [Visual Design](#visual-design)
7. [User Experience](#user-experience)
8. [Responsive Design](#responsive-design)
9. [Performance Optimization](#performance-optimization)
10. [Development Workflow](#development-workflow)
11. [Accessibility Guidelines](#accessibility-guidelines)
12. [Animation & Micro-interactions](#animation--micro-interactions)

---

## 🎯 Design Philosophy

### **Core Principles**

1. **Clean & Minimal**
   - Less is more approach with purposeful elements
   - Generous white space for visual breathing room
   - Focus on content over decoration
   - Consistent 4px grid system for spacing

2. **Professional**
   - Business-oriented color palette
   - Clear typography hierarchy
   - Data visualization that's easy to understand
   - Consistent and predictable interactions

3. **Eye-Catching**
   - Strategic use of color for emphasis
   - Meaningful micro-interactions
   - Visual hierarchy that guides attention
   - Subtle gradients and shadows for depth

4. **User-Friendly**
   - Intuitive navigation patterns
   - Clear feedback for all actions
   - Forgiving error handling
   - Progressive disclosure of complexity

5. **Modern**
   - Current design trends with longevity
   - Component-based architecture
   - Optimized for performance
   - Future-proof technology choices

---

## 🛠️ Technology Stack

### **Core Technologies**

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Framework** | React 18.3.0 | Component-based, excellent ecosystem, performance |
| **Language** | TypeScript 5.5.0 | Type safety, better developer experience |
| **Bundler** | Vite 5.4.0 | Fast development, optimized builds |
| **Routing** | TanStack Router 1.50.0 | Type-safe routing, modern features |
| **State Management** | Zustand 4.5.0 | Simple, TypeScript-friendly, minimal boilerplate |
| **Server State** | TanStack Query 5.50.0 | Server state management, caching, sync |
| **Forms** | React Hook Form 7.52.0 | Performance, validation, minimal re-renders |
| **Validation** | Zod 3.23.0 | TypeScript-first validation |
| **Styling** | Tailwind CSS 4.0.0 | Utility-first, rapid development, consistent design |

### **UI Component Libraries**

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Base Components** | shadcn/ui | Beautiful, accessible, customizable |
| **Icons** | Lucide React 0.400.0 | Consistent, modern, extensive library |
| **Charts** | Recharts 2.12.0 | React-based, customizable charts |
| **Modals** | Vaul 0.9.0 | Accessible, animated modals |
| **Toasts** | Sonner 1.5.0 | Beautiful, stackable notifications |

### **Why This Stack is Ideal**

1. **Developer Experience**:
   - Type safety throughout the stack
   - Hot module replacement in development
   - Excellent debugging tools
   - Rich auto-completion

2. **Performance**:
   - Optimized builds with Vite
   - Efficient state management
   - Lazy loading capabilities
   - Minimal bundle sizes

3. **Maintainability**:
   - Component-based architecture
   - Consistent design system
   - Type-safe APIs and forms
   - Clear separation of concerns

---

## 🎨 Design System

### **Color Palette**

```css
/* Primary Colors - Professional Blue */
--primary-50: #eff6ff;   /* Lightest */
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main Primary */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;  /* Darkest */

/* Secondary Colors - Neutral Gray */
--secondary-50: #f8fafc;
--secondary-100: #f1f5f9;
--secondary-200: #e2e8f0;
--secondary-300: #cbd5e1;
--secondary-400: #94a3b8;
--secondary-500: #64748b;
--secondary-600: #475569;
--secondary-700: #334155;
--secondary-800: #1e293b;
--secondary-900: #0f172a;

/* Semantic Colors */
--success: #10b981;    /* Green */
--warning: #f59e0b;    /* Amber */
--error: #ef4444;      /* Red */
--info: #06b6d4;       /* Cyan */

/* Surface Colors */
--surface: #ffffff;
--surface-variant: #f8fafc;
--surface-hover: #f1f5f9;
--surface-active: #e2e8f0;

/* Text Colors */
--text-primary: #0f172a;
--text-secondary: #475569;
--text-tertiary: #64748b;
--text-disabled: #94a3b8;
--text-on-primary: #ffffff;
```

### **Typography System**

```css
/* Font Family */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes - 1.25rem (20px) base scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Letter Spacing */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
```

### **Spacing System**

```css
/* 4px base scale */
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### **Border Radius**

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

### **Shadows**

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

## 🧩 UI Components Library

### **Core Components**

#### **Buttons**

```tsx
// Button variants with clean, minimal design
export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ variant = 'primary', size = 'md', className, ...props }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500',
    outline: 'border border-secondary-300 bg-transparent text-secondary-700 hover:bg-secondary-50 focus:ring-primary-500',
    ghost: 'text-secondary-700 hover:bg-secondary-100 focus:ring-primary-500',
    destructive: 'bg-error text-white hover:bg-error-600 focus:ring-error-500',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm rounded-md',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-12 px-6 text-base rounded-md',
    xl: 'h-14 px-8 text-lg rounded-lg',
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});
```

#### **Input Fields**

```tsx
// Clean, minimal input with focus states
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const baseClasses = 'flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const errorClasses = error ? 'border-error focus-visible:ring-error' : '';
    
    return (
      <input
        type={type}
        className={cn(baseClasses, errorClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### **Cards**

```tsx
// Minimal card with subtle shadows
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-secondary-200 bg-white text-secondary-950 shadow-sm',
        className
      )}
      {...props}
    />
  )
);

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
```

### **Specialized POS Components**

#### **Product Card**

```tsx
// Clean product card for POS interface
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isSelected?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isSelected = false,
}) => {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:scale-105',
        isSelected && 'ring-2 ring-primary-500 bg-primary-50'
      )}
      onClick={() => onAddToCart(product)}
    >
      <CardContent className="p-4">
        <div className="aspect-square w-full mb-3 bg-secondary-100 rounded-md flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <Package className="w-8 h-8 text-secondary-400" />
          )}
        </div>
        
        <h3 className="font-semibold text-sm text-primary-900 truncate">
          {product.name}
        </h3>
        
        <p className="text-xs text-secondary-500 mb-2">
          {product.sku}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary-600">
            {formatCurrency(product.sellPrice)}
          </span>
          
          <span className="text-xs text-secondary-500">
            Stock: {product.stockQty}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
```

#### **Cart Widget**

```tsx
// Minimal, clean cart display
export const CartWidget: React.FC = () => {
  const { items, total, removeItem, updateQuantity } = useCart();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <Badge variant="secondary">{items.length} items</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">Cart is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
        )}
      </CardContent>
      
      {items.length > 0 && (
        <div className="border-t border-secondary-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(total)}
            </span>
          </div>
          
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </div>
      )}
    </Card>
  );
};
```

---

## 📐 Layout & Navigation

### **Application Layout**

```tsx
// Main application layout with sidebar navigation
export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
```

### **Sidebar Navigation**

```tsx
// Clean, minimal sidebar navigation
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'POS', href: '/pos', icon: CashRegister },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Inventory', href: '/inventory', icon: Warehouse },
  { name: 'Sales', href: '/sales', icon: Receipt },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Suppliers', href: '/suppliers', icon: Truck },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900/20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-secondary-200">
            <Store className="w-8 h-8 text-primary-500 mr-3" />
            <span className="text-xl font-bold text-secondary-900">StoreWise</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-700 hover:bg-secondary-100'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* User Section */}
          <div className="border-t border-secondary-200 p-4">
            <UserMenu />
          </div>
        </div>
      </div>
    </>
  );
};
```

### **Top Navigation**

```tsx
// Clean top navigation with search and notifications
export const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  
  return (
    <header className="bg-white border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Search */}
          <div className="hidden md:block ml-10">
            <CommandPalette />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-error rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <NotificationDropdown />
          </DropdownMenu>
          
          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoUrl} />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <UserDropdown />
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
```

---

## 🎨 Visual Design

### **Dashboard Design**

```tsx
// Clean, minimal dashboard with key metrics
export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-500">Welcome back! Here's your store overview.</p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Today's Sales"
          value={formatCurrency(todaySales)}
          change={{ value: '+12.5%', positive: true }}
          icon={DollarSign}
          color="primary"
        />
        
        <KPICard
          title="Transactions"
          value={transactionCount}
          change={{ value: '+8.2%', positive: true }}
          icon={Receipt}
          color="success"
        />
        
        <KPICard
          title="Products Sold"
          value={productsSold}
          change={{ value: '-2.4%', positive: false }}
          icon={Package}
          color="warning"
        />
        
        <KPICard
          title="Active Customers"
          value={activeCustomers}
          change={{ value: '+18.7%', positive: true }}
          icon={Users}
          color="info"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sales Trend</h3>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        
        {/* Top Products */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Top Products</h3>
          </CardHeader>
          <CardContent>
            <TopProductsList />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Activities</h3>
        </CardHeader>
        <CardContent>
          <RecentActivitiesList />
        </CardContent>
      </Card>
    </div>
  );
};
```

### **KPI Card Component**

```tsx
// Clean KPI card with subtle animations
interface KPICardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    positive: boolean;
  };
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'info';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    info: 'bg-info-100 text-info-600',
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-500">{title}</p>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
            
            {change && (
              <div className="flex items-center mt-2">
                <TrendingUp
                  className={cn(
                    'w-4 h-4 mr-1',
                    change.positive ? 'text-success' : 'text-error'
                  )}
                />
                <span
                  className={cn(
                    'text-sm font-medium',
                    change.positive ? 'text-success' : 'text-error'
                  )}
                >
                  {change.value}
                </span>
                <span className="text-sm text-secondary-500 ml-1">
                  from yesterday
                </span>
              </div>
            )}
          </div>
          
          <div className={cn('p-3 rounded-full', colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 👤 User Experience

### **Loading States**

```tsx
// Clean skeleton loading components
export const ProductGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="aspect-square bg-secondary-200 rounded-md mb-3" />
            <div className="h-4 bg-secondary-200 rounded mb-2" />
            <div className="h-3 bg-secondary-100 rounded w-3/4 mb-2" />
            <div className="flex justify-between">
              <div className="h-4 bg-secondary-200 rounded w-1/2" />
              <div className="h-3 bg-secondary-100 rounded w-1/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

### **Error States**

```tsx
// User-friendly error states with recovery options
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {title}
      </h3>
      
      <p className="text-secondary-500 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
};
```

### **Empty States**

```tsx
// Helpful empty states with clear CTAs
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {title}
      </h3>
      
      <p className="text-secondary-500 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {action}
    </div>
  );
};
```

---

## 📱 Responsive Design

### **Breakpoint System**

```css
/* Consistent breakpoint scale */
sm: 640px   /* Small phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### **Mobile-First POS Interface**

```tsx
// Mobile-optimized POS interface
export const POSInterface: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Product Grid - Full width on mobile */}
      <div className="flex-1 min-h-0">
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <SearchBar className="flex-1" />
          <Button className="sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <ProductGrid />
      </div>
      
      {/* Cart - Sidebar on desktop, bottom sheet on mobile */}
      <div className="lg:w-96">
        <div className="hidden lg:block">
          <CartWidget />
        </div>
        
        {/* Mobile Cart - Fixed bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Total</p>
              <p className="text-xl font-bold text-primary-600">
                {formatCurrency(cartTotal)}
              </p>
            </div>
            
            <Button size="lg" className="flex-1 ml-4">
              Checkout ({cartItems.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## ⚡ Performance Optimization

### **Code Splitting**

```tsx
// Route-based code splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const POS = lazy(() => import('../pages/POS'));
const Products = lazy(() => import('../pages/Products'));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Suspense>
  );
};
```

### **Image Optimization**

```tsx
// Optimized image component with lazy loading
export const OptimizedImage: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && (
        <div className="absolute inset-0 bg-secondary-200 animate-pulse" />
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
};
```

---

## 🔄 Development Workflow

### **Project Setup**

```bash
# Create new React project with Vite
pnpm create vite storewise-frontend --template react-ts

# Navigate to project
cd storewise-frontend

# Install dependencies
pnpm add @tanstack/react-router @tanstack/react-query zustand react-hook-form @hookform/resolvers zod
pnpm add tailwindcss @tailwindcss/forms @tailwindcss/typography autoprefixer postcss
pnpm add lucide-react recharts vaul sonner clsx tailwind-merge

# Install dev dependencies
pnpm add -D @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react-hooks eslint-plugin-react-refresh prettier eslint-config-prettier

# Install shadcn/ui
pnpm dlx shadcn-ui@latest init

# Add shadcn/ui components
pnpm dlx shadcn-ui@latest add button card input label badge dropdown-menu avatar sheet dialog
```

### **Environment Configuration**

```bash
# .env.example
VITE_API_URL=http://localhost:3001/api/v1
VITE_APP_NAME=StoreWise
VITE_APP_VERSION=1.0.0
VITE_ENABLE_MOCK_API=false
VITE_SENTRY_DSN=your-sentry-dsn
```

### **Development Commands**

```bash
# Development
pnpm dev              # Start development server
pnpm preview          # Preview production build

# Build
pnpm build            # Build for production
pnpm build:analyze    # Analyze bundle size

# Code Quality
pnpm lint             # Lint code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Prettier
pnpm typecheck        # Check TypeScript types

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Generate coverage report
```

---

## ♿ Accessibility Guidelines

### **Keyboard Navigation**

```tsx
// Focus management and keyboard interactions
export const SearchInput: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
      <Input
        ref={inputRef}
        placeholder="Search products... (⌘K)"
        className="pl-10"
        aria-label="Search products"
      />
    </div>
  );
};
```

### **Screen Reader Support**

```tsx
// Semantic HTML and ARIA labels
export const CartWidget: React.FC = () => {
  const { items, total } = useCart();
  
  return (
    <section aria-label="Shopping cart" className="h-full flex flex-col">
      <header className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          Shopping Cart
          <span className="sr-only">
            {items.length} items in cart
          </span>
        </h2>
        <div aria-live="polite" className="text-sm text-secondary-500">
          {items.length} items • Total {formatCurrency(total)}
        </div>
      </header>
      
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">Your cart is empty</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-secondary-200">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
```

---

## ✨ Animation & Micro-interactions

### **Subtle Transitions**

```css
/* Consistent transition utilities */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover-lift {
  transition: transform 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}
```

### **Loading Animations**

```tsx
// Smooth loading skeleton
export const SkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-secondary-200 h-32 rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="bg-secondary-200 h-4 rounded" />
        <div className="bg-secondary-100 h-4 rounded w-3/4" />
        <div className="bg-secondary-100 h-4 rounded w-1/2" />
      </div>
    </div>
  );
};
```

### **Interactive Feedback**

```tsx
// Button with loading state and feedback
export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  loading,
  success,
  ...props
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleClick = async () => {
    try {
      await onClick();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <Button
      onClick={handleClick}
      disabled={loading || showSuccess}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {showSuccess && <Check className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
};
```

---

## 🎯 Best Practices

### **Component Organization**

```tsx
// Consistent component structure
interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({
  // Destructured props
}) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Derived values
  const computedValue = useMemo(() => {
    // Computation
  }, [dependencies]);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### **State Management**

```tsx
// Zustand store pattern
interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
    total: calculateTotal([...state.items, item]),
  })),
  
  removeItem: (id) => set((state) => {
    const items = state.items.filter(item => item.id !== id);
    return { items, total: calculateTotal(items) };
  }),
  
  clearCart: () => set({ items: [], total: 0 }),
}));
```

---

## 🚀 Next Steps

1. **Initialize Project Structure**
   ```bash
   pnpm create vite storewise-frontend --template react-ts
   cd storewise-frontend
   # Follow setup instructions above
   ```

2. **Setup Design System**
   - Configure Tailwind CSS
   - Install shadcn/ui components
   - Create custom theme tokens

3. **Implement Core Components**
   - Layout components (AppLayout, Sidebar, TopNav)
   - UI components (Button, Input, Card)
   - POS-specific components (ProductCard, CartWidget)

4. **Build Key Pages**
   - Dashboard with KPIs and charts
   - POS interface with product grid and cart
   - Product management with CRUD operations

5. **Add Polish**
   - Animations and micro-interactions
   - Loading and error states
   - Responsive design optimizations

6. **Testing & Optimization**
   - Component testing with React Testing Library
   - Performance optimization
   - Accessibility testing

---

## 📞 Resources & References

- **Design Inspiration**: [Dribbble](https://dribbble.com/), [Behance](https://www.behance.net/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Tailwind UI](https://tailwindui.com/)
- **Icons**: [Lucide](https://lucide.dev/), [Heroicons](https://heroicons.com/)
- **Typography**: [Google Fonts](https://fonts.google.com/), [Inter](https://rsms.me/inter/)
- **Color Palettes**: [Coolors](https://coolors.co/), [Tailwind Color Generator](https://tailwindcolor.com/)

---

**This frontend guideline provides a comprehensive foundation for building a modern, clean, and professional StoreWise application with excellent user experience and maintainable codebase.**