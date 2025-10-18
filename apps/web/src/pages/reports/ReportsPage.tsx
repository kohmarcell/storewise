import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card'
import { Button } from '@/lib/components/ui/button'
import { Badge } from '@/lib/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

interface ReportData {
  summary: {
    totalRevenue: number
    totalSales: number
    totalCustomers: number
    totalProducts: number
    averageOrderValue: number
    conversionRate: number
    revenueGrowth: number
    salesGrowth: number
  }
  topProducts: Array<{
    name: string
    quantity: number
    revenue: number
    growth: number
  }>
  salesByCategory: Array<{
    category: string
    revenue: number
    percentage: number
  }>
  revenueByDay: Array<{
    date: string
    revenue: number
    sales: number
  }>
  paymentMethods: Array<{
    method: string
    count: number
    revenue: number
    percentage: number
  }>
  lowStockProducts: Array<{
    name: string
    currentStock: number
    minStock: number
    daysOfStock: number
  }>
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30days')
  const [reportType, setReportType] = useState('overview')

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', dateRange, reportType],
    queryFn: () => {
      // Mock API call - replace with actual API
      return Promise.resolve({
        data: generateMockReportData()
      })
    }
  })

  function generateMockReportData(): ReportData {
    const days = dateRange === 'today' ? 1 : dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90
    const baseRevenue = 10000
    const baseSales = 100

    return {
      summary: {
        totalRevenue: baseRevenue * (1 + Math.random() * 0.5),
        totalSales: Math.floor(baseSales * (1 + Math.random() * 0.3)),
        totalCustomers: Math.floor(baseSales * 0.8 * (1 + Math.random() * 0.2)),
        totalProducts: 150,
        averageOrderValue: baseRevenue / baseSales * (1 + Math.random() * 0.2),
        conversionRate: 65 + Math.random() * 20,
        revenueGrowth: (Math.random() - 0.3) * 30,
        salesGrowth: (Math.random() - 0.2) * 25
      },
      topProducts: [
        { name: 'Laptop Pro 15"', quantity: 45, revenue: 67500, growth: 12.5 },
        { name: 'Wireless Mouse', quantity: 89, revenue: 8900, growth: -5.2 },
        { name: 'USB-C Hub', quantity: 67, revenue: 13400, growth: 8.7 },
        { name: 'Mechanical Keyboard', quantity: 34, revenue: 10200, growth: 15.3 },
        { name: 'Monitor 27"', quantity: 23, revenue: 34500, growth: -2.1 }
      ],
      salesByCategory: [
        { category: 'Electronics', revenue: 45000, percentage: 45 },
        { category: 'Accessories', revenue: 25000, percentage: 25 },
        { category: 'Office Supplies', revenue: 15000, percentage: 15 },
        { category: 'Furniture', revenue: 10000, percentage: 10 },
        { category: 'Other', revenue: 5000, percentage: 5 }
      ],
      revenueByDay: Array.from({ length: days }, (_, i) => {
        const date = subDays(new Date(), days - i - 1)
        return {
          date: format(date, 'MMM dd'),
          revenue: baseRevenue / days * (0.8 + Math.random() * 0.4),
          sales: Math.floor(baseSales / days * (0.8 + Math.random() * 0.4))
        }
      }),
      paymentMethods: [
        { method: 'CASH', count: 45, revenue: 22500, percentage: 45 },
        { method: 'CARD', count: 35, revenue: 35000, percentage: 35 },
        { method: 'BANK_TRANSFER', count: 15, revenue: 30000, percentage: 15 },
        { method: 'OTHER', count: 5, revenue: 7500, percentage: 5 }
      ],
      lowStockProducts: [
        { name: 'Wireless Mouse', currentStock: 3, minStock: 10, daysOfStock: 2 },
        { name: 'USB-C Cable', currentStock: 5, minStock: 15, daysOfStock: 3 },
        { name: 'Desk Lamp', currentStock: 1, minStock: 5, daysOfStock: 1 },
        { name: 'Notebook Set', currentStock: 8, minStock: 20, daysOfStock: 4 }
      ]
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  function formatPercentage(value: number) {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  function getGrowthIcon(value: number) {
    return value > 0 ? <ArrowUpRight className="h-4 w-4 text-green-600" /> : <ArrowDownRight className="h-4 w-4 text-red-600" />
  }

  function getGrowthColor(value: number) {
    return value > 0 ? 'text-green-600' : 'text-red-600'
  }

  const exportReport = () => {
    // Mock export functionality
    const reportText = `
StoreWise Analytics Report
Generated: ${format(new Date(), 'PPP')}
Period: ${dateRange}

SUMMARY
-------
Total Revenue: ${reportData?.data && formatCurrency(reportData.data.summary.totalRevenue)}
Total Sales: ${reportData?.data && reportData.data.summary.totalSales}
Total Customers: ${reportData?.data && reportData.data.summary.totalCustomers}
Average Order Value: ${reportData?.data && formatCurrency(reportData.data.summary.averageOrderValue)}
Conversion Rate: ${reportData?.data && reportData.data.summary.conversionRate.toFixed(1)}%

TOP PRODUCTS
------------
${reportData?.data && reportData.data.topProducts.map(p =>
  `${p.name}: ${p.quantity} units, ${formatCurrency(p.revenue)} revenue`
).join('\n')}

LOW STOCK ALERTS
----------------
${reportData?.data && reportData.data.lowStockProducts.map(p =>
  `${p.name}: ${p.currentStock}/${p.minStock} units remaining`
).join('\n')}
    `

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `storewise-report-${format(new Date(), 'yyyy-MM-dd')}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const data = reportData?.data

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-pulse mx-auto mb-4 text-muted-foreground" />
            <p>Loading analytics...</p>
          </div>
        </div>
      ) : data ? (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {getGrowthIcon(data.summary.revenueGrowth)}
                  <span className={`ml-1 ${getGrowthColor(data.summary.revenueGrowth)}`}>
                    {formatPercentage(data.summary.revenueGrowth)} from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.totalSales}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {getGrowthIcon(data.summary.salesGrowth)}
                  <span className={`ml-1 ${getGrowthColor(data.summary.salesGrowth)}`}>
                    {formatPercentage(data.summary.salesGrowth)} from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.summary.averageOrderValue)}</div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Visitors to customers</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Top Products
                </CardTitle>
                <CardDescription>Best performing products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.quantity} units sold
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(product.revenue)}</div>
                        <div className={`text-sm flex items-center justify-end ${getGrowthColor(product.growth)}`}>
                          {getGrowthIcon(product.growth)}
                          <span className="ml-1">{formatPercentage(product.growth)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Sales by Category
                </CardTitle>
                <CardDescription>Revenue distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.salesByCategory.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(category.revenue)} revenue
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Payment method preferences and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.paymentMethods.map((method, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="font-medium mb-2">{method.method.replace('_', ' ')}</div>
                    <div className="text-2xl font-bold mb-1">{formatCurrency(method.revenue)}</div>
                    <div className="text-sm text-muted-foreground">
                      {method.count} transactions ({method.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>Products that need immediate restocking</CardDescription>
            </CardHeader>
            <CardContent>
              {data.lowStockProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>All products are well stocked</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.lowStockProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Current stock: {product.currentStock} / Min required: {product.minStock}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          {product.daysOfStock} days left
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Daily revenue performance over selected period</CardDescription>
            </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.revenueByDay.slice(-7).map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-20">{day.date}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(day.revenue / Math.max(...data.revenueByDay.map(d => d.revenue))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-right w-24">
                        <div className="font-medium">{formatCurrency(day.revenue)}</div>
                        <div className="text-xs text-muted-foreground">{day.sales} sales</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </>
      ) : null}
    </div>
  )
}