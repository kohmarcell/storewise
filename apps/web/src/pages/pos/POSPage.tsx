import React, { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { productsApi, customersApi, salesApi } from '@/lib/api'
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
import { ShoppingCart, Plus, Minus, Trash2, Search, User, CreditCard, Receipt, Users, Percent } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { ReceiptDialog } from '@/components/ReceiptDialog'

export function PosPage() {
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [paidAmount, setPaidAmount] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showDiscountDialog, setShowDiscountDialog] = useState(false)
  const [selectedDiscountItem, setSelectedDiscountItem] = useState<string | null>(null)
  const [discountValue, setDiscountValue] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [cartDiscountValue, setCartDiscountValue] = useState('')
  const [cartDiscountType, setCartDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [lastSaleData, setLastSaleData] = useState<any>(null)

  const {
    items,
    subtotal,
    taxAmount,
    grandTotal,
    discountAmount,
    discountPercent,
    addItem,
    removeItem,
    updateQuantity,
    updateDiscount,
    clearCart,
    setCustomer,
    setCartDiscount,
    setPaymentMethod: setCartPaymentMethod,
  } = useCartStore()

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', { search: searchTerm, categoryId: selectedCategory, isActive: true }],
    queryFn: () => productsApi.getAll({
      search: searchTerm,
      categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
      isActive: true,
      limit: 50,
    }),
  })

  const products = productsData?.data.data?.data || []

  // Fetch customers
  const { data: customersData } = useQuery({
    queryKey: ['customers', { isActive: true, limit: 100 }],
    queryFn: () => customersApi.getAll({
      isActive: true,
      limit: 100,
    }),
  })
  const customers = customersData?.data.data || []

  const handleAddToCart = (product: any) => {
    // Check if product has sufficient stock
    if (product.stockQty <= 0) {
      toast.error(`Product ${product.name} is out of stock`)
      return
    }

    // Check if adding this item would exceed available stock
    const existingItem = items.find(item => item.productId === product.id)
    const currentQuantity = existingItem?.quantity || 0

    if (currentQuantity >= product.stockQty) {
      toast.error(`Cannot add more ${product.name}. Only ${product.stockQty} available in stock.`)
      return
    }

    addItem(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    // Find the product to check stock
    const item = items.find(item => item.productId === productId)
    if (!item) return

    // Check if we have enough stock for this quantity
    const product = products.find((p: any) => p.id === productId)
    if (product && quantity > product.stockQty) {
      toast.error(`Cannot update quantity. Only ${product.stockQty} ${product.name} available in stock.`)
      return
    }

    updateQuantity(productId, quantity)
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Cart is empty')
      return
    }

    // Validate stock availability before checkout
    const outOfStockItems = []
    for (const cartItem of items) {
      const product = products.find((p: any) => p.id === cartItem.productId)
      if (product) {
        if (product.stockQty <= 0) {
          outOfStockItems.push(`${product.name} is out of stock`)
        } else if (cartItem.quantity > product.stockQty) {
          outOfStockItems.push(`${product.name} only has ${product.stockQty} available (you have ${cartItem.quantity})`)
        }
      }
    }

    if (outOfStockItems.length > 0) {
      toast.error(`Stock issue: ${outOfStockItems.join(', ')}`)
      return
    }

    setCartPaymentMethod(paymentMethod)
    setIsCheckoutOpen(true)
  }

  const handleItemDiscount = (productId: string) => {
    setSelectedDiscountItem(productId)
    const item = items.find(item => item.productId === productId)
    if (item && item.discount > 0) {
      setDiscountValue(item.discountPercent > 0 ? item.discountPercent.toString() : item.discount.toString())
      setDiscountType(item.discountPercent > 0 ? 'percentage' : 'fixed')
    } else {
      setDiscountValue('')
      setDiscountType('percentage')
    }
    setShowDiscountDialog(true)
  }

  const applyItemDiscount = () => {
    if (!selectedDiscountItem || !discountValue) return

    const value = parseFloat(discountValue)
    if (isNaN(value) || value <= 0) return

    const item = items.find(item => item.productId === selectedDiscountItem)
    if (!item) return

    let discountAmount = 0
    let discountPercent = 0

    if (discountType === 'percentage') {
      if (value > 100) {
        toast.error('Percentage discount cannot exceed 100%')
        return
      }
      discountPercent = value
      discountAmount = (item.price * item.quantity) * (value / 100)
    } else {
      discountAmount = Math.min(value, item.price * item.quantity)
    }

    updateDiscount(selectedDiscountItem, discountAmount, discountPercent)
    setShowDiscountDialog(false)
    setDiscountValue('')
    setSelectedDiscountItem(null)
    toast.success('Discount applied successfully')
  }

  const applyCartDiscount = () => {
    if (!cartDiscountValue) return

    const value = parseFloat(cartDiscountValue)
    if (isNaN(value) || value <= 0) return

    let discountAmount = 0
    let discountPercent = 0

    if (cartDiscountType === 'percentage') {
      if (value > 100) {
        toast.error('Percentage discount cannot exceed 100%')
        return
      }
      discountPercent = value
      discountAmount = subtotal * (value / 100)
    } else {
      discountAmount = Math.min(value, subtotal)
    }

    setCartDiscount(discountAmount, discountPercent)
    toast.success('Cart discount applied successfully')
  }

  const clearCartDiscount = () => {
    setCartDiscount(0, 0)
    setCartDiscountValue('')
    toast.success('Cart discount removed')
  }

  const handlePayment = async () => {
    const paid = parseFloat(paidAmount)
    if (paid < grandTotal) {
      toast.error('Insufficient payment amount')
      return
    }

    setIsProcessingPayment(true)

    try {
      // Prepare sale data
      const saleData = {
        customerId: useCartStore.getState().customerId || undefined,
        outletId: user?.outletId || 'default-outlet', // You might need to get this from user context
        cashierId: user?.id || 'default-cashier',
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: item.discount || 0,
          subtotal: item.subtotal,
        })),
        subtotal,
        discountAmount: useCartStore.getState().discountAmount || 0,
        taxAmount,
        grandTotal,
        paymentMethod,
        paymentStatus: 'PAID',
        notes: useCartStore.getState().notes || '',
      }

      // Create sale via API
      const response = await salesApi.create(saleData)

      toast.success('Payment successful! Sale completed.')

      // Store sale data for receipt
      setLastSaleData(response.data.data)

      // Clear cart and close checkout dialog
      clearCart()
      setIsCheckoutOpen(false)
      setPaidAmount('')
      setPaymentMethod('CASH')

      // Open receipt dialog
      setShowReceiptDialog(true)

    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <>
      <div className="p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Point of Sale</h1>
            <p className="text-gray-600">
              {format(new Date(), 'EEEE, MMMM d, yyyy HH:mm')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {items.length} items in cart
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Products</span>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="food">Food & Beverages</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {productsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg h-40"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product: any) => (
                      <Card
                        key={product.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleAddToCart(product)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                            {product.images?.[0]?.imageUrl ? (
                              <img
                                src={product.images[0].imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <div className="text-gray-400 text-sm">No image</div>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
                          <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary">
                              {formatCurrency(product.sellPrice)}
                            </span>
                            <Badge variant={product.stockQty > 10 ? 'secondary' : 'destructive'}>
                              {product.stockQty} in stock
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Shopping Cart
                  </span>
                  {items.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                {items.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p>Your cart is empty</p>
                      <p className="text-sm">Add products to get started</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.productId} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start space-x-3 mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.product.name}</h4>
                              <p className="text-xs text-gray-500">{formatCurrency(item.price)} each</p>
                              {item.discount > 0 && (
                                <div className="mt-1">
                                  <span className="text-xs text-green-600 font-medium">
                                    Discount: {item.discountPercent > 0 ? `${item.discountPercent}%` : formatCurrency(item.discount)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleItemDiscount(item.productId)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Add/Edit Discount"
                            >
                              <Percent className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              {item.discount > 0 && (
                                <p className="text-xs text-gray-500 line-through">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              )}
                              <p className="font-semibold text-sm text-green-600">
                                {formatCurrency(item.subtotal)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>

                      {/* Cart Discount Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Cart Discount</span>
                          <div className="flex items-center space-x-2">
                            {discountAmount > 0 && (
                              <span className="text-green-600 font-medium">
                                -{formatCurrency(discountAmount)}
                                {discountPercent > 0 && ` (${discountPercent}%)`}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCartDiscountType('percentage')
                                setCartDiscountValue(discountPercent > 0 ? discountPercent.toString() : '')
                              }}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 h-6"
                              title="Add Cart Discount"
                            >
                              <Percent className="h-3 w-3" />
                            </Button>
                            {discountAmount > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearCartDiscount}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-6"
                                title="Clear Cart Discount"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Cart Discount Input */}
                        {cartDiscountValue && (
                          <div className="flex items-center space-x-2 pl-4">
                            <Select value={cartDiscountType} onValueChange={(value: 'percentage' | 'fixed') => setCartDiscountType(value)}>
                              <SelectTrigger className="w-20 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">%</SelectItem>
                                <SelectItem value="fixed">$</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              placeholder="0"
                              value={cartDiscountValue}
                              onChange={(e) => setCartDiscountValue(e.target.value)}
                              className="w-20 h-8 text-sm"
                              min="0"
                              max={cartDiscountType === 'percentage' ? '100' : undefined}
                              step={cartDiscountType === 'percentage' ? '1' : '0.01'}
                            />
                            <Button
                              size="sm"
                              onClick={applyCartDiscount}
                              className="h-8 text-xs px-2"
                              disabled={!cartDiscountValue || parseFloat(cartDiscountValue) <= 0}
                            >
                              Apply
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCartDiscountValue('')}
                              className="h-8 text-xs px-2"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Tax (10%)</span>
                        <span>{formatCurrency(taxAmount)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full mt-4"
                          size="lg"
                          onClick={handleCheckout}
                        >
                          <CreditCard className="mr-2 h-5 w-5" />
                          Checkout
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Complete Payment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Customer Selection */}
                          <div>
                            <Label htmlFor="customer">Customer (Optional)</Label>
                            <Select value={useCartStore.getState().customerId || ''} onValueChange={(value) => useCartStore.getState().setCustomer(value || undefined)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Walk-in Customer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                                {customers.map((customer) => (
                                  <SelectItem key={customer.id} value={customer.id}>
                                    {customer.name} ({customer.email})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Payment Method */}
                          <div>
                            <Label htmlFor="paymentMethod">Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CASH">💵 Cash</SelectItem>
                                <SelectItem value="CARD">💳 Card</SelectItem>
                                <SelectItem value="MOBILE">📱 Mobile Payment</SelectItem>
                                <SelectItem value="BANK_TRANSFER">🏦 Bank Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Cash Payment Input */}
                          {paymentMethod === 'CASH' && (
                            <div>
                              <Label htmlFor="paidAmount">Amount Paid</Label>
                              <Input
                                id="paidAmount"
                                type="number"
                                placeholder="Enter amount received"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                              />
                              {paidAmount && parseFloat(paidAmount) >= grandTotal && (
                                <p className="text-sm text-green-600 mt-1 font-medium">
                                  💰 Change: {formatCurrency(parseFloat(paidAmount) - grandTotal)}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Order Summary */}
                          <div className="border-t pt-4 space-y-2">
                            <h3 className="font-semibold">Order Summary</h3>
                            {items.map((item) => (
                              <div key={item.productId} className="flex justify-between text-sm">
                                <span>{item.product.name} x{item.quantity}</span>
                                <span>{formatCurrency(item.subtotal)}</span>
                              </div>
                            ))}
                            <div className="border-t pt-2 space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Tax (10%)</span>
                                <span>{formatCurrency(taxAmount)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(grandTotal)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Complete Payment Button */}
                          <Button
                            className="w-full"
                            size="lg"
                            onClick={handlePayment}
                            disabled={isProcessingPayment || (paymentMethod === 'CASH' && (!paidAmount || parseFloat(paidAmount) < grandTotal))}
                          >
                            {isProcessingPayment ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <Receipt className="mr-2 h-5 w-5" />
                                Complete Payment
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Item Discount Dialog */}
                    <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Item Discount</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {selectedDiscountItem && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">
                                {items.find(item => item.productId === selectedDiscountItem)?.product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatCurrency(items.find(item => item.productId === selectedDiscountItem)?.price || 0)} each
                              </p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Discount Type</Label>
                            <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>
                              {discountType === 'percentage' ? 'Percentage' : 'Amount'}
                            </Label>
                            <Input
                              type="number"
                              placeholder={discountType === 'percentage' ? '0' : '0.00'}
                              value={discountValue}
                              onChange={(e) => setDiscountValue(e.target.value)}
                              min="0"
                              max={discountType === 'percentage' ? '100' : undefined}
                              step={discountType === 'percentage' ? '1' : '0.01'}
                            />
                            {discountType === 'percentage' && (
                              <p className="text-xs text-gray-500">
                                Enter percentage (1-100)
                              </p>
                            )}
                          </div>

                          {discountValue && selectedDiscountItem && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-sm font-medium">Preview:</p>
                              <p className="text-xs text-gray-600">
                                Original: {formatCurrency(
                                  items.find(item => item.productId === selectedDiscountItem)?.price! *
                                  items.find(item => item.productId === selectedDiscountItem)?.quantity!
                                )}
                              </p>
                              <p className="text-xs text-green-600">
                                Discount: {discountType === 'percentage' ? `${discountValue}%` : formatCurrency(parseFloat(discountValue))}
                              </p>
                              <p className="text-sm font-semibold text-green-600">
                                New subtotal: {formatCurrency(
                                  (items.find(item => item.productId === selectedDiscountItem)?.price! *
                                  items.find(item => item.productId === selectedDiscountItem)?.quantity!) -
                                  (discountType === 'percentage'
                                    ? (items.find(item => item.productId === selectedDiscountItem)?.price! *
                                       items.find(item => item.productId === selectedDiscountItem)?.quantity!) * (parseFloat(discountValue) / 100)
                                    : parseFloat(discountValue)
                                  )
                                )}
                              </p>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button
                              onClick={applyItemDiscount}
                              disabled={!discountValue || parseFloat(discountValue) <= 0}
                              className="flex-1"
                            >
                              Apply Discount
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowDiscountDialog(false)
                                setDiscountValue('')
                                setSelectedDiscountItem(null)
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Receipt Dialog */}
      {lastSaleData && (
        <ReceiptDialog
          open={showReceiptDialog}
          onOpenChange={setShowReceiptDialog}
          saleData={lastSaleData}
        />
      )}
    </>
  )
}