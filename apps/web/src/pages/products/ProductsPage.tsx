import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi, categoriesApi, inventoryApi } from '@/lib/api'
import { Button } from '@/lib/components/ui/button'
import { Input } from '@/lib/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card'
import { Badge } from '@/lib/components/ui/badge'
import {
  Dialog,
  DialogContent,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/lib/components/ui/table'
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Upload,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/types'

// Product Form Component
function ProductForm({
  product,
  categories,
  uoms,
  onSubmit,
  isLoading,
}: {
  product?: Product | null
  categories: any[]
  uoms: any[]
  onSubmit: (data: FormData) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    description: product?.description || '',
    brand: product?.brand || '',
    categoryId: product?.categoryId || '',
    uomId: product?.uomId || '',
    costPrice: product?.costPrice || '',
    sellPrice: product?.sellPrice || '',
    stockQty: product?.stockQty || '',
    minQty: product?.minQty || '',
    maxQty: product?.maxQty || '',
    reorderPoint: product?.reorderPoint || '',
    reorderQty: product?.reorderQty || '',
    tags: product?.tags?.join(', ') || '',
    specifications: product?.specifications
      ? Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`).join('\n')
      : '',
    isActive: product?.isActive ?? true,
  })

  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()

    // Basic fields
    data.append('name', formData.name)
    data.append('sku', formData.sku)
    data.append('description', formData.description)
    data.append('brand', formData.brand)
    data.append('categoryId', formData.categoryId)
    data.append('uomId', formData.uomId)
    data.append('costPrice', formData.costPrice)
    data.append('sellPrice', formData.sellPrice)
    data.append('minQty', formData.minQty)
    data.append('maxQty', formData.maxQty)
    data.append('reorderPoint', formData.reorderPoint)
    data.append('reorderQty', formData.reorderQty)
    data.append('isActive', formData.isActive.toString())

    // Parse tags
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    data.append('tags', JSON.stringify(tags))

    // Parse specifications
    const specs: Record<string, string> = {}
    formData.specifications.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        specs[key.trim()] = valueParts.join(':').trim()
      }
    })
    data.append('specifications', JSON.stringify(specs))

    // Add images
    selectedImages.forEach((image, index) => {
      data.append(`image_${index}`, image)
    })

    onSubmit(data)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files))
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="uom">Unit of Measure *</Label>
          <Select value={formData.uomId} onValueChange={(value) => setFormData({ ...formData, uomId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select UOM" />
            </SelectTrigger>
            <SelectContent>
              {uoms.map((uom) => (
                <SelectItem key={uom.id} value={uom.id}>
                  {uom.name} ({uom.abbreviation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="costPrice">Cost Price *</Label>
          <Input
            id="costPrice"
            type="number"
            step="0.01"
            value={formData.costPrice}
            onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="sellPrice">Sell Price *</Label>
          <Input
            id="sellPrice"
            type="number"
            step="0.01"
            value={formData.sellPrice}
            onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="stockQty">Initial Stock *</Label>
          <Input
            id="stockQty"
            type="number"
            value={formData.stockQty}
            onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="minQty">Min Quantity</Label>
          <Input
            id="minQty"
            type="number"
            value={formData.minQty}
            onChange={(e) => setFormData({ ...formData, minQty: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="maxQty">Max Quantity</Label>
          <Input
            id="maxQty"
            type="number"
            value={formData.maxQty}
            onChange={(e) => setFormData({ ...formData, maxQty: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="reorderPoint">Reorder Point</Label>
          <Input
            id="reorderPoint"
            type="number"
            value={formData.reorderPoint}
            onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., beverage, cold-drink, popular"
          />
        </div>
        <div>
          <Label htmlFor="reorderQty">Reorder Quantity</Label>
          <Input
            id="reorderQty"
            type="number"
            value={formData.reorderQty}
            onChange={(e) => setFormData({ ...formData, reorderQty: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="specifications">Specifications (one per line, format: key: value)</Label>
        <textarea
          id="specifications"
          className="w-full p-2 border rounded-md"
          rows={4}
          value={formData.specifications}
          onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          placeholder="e.g., volume: 500ml&#10;type: Carbonated&#10;packaging: Bottle"
        />
      </div>

      <div>
        <Label htmlFor="images">Product Images</Label>
        <Input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-2"
        />
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isActive">Active Product</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => product ? setEditingProduct(null) : setIsCreateDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showLowStock, setShowLowStock] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)

  const queryClient = useQueryClient()

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', { search: searchTerm, categoryId: selectedCategory, lowStock: showLowStock }],
    queryFn: () => productsApi.getAll({
      search: searchTerm,
      categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
      lowStock: showLowStock,
      limit: 100,
    }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  })

  const { data: uomsData } = useQuery({
    queryKey: ['uoms'],
    queryFn: () => inventoryApi.getUOMs(),
  })

  const products = productsData?.data?.data || []
  const categories = categoriesData?.data || []
  const uoms = uomsData?.data || []

  const deleteProductMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      toast.success('Product deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product')
    },
  })

  const createProductMutation = useMutation({
    mutationFn: (formData: FormData) => productsApi.create(formData),
    onSuccess: () => {
      toast.success('Product created successfully')
      setIsCreateDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product')
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string, formData: FormData }) =>
      productsApi.update(id, formData),
    onSuccess: () => {
      toast.success('Product updated successfully')
      setEditingProduct(null)
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product')
    },
  })

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getStockStatus = (stockQty: number, minQty: number) => {
    if (stockQty === 0) return { status: 'Out of Stock', color: 'destructive', icon: AlertTriangle }
    if (stockQty <= minQty) return { status: 'Low Stock', color: 'warning', icon: TrendingDown }
    return { status: 'In Stock', color: 'success', icon: TrendingUp }
  }

  return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your inventory and product catalog</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                categories={categories}
                uoms={uoms}
                onSubmit={(data) => createProductMutation.mutate(data)}
                isLoading={createProductMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by name, SKU, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={showLowStock ? "default" : "outline"}
                onClick={() => setShowLowStock(!showLowStock)}
                className="whitespace-nowrap"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Low Stock Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Products ({products.length})</span>
              {productsLoading && (
                <Badge variant="secondary">Loading...</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No products found</p>
                <p className="text-sm">Try adjusting your filters or add a new product</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Cost Price</TableHead>
                      <TableHead>Sell Price</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product: Product) => {
                      const stockStatus = getStockStatus(product.stockQty, product.minQty)
                      const margin = ((product.sellPrice - product.costPrice) / product.costPrice) * 100
                      const StatusIcon = stockStatus.icon

                      return (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                                {product.images?.[0]?.imageUrl ? (
                                  <img
                                    src={product.images[0].imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                {product.brand && (
                                  <div className="text-sm text-gray-500">{product.brand}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {product.category?.name || 'Uncategorized'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{product.stockQty}</span>
                              <span className="text-sm text-gray-500">
                                ({product.uom?.abbreviation || 'pcs'})
                              </span>
                            </div>
                            {product.minQty > 0 && (
                              <div className="text-xs text-gray-500">
                                Min: {product.minQty}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{formatCurrency(product.costPrice)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(product.sellPrice)}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${margin >= 50 ? 'text-green-600' : margin >= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {margin.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4" />
                              <Badge variant={stockStatus.color as any}>
                                {stockStatus.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingProduct(product)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={deleteProductMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Details Dialog */}
        <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {viewingProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {viewingProduct.name}</div>
                    <div><strong>SKU:</strong> {viewingProduct.sku}</div>
                    <div><strong>Brand:</strong> {viewingProduct.brand || 'N/A'}</div>
                    <div><strong>Category:</strong> {viewingProduct.category?.name || 'N/A'}</div>
                    <div><strong>Unit:</strong> {viewingProduct.uom?.name || 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Cost Price:</strong> {formatCurrency(viewingProduct.costPrice)}</div>
                    <div><strong>Sell Price:</strong> {formatCurrency(viewingProduct.sellPrice)}</div>
                    <div><strong>Margin:</strong> {((viewingProduct.sellPrice - viewingProduct.costPrice) / viewingProduct.costPrice * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Inventory</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Current Stock:</strong> {viewingProduct.stockQty} {viewingProduct.uom?.abbreviation}</div>
                    <div><strong>Min Quantity:</strong> {viewingProduct.minQty}</div>
                    <div><strong>Max Quantity:</strong> {viewingProduct.maxQty || 'N/A'}</div>
                    <div><strong>Reorder Point:</strong> {viewingProduct.reorderPoint || 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Additional Info</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Status:</strong> {viewingProduct.isActive ? 'Active' : 'Inactive'}</div>
                    <div><strong>Created:</strong> {new Date(viewingProduct.createdAt).toLocaleDateString()}</div>
                    <div><strong>Last Updated:</strong> {new Date(viewingProduct.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                {viewingProduct.description && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{viewingProduct.description}</p>
                  </div>
                )}
                {viewingProduct.tags && viewingProduct.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingProduct.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm
                product={editingProduct}
                categories={categories}
                uoms={uoms}
                onSubmit={(data) => updateProductMutation.mutate({ id: editingProduct.id, formData: data })}
                isLoading={updateProductMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
  )
}

export default ProductsPage