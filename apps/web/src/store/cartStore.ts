import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, SaleItem } from '@/types'

interface CartItem {
  productId: string
  product: Product
  quantity: number
  price: number
  discount: number
  discountPercent: number
  subtotal: number
  notes?: string
}

interface CartState {
  items: CartItem[]
  customerId?: string
  discountAmount: number
  discountPercent: number
  taxAmount: number
  subtotal: number
  grandTotal: number
  paymentMethod: string
  notes: string

  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateDiscount: (productId: string, discount: number, discountPercent: number) => void
  clearCart: () => void
  setCustomer: (customerId?: string) => void
  setCartDiscount: (amount: number, percent: number) => void
  setPaymentMethod: (method: string) => void
  setNotes: (notes: string) => void
  calculateTotals: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountAmount: 0,
      discountPercent: 0,
      taxAmount: 0,
      subtotal: 0,
      grandTotal: 0,
      paymentMethod: 'CASH',
      notes: '',

      addItem: (product: Product, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find(item => item.productId === product.id)

        if (existingItem) {
          // Update quantity if item already exists
          const newQuantity = existingItem.quantity + quantity
          const newSubtotal = newQuantity * existingItem.price

          set({
            items: items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: newQuantity, subtotal: newSubtotal }
                : item
            ),
          })
        } else {
          // Add new item
          const newItem: CartItem = {
            productId: product.id,
            product,
            quantity,
            price: product.sellPrice,
            discount: 0,
            discountPercent: 0,
            subtotal: product.sellPrice * quantity,
          }

          set({ items: [...items, newItem] })
        }

        get().calculateTotals()
      },

      removeItem: (productId: string) => {
        const { items } = get()
        set({ items: items.filter(item => item.productId !== productId) })
        get().calculateTotals()
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        const { items } = get()
        set({
          items: items.map(item =>
            item.productId === productId
              ? { ...item, quantity, subtotal: item.price * quantity }
              : item
          ),
        })
        get().calculateTotals()
      },

      updateDiscount: (productId: string, discount: number, discountPercent: number) => {
        const { items } = get()
        set({
          items: items.map(item =>
            item.productId === productId
              ? {
                  ...item,
                  discount,
                  discountPercent,
                  subtotal: (item.price * item.quantity) - discount,
                }
              : item
          ),
        })
        get().calculateTotals()
      },

      clearCart: () => {
        set({
          items: [],
          customerId: undefined,
          discountAmount: 0,
          discountPercent: 0,
          taxAmount: 0,
          subtotal: 0,
          grandTotal: 0,
          paymentMethod: 'CASH',
          notes: '',
        })
      },

      setCustomer: (customerId?: string) => {
        set({ customerId })
      },

      setCartDiscount: (amount: number, percent: number) => {
        set({ discountAmount: amount, discountPercent: percent })
        get().calculateTotals()
      },

      setPaymentMethod: (method: string) => {
        set({ paymentMethod: method })
      },

      setNotes: (notes: string) => {
        set({ notes })
      },

      calculateTotals: () => {
        const { items, discountAmount } = get()

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)

        // Calculate tax (assuming 10% tax rate)
        const taxAmount = (subtotal - discountAmount) * 0.1

        // Calculate grand total
        const grandTotal = subtotal - discountAmount + taxAmount

        set({
          subtotal,
          taxAmount,
          grandTotal,
        })
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        customerId: state.customerId,
        discountAmount: state.discountAmount,
        discountPercent: state.discountPercent,
        paymentMethod: state.paymentMethod,
        notes: state.notes,
      }),
    }
  )
)