import React from 'react'
import { format } from 'date-fns'
import { Receipt, Printer, Download, X } from 'lucide-react'
import { Button } from '@/lib/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/lib/components/ui/dialog'

interface ReceiptItem {
  product: {
    name: string
    sku?: string
  }
  quantity: number
  price: number
  discount: number
  subtotal: number
}

interface ReceiptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  saleData: {
    id: string
    createdAt: Date
    customer?: {
      name: string
      email?: string
      phone?: string
    }
    cashier?: {
      name: string
    }
    outlet?: {
      name: string
      address?: string
      phone?: string
    }
    items: ReceiptItem[]
    subtotal: number
    discountAmount: number
    taxAmount: number
    grandTotal: number
    paymentMethod: string
    paymentStatus: string
    notes?: string
  }
}

export function ReceiptDialog({ open, onOpenChange, saleData }: ReceiptDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content')
    if (printContent) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt #${saleData.id}</title>
              <style>
                body {
                  font-family: 'Courier New', monospace;
                  margin: 0;
                  padding: 20px;
                  max-width: 400px;
                  margin: 0 auto;
                }
                .header { text-align: center; margin-bottom: 20px; }
                .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .info { margin-bottom: 20px; }
                .item { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .item-name { flex: 1; }
                .item-qty { margin-left: 10px; }
                .item-price { text-align: right; }
                .discount { color: #666; }
                .total { border-top: 1px solid #000; padding-top: 8px; margin-top: 10px; }
                .total-item { display: flex; justify-content: space-between; margin-bottom: 4px; }
                .grand-total { font-weight: bold; font-size: 16px; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleDownload = () => {
    const receiptText = generateTextReceipt()
    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${saleData.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const generateTextReceipt = () => {
    const lines = []
    lines.push('================================')
    lines.push('           STOREWISE')
    lines.push('        Point of Sale')
    lines.push('================================')
    lines.push('')

    if (saleData.outlet) {
      lines.push(saleData.outlet.name)
      if (saleData.outlet.address) lines.push(saleData.outlet.address)
      if (saleData.outlet.phone) lines.push(`Tel: ${saleData.outlet.phone}`)
      lines.push('')
    }

    lines.push(`Receipt #: ${saleData.id}`)
    lines.push(`Date: ${format(new Date(saleData.createdAt), 'MMM dd, yyyy HH:mm')}`)
    lines.push('')

    if (saleData.customer) {
      lines.push('Customer:')
      lines.push(`  ${saleData.customer.name}`)
      if (saleData.customer.email) lines.push(`  ${saleData.customer.email}`)
      if (saleData.customer.phone) lines.push(`  ${saleData.customer.phone}`)
      lines.push('')
    }

    if (saleData.cashier) {
      lines.push(`Cashier: ${saleData.cashier.name}`)
      lines.push('')
    }

    lines.push('--------------------------------')
    lines.push('ITEMS')
    lines.push('--------------------------------')

    saleData.items.forEach(item => {
      lines.push(`${item.product.name}`)
      if (item.product.sku) lines.push(`  SKU: ${item.product.sku}`)
      lines.push(`  ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.subtotal)}`)
      if (item.discount > 0) {
        lines.push(`  Discount: -${formatCurrency(item.discount)}`)
      }
      lines.push('')
    })

    lines.push('--------------------------------')
    lines.push('SUMMARY')
    lines.push('--------------------------------')
    lines.push(`Subtotal:     ${formatCurrency(saleData.subtotal).padStart(12)}`)
    if (saleData.discountAmount > 0) {
      lines.push(`Discount:     -${formatCurrency(saleData.discountAmount).padStart(11)}`)
    }
    lines.push(`Tax (10%):    ${formatCurrency(saleData.taxAmount).padStart(12)}`)
    lines.push(`TOTAL:        ${formatCurrency(saleData.grandTotal).padStart(12)}`)
    lines.push('')

    lines.push(`Payment: ${saleData.paymentMethod}`)
    lines.push(`Status:  ${saleData.paymentStatus}`)
    lines.push('')

    if (saleData.notes) {
      lines.push('Notes:')
      lines.push(saleData.notes)
      lines.push('')
    }

    lines.push('================================')
    lines.push('      Thank you for shopping!')
    lines.push('         Please come again')
    lines.push('================================')

    return lines.join('\n')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Receipt #{saleData.id}
          </DialogTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogHeader>

        <div id="receipt-content" className="bg-white p-6 text-sm">
          {/* Store Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">STOREWISE</h2>
            <p className="text-xs text-gray-600">Point of Sale System</p>
            {saleData.outlet && (
              <div className="mt-2">
                <p className="font-medium">{saleData.outlet.name}</p>
                {saleData.outlet.address && <p className="text-xs text-gray-600">{saleData.outlet.address}</p>}
                {saleData.outlet.phone && <p className="text-xs text-gray-600">Tel: {saleData.outlet.phone}</p>}
              </div>
            )}
          </div>

          {/* Receipt Info */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Receipt #:</span>
              <span>{saleData.id}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-medium">Date:</span>
              <span>{format(new Date(saleData.createdAt), 'MMM dd, yyyy HH:mm')}</span>
            </div>
          </div>

          {/* Customer Info */}
          {saleData.customer && (
            <div className="mb-4 p-2 bg-gray-50 rounded">
              <p className="font-medium mb-1">Customer:</p>
              <p className="text-sm">{saleData.customer.name}</p>
              {saleData.customer.email && <p className="text-xs text-gray-600">{saleData.customer.email}</p>}
              {saleData.customer.phone && <p className="text-xs text-gray-600">{saleData.customer.phone}</p>}
            </div>
          )}

          {/* Cashier Info */}
          {saleData.cashier && (
            <div className="mb-4">
              <div className="flex justify-between">
                <span className="font-medium">Cashier:</span>
                <span>{saleData.cashier.name}</span>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="mb-4">
            <h3 className="font-bold mb-2 border-b pb-1">ITEMS</h3>
            {saleData.items.map((item, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    {item.product.sku && <p className="text-xs text-gray-600">SKU: {item.product.sku}</p>}
                    <p className="text-xs text-gray-600">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                    {item.discount > 0 && (
                      <p className="text-xs text-green-600 discount">
                        -{formatCurrency(item.discount)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t pt-3">
            <h3 className="font-bold mb-2">SUMMARY</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(saleData.subtotal)}</span>
              </div>
              {saleData.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(saleData.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax (10%):</span>
                <span>{formatCurrency(saleData.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>TOTAL:</span>
                <span>{formatCurrency(saleData.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-4 p-2 bg-gray-50 rounded">
            <div className="flex justify-between text-sm mb-1">
              <span>Payment:</span>
              <span>{saleData.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Status:</span>
              <span className={`font-medium ${
                saleData.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {saleData.paymentStatus}
              </span>
            </div>
          </div>

          {/* Notes */}
          {saleData.notes && (
            <div className="mt-4 p-2 bg-gray-50 rounded">
              <p className="font-medium mb-1">Notes:</p>
              <p className="text-sm">{saleData.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t">
            <p className="text-sm font-medium">Thank you for shopping!</p>
            <p className="text-xs text-gray-600">Please come again</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}