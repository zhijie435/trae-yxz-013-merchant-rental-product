export type ProductStatus = 'all' | 'online' | 'pending' | 'rejected' | 'offline'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  status: Exclude<ProductStatus, 'all'>
  images: string[]
  category: string
  createTime: string
  updateTime: string
}

export interface ProductCounts {
  all: number
  online: number
  pending: number
  rejected: number
  offline: number
}

export interface BatchAction {
  type: 'online' | 'offline' | 'delete'
  productIds: number[]
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface ProductListResponse {
  list: Product[]
  pagination: Pagination
}

export interface BatchOperationResponse {
  successCount: number
  failCount: number
  results: Array<{
    productId: number
    success: boolean
    message?: string
  }>
}

export const STATUS_CONFIG: Record<Exclude<ProductStatus, 'all'>, {
  label: string
  type: 'success' | 'warning' | 'danger' | 'info'
}> = {
  online: {
    label: '上架中',
    type: 'success'
  },
  pending: {
    label: '待审核',
    type: 'warning'
  },
  rejected: {
    label: '已驳回',
    type: 'danger'
  },
  offline: {
    label: '已下架',
    type: 'info'
  }
}
