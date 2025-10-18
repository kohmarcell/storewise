import React, { Suspense } from 'react'
import { createRootRoute, createRoute, createRouter, Outlet, redirect, createBrowserHistory, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import {
  Store,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Archive,
  FileText,
  TrendingUp,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  DollarSign,
  AlertTriangle,
  Search,
  Plus,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Target,
  Mail,
  Phone,
  MapPin,
  Star,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  Award,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Mail as MailIcon,
  MessageSquare,
  Gift,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Gem,
  Medal,
  UserCheck,
  UserX,
  PhoneCall,
  Video,
  History
} from 'lucide-react'

// Loading component for lazy routes
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
)

// Create a browser history for the router
const browserHistory = createBrowserHistory()

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <Outlet />
    </Suspense>
  ),
})

// Authentication guard component
const AuthGuard = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()
  const navigate = useNavigate({ from: '/' })

  // Check authentication status on component mount
  React.useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <Layout />
}

// Lazy loaded components
import { lazy } from 'react'
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(mod => ({ default: mod.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(mod => ({ default: mod.DashboardPage })))
const PosPage = lazy(() => import('@/pages/pos/POSPage').then(mod => ({ default: mod.PosPage })))

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <LoginPage />
    </Suspense>
  ),
})

// Protected routes
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: AuthGuard,
})

// Dashboard route
const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <DashboardPage />
    </Suspense>
  ),
})

