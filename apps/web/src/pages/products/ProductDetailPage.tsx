import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Layout } from '@/components/Layout'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/lib/api'
import { Button } from '@/lib/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card'
import { Badge } from '@/lib/components/ui/badge'
import {
  ArrowLeft,
  Package,
  Image as ImageIcon,
  DollarSign,
  Box,
  TrendingUp,
  Calendar,
  Tag,
  Edit,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const { id } = useParams({ from: '/products/$id' })
  const navigate = useNavigate()

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id as string),
    enabled: !!id,
  })

  const product = productData?.data

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getStockStatus = (stockQty: number, minQty: number) => {
    if (stockQty === 0) return { status: 'Out of Stock', color: 'destructive' }
    if (stockQty <= minQty) return { status: 'Low Stock', color: 'warning' }
    return { status: 'In Stock', color: 'success' }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate({ to: '/products' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  const stockStatus = getStockStatus(product.stockQty, product.minQty)
  const margin = ((product.sellPrice - product.costPrice) / product.costPrice) * 100

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/products' })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600">SKU: {product.sku}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images && product.images.length > 0 ? (
                    product.images.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                      <ImageIcon className="h-12 w-12 text-gray-300 mb-4" />
                      <p>No images available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {product.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Basic Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">SKU:</span>
                        <span className="font-mono">{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Brand:</span>
                        <span>{product.brand || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <Badge variant="secondary">{product.category?.name || 'Uncategorized'}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit of Measure:</span>
                        <span>{product.uom?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={product.isActive ? 'success' : 'secondary'}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Inventory Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Stock:</span>
                        <span className="font-medium">{product.stockQty} {product.uom?.abbreviation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Quantity:</span>
                        <span>{product.minQty} {product.uom?.abbreviation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Quantity:</span>
                        <span>{product.maxQty || 'N/A'} {product.uom?.abbreviation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reorder Point:</span>
                        <span>{product.reorderPoint || 'N/A'} {product.uom?.abbreviation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock Status:</span>
                        <Badge variant={stockStatus.color as any}>{stockStatus.status}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Barcodes */}
                {product.barcodes && product.barcodes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Barcodes</h3>
                    <div className="space-y-2">
                      {product.barcodes.map((barcode, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-mono">{barcode.barcode}</span>
                            {barcode.isPrimary && (
                              <Badge variant="secondary" className="ml-2">Primary</Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{barcode.barcodeType}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Cost Price</div>
                  <div className="text-2xl font-bold">{formatCurrency(product.costPrice)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Sell Price</div>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(product.sellPrice)}</div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Margin</span>
                    <div className="flex items-center">
                      <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                      <span className={`font-bold ${margin >= 50 ? 'text-green-600' : margin >= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Profit per Unit</span>
                    <span className="font-bold">{formatCurrency(product.sellPrice - product.costPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Box className="mr-2 h-5 w-5" />
                  Stock Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold mb-2">{product.stockQty}</div>
                  <Badge variant={stockStatus.color as any} className="mb-4">
                    {stockStatus.status}
                  </Badge>
                  {product.stockQty <= product.minQty && (
                    <div className="text-sm text-amber-600">
                      ⚠️ Stock is below minimum level. Consider reordering.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Created</div>
                  <div className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Last Updated</div>
                  <div className="font-medium">{new Date(product.updatedAt).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}