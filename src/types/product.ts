export type ProductStatus = 'all' | 'online' | 'pending' | 'rejected' | 'offline'

export interface ProductSpecification {
  label: string
  value: string
}

export interface Product {
  id: number
  name: string
  brand: string
  model: string
  category: string
  subCategory?: string
  description: string
  price: number
  stock: number
  status: Exclude<ProductStatus, 'all'>
  images: string[]
  video?: string
  specifications?: ProductSpecification[]
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

export const CATEGORY_OPTIONS = [
  {
    value: '礼服',
    label: '礼服',
    children: [
      { value: '婚纱', label: '婚纱' },
      { value: '晚礼服', label: '晚礼服' },
      { value: '学士服', label: '学士服' },
      { value: '学位服', label: '学位服' }
    ]
  },
  {
    value: '西装',
    label: '西装',
    children: [
      { value: '商务西装', label: '商务西装' },
      { value: '休闲西装', label: '休闲西装' }
    ]
  },
  {
    value: '古装',
    label: '古装',
    children: [
      { value: '汉服', label: '汉服' },
      { value: '旗袍', label: '旗袍' }
    ]
  },
  {
    value: '运动',
    label: '运动',
    children: [
      { value: '登山装备', label: '登山装备' },
      { value: '滑雪装备', label: '滑雪装备' }
    ]
  },
  {
    value: '儿童',
    label: '儿童',
    children: [
      { value: '表演服', label: '表演服' },
      { value: '节日装', label: '节日装' }
    ]
  },
  {
    value: '角色扮演',
    label: '角色扮演',
    children: [
      { value: '动漫服装', label: '动漫服装' },
      { value: '游戏道具', label: '游戏道具' }
    ]
  },
  {
    value: '其他',
    label: '其他',
    children: [
      { value: '配饰', label: '配饰' },
      { value: '道具', label: '道具' }
    ]
  }
]

export const BRAND_OPTIONS = [
  '雅戈尔',
  '杉杉',
  '罗蒙',
  '红豆',
  '七匹狼',
  '劲霸',
  '九牧王',
  '柒牌',
  '利郎',
  '太子龙',
  '其他'
]