// POS route
const PosPage = () => (
  <div className="p-6 min-h-full">
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground">Point of Sale</h1>
      <p className="text-muted-foreground mt-2">Advanced sales terminal with real-time inventory management</p>
    </div>

    {/* POS Stats Bar */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Today's Sales</p>
            <p className="text-2xl font-bold">$3,250.75</p>
            <p className="text-blue-100 text-xs mt-1">↑ 12.5% from yesterday</p>
          </div>
          <DollarSign className="h-8 w-8 text-blue-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Transactions</p>
            <p className="text-2xl font-bold">42</p>
            <p className="text-green-100 text-xs mt-1">Avg: $77.40 per sale</p>
          </div>
          <ShoppingCart className="h-8 w-8 text-green-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Items Sold</p>
            <p className="text-2xl font-bold">156</p>
            <p className="text-purple-100 text-xs mt-1">Top: Wireless Headphones</p>
          </div>
          <Package className="h-8 w-8 text-purple-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Active Session</p>
            <p className="text-2xl font-bold">2:34:15</p>
            <p className="text-orange-100 text-xs mt-1">Cashier: John Doe</p>
          </div>
          <Users className="h-8 w-8 text-orange-200" />
        </div>
      </div>
    </div>

    {/* Main POS Interface */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Product Categories & Search */}
      <div className="lg:col-span-2 space-y-4">
        {/* Quick Actions */}
        <div className="bg-card rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                Quick Sale
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
                Return
              </button>
              <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors">
                Exchange
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name, SKU, or barcode..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Package className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Product Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Electronics', icon: '💻', count: 124, color: 'from-blue-500 to-blue-600' },
              { name: 'Clothing', icon: '👕', count: 89, color: 'from-pink-500 to-pink-600' },
              { name: 'Food & Beverages', icon: '🍕', count: 67, color: 'from-green-500 to-green-600' },
              { name: 'Home & Garden', icon: '🏠', count: 45, color: 'from-purple-500 to-purple-600' },
              { name: 'Sports', icon: '⚽', count: 38, color: 'from-orange-500 to-orange-600' },
              { name: 'Books', icon: '📚', count: 92, color: 'from-indigo-500 to-indigo-600' },
            ].map((category, index) => (
              <div key={index} className={`bg-gradient-to-r ${category.color} rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs opacity-90">{category.count} items</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-2">
            {[
              { id: '1001', time: '2:34 PM', items: 3, total: 127.50, status: 'completed', payment: 'Credit Card' },
              { id: '1000', time: '2:28 PM', items: 5, total: 89.99, status: 'completed', payment: 'Cash' },
              { id: '999', time: '2:15 PM', items: 2, total: 45.00, status: 'pending', payment: 'Mobile Pay' },
              { id: '998', time: '2:05 PM', items: 8, total: 234.75, status: 'completed', payment: 'Credit Card' },
              { id: '997', time: '1:52 PM', items: 1, total: 12.99, status: 'refunded', payment: 'Cash' },
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-500' :
                    transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="font-medium text-foreground">#{transaction.id}</div>
                    <div className="text-sm text-gray-500">{transaction.time} • {transaction.items} items</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">${transaction.total.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{transaction.payment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Best Selling Today</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Wireless Headphones Pro', sold: 12, revenue: 3600, trend: 'up' },
              { name: 'Smart Watch Ultra', sold: 8, revenue: 2400, trend: 'up' },
              { name: 'USB-C Hub Multi-Port', sold: 15, revenue: 900, trend: 'down' },
              { name: 'Laptop Stand Adjustable', sold: 6, revenue: 600, trend: 'up' },
            ].map((product, index) => (
              <div key={index} className="border border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-foreground text-sm truncate">{product.name}</div>
                  {product.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{product.sold} sold</span>
                  <span className="font-medium text-foreground">${product.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Current Sale */}
      <div className="space-y-4">
        {/* Current Sale */}
        <div className="bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Current Sale</h3>

          {/* Customer Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Customer</span>
              <button className="text-blue-600 hover:text-blue-800 text-sm">Add Customer</button>
            </div>
            <div className="text-sm text-gray-500">Walk-in Customer</div>
          </div>

          {/* Cart Items */}
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            <div className="text-sm font-medium text-gray-700 mb-2">Cart Items (0)</div>
            <div className="text-sm text-gray-500 text-center py-8 border-2 border-dashed border rounded-lg">
              No items in cart
            </div>
          </div>

          {/* Sale Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax (8.5%)</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium text-green-600">-$0.00</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-blue-600">$0.00</span>
            </div>
          </div>

          {/* Payment Options */}
          <div className="mt-4 space-y-2">
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Process Payment
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Cash
              </button>
              <button className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Card
              </button>
              <button className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Mobile
              </button>
              <button className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Split
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Hold Sale
            </button>
            <button className="py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Quote
            </button>
          </div>
        </div>

        {/* Quick Add Items */}
        <div className="bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Add</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Water', price: 1.99, color: 'bg-blue-100 text-blue-800' },
              { name: 'Soda', price: 2.49, color: 'bg-red-100 text-red-800' },
              { name: 'Chips', price: 1.99, color: 'bg-yellow-100 text-yellow-800' },
              { name: 'Candy', price: 0.99, color: 'bg-pink-100 text-pink-800' },
              { name: 'Coffee', price: 3.99, color: 'bg-amber-100 text-amber-800' },
              { name: 'Snack', price: 2.99, color: 'bg-green-100 text-green-800' },
            ].map((item, index) => (
              <button key={index} className={`${item.color} rounded-lg p-3 text-center hover:opacity-90 transition-opacity`}>
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs mt-1">${item.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Drawer Status */}
        <div className="bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Drawer Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Starting Cash</span>
              <span className="font-medium">$500.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cash Sales</span>
              <span className="font-medium text-green-600">+$245.50</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cash Out</span>
              <span className="font-medium text-red-600">-$50.00</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t font-semibold">
              <span className="text-foreground">Current Total</span>
              <span className="text-blue-600">$695.50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Products route
const ProductsPage = () => (
  <div className="p-6 min-h-full">
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
      <p className="text-muted-foreground mt-2">Advanced inventory management with real-time tracking and analytics</p>
    </div>

    {/* Product Stats Dashboard */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <Package className="h-8 w-8 text-blue-200" />
          <span className="bg-muted/50 px-2 py-1 rounded text-xs">+5.2%</span>
        </div>
        <div className="text-2xl font-bold">1,486</div>
        <div className="text-blue-100 text-sm">Total Products</div>
        <div className="text-xs text-blue-200 mt-1">76 added this month</div>
      </div>
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <AlertTriangle className="h-8 w-8 text-red-200" />
          <span className="bg-muted/50 px-2 py-1 rounded text-xs">+3</span>
        </div>
        <div className="text-2xl font-bold">28</div>
        <div className="text-red-100 text-sm">Out of Stock</div>
        <div className="text-xs text-red-200 mt-1">Critical: 8 items</div>
      </div>
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <AlertTriangle className="h-8 w-8 text-yellow-200" />
          <span className="bg-muted/50 px-2 py-1 rounded text-xs">-12</span>
        </div>
        <div className="text-2xl font-bold">45</div>
        <div className="text-yellow-100 text-sm">Low Stock</div>
        <div className="text-xs text-yellow-200 mt-1">Reorder needed</div>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="h-8 w-8 text-green-200" />
          <span className="bg-muted/50 px-2 py-1 rounded text-xs">+$125K</span>
        </div>
        <div className="text-2xl font-bold">$342.5K</div>
        <div className="text-green-100 text-sm">Total Value</div>
        <div className="text-xs text-green-200 mt-1">+18% vs last month</div>
      </div>
    </div>

    {/* Action Bar */}
    <div className="bg-card rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <span className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            <span className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Bulk Import
            </span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Export
            </span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Package className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Food & Beverages</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>
    </div>

    {/* Products Table */}
    <div className="bg-card rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y border">
            {[
              {
                name: 'Wireless Headphones Pro',
                sku: 'WHP-001',
                category: 'Electronics',
                stock: 45,
                price: 299.99,
                status: 'in-stock',
                image: '🎧',
                trend: 'up'
              },
              {
                name: 'Smart Watch Ultra',
                sku: 'SWU-042',
                category: 'Electronics',
                stock: 8,
                price: 499.99,
                status: 'low-stock',
                image: '⌚',
                trend: 'down'
              },
              {
                name: 'Organic Cotton T-Shirt',
                sku: 'OCT-156',
                category: 'Clothing',
                stock: 0,
                price: 24.99,
                status: 'out-of-stock',
                image: '👕',
                trend: 'stable'
              },
              {
                name: 'Premium Coffee Beans',
                sku: 'PCB-789',
                category: 'Food & Beverages',
                stock: 120,
                price: 18.99,
                status: 'in-stock',
                image: '☕',
                trend: 'up'
              },
              {
                name: 'Ergonomic Desk Chair',
                sku: 'EDC-234',
                category: 'Office',
                stock: 15,
                price: 349.99,
                status: 'in-stock',
                image: '🪑',
                trend: 'stable'
              },
            ].map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{product.image}</div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock <= 10 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                    {product.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 ml-1" />}
                    {product.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 ml-1 transform rotate-180" />}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  ${(product.stock * product.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'in-stock' ? 'bg-green-100 text-green-800' :
                    product.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'in-stock' ? 'In Stock' :
                     product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                    <button className="text-green-600 hover:text-green-900">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Category Analytics */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Category Performance */}
      <div className="bg-card rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Performance</h3>
        <div className="space-y-3">
          {[
            { categoryName: 'Electronics', sales: 45000, percentage: 35.8 },
            { categoryName: 'Clothing', sales: 28000, percentage: 22.3 },
            { categoryName: 'Food & Beverages', sales: 22000, percentage: 17.5 },
            { categoryName: 'Home & Garden', sales: 15000, percentage: 11.9 },
            { categoryName: 'Sports & Outdoors', sales: 10000, percentage: 8.0 },
          ].map((cat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {cat.categoryName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-foreground">{cat.categoryName}</div>
                  <div className="text-sm text-gray-500">{cat.percentage.toFixed(1)}% of total</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">${cat.sales.toLocaleString()}</div>
                <div className="text-sm text-gray-500">
                  Sales
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="bg-card rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Stock Alerts</h3>
        <div className="space-y-3">
          {[
            {
              type: 'critical',
              title: 'Critical Stock Levels',
              count: 8,
              items: ['Wireless Mouse (3 left)', 'USB Cable (2 left)', 'Power Bank (1 left)'],
              color: 'bg-red-50 border-red-200 text-red-800'
            },
            {
              type: 'warning',
              title: 'Low Stock Alerts',
              count: 17,
              items: ['Bluetooth Speaker (8 left)', 'Phone Case (5 left)', 'Screen Protector (12 left)'],
              color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
            },
            {
              type: 'info',
              title: 'Reorder Suggestions',
              count: 12,
              items: ['Laptop Stand (15 left)', 'Desk Lamp (22 left)', 'Notebook Set (8 left)'],
              color: 'bg-blue-50 border-blue-200 text-blue-800'
            },
          ].map((alert, index) => (
            <div key={index} className={`p-3 rounded-lg border ${alert.color}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{alert.title}</div>
                <span className="bg-muted px-2 py-1 rounded text-sm font-semibold">{alert.count}</span>
              </div>
              <div className="text-sm space-y-1">
                {alert.items.map((item, i) => (
                  <div key={i}>• {item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Customers route
const CustomersPage = () => {
  const [selectedCustomer, setSelectedCustomer] = React.useState(null)
  const [activeTab, setActiveTab] = React.useState('overview')

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Customer Relationship Management</h1>
        <p className="text-muted-foreground mt-2">Advanced customer analytics and engagement platform</p>
      </div>

      {/* Customer Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-blue-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+12.4%</span>
          </div>
          <div className="text-2xl font-bold">3,847</div>
          <div className="text-blue-100 text-sm">Total Customers</div>
          <div className="text-xs text-blue-200 mt-1">245 new this month</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-green-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+8.7%</span>
          </div>
          <div className="text-2xl font-bold">$2,847</div>
          <div className="text-green-100 text-sm">Avg Customer Value</div>
          <div className="text-xs text-green-200 mt-1">+18% YoY growth</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Crown className="h-8 w-8 text-purple-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">VIP</span>
          </div>
          <div className="text-2xl font-bold">156</div>
          <div className="text-purple-100 text-sm">VIP Members</div>
          <div className="text-xs text-purple-200 mt-1">4.1% of total</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-8 w-8 text-orange-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">Active</span>
          </div>
          <div className="text-2xl font-bold">89.3%</div>
          <div className="text-orange-100 text-sm">Retention Rate</div>
          <div className="text-xs text-orange-200 mt-1">+3.2% improvement</div>
        </div>
      </div>

      {/* Customer Segmentation & Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer Segments */}
        <div className="lg:col-span-2 bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Customer Segments</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Premium VIP',
                count: 156,
                percentage: 4.1,
                value: 125000,
                color: 'from-purple-500 to-purple-600',
                icon: Crown,
                characteristics: ['High spenders', 'Frequent buyers', 'Brand advocates']
              },
              {
                name: 'Loyal Regulars',
                count: 892,
                percentage: 23.2,
                value: 280000,
                color: 'from-blue-500 to-blue-600',
                icon: Heart,
                characteristics: ['Repeat customers', 'Medium spend', 'Steady engagement']
              },
              {
                name: 'New Customers',
                count: 245,
                percentage: 6.4,
                value: 18000,
                color: 'from-green-500 to-green-600',
                icon: UserPlus,
                characteristics: ['First-time buyers', 'High potential', 'Nurturing phase']
              },
              {
                name: 'At Risk',
                count: 428,
                percentage: 11.1,
                value: 45000,
                color: 'from-red-500 to-red-600',
                icon: AlertCircle,
                characteristics: ['Declining activity', 'Low engagement', 'Re-engagement needed']
              }
            ].map((segment, index) => (
              <div key={index} className="border border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${segment.color} rounded-lg flex items-center justify-center text-white`}>
                      <segment.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{segment.name}</div>
                      <div className="text-sm text-gray-500">{segment.count} customers ({segment.percentage}%)</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-medium">${segment.value.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    {segment.characteristics.map((char, i) => (
                      <div key={i} className="text-xs text-gray-500">• {char}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Program Stats */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Loyalty Program</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">1,247</div>
              <div className="text-sm text-purple-700">Active Members</div>
            </div>
            <div className="space-y-3">
              {[
                { tier: 'Bronze', members: 623, points: '0-499', color: 'bg-amber-100 text-amber-800' },
                { tier: 'Silver', members: 389, points: '500-1499', color: 'bg-gray-100 text-gray-800' },
                { tier: 'Gold', members: 187, points: '1500-2999', color: 'bg-yellow-100 text-yellow-800' },
                { tier: 'Platinum', members: 48, points: '3000+', color: 'bg-purple-100 text-purple-800' }
              ].map((tier, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${tier.color.split(' ')[0]}`} />
                    <span className="text-sm font-medium">{tier.tier}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{tier.members}</div>
                    <div className="text-xs text-gray-500">{tier.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Customer Management */}
      <div className="bg-card rounded-lg shadow">
        {/* Customer Management Toolbar */}
        <div className="p-4 border-b border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <span className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Customer
                </span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                <span className="flex items-center">
                  <MailIcon className="h-4 w-4 mr-2" />
                  Email Campaign
                </span>
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Segments</option>
                <option>Premium VIP</option>
                <option>Loyal Regulars</option>
                <option>New Customers</option>
                <option>At Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y border">
              {[
                {
                  name: 'Sarah Johnson',
                  email: 'sarah.j@email.com',
                  phone: '+1 (555) 123-4567',
                  segment: 'Premium VIP',
                  spent: 12450.00,
                  orders: 47,
                  lastContact: '2 days ago',
                  status: 'active',
                  avatar: 'SJ',
                  loyaltyPoints: 3247,
                  joinedDate: '2021-03-15'
                },
                {
                  name: 'Michael Chen',
                  email: 'm.chen@email.com',
                  phone: '+1 (555) 987-6543',
                  segment: 'Loyal Regulars',
                  spent: 3420.50,
                  orders: 18,
                  lastContact: '1 week ago',
                  status: 'active',
                  avatar: 'MC',
                  loyaltyPoints: 1234,
                  joinedDate: '2022-07-22'
                },
                {
                  name: 'Emily Rodriguez',
                  email: 'emily.r@email.com',
                  phone: '+1 (555) 456-7890',
                  segment: 'New Customers',
                  spent: 245.00,
                  orders: 2,
                  lastContact: '3 days ago',
                  status: 'new',
                  avatar: 'ER',
                  loyaltyPoints: 85,
                  joinedDate: '2024-01-10'
                },
                {
                  name: 'David Kim',
                  email: 'd.kim@email.com',
                  phone: '+1 (555) 321-0987',
                  segment: 'At Risk',
                  spent: 1890.75,
                  orders: 12,
                  lastContact: '1 month ago',
                  status: 'at-risk',
                  avatar: 'DK',
                  loyaltyPoints: 567,
                  joinedDate: '2021-11-05'
                },
                {
                  name: 'Jessica Taylor',
                  email: 'j.taylor@email.com',
                  phone: '+1 (555) 654-3210',
                  segment: 'Premium VIP',
                  spent: 8765.25,
                  orders: 31,
                  lastContact: '5 days ago',
                  status: 'active',
                  avatar: 'JT',
                  loyaltyPoints: 2890,
                  joinedDate: '2020-09-18'
                }
              ].map((customer, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-muted-foreground">{customer.avatar}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        <div className="text-xs text-muted-foreground">{customer.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.segment === 'Premium VIP' ? 'bg-purple-100 text-purple-800' :
                      customer.segment === 'Loyal Regulars' ? 'bg-blue-100 text-blue-800' :
                      customer.segment === 'New Customers' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">${customer.spent.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{customer.loyaltyPoints} pts</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{customer.lastContact}</div>
                    <div className="text-xs text-gray-500">Since {customer.joinedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' :
                      customer.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {customer.status === 'active' ? 'Active' :
                       customer.status === 'new' ? 'New' : 'At Risk'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Send Message">
                        <MailIcon className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Call">
                        <PhoneCall className="h-4 w-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-foreground" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Communication History & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Communications */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Communications</h3>
          <div className="space-y-3">
            {[
              {
                customer: 'Sarah Johnson',
                type: 'email',
                subject: 'Exclusive VIP Offer - New Collection',
                time: '2 hours ago',
                status: 'delivered',
                icon: MailIcon,
                color: 'text-blue-600'
              },
              {
                customer: 'Michael Chen',
                type: 'sms',
                subject: 'Your order is ready for pickup',
                time: '5 hours ago',
                status: 'delivered',
                icon: MessageSquare,
                color: 'text-green-600'
              },
              {
                customer: 'David Kim',
                type: 'email',
                subject: 'We miss you! Come back with 20% off',
                time: '1 day ago',
                status: 'opened',
                icon: MailIcon,
                color: 'text-purple-600'
              },
              {
                customer: 'Jessica Taylor',
                type: 'call',
                subject: 'Customer service follow-up',
                time: '2 days ago',
                status: 'completed',
                icon: PhoneCall,
                color: 'text-orange-600'
              }
            ].map((comm, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`mt-1 ${comm.color}`}>
                  <comm.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">{comm.customer}</p>
                    <span className="text-xs text-gray-500">{comm.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comm.subject}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      comm.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      comm.status === 'opened' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {comm.status}
                    </span>
                    <span className="text-xs text-gray-500 ml-2 capitalize">{comm.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Lifetime Value Predictions */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Customer Value Predictions</h3>
          <div className="space-y-4">
            {[
              {
                name: 'Sarah Johnson',
                currentCLV: 12450,
                predictedCLV: 18750,
                confidence: 87,
                trend: 'up',
                recommendations: ['Focus on premium products', 'Early access to new collections', 'Exclusive events']
              },
              {
                name: 'Michael Chen',
                currentCLV: 3420,
                predictedCLV: 5680,
                confidence: 72,
                trend: 'up',
                recommendations: ['Cross-sell accessories', 'Loyalty program engagement', 'Personalized recommendations']
              },
              {
                name: 'David Kim',
                currentCLV: 1890,
                predictedCLV: 1450,
                confidence: 65,
                trend: 'down',
                recommendations: ['Re-engagement campaign', 'Special discount offer', 'Feedback survey']
              }
            ].map((customer, index) => (
              <div key={index} className="border border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-foreground">{customer.name}</div>
                    <div className="text-sm text-gray-500">Confidence: {customer.confidence}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      ${customer.currentCLV.toLocaleString()} → ${customer.predictedCLV.toLocaleString()}
                    </div>
                    {customer.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 ml-auto" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 ml-auto transform rotate-180" />
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700 mb-1">Recommended Actions:</div>
                  {customer.recommendations.map((rec, i) => (
                    <div key={i} className="text-xs text-muted-foreground">• {rec}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons already imported above - no additional imports needed

// Inventory route
const InventoryPage = () => {
  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Advanced Inventory Management</h1>
        <p className="text-muted-foreground mt-2">Real-time stock tracking, forecasting, and automated replenishment system</p>
      </div>

      {/* Inventory Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-8 w-8 text-blue-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+5.2%</span>
          </div>
          <div className="text-2xl font-bold">12,486</div>
          <div className="text-blue-100 text-sm">Total Items</div>
          <div className="text-xs text-blue-200 mt-1">Across 847 SKUs</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-8 w-8 text-green-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">98.2%</span>
          </div>
          <div className="text-2xl font-bold">In Stock</div>
          <div className="text-green-100 text-sm">Inventory Health</div>
          <div className="text-xs text-green-200 mt-1">Optimal levels</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-8 w-8 text-yellow-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">-8</span>
          </div>
          <div className="text-2xl font-bold">47</div>
          <div className="text-yellow-100 text-sm">Low Stock Alert</div>
          <div className="text-xs text-yellow-200 mt-1">Reorder needed</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="h-8 w-8 text-red-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">Critical</span>
          </div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-red-100 text-sm">Out of Stock</div>
          <div className="text-xs text-red-200 mt-1">Immediate action</div>
        </div>
      </div>

      {/* Inventory Management Toolbar */}
      <div className="bg-card rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <span className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Import/Export
              </span>
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              <span className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Reorder Settings
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Food & Beverages</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Locations</option>
              <option>Main Store</option>
              <option>Warehouse</option>
              <option>Online Store</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stock Level Analysis */}
        <div className="lg:col-span-2 bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Stock Level Analysis</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                This Week
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                This Month
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                category: 'Critical Stock',
                count: 12,
                percentage: 2.8,
                value: 8900,
                color: 'from-red-500 to-red-600',
                items: ['Wireless Mouse (3 left)', 'USB Cable (2 left)', 'Power Bank (1 left)'],
                action: 'Immediate reorder required'
              },
              {
                category: 'Low Stock',
                count: 47,
                percentage: 11.2,
                value: 15600,
                color: 'from-yellow-500 to-yellow-600',
                items: ['Bluetooth Speaker (8 left)', 'Phone Case (5 left)', 'Screen Protector (12 left)'],
                action: 'Schedule reorder this week'
              },
              {
                category: 'Optimal Stock',
                count: 367,
                percentage: 86.0,
                value: 287000,
                color: 'from-green-500 to-green-600',
                items: ['Laptop Stand (45 left)', 'Desk Lamp (67 left)', 'Notebook Set (89 left)'],
                action: 'Maintain current levels'
              }
            ].map((stock, index) => (
              <div key={index} className="border border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stock.color} rounded-lg flex items-center justify-center text-white`}>
                    {stock.category === 'Critical Stock' ? <XCircle className="h-5 w-5" /> :
                     stock.category === 'Low Stock' ? <AlertTriangle className="h-5 w-5" /> :
                     <CheckCircle className="h-5 w-5" />}
                  </div>
                  <span className={`text-2xl font-bold ${
                    stock.category === 'Critical Stock' ? 'text-red-600' :
                    stock.category === 'Low Stock' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {stock.count}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="font-medium text-foreground">{stock.category}</div>
                    <div className="text-sm text-gray-500">{stock.percentage}% of inventory</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-medium">${stock.value.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                    <div className="font-medium text-gray-700 mb-1">Sample Items:</div>
                    {stock.items.slice(0, 2).map((item, i) => (
                      <div key={i}>• {item}</div>
                    ))}
                  </div>
                  <div className={`text-xs p-2 rounded ${
                    stock.category === 'Critical Stock' ? 'bg-red-50 text-red-700' :
                    stock.category === 'Low Stock' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    {stock.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reorder Recommendations */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">AI Reorder Recommendations</h3>
          <div className="space-y-3">
            {[
              {
                product: 'Wireless Mouse Pro',
                currentStock: 3,
                recommendedOrder: 50,
                urgency: 'high',
                reason: 'High demand, 45-day lead time',
                estimatedCost: 750,
                supplier: 'TechGear Inc.'
              },
              {
                product: 'Bluetooth Speaker',
                currentStock: 8,
                recommendedOrder: 30,
                urgency: 'medium',
                reason: 'Seasonal demand increase',
                estimatedCost: 900,
                supplier: 'AudioMax'
              },
              {
                product: 'USB-C Cable Multi-Port',
                currentStock: 2,
                recommendedOrder: 100,
                urgency: 'high',
                reason: 'Running promotional sale',
                estimatedCost: 500,
                supplier: 'CablePro'
              },
              {
                product: 'Laptop Stand Adjustable',
                currentStock: 15,
                recommendedOrder: 25,
                urgency: 'low',
                reason: 'Maintain safety stock',
                estimatedCost: 625,
                supplier: 'OfficeTech'
              }
            ].map((item, index) => (
              <div key={index} className="border border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-foreground text-sm">{item.product}</div>
                    <div className="text-xs text-gray-500">{item.supplier}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    item.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.urgency}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Stock</span>
                    <span className="font-medium text-red-600">{item.currentStock}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Order Qty</span>
                    <span className="font-medium text-green-600">{item.recommendedOrder}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Est. Cost</span>
                    <span className="font-medium">${item.estimatedCost}</span>
                  </div>
                  <div className="text-gray-500 mt-1">{item.reason}</div>
                </div>
                <button className="w-full mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                  Quick Order
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Movement Tracking */}
      <div className="bg-card rounded-lg shadow mb-6">
        <div className="p-4 border-b border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Real-Time Inventory Movement</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2" />
                <span className="text-sm text-muted-foreground">Live Tracking</span>
              </div>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                Export Log
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y border">
              {[
                {
                  time: '2 minutes ago',
                  product: 'Wireless Headphones Pro',
                  type: 'sale',
                  quantity: -2,
                  location: 'Main Store',
                  reference: 'Order #1001',
                  user: 'John Doe',
                  status: 'completed'
                },
                {
                  time: '15 minutes ago',
                  product: 'USB-C Hub Multi-Port',
                  type: 'restock',
                  quantity: +50,
                  location: 'Warehouse',
                  reference: 'PO #4582',
                  user: 'Sarah Smith',
                  status: 'completed'
                },
                {
                  time: '1 hour ago',
                  product: 'Smart Watch Ultra',
                  type: 'transfer',
                  quantity: -10,
                  location: 'Main Store → Online',
                  reference: 'Transfer #891',
                  user: 'Mike Johnson',
                  status: 'in-progress'
                },
                {
                  time: '2 hours ago',
                  product: 'Laptop Stand Adjustable',
                  type: 'adjustment',
                  quantity: -5,
                  location: 'Main Store',
                  reference: 'Inventory Count',
                  user: 'Emily Chen',
                  status: 'completed'
                },
                {
                  time: '3 hours ago',
                  product: 'Premium Coffee Beans',
                  type: 'return',
                  quantity: +3,
                  location: 'Main Store',
                  reference: 'Return #234',
                  user: 'David Kim',
                  status: 'completed'
                }
              ].map((movement, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{movement.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{movement.product}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      movement.type === 'sale' ? 'bg-blue-100 text-blue-800' :
                      movement.type === 'restock' ? 'bg-green-100 text-green-800' :
                      movement.type === 'transfer' ? 'bg-purple-100 text-purple-800' :
                      movement.type === 'return' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {movement.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.reference}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{movement.user}</div>
                    {movement.status === 'in-progress' && (
                      <div className="text-xs text-yellow-600">In Progress</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Locations & Stock Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock by Location */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Stock Distribution by Location</h3>
          <div className="space-y-4">
            {[
              {
                location: 'Main Store - Front',
                totalItems: 342,
                totalValue: 67800,
                capacity: 85,
                zones: ['Electronics (120)', 'Accessories (89)', 'Small Items (133)'],
                status: 'optimal'
              },
              {
                location: 'Main Store - Backroom',
                totalItems: 567,
                totalValue: 45600,
                capacity: 72,
                zones: ['Overstock (234)', 'Bulk Items (156)', 'Returns (177)'],
                status: 'warning'
              },
              {
                location: 'Warehouse - Section A',
                totalItems: 1890,
                totalValue: 234000,
                capacity: 94,
                zones: ['Electronics (890)', 'Large Items (678)', 'Bulk Storage (322)'],
                status: 'optimal'
              },
              {
                location: 'Warehouse - Section B',
                totalItems: 1245,
                totalValue: 89000,
                capacity: 68,
                zones: ['Seasonal (456)', 'Clearance (234)', 'Archive (555)'],
                status: 'critical'
              }
            ].map((location, index) => (
              <div key={index} className="border border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-foreground">{location.location}</div>
                    <div className="text-sm text-gray-500">{location.totalItems} items • ${location.totalValue.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{location.capacity}% capacity</div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                      <div className={`h-2 rounded-full ${
                        location.status === 'optimal' ? 'bg-green-500' :
                        location.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} style={{ width: `${location.capacity}%` }} />
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  {location.zones.map((zone, i) => (
                    <div key={i}>• {zone}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Forecasting */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Demand Forecasting (Next 30 Days)</h3>
          <div className="space-y-4">
            {[
              {
                product: 'Wireless Headphones Pro',
                currentStock: 45,
                predictedDemand: 62,
                reorderPoint: 20,
                recommendation: 'Order soon',
                confidence: 92,
                trend: 'increasing'
              },
              {
                product: 'Smart Watch Ultra',
                currentStock: 8,
                predictedDemand: 35,
                reorderPoint: 15,
                recommendation: 'Urgent reorder',
                confidence: 88,
                trend: 'stable'
              },
              {
                product: 'USB-C Hub Multi-Port',
                currentStock: 156,
                predictedDemand: 98,
                reorderPoint: 30,
                recommendation: 'Stock healthy',
                confidence: 76,
                trend: 'decreasing'
              },
              {
                product: 'Laptop Stand Adjustable',
                currentStock: 23,
                predictedDemand: 41,
                reorderPoint: 10,
                recommendation: 'Plan reorder',
                confidence: 84,
                trend: 'increasing'
              }
            ].map((forecast, index) => (
              <div key={index} className="border border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-foreground text-sm">{forecast.product}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Confidence: {forecast.confidence}%</span>
                    {forecast.trend === 'increasing' ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : forecast.trend === 'decreasing' ? (
                      <TrendingUp className="h-3 w-3 text-red-500 transform rotate-180" />
                    ) : (
                      <div className="h-3 w-3 bg-gray-400 rounded-full" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-gray-500">Current</div>
                    <div className="font-medium">{forecast.currentStock}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Demand</div>
                    <div className="font-medium text-blue-600">{forecast.predictedDemand}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Reorder at</div>
                    <div className="font-medium text-orange-600">{forecast.reorderPoint}</div>
                  </div>
                </div>
                <div className={`text-xs mt-2 px-2 py-1 rounded text-center ${
                  forecast.recommendation === 'Urgent reorder' ? 'bg-red-100 text-red-800' :
                  forecast.recommendation === 'Order soon' ? 'bg-yellow-100 text-yellow-800' :
                  forecast.recommendation === 'Plan reorder' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {forecast.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sales route
const SalesPage = () => {
  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Advanced Sales Analytics</h1>
        <p className="text-muted-foreground mt-2">Comprehensive sales performance analysis and transaction management system</p>
      </div>

      {/* Sales Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-green-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+18.4%</span>
          </div>
          <div className="text-2xl font-bold">$12,847</div>
          <div className="text-green-100 text-sm">Today's Revenue</div>
          <div className="text-xs text-green-200 mt-1">Above daily target</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="h-8 w-8 text-blue-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+24</span>
          </div>
          <div className="text-2xl font-bold">167</div>
          <div className="text-blue-100 text-sm">Transactions</div>
          <div className="text-xs text-blue-200 mt-1">Avg: $76.95 per sale</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-purple-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+15</span>
          </div>
          <div className="text-2xl font-bold">89</div>
          <div className="text-purple-100 text-sm">Unique Customers</div>
          <div className="text-xs text-purple-200 mt-1">47% repeat rate</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-orange-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+8.7%</span>
          </div>
          <div className="text-2xl font-bold">$144.30</div>
          <div className="text-orange-100 text-sm">Avg Order Value</div>
          <div className="text-xs text-orange-200 mt-1">+12% vs last week</div>
        </div>
      </div>

      {/* Sales Analytics Toolbar */}
      <div className="bg-card rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <span className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </span>
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              <span className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Advanced Analytics
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Today</option>
              <option>Yesterday</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Channels</option>
              <option>In-Store</option>
              <option>Online</option>
              <option>Phone</option>
              <option>Mobile App</option>
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Performance Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Sales Performance Trend</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                Revenue
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                Orders
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                Customers
              </button>
            </div>
          </div>
          <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Interactive Sales Chart</p>
              <p className="text-sm text-gray-500 mt-2">Real-time revenue tracking with trend analysis</p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Peak Hour</p>
                  <p className="font-semibold text-foreground">2:00 PM - 3:00 PM</p>
                </div>
                <div>
                  <p className="text-gray-500">Best Day</p>
                  <p className="font-semibold text-foreground">Saturday</p>
                </div>
                <div>
                  <p className="text-gray-500">Growth Rate</p>
                  <p className="font-semibold text-green-600">+18.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products Today */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Products Today</h3>
          <div className="space-y-3">
            {[
              {
                name: 'Wireless Headphones Pro',
                units: 24,
                revenue: 7199.76,
                growth: '+15%',
                icon: '🎧'
              },
              {
                name: 'Smart Watch Ultra',
                units: 12,
                revenue: 5999.88,
                growth: '+8%',
                icon: '⌚'
              },
              {
                name: 'USB-C Hub Multi-Port',
                units: 45,
                revenue: 2249.55,
                growth: '+22%',
                icon: '🔌'
              },
              {
                name: 'Laptop Stand Adjustable',
                units: 18,
                revenue: 6299.82,
                growth: '+5%',
                icon: '🪑'
              },
              {
                name: 'Premium Coffee Beans',
                units: 67,
                revenue: 1272.33,
                growth: '+31%',
                icon: '☕'
              }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{product.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-foreground">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.units} units</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">${product.revenue.toFixed(2)}</div>
                  <div className="text-xs text-green-600">{product.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Methods Analysis</h3>
          <div className="space-y-4">
            {[
              {
                method: 'Credit Card',
                transactions: 89,
                amount: 8747.25,
                percentage: 68.1,
                trend: 'up',
                fees: 262.42,
                icon: CreditCard,
                color: 'from-blue-500 to-blue-600'
              },
              {
                method: 'Cash',
                transactions: 45,
                amount: 2456.50,
                percentage: 19.1,
                trend: 'stable',
                fees: 0,
                icon: DollarSign,
                color: 'from-green-500 to-green-600'
              },
              {
                method: 'Mobile Payment',
                transactions: 23,
                amount: 1247.80,
                percentage: 9.7,
                trend: 'up',
                fees: 37.43,
                icon: Phone,
                color: 'from-purple-500 to-purple-600'
              },
              {
                method: 'Gift Card',
                transactions: 10,
                amount: 395.45,
                percentage: 3.1,
                trend: 'down',
                fees: 0,
                icon: Gift,
                color: 'from-pink-500 to-pink-600'
              }
            ].map((payment, index) => (
              <div key={index} className="border border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${payment.color} rounded-lg flex items-center justify-center text-white`}>
                      <payment.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{payment.method}</div>
                      <div className="text-sm text-gray-500">{payment.transactions} transactions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${payment.amount.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{payment.percentage}% of total</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fees</span>
                  <span className="font-medium">${payment.fees.toFixed(2)}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${payment.color}`}
                    style={{ width: `${payment.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Team Performance */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sales Team Performance</h3>
          <div className="space-y-4">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Senior Sales Associate',
                sales: 47,
                revenue: 5847.25,
                avgOrder: 124.42,
                conversion: 24.5,
                avatar: 'SJ',
                status: 'top-performer'
              },
              {
                name: 'Michael Chen',
                role: 'Sales Associate',
                sales: 38,
                revenue: 3456.80,
                avgOrder: 90.97,
                conversion: 18.2,
                avatar: 'MC',
                status: 'above-target'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Junior Sales Associate',
                sales: 29,
                revenue: 2145.60,
                avgOrder: 73.99,
                conversion: 15.8,
                avatar: 'ER',
                status: 'on-target'
              },
              {
                name: 'David Kim',
                role: 'Sales Associate',
                sales: 31,
                revenue: 2897.35,
                avgOrder: 93.46,
                conversion: 19.1,
                avatar: 'DK',
                status: 'above-target'
              }
            ].map((staff, index) => (
              <div key={index} className="border border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {staff.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{staff.name}</div>
                      <div className="text-xs text-gray-500">{staff.role}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    staff.status === 'top-performer' ? 'bg-green-100 text-green-800' :
                    staff.status === 'above-target' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {staff.status === 'top-performer' ? 'Top Performer' :
                     staff.status === 'above-target' ? 'Above Target' : 'On Target'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <div className="text-gray-500">Sales</div>
                    <div className="font-medium">{staff.sales}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Revenue</div>
                    <div className="font-medium">${staff.revenue.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Avg Order</div>
                    <div className="font-medium">${staff.avgOrder.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Conversion</div>
                    <div className="font-medium">{staff.conversion}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-card rounded-lg shadow">
        <div className="p-4 border-b border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                Filter
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y border">
              {[
                {
                  id: '1001',
                  time: '2:34 PM',
                  customer: 'Sarah Johnson',
                  items: 5,
                  total: 299.99,
                  payment: 'Credit Card',
                  staff: 'John Doe',
                  status: 'completed',
                  channel: 'in-store'
                },
                {
                  id: '1000',
                  time: '2:28 PM',
                  customer: 'Michael Chen',
                  items: 3,
                  total: 189.99,
                  payment: 'Cash',
                  staff: 'Emily Rodriguez',
                  status: 'completed',
                  channel: 'in-store'
                },
                {
                  id: '999',
                  time: '2:15 PM',
                  customer: 'Online Guest',
                  items: 8,
                  total: 447.25,
                  payment: 'Mobile Payment',
                  staff: 'System',
                  status: 'processing',
                  channel: 'online'
                },
                {
                  id: '998',
                  time: '2:05 PM',
                  customer: 'David Kim',
                  items: 2,
                  total: 129.99,
                  payment: 'Credit Card',
                  staff: 'Sarah Johnson',
                  status: 'completed',
                  channel: 'in-store'
                },
                {
                  id: '997',
                  time: '1:52 PM',
                  customer: 'Emily Rodriguez',
                  items: 1,
                  total: 89.99,
                  payment: 'Gift Card',
                  staff: 'Michael Chen',
                  status: 'completed',
                  channel: 'in-store'
                }
              ].map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">#{transaction.id}</div>
                    <div className="text-xs text-gray-500">{transaction.channel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{transaction.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{transaction.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{transaction.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">${transaction.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.payment === 'Credit Card' ? 'bg-blue-100 text-blue-800' :
                      transaction.payment === 'Cash' ? 'bg-green-100 text-green-800' :
                      transaction.payment === 'Mobile Payment' ? 'bg-purple-100 text-purple-800' :
                      'bg-pink-100 text-pink-800'
                    }`}>
                      {transaction.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{transaction.staff}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Completed' : 'Processing'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Receipt</button>
                      <button className="text-muted-foreground hover:text-foreground">Refund</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Reports route
const ReportsPage = () => {
  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Advanced Business Intelligence</h1>
        <p className="text-muted-foreground mt-2">Comprehensive analytics platform with real-time insights and predictive forecasting</p>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-indigo-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+24.7%</span>
          </div>
          <div className="text-2xl font-bold">$284.7K</div>
          <div className="text-indigo-100 text-sm">Monthly Revenue</div>
          <div className="text-xs text-indigo-200 mt-1">Above target by 18%</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-green-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+5.2%</span>
          </div>
          <div className="text-2xl font-bold">42.8%</div>
          <div className="text-green-100 text-sm">Profit Margin</div>
          <div className="text-xs text-green-200 mt-1">+2.1% improvement</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-purple-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">+156</span>
          </div>
          <div className="text-2xl font-bold">3,478</div>
          <div className="text-purple-100 text-sm">Active Customers</div>
          <div className="text-xs text-purple-200 mt-1">89% retention rate</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-8 w-8 text-orange-200" />
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">On Track</span>
          </div>
          <div className="text-2xl font-bold">94.2%</div>
          <div className="text-orange-100 text-sm">Goal Achievement</div>
          <div className="text-xs text-orange-200 mt-1">Q4 objectives</div>
        </div>
      </div>

      {/* Reports Generation Panel */}
      <div className="bg-card rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </span>
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              <span className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Custom Analytics
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Departments</option>
              <option>Sales</option>
              <option>Inventory</option>
              <option>Marketing</option>
              <option>Finance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Analysis Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Revenue & Profit Analysis</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                Revenue
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                Profit
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                Margin
              </button>
            </div>
          </div>
          <div className="h-80 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Revenue Breakdown by Category</p>
              <p className="text-sm text-gray-500 mt-2">Interactive charts with drill-down capabilities</p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Top Category</p>
                  <p className="font-semibold text-foreground">Electronics</p>
                </div>
                <div>
                  <p className="text-gray-500">Growth Driver</p>
                  <p className="font-semibold text-green-600">Mobile Sales</p>
                </div>
                <div>
                  <p className="text-gray-500">YoY Growth</p>
                  <p className="font-semibold text-blue-600">+32.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Report Templates */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Report Templates</h3>
          <div className="space-y-3">
            {[
              {
                name: 'Monthly Performance',
                description: 'Revenue, profit, and KPI summary',
                icon: BarChart3,
                color: 'from-blue-500 to-blue-600',
                frequency: 'Monthly',
                lastGenerated: '2 days ago'
              },
              {
                name: 'Inventory Analysis',
                description: 'Stock levels and turnover rates',
                icon: Package,
                color: 'from-green-500 to-green-600',
                frequency: 'Weekly',
                lastGenerated: '1 day ago'
              },
              {
                name: 'Customer Insights',
                description: 'Behavior and segmentation analysis',
                icon: Users,
                color: 'from-purple-500 to-purple-600',
                frequency: 'Monthly',
                lastGenerated: '5 days ago'
              },
              {
                name: 'Sales Team Report',
                description: 'Individual and team performance',
                icon: Award,
                color: 'from-orange-500 to-orange-600',
                frequency: 'Weekly',
                lastGenerated: '3 days ago'
              }
            ].map((report, index) => (
              <div key={index} className="border border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${report.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                    <report.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">{report.name}</div>
                    <div className="text-xs text-gray-500">{report.description}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{report.frequency}</span>
                      <span className="text-xs text-muted-foreground">{report.lastGenerated}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Performance */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Department Performance Metrics</h3>
          <div className="space-y-4">
            {[
              {
                department: 'Sales',
                revenue: 284750,
                target: 250000,
                achievement: 113.9,
                growth: 24.7,
                efficiency: 94.2,
                color: 'from-blue-500 to-blue-600',
                topMetric: 'Conversion Rate: 3.8%'
              },
              {
                department: 'Marketing',
                leads: 1847,
                target: 1500,
                achievement: 123.1,
                growth: 45.2,
                efficiency: 87.6,
                color: 'from-purple-500 to-purple-600',
                topMetric: 'ROI: 342%'
              },
              {
                department: 'Inventory',
                turnover: 8.7,
                target: 6.5,
                achievement: 133.8,
                growth: 12.4,
                efficiency: 91.3,
                color: 'from-green-500 to-green-600',
                topMetric: 'Carrying Cost: 2.1%'
              },
              {
                department: 'Customer Service',
                satisfaction: 94.7,
                target: 90.0,
                achievement: 105.2,
                growth: 8.9,
                efficiency: 96.8,
                color: 'from-orange-500 to-orange-600',
                topMetric: 'Response Time: 1.2h'
              }
            ].map((dept, index) => (
              <div key={index} className="border border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${dept.color} rounded-lg flex items-center justify-center text-white`}>
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{dept.department}</div>
                      <div className="text-sm text-gray-500">{dept.topMetric}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">{dept.achievement}%</div>
                    <div className="text-sm text-green-600">+{dept.growth}% growth</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Current/Target</div>
                    <div className="font-medium">
                      {dept.department === 'Sales' ? `$${(dept.revenue/1000).toFixed(0)}K / $${(dept.target/1000).toFixed(0)}K` :
                       dept.department === 'Marketing' ? `${dept.leads} / ${dept.target}` :
                       dept.department === 'Inventory' ? `${dept.turnover}x / ${dept.target}x` :
                       `${dept.satisfaction}% / ${dept.target}%`}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Efficiency</div>
                    <div className="font-medium">{dept.efficiency}%</div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${dept.color}`}
                    style={{ width: `${Math.min(dept.achievement, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Analytics */}
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">AI-Powered Forecasts</h3>
          <div className="space-y-4">
            {[
              {
                metric: 'Next Month Revenue',
                current: 284750,
                predicted: 312450,
                confidence: 87,
                trend: 'up',
                factors: ['Seasonal demand', 'New product launch', 'Marketing campaign'],
                recommendation: 'Increase inventory by 15%'
              },
              {
                metric: 'Customer Growth',
                current: 3478,
                predicted: 3656,
                confidence: 92,
                trend: 'up',
                factors: ['Retention improvements', 'Referral program', 'Market expansion'],
                recommendation: 'Focus on onboarding efficiency'
              },
              {
                metric: 'Inventory Turnover',
                current: 8.7,
                predicted: 8.2,
                confidence: 78,
                trend: 'down',
                factors: ['Seasonal slowdown', 'Supply chain delays', 'Price changes'],
                recommendation: 'Optimize reorder points'
              },
              {
                metric: 'Profit Margin',
                current: 42.8,
                predicted: 44.1,
                confidence: 83,
                trend: 'up',
                factors: ['Cost reductions', 'Premium mix shift', 'Operational efficiency'],
                recommendation: 'Maintain current pricing strategy'
              }
            ].map((forecast, index) => (
              <div key={index} className="border border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-foreground text-sm">{forecast.metric}</div>
                    <div className="text-xs text-gray-500">Confidence: {forecast.confidence}%</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {forecast.metric.includes('Revenue') ? `$${(forecast.current/1000).toFixed(0)}K` :
                       forecast.metric.includes('Customer') ? forecast.current.toLocaleString() :
                       forecast.current + (forecast.metric.includes('Margin') ? '%' : 'x')}
                    </span>
                    <span className="text-sm text-muted-foreground">→</span>
                    <span className="text-sm font-medium">
                      {forecast.metric.includes('Revenue') ? `$${(forecast.predicted/1000).toFixed(0)}K` :
                       forecast.metric.includes('Customer') ? forecast.predicted.toLocaleString() :
                       forecast.predicted + (forecast.metric.includes('Margin') ? '%' : 'x')}
                    </span>
                    {forecast.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-red-500 transform rotate-180" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  <span className="font-medium">Key Factors:</span> {forecast.factors.join(', ')}
                </div>
                <div className={`text-xs p-2 rounded ${
                  forecast.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <span className="font-medium">AI Recommendation:</span> {forecast.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-card rounded-lg shadow">
        <div className="p-4 border-b border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Automated Report Schedule</h3>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
              Schedule New Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y border">
              {[
                {
                  name: 'Weekly Sales Performance',
                  type: 'Sales Analytics',
                  frequency: 'Every Monday',
                  recipients: 5,
                  nextRun: 'In 3 days',
                  status: 'active',
                  lastRun: '2 days ago'
                },
                {
                  name: 'Monthly Inventory Report',
                  type: 'Inventory Analysis',
                  frequency: '1st of Month',
                  recipients: 3,
                  nextRun: 'In 14 days',
                  status: 'active',
                  lastRun: '5 days ago'
                },
                {
                  name: 'Customer Loyalty Metrics',
                  type: 'Customer Analytics',
                  frequency: 'Bi-weekly',
                  recipients: 4,
                  nextRun: 'Tomorrow',
                  status: 'active',
                  lastRun: '1 week ago'
                },
                {
                  name: 'Financial Summary',
                  type: 'Financial Report',
                  frequency: 'Monthly',
                  recipients: 8,
                  nextRun: 'In 14 days',
                  status: 'paused',
                  lastRun: '1 month ago'
                }
              ].map((report, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{report.name}</div>
                    <div className="text-xs text-gray-500">Last run: {report.lastRun}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{report.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{report.recipients} recipients</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{report.nextRun}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-green-600 hover:text-green-900">Run Now</button>
                      <button className="text-muted-foreground hover:text-foreground">Configure</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Settings route
const SettingsPage = () => {
  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Advanced System Configuration</h1>
        <p className="text-muted-foreground mt-2">Comprehensive settings management for store operations, security, and preferences</p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-card rounded-lg shadow mb-6">
        <div className="border-b border">
          <nav className="flex space-x-8 px-6" aria-label="Settings navigation">
            {[
              { name: 'General', icon: Settings, current: true },
              { name: 'Store', icon: Store, current: false },
              { name: 'Payments', icon: CreditCard, current: false },
              { name: 'Users', icon: Users, current: false },
              { name: 'Security', icon: Shield, current: false },
              { name: 'Integrations', icon: Zap, current: false },
              { name: 'Advanced', icon: Settings, current: false }
            ].map((item) => (
              <button
                key={item.name}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  item.current
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Configuration */}
          <div className="bg-card rounded-lg shadow">
            <div className="p-6 border-b border">
              <h3 className="text-lg font-semibold text-foreground">Store Configuration</h3>
              <p className="text-sm text-muted-foreground mt-1">Basic store information and operational settings</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    defaultValue="StoreWise Main Location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store ID</label>
                  <input
                    type="text"
                    defaultValue="ST001"
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue="info@storewise.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                <textarea
                  rows={3}
                  defaultValue="123 Main Street, City, State 12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>CAD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Configuration */}
          <div className="bg-card rounded-lg shadow">
            <div className="p-6 border-b border">
              <h3 className="text-lg font-semibold text-foreground">Payment Methods Configuration</h3>
              <p className="text-sm text-muted-foreground mt-1">Configure and manage payment processing options</p>
            </div>
            <div className="p-6 space-y-4">
              {[
                {
                  name: 'Credit Card Processing',
                  provider: 'Stripe',
                  status: 'active',
                  fees: '2.9% + $0.30',
                  icon: CreditCard,
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  name: 'Mobile Payments',
                  provider: 'Apple Pay, Google Pay',
                  status: 'active',
                  fees: '2.9% + $0.30',
                  icon: Phone,
                  color: 'from-green-500 to-green-600'
                },
                {
                  name: 'Cash Payments',
                  provider: 'Physical Cash',
                  status: 'active',
                  fees: 'No fees',
                  icon: DollarSign,
                  color: 'from-yellow-500 to-yellow-600'
                },
                {
                  name: 'Gift Cards',
                  provider: 'StoreWise Gift Cards',
                  status: 'active',
                  fees: 'No fees',
                  icon: Gift,
                  color: 'from-purple-500 to-purple-600'
                }
              ].map((payment, index) => (
                <div key={index} className="border border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${payment.color} rounded-lg flex items-center justify-center text-white`}>
                        <payment.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{payment.name}</div>
                        <div className="text-sm text-gray-500">Provider: {payment.provider}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Processing Fees</div>
                        <div className="font-medium">{payment.fees}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Configure</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Configuration */}
          <div className="bg-card rounded-lg shadow">
            <div className="p-6 border-b border">
              <h3 className="text-lg font-semibold text-foreground">Tax Configuration</h3>
              <p className="text-sm text-muted-foreground mt-1">Set up tax rates and calculation rules</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Tax Rate</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      defaultValue="8.5"
                      step="0.1"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Calculation Method</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Inclusive (tax included in price)</option>
                    <option>Exclusive (tax added to price)</option>
                  </select>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium text-foreground mb-3">Regional Tax Rates</h4>
                <div className="space-y-3">
                  {[
                    { region: 'State Tax', rate: 6.5, active: true },
                    { region: 'City Tax', rate: 2.0, active: true },
                    { region: 'Special District', rate: 0.0, active: false }
                  ].map((tax, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={tax.active}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-foreground">{tax.region}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          defaultValue={tax.rate}
                          step="0.1"
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Backup Settings
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Export Configuration
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Reset to Defaults
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { service: 'Database', status: 'healthy', uptime: '99.9%' },
                { service: 'Payment Gateway', status: 'healthy', uptime: '99.8%' },
                { service: 'Email Service', status: 'healthy', uptime: '99.7%' },
                { service: 'Inventory Sync', status: 'healthy', uptime: '100%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-700">{item.service}</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.uptime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Payment method updated', time: '2 hours ago', user: 'Admin' },
                { action: 'Tax rates modified', time: '1 day ago', user: 'Admin' },
                { action: 'User role changed', time: '3 days ago', user: 'Admin' },
                { action: 'System backup completed', time: '1 week ago', user: 'System' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-foreground">{activity.action}</div>
                    <div className="text-gray-500 text-xs">{activity.time} • {activity.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Settings */}
      <div className="mt-6 flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel Changes
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Save All Settings
        </button>
      </div>
    </div>
  )
}

// Profile route
const ProfilePage = () => {
  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">User Profile Management</h1>
        <p className="text-muted-foreground mt-2">Advanced user account settings, security, and personalization options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow p-6">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                JD
              </div>
              <h2 className="text-xl font-bold text-foreground">John Doe</h2>
              <p className="text-sm text-gray-500">Administrator</p>
              <div className="mt-2 flex items-center justify-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Verified</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">john.doe@storewise.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">New York, NY</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Joined March 2021</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border">
              <h4 className="text-sm font-medium text-foreground mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-xs text-gray-500">Total Sales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">4.9</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">892</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-card rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Achievements</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Award, color: 'from-yellow-400 to-yellow-600', name: 'Top Seller' },
                { icon: Star, color: 'from-blue-400 to-blue-600', name: '5-Star Rated' },
                { icon: Trophy, color: 'from-purple-400 to-purple-600', name: 'Sales Leader' },
                { icon: Medal, color: 'from-green-400 to-green-600', name: 'Perfect Record' },
                { icon: Crown, color: 'from-orange-400 to-orange-600', name: 'VIP Member' },
                { icon: Gem, color: 'from-pink-400 to-pink-600', name: 'Diamond Tier' }
              ].map((achievement, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className={`w-12 h-12 mx-auto bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center text-white transform transition-transform group-hover:scale-110`}>
                    <achievement.icon className="h-6 w-6" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 group-hover:text-foreground">{achievement.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-card rounded-lg shadow">
            <div className="p-6 border-b border">
              <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              <p className="text-sm text-muted-foreground mt-1">Manage your personal details and contact information</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue="john.doe@storewise.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    defaultValue="1985-06-15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Sales</option>
                    <option>Management</option>
                    <option>Customer Service</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows={4}
                  defaultValue="Experienced sales professional with a passion for customer service and achieving exceptional results."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-card rounded-lg shadow">
            <div className="p-6 border-b border">
              <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
              <p className="text-sm text-muted-foreground mt-1">Manage your password and authentication preferences</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-foreground mb-4">Two-Factor Authentication</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">SMS Authentication</div>
                        <div className="text-sm text-gray-500">Receive codes via SMS</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-green-600">Enabled</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Configure</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Authenticator App</div>
                        <div className="text-sm text-gray-500">Use Google Authenticator or similar</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">Disabled</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Enable</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-card rounded-lg shadow">
            <div className="p-6 border-b border">
              <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
              <p className="text-sm text-muted-foreground mt-1">Customize your application experience</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-foreground mb-4">Notification Preferences</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Email Notifications', description: 'Receive updates via email', enabled: true },
                    { name: 'SMS Alerts', description: 'Get critical alerts via SMS', enabled: true },
                    { name: 'Desktop Notifications', description: 'Browser push notifications', enabled: false },
                    { name: 'Weekly Reports', description: 'Receive weekly performance summaries', enabled: true }
                  ].map((notification, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">{notification.name}</div>
                        <div className="text-sm text-gray-500">{notification.description}</div>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notification.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                            notification.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-card rounded-lg shadow">
            <div className="p-6 border-b border">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <p className="text-sm text-muted-foreground mt-1">Your recent account activity and login history</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    action: 'Logged in from New York, NY',
                    time: '2 hours ago',
                    device: 'Chrome on Windows',
                    status: 'success'
                  },
                  {
                    action: 'Updated personal information',
                    time: '1 day ago',
                    device: 'Mobile App',
                    status: 'success'
                  },
                  {
                    action: 'Changed password',
                    time: '3 days ago',
                    device: 'Chrome on Windows',
                    status: 'success'
                  },
                  {
                    action: 'Failed login attempt',
                    time: '5 days ago',
                    device: 'Unknown device',
                    status: 'warning'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.device} • {activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel Changes
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Save Profile Changes
        </button>
      </div>
    </div>
  )
}

// POS route
const posRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/pos',
  component: PosPage,
})

// Products route
const productsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/products',
  component: ProductsPage,
})

// Customers route
const customersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/customers',
  component: CustomersPage,
})

// Inventory route
const inventoryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/inventory',
  component: InventoryPage,
})

// Sales route
const salesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/sales',
  component: SalesPage,
})

// Reports route
const reportsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/reports',
  component: ReportsPage,
})

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/settings',
  component: SettingsPage,
})

// Profile route
const profileRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/profile',
  component: ProfilePage,
})

// Build the route tree
export const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([
    indexRoute,
    posRoute,
    productsRoute,
    customersRoute,
    inventoryRoute,
    salesRoute,
    reportsRoute,
    settingsRoute,
    profileRoute,
  ]),
])

// Create the router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  history: browserHistory,
})

// Register router for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}