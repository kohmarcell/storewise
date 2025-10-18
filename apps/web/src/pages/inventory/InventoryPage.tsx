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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/lib/components/ui/dialog'
import { Label } from '@/lib/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select'
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Plus,
  Edit,
  Eye
} from 'lucide-react'
import { productsApi } from '@/lib/api'

interface InventoryItem {
  id: string
  name: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  reorderPoint: number
  unitCost: number
  unitPrice: number
  supplier: string
  category: string
  lastRestocked: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  trend: 'up' | 'down' | 'stable'
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showAdjustStockDialog, setShowAdjustStockDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add')
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('')
  const [adjustmentReason, setAdjustmentReason] = useState('')

  const queryClient = useQueryClient()

  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => productsApi.getAll({ limit: 100 }),
    select: (response) => {
      const products = response.data || []
      return products.map((product: any) => ({
        id: product.id,
        name: product.name,
        sku: product.sku || `SKU-${product.id.slice(-6)}`,
        currentStock: product.stockQty || 0,
        minStock: product.minQty || 5,
        maxStock: product.maxQty || 100,
        reorderPoint: product.reorderPoint || 10,
        unitCost: product.costPrice || 0,
        unitPrice: product.sellPrice || 0,
        supplier: product.supplier || 'Default Supplier',
        category: product.category?.name || 'Uncategorized',
        lastRestocked: product.updatedAt,
        status: getStockStatus(product.stockQty || 0, product.reorderPoint || 10),
        trend: Math.random() > 0.5 ? 'stable' : Math.random() > 0.5 ? 'up' : 'down'
      }))
    }
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      // Use the same products API but extract categories
      return productsApi.getAll({ limit: 100 }).then(res => {
        const products = res.data || []
        const uniqueCategories = [...new Set(products.map((p: any) => p.category?.name).filter(Boolean))]
        return uniqueCategories
      })
    }
  })

  const adjustStockMutation = useMutation({
    mutationFn: ({ productId, adjustment }: { productId: string, adjustment: any }) =>
      productsApi.update(productId, adjustment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Stock adjusted successfully')
      setShowAdjustStockDialog(false)
      resetAdjustmentForm()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to adjust stock')
    }
  })

  function getStockStatus(currentStock: number, reorderPoint: number) {
    if (currentStock === 0) return 'out-of-stock'
    if (currentStock <= reorderPoint) return 'low-stock'
    return 'in-stock'
  }

  function getStockStatusColor(status: string) {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800'
      case 'low-stock': return 'bg-yellow-100 text-yellow-800'
      case 'out-of-stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const filteredInventory = inventoryData?.filter((item: InventoryItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStock = stockFilter === 'all' || item.status === stockFilter
    return matchesSearch && matchesCategory && matchesStock
  }) || []

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name)
      case 'stock': return b.currentStock - a.currentStock
      case 'value': return (b.currentStock * b.unitCost) - (a.currentStock * a.unitCost)
      default: return 0
    }
  })

  const handleAdjustStock = () => {
    if (!selectedItem || !adjustmentQuantity) return

    const quantity = parseInt(adjustmentQuantity)
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }

    const newStock = adjustmentType === 'add'
      ? selectedItem.currentStock + quantity
      : selectedItem.currentStock - quantity

    if (newStock < 0) {
      toast.error('Insufficient stock for removal')
      return
    }

    adjustStockMutation.mutate({
      productId: selectedItem.id,
      adjustment: {
        stockQty: newStock,
        ...(adjustmentReason && { notes: adjustmentReason })
      }
    })
  }

  const resetAdjustmentForm = () => {
    setSelectedItem(null)
    setAdjustmentType('add')
    setAdjustmentQuantity('')
    setAdjustmentReason('')
  }

  const totalValue = inventoryData?.reduce((sum, item: InventoryItem) =>
    sum + (item.currentStock * item.unitCost), 0) || 0

  const lowStockItems = inventoryData?.filter((item: InventoryItem) =>
    item.status === 'low-stock' || item.status === 'out-of-stock').length || 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor and manage your stock levels</p>
        </div>
        <Button onClick={() => window.location.href = '/products'}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>View and manage your stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.isArray(categoriesData) && categoriesData.map((category: string) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="stock">Stock Level</SelectItem>
                <SelectItem value="value">Total Value</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['inventory'] })}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Inventory Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min/Max</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : sortedInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedInventory.map((item: InventoryItem) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.supplier}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.currentStock}</span>
                          {item.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {item.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Min: {item.minStock}</div>
                          <div>Max: {item.maxStock}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                      <TableCell>{formatCurrency(item.currentStock * item.unitCost)}</TableCell>
                      <TableCell>
                        <Badge className={getStockStatusColor(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setShowAdjustStockDialog(true)
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/products/${item.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Stock Dialog */}
      <Dialog open={showAdjustStockDialog} onOpenChange={setShowAdjustStockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Adjust stock level for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Stock</Label>
                <div className="text-2xl font-bold">{selectedItem?.currentStock}</div>
              </div>
              <div>
                <Label>New Stock</Label>
                <div className="text-2xl font-bold">
                  {adjustmentType === 'add'
                    ? (selectedItem?.currentStock || 0) + (parseInt(adjustmentQuantity) || 0)
                    : (selectedItem?.currentStock || 0) - (parseInt(adjustmentQuantity) || 0)
                  }
                </div>
              </div>
            </div>

            <div>
              <Label>Adjustment Type</Label>
              <Select value={adjustmentType} onValueChange={(value: 'add' | 'remove') => setAdjustmentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock</SelectItem>
                  <SelectItem value="remove">Remove Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div>
              <Label>Reason (Optional)</Label>
              <Input
                placeholder="Reason for adjustment"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustStockDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdjustStock}
              disabled={adjustStockMutation.isPending}
            >
              {adjustStockMutation.isPending ? 'Processing...' : 'Adjust Stock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}