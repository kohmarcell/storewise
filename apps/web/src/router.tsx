import React, { Suspense, lazy } from 'react'
import { createRootRoute, createRoute, createRouter, Outlet, createBrowserHistory, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'

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
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(mod => ({ default: mod.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(mod => ({ default: mod.DashboardPage })))
const PosPage = lazy(() => import('@/pages/pos/POSPage').then(mod => ({ default: mod.PosPage })))
const ProductsPage = lazy(() => import('@/pages/products/ProductsPage').then(mod => ({ default: mod.ProductsPage })))
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage').then(mod => ({ default: mod.default })))
const InventoryPage = lazy(() => import('@/pages/inventory/InventoryPage').then(mod => ({ default: mod.default })))
const SalesPage = lazy(() => import('@/pages/sales/SalesPage').then(mod => ({ default: mod.default })))
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage').then(mod => ({ default: mod.default })))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage').then(mod => ({ default: mod.default })))

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

// POS route - This is the key fix!
const posRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/pos',
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <PosPage />
    </Suspense>
  ),
})

// Products route
const productsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/products',
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <ProductsPage />
    </Suspense>
  ),
})

// Customers route
const customersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/customers',
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <CustomersPage />
    </Suspense>
  ),
})

// Inventory route
const inventoryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/inventory',
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <InventoryPage />
    </Suspense>
  ),
})

// Sales route
const salesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/sales',
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <SalesPage />
    </Suspense>
  ),
})

// Reports route
const reportsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/reports',
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <ReportsPage />
    </Suspense>
  ),
})

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/settings',
  component: () => (
    <Suspense fallback={<RouteLoader />}>
      <SettingsPage />
    </Suspense>
  ),
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