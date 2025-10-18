import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/lib/components/ui/button'
import { Input } from '@/lib/components/ui/input'
import { Badge } from '@/lib/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/lib/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/lib/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select'
import {
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
  Package,
  Users
} from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { salesApi } from '@/lib/api'

interface Sale {
  id: string
  invoiceNumber: string
  customerName: string
  customerEmail?: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'OTHER'
  status: 'completed' | 'pending' | 'refunded'
  createdAt: string
  updatedAt: string
  staffName: string
}

interface SaleItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [showSaleDetails, setShowSaleDetails] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  const queryClient = useQueryClient()

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['sales', { dateRange, status: statusFilter, payment: paymentFilter }],
    queryFn: () => {
      // Mock API call - replace with actual API
      return Promise.resolve({
        data: generateMockSales()
      })
    }
  })

  function generateMockSales(): Sale[] {
    const customers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson']
    const paymentMethods: Array<'CASH' | 'CARD' | 'BANK_TRANSFER' | 'OTHER'> = ['CASH', 'CARD', 'BANK_TRANSFER', 'OTHER']
    const statuses: Array<'completed' | 'pending' | 'refunded'> = ['completed', 'completed', 'completed', 'pending', 'refunded']

    const sales: Sale[] = []
    const days = dateRange === 'today' ? 1 : dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90

    for (let i = 0; i < 50; i++) {
      const date = subDays(new Date(), Math.floor(Math.random() * days))
      const itemCount = Math.floor(Math.random() * 5) + 1
      const items: SaleItem[] = []

      for (let j = 0; j < itemCount; j++) {
        items.push({
          id: `item-${i}-${j}`,
          productName: `Product ${j + 1}`,
          quantity: Math.floor(Math.random() * 3) + 1,
          unitPrice: Math.floor(Math.random() * 100) + 10,
          totalPrice: 0
        })
        items[j].totalPrice = items[j].quantity * items[j].unitPrice
      }

      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
      const tax = subtotal * 0.1
      const discount = Math.random() > 0.7 ? subtotal * (Math.random() * 0.2) : 0
      const total = subtotal + tax - discount

      sales.push({
        id: `sale-${i}`,
        invoiceNumber: `INV-${String(i + 1).padStart(6, '0')}`,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        customerEmail: `customer${i}@example.com`,
        items,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        staffName: 'Store Staff'
      })
    }

    return sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const filteredSales = salesData?.data?.filter((sale: Sale) => {
    const matchesSearch = sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || sale.paymentMethod === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  }) || []

  const totalRevenue = filteredSales.reduce((sum, sale: Sale) => sum + sale.total, 0)
  const totalSales = filteredSales.length
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0
  const completedSales = filteredSales.filter(sale => sale.status === 'completed').length

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  function getPaymentMethodIcon(method: string) {
    switch (method) {
      case 'CASH': return <DollarSign className="h-4 w-4" />
      case 'CARD': return <CreditCard className="h-4 w-4" />
      case 'BANK_TRANSFER': return <TrendingUp className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'refunded': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportSales = () => {
    const csv = [
      ['Invoice Number', 'Customer', 'Date', 'Total', 'Payment Method', 'Status'].join(','),
      ...filteredSales.map((sale: Sale) => [
        sale.invoiceNumber,
        sale.customerName,
        format(new Date(sale.createdAt), 'yyyy-MM-dd HH:mm'),
        sale.total.toFixed(2),
        sale.paymentMethod,
        sale.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
          <p className="text-muted-foreground">Track and manage your sales transactions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportSales}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => window.location.href = '/pos'}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From {totalSales} sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">{completedSales} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageSale)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSales > 0 ? Math.round((completedSales / totalSales) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Completed sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>View and manage your sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sales Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading sales...
                    </TableCell>
                  </TableRow>
                ) : filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No sales found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale: Sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sale.customerName}</div>
                          {sale.customerEmail && (
                            <div className="text-sm text-muted-foreground">{sale.customerEmail}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(sale.createdAt), 'MMM dd, yyyy')}
                          <div className="text-muted-foreground">
                            {format(new Date(sale.createdAt), 'HH:mm')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{sale.items.length}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(sale.total)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(sale.paymentMethod)}
                          <span className="capitalize">{sale.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sale.status)}>
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSale(sale)
                            setShowSaleDetails(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sale Details Dialog */}
      <Dialog open={showSaleDetails} onOpenChange={setShowSaleDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sale Details - {selectedSale?.invoiceNumber}</DialogTitle>
            <DialogDescription>
              Sale completed on {selectedSale && format(new Date(selectedSale.createdAt), 'PPP p')}
            </DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {selectedSale.customerName}</div>
                    {selectedSale.customerEmail && (
                      <div><strong>Email:</strong> {selectedSale.customerEmail}</div>
                    )}
                    <div><strong>Staff:</strong> {selectedSale.staffName}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Method:</strong> {selectedSale.paymentMethod.replace('_', ' ')}</div>
                    <div><strong>Status:</strong> <Badge className={getStatusColor(selectedSale.status)}>{selectedSale.status}</Badge></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Items Purchased</h4>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedSale.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>{formatCurrency(selectedSale.tax)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedSale.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}