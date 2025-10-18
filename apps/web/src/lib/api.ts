import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'
import type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  User,
  Product,
  Customer,
  Sale,
  DashboardKPI,
  SalesChart,
  CategorySales,
  TopProduct
} from '@/types'

// Create axios instance
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post('/api/v1/auth/refresh', {
            refreshToken,
          })

          const { accessToken } = response.data.data
          localStorage.setItem('accessToken', accessToken)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || error.message || 'An error occurred'
    toast.error(message)

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  refresh: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },

  me: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Users API
export const usersApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    roleId?: string
    outletId?: string
    isActive?: boolean
  }): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await api.get('/users', { params })
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  create: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', data)
    return response.data
  },

  update: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}

// Products API
export const productsApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    isActive?: boolean
    lowStock?: boolean
  }): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const response = await api.get('/products', { params })
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  create: async (data: FormData): Promise<ApiResponse<Product>> => {
    const response = await api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  update: async (id: string, data: FormData): Promise<ApiResponse<Product>> => {
    const response = await api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  getByBarcode: async (barcode: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/barcode/${barcode}`)
    return response.data
  },

  updateStock: async (id: string, quantity: number, type: string): Promise<ApiResponse<Product>> => {
    const response = await api.post(`/products/${id}/stock`, { quantity, type })
    return response.data
  },
}

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/categories')
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/categories', data)
    return response.data
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },
}

// Customers API
export const customersApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    tierId?: string
    isActive?: boolean
  }): Promise<ApiResponse<PaginatedResponse<Customer>>> => {
    const response = await api.get('/customers', { params })
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<Customer>> => {
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  create: async (data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const response = await api.post('/customers', data)
    return response.data
  },

  update: async (id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const response = await api.put(`/customers/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/customers/${id}`)
    return response.data
  },

  addPoints: async (id: string, points: number, description: string): Promise<ApiResponse<Customer>> => {
    const response = await api.post(`/customers/${id}/points`, { points, description })
    return response.data
  },
}

// Sales API
export const salesApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    outletId?: string
    cashierId?: string
    customerId?: string
    status?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<PaginatedResponse<Sale>>> => {
    const response = await api.get('/sales', { params })
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<Sale>> => {
    const response = await api.get(`/sales/${id}`)
    return response.data
  },

  create: async (data: Partial<Sale>): Promise<ApiResponse<Sale>> => {
    const response = await api.post('/sales', data)
    return response.data
  },

  update: async (id: string, data: Partial<Sale>): Promise<ApiResponse<Sale>> => {
    const response = await api.put(`/sales/${id}`, data)
    return response.data
  },

  void: async (id: string, reason: string): Promise<ApiResponse<Sale>> => {
    const response = await api.post(`/sales/${id}/void`, { reason })
    return response.data
  },
}

// Inventory API
export const inventoryApi = {
  getUOMs: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/inventory/uom')
    return response.data
  },

  getStockMovements: async (params?: {
    productId?: string
    outletId?: string
    type?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<any>> => {
    const response = await api.get('/inventory/stock-movements', { params })
    return response.data
  },

  createStockMovement: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/inventory/stock-movements', data)
    return response.data
  },

  getBatches: async (params?: {
    productId?: string
    outletId?: string
    expiringSoon?: boolean
    page?: number
    limit?: number
  }): Promise<ApiResponse<any>> => {
    const response = await api.get('/inventory/batches', { params })
    return response.data
  },
}

// Reports API
export const reportsApi = {
  getDashboardKPI: async (outletId?: string): Promise<ApiResponse<DashboardKPI>> => {
    const response = await api.get('/reports/dashboard/kpi', {
      params: { outletId }
    })
    return response.data
  },

  getSalesChart: async (params: {
    period: 'day' | 'week' | 'month' | 'year'
    startDate?: string
    endDate?: string
    outletId?: string
  }): Promise<ApiResponse<SalesChart[]>> => {
    const response = await api.get('/reports/sales/chart', { params })
    return response.data
  },

  getCategorySales: async (params: {
    startDate?: string
    endDate?: string
    outletId?: string
  }): Promise<ApiResponse<CategorySales[]>> => {
    const response = await api.get('/reports/sales/by-category', { params })
    return response.data
  },

  getTopProducts: async (params: {
    period: 'day' | 'week' | 'month'
    limit?: number
    outletId?: string
  }): Promise<ApiResponse<TopProduct[]>> => {
    const response = await api.get('/reports/products/top', { params })
    return response.data
  },
}

// Uploads API
export const uploadsApi = {
  uploadImage: async (type: 'logo' | 'product', file: File, productId?: string, sortOrder?: number, isPrimary?: boolean): Promise<ApiResponse<{
    filename: string
    originalName: string
    size: number
    mimetype: string
    url: string
  }>> => {
    const formData = new FormData()
    formData.append('image', file)
    if (productId) formData.append('productId', productId)
    if (sortOrder !== undefined) formData.append('sortOrder', sortOrder.toString())
    if (isPrimary !== undefined) formData.append('isPrimary', isPrimary.toString())

    const response = await api.post(`/uploads/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  deleteImage: async (type: 'logo' | 'product', filename: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/uploads/${type}/${filename}`)
    return response.data
  },

  getImages: async (type: 'logo' | 'product'): Promise<ApiResponse<Array<{
    filename: string
    url: string
    size: number
    createdAt: Date
    modifiedAt: Date
  }>>> => {
    const response = await api.get(`/uploads/${type}`)
    return response.data
  },
}

export default api