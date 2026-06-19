import axios from 'axios'
import type {
  Product,
  ProductStatus,
  ProductListResponse,
  BatchOperationResponse,
  ApiResponse
} from '@/types/product'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const productApi = {
  getProducts: async (
    status?: ProductStatus,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<ProductListResponse>> => {
    const params: Record<string, any> = { page, pageSize }
    if (status && status !== 'all') {
      params.status = status
    }
    return api.get('/products', { params })
  },

  getProductById: async (id: number): Promise<ApiResponse<Product>> => {
    return api.get(`/products/${id}`)
  },

  createProduct: async (
    product: Omit<Product, 'id' | 'createTime' | 'updateTime'>
  ): Promise<ApiResponse<Product>> => {
    return api.post('/products', product)
  },

  updateProduct: async (
    id: number,
    product: Partial<Product>
  ): Promise<ApiResponse<Product>> => {
    return api.put(`/products/${id}`, product)
  },

  deleteProduct: async (id: number): Promise<ApiResponse<null>> => {
    return api.delete(`/products/${id}`)
  },

  updateProductStatus: async (
    id: number,
    status: 'online' | 'offline'
  ): Promise<ApiResponse<Product>> => {
    return api.put(`/products/${id}/status`, { status })
  },

  batchOperation: async (
    productIds: number[],
    action: 'online' | 'offline' | 'delete'
  ): Promise<ApiResponse<BatchOperationResponse>> => {
    return api.post('/products/batch', { productIds, action })
  }
}

export default api
