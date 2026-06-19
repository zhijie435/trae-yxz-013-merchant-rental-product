export type ProductStatus = 'all' | 'online' | 'pending' | 'approved' | 'rejected' | 'offline'

export type RentalMethod = 'daily' | 'weekly' | 'monthly' | 'custom'

export type MinimumRentalTime = 'none' | '1day' | '3days' | '1week' | '1month'

export type DeliveryMethod = 'express' | 'installer' | 'pickup'

export type AuditStatus = 'pending' | 'approved' | 'rejected'

export type AuditLevel = 'store' | 'district' | 'headquarters'

export interface AuditRecord {
  level: AuditLevel
  status: AuditStatus
  auditor?: string
  auditTime?: string
  comment?: string
}

export interface ProductCode {
  code: string
  barcode?: string
  qrCode?: string
}

export interface ProductAttributes {
  origin?: string
  material?: string
  washingInstructions?: string
  size?: string
  color?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
}

export interface SpecificationPrice {
  price: number
  originalPrice?: number
  stock: number
}

export interface TieredPrice {
  minDays: number
  maxDays: number | null
  pricePerDay: number
  discount?: number
}

export interface SpecificationOption {
  label: string
  values: Array<{
    label: string
    price?: SpecificationPrice
    tieredPrices?: TieredPrice[]
  }>
}

export interface DepositTier {
  level: 'normal' | 'minor' | 'moderate' | 'severe'
  amount: number
  description: string
  damageRatio: number
}

export interface DepositConfig {
  baseAmount: number
  suggestedAmount: number
  maxWaiveAmount: number
  tiers: DepositTier[]
  waiveConditions?: {
    minRentalDays?: number
    vipOnly?: boolean
    autoInsure?: boolean
  }
}

export interface DeliverySlot {
  date: string
  timeRanges: Array<{
    start: string
    end: string
  }>
}

export interface PickupConfig {
  storeName: string
  storeAddress: string
  storePhone: string
  availableSlots: DeliverySlot[]
}

export interface ExpressDeliveryConfig {
  method: 'express'
  expressCompany: string
  trackingNumber: string
  estimatedDeliveryDays: number
  deliveryDate?: string
}

export interface InstallerDeliveryConfig {
  method: 'installer'
  installerName: string
  installerPhone: string
  serviceFee: number
  serviceDescription: string
  availableSlots?: DeliverySlot[]
}

export interface DeliveryConfig {
  method: DeliveryMethod
  expressConfig?: ExpressDeliveryConfig
  installerConfig?: InstallerDeliveryConfig
  pickupConfig?: PickupConfig
}

export interface ProductSpecification {
  label: string
  value: string
}

export interface RentalConfig {
  minimumQuantity: number
  rentalMethod: RentalMethod
  minimumRentalTime: MinimumRentalTime
  tieredPricingEnabled: boolean
  tieredPrices?: TieredPrice[]
  specificationOptions?: SpecificationOption[]
  depositConfig: DepositConfig
}

export interface Product {
  id: number
  code: ProductCode
  name: string
  brand: string
  model: string
  category: string
  subCategory?: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  status: Exclude<ProductStatus, 'all'>
  images: string[]
  video?: string
  specifications?: ProductSpecification[]
  attributes?: ProductAttributes
  rentalConfig?: RentalConfig
  deliveryConfig?: DeliveryConfig
  auditHistory?: AuditRecord[]
  currentAuditLevel?: AuditLevel
  rejectReason?: string
  createTime: string
  updateTime: string
}

export interface ProductCounts {
  all: number
  online: number
  pending: number
  approved: number
  rejected: number
  offline: number
}

export interface BatchAction {
  type: 'online' | 'offline' | 'delete' | 'submit_audit'
  productIds: number[]
}

export interface AuditAction {
  type: 'approve' | 'reject'
  productIds: number[]
  level: AuditLevel
  comment?: string
}

export interface AuditResponse {
  successCount: number
  failCount: number
  results: Array<{
    productId: number
    success: boolean
    message?: string
  }>
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
  approved: {
    label: '已通过',
    type: 'success'
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

export const AUDIT_LEVEL_CONFIG: Record<AuditLevel, {
  label: string
  description: string
}> = {
  store: {
    label: '门店审核',
    description: '门店管理员初步审核'
  },
  district: {
    label: '区域审核',
    description: '区域经理审核'
  },
  headquarters: {
    label: '总部审核',
    description: '总部专业人员审核'
  }
}

export const DEPOSIT_TIER_PRESETS: DepositTier[] = [
  {
    level: 'normal',
    amount: 100,
    description: '正常押金',
    damageRatio: 0
  },
  {
    level: 'minor',
    amount: 50,
    description: '轻微损坏押金',
    damageRatio: 0.1
  },
  {
    level: 'moderate',
    amount: 200,
    description: '一般损坏押金',
    damageRatio: 0.3
  },
  {
    level: 'severe',
    amount: 500,
    description: '严重损坏押金',
    damageRatio: 0.6
  }
]

export const TIERED_PRICE_PRESETS: TieredPrice[] = [
  { minDays: 1, maxDays: 7, pricePerDay: 100, discount: 0 },
  { minDays: 8, maxDays: 30, pricePerDay: 80, discount: 20 },
  { minDays: 31, maxDays: null, pricePerDay: 60, discount: 40 }
]

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

export const RENTAL_METHOD_OPTIONS = [
  { value: 'daily', label: '按天计费' },
  { value: 'weekly', label: '按周计费' },
  { value: 'monthly', label: '按月计费' },
  { value: 'custom', label: '自定义计费' }
]

export const MINIMUM_RENTAL_TIME_OPTIONS = [
  { value: 'none', label: '无限制' },
  { value: '1day', label: '1天起租' },
  { value: '3days', label: '3天起租' },
  { value: '1week', label: '1周起租' },
  { value: '1month', label: '1月起租' }
]

export const EXPRESS_COMPANY_OPTIONS = [
  '顺丰速运',
  '圆通速递',
  '中通快递',
  '韵达快递',
  '申通快递',
  '极兔速递',
  '京东物流',
  '邮政EMS',
  '德邦快递',
  '其他'
]

export const DELIVERY_METHOD_OPTIONS = [
  { value: 'pickup', label: '门店自提', description: '客户到门店自取商品' },
  { value: 'express', label: '快递交付', description: '填写快递单号和快递公司' },
  { value: 'installer', label: '专业操作员现场交付', description: '专业人员上门安装交付' }
]

export const WASHING_INSTRUCTIONS_OPTIONS = [
  '手洗',
  '机洗',
  '干洗',
  '不可水洗',
  '低温熨烫',
  '不可熨烫',
  '悬挂晾干',
  '平摊晾干',
  '专业护理'
]

export const SIZE_OPTIONS = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
  '均码'
]

export const COLOR_OPTIONS = [
  '白色',
  '黑色',
  '灰色',
  '红色',
  '蓝色',
  '绿色',
  '黄色',
  '紫色',
  '粉色',
  '橙色',
  '棕色',
  '米色',
  '金色',
  '银色',
  '多色'
]
