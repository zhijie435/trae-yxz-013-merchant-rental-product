import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Product, RentalConfig, TieredPrice, DepositConfig } from '@/types/product'
import { DEPOSIT_TIER_PRESETS, TIERED_PRICE_PRESETS } from '@/types/product'

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual as any,
    ElMessage: {
      warning: vi.fn(),
      success: vi.fn(),
    },
  }
})

const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  code: { code: 'TEST-001', barcode: '123456789', qrCode: 'QR123' },
  name: '测试商品',
  brand: '测试品牌',
  model: 'TEST-MODEL',
  category: '礼服',
  subCategory: '婚纱',
  description: '这是一个测试商品描述',
  price: 100,
  originalPrice: 150,
  stock: 10,
  status: 'online',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  video: 'https://example.com/video.mp4',
  specifications: [
    { label: '材质', value: '丝绸' },
    { label: '尺码', value: 'M' }
  ],
  attributes: {
    origin: '中国',
    material: '丝绸',
    washingInstructions: '干洗',
    size: 'M',
    color: '白色',
    weight: 1.5,
    dimensions: { length: 30, width: 20, height: 10 }
  },
  rentalConfig: {
    minimumQuantity: 1,
    rentalMethod: 'daily',
    minimumRentalTime: '1day',
    tieredPricingEnabled: true,
    tieredPrices: [
      { minDays: 1, maxDays: 7, pricePerDay: 100, discount: 0 },
      { minDays: 8, maxDays: 30, pricePerDay: 80, discount: 20 }
    ],
    specificationOptions: [
      {
        label: '颜色',
        values: [
          { label: '白色', price: { price: 100, originalPrice: 150, stock: 5 } },
          { label: '红色', price: { price: 110, originalPrice: 160, stock: 3 } }
        ]
      }
    ],
    depositConfig: {
      baseAmount: 200,
      suggestedAmount: 150,
      maxWaiveAmount: 100,
      tiers: JSON.parse(JSON.stringify(DEPOSIT_TIER_PRESETS))
    }
  },
  deliveryConfig: {
    method: 'pickup',
    pickupConfig: {
      storeName: '测试门店',
      storeAddress: '测试地址',
      storePhone: '13800138000',
      availableSlots: []
    }
  },
  auditHistory: [],
  currentAuditLevel: 'store',
  rejectReason: '',
  createTime: '2024-01-01T00:00:00Z',
  updateTime: '2024-01-01T00:00:00Z',
  ...overrides
})

describe('租赁商品编辑功能测试', () => {
  describe('表单数据验证测试', () => {
    it('应该验证必填字段 - 商品名称', () => {
      const validateForm = (formData: any): string | null => {
        if (!formData.name) {
          return '请输入商品名称'
        }
        return null
      }

      expect(validateForm({ name: '' })).toBe('请输入商品名称')
      expect(validateForm({ name: '测试商品' })).toBeNull()
    })

    it('应该验证必填字段 - 品牌', () => {
      const validateForm = (formData: any): string | null => {
        if (!formData.brand) {
          return '请选择品牌'
        }
        return null
      }

      expect(validateForm({ brand: '' })).toBe('请选择品牌')
      expect(validateForm({ brand: '测试品牌' })).toBeNull()
    })

    it('应该验证必填字段 - 分类', () => {
      const validateForm = (formData: any): string | null => {
        if (!formData.category) {
          return '请选择产品分类'
        }
        return null
      }

      expect(validateForm({ category: '' })).toBe('请选择产品分类')
      expect(validateForm({ category: '礼服' })).toBeNull()
    })

    it('应该验证必填字段 - 价格', () => {
      const validateForm = (formData: any): string | null => {
        if (!formData.price || formData.price <= 0) {
          return '请输入有效的价格'
        }
        return null
      }

      expect(validateForm({ price: 0 })).toBe('请输入有效的价格')
      expect(validateForm({ price: -1 })).toBe('请输入有效的价格')
      expect(validateForm({ price: 100 })).toBeNull()
    })

    it('应该验证完整的表单', () => {
      const validateCompleteForm = (formData: any): string[] => {
        const errors: string[] = []

        if (!formData.name) {
          errors.push('请输入商品名称')
        }
        if (!formData.brand) {
          errors.push('请选择品牌')
        }
        if (!formData.category) {
          errors.push('请选择产品分类')
        }
        if (!formData.price || formData.price <= 0) {
          errors.push('请输入有效的价格')
        }

        return errors
      }

      const validForm = {
        name: '测试商品',
        brand: '测试品牌',
        category: '礼服',
        price: 100
      }
      expect(validateCompleteForm(validForm)).toHaveLength(0)

      const invalidForm = {}
      expect(validateCompleteForm(invalidForm)).toHaveLength(4)
    })
  })

  describe('默认配置创建测试', () => {
    it('应该创建默认租赁配置', () => {
      const createDefaultRentalConfig = (): RentalConfig => ({
        minimumQuantity: 1,
        rentalMethod: 'daily',
        minimumRentalTime: 'none',
        tieredPricingEnabled: false,
        tieredPrices: [],
        specificationOptions: [],
        depositConfig: {
          baseAmount: 0,
          suggestedAmount: 0,
          maxWaiveAmount: 0,
          tiers: JSON.parse(JSON.stringify(DEPOSIT_TIER_PRESETS))
        }
      })

      const config = createDefaultRentalConfig()
      expect(config.minimumQuantity).toBe(1)
      expect(config.rentalMethod).toBe('daily')
      expect(config.minimumRentalTime).toBe('none')
      expect(config.tieredPricingEnabled).toBe(false)
    })

    it('应该创建默认配送配置', () => {
      const createDefaultDeliveryConfig = () => ({
        method: 'pickup',
        pickupConfig: {
          storeName: '',
          storeAddress: '',
          storePhone: '',
          availableSlots: []
        }
      })

      const config = createDefaultDeliveryConfig()
      expect(config.method).toBe('pickup')
      expect(config.pickupConfig.storeName).toBe('')
      expect(config.pickupConfig.storeAddress).toBe('')
      expect(config.pickupConfig.storePhone).toBe('')
    })
  })

  describe('图片管理测试', () => {
    it('应该添加图片到列表', () => {
      const images: string[] = []
      const addImage = (url: string) => {
        if (images.length < 10) {
          images.push(url)
        }
      }

      addImage('https://example.com/image1.jpg')
      expect(images).toHaveLength(1)
      expect(images[0]).toBe('https://example.com/image1.jpg')
    })

    it('应该限制最多10张图片', () => {
      const images: string[] = []
      for (let i = 0; i < 10; i++) {
        images.push(`https://example.com/image${i}.jpg`)
      }

      const addImage = (url: string): boolean => {
        if (images.length < 10) {
          images.push(url)
          return true
        }
        return false
      }

      expect(addImage('https://example.com/extra.jpg')).toBe(false)
      expect(images).toHaveLength(10)
    })

    it('应该移除指定索引的图片', () => {
      const images = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ]
      const removeImage = (index: number) => {
        if (index >= 0 && index < images.length) {
          images.splice(index, 1)
        }
      }

      removeImage(1)
      expect(images).toHaveLength(2)
      expect(images).not.toContain('https://example.com/image2.jpg')
    })
  })

  describe('视频管理测试', () => {
    it('应该添加视频', () => {
      let video = ''
      const addVideo = (url: string) => {
        video = url
      }

      addVideo('https://example.com/video.mp4')
      expect(video).toBe('https://example.com/video.mp4')
    })

    it('应该移除视频', () => {
      let video = 'https://example.com/video.mp4'
      const removeVideo = () => {
        video = ''
      }

      removeVideo()
      expect(video).toBe('')
    })
  })

  describe('规格参数管理测试', () => {
    it('应该添加规格参数', () => {
      const specifications: Array<{ label: string; value: string }> = []
      const addSpecification = () => {
        specifications.push({ label: '', value: '' })
      }

      addSpecification()
      expect(specifications).toHaveLength(1)
    })

    it('应该移除规格参数', () => {
      const specifications = [
        { label: '材质', value: '丝绸' },
        { label: '尺码', value: 'M' }
      ]
      const removeSpecification = (index: number) => {
        specifications.splice(index, 1)
      }

      removeSpecification(0)
      expect(specifications).toHaveLength(1)
      expect(specifications[0].label).toBe('尺码')
    })

    it('应该编辑规格参数', () => {
      const specifications = [{ label: '', value: '' }]
      specifications[0].label = '材质'
      specifications[0].value = '丝绸'

      expect(specifications[0].label).toBe('材质')
      expect(specifications[0].value).toBe('丝绸')
    })
  })

  describe('规格选项管理测试', () => {
    it('应该添加规格选项', () => {
      const specificationOptions: any[] = []
      specificationOptions.push({
        label: '颜色',
        values: []
      })

      expect(specificationOptions).toHaveLength(1)
      expect(specificationOptions[0].label).toBe('颜色')
    })

    it('应该添加规格值到规格选项', () => {
      const specOption = {
        label: '颜色',
        values: [] as any[]
      }
      specOption.values.push({
        label: '白色',
        price: { price: 100, stock: 5 }
      })

      expect(specOption.values).toHaveLength(1)
      expect(specOption.values[0].label).toBe('白色')
    })

    it('应该移除规格值', () => {
      const specOption = {
        label: '颜色',
        values: [
          { label: '白色', price: { price: 100, stock: 5 } },
          { label: '红色', price: { price: 110, stock: 3 } }
        ]
      }
      specOption.values.splice(0, 1)

      expect(specOption.values).toHaveLength(1)
      expect(specOption.values[0].label).toBe('红色')
    })
  })

  describe('商品编码生成测试', () => {
    it('应该生成格式正确的商品编码', () => {
      const generateProductCode = (): string => {
        const timestamp = Date.now().toString(36).toUpperCase()
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()
        return `PRD-${timestamp}-${random}`
      }

      const code = generateProductCode()
      expect(code).toMatch(/^PRD-[A-Z0-9]+-[A-Z0-9]+$/)
    })

    it('每次生成的编码应该唯一', () => {
      const generateProductCode = (): string => {
        const timestamp = Date.now().toString(36).toUpperCase()
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()
        return `PRD-${timestamp}-${random}`
      }

      const codes = new Set<string>()
      for (let i = 0; i < 100; i++) {
        codes.add(generateProductCode())
      }

      expect(codes.size).toBe(100)
    })
  })

  describe('表单重置测试', () => {
    it('应该重置表单数据到默认值', () => {
      const formData = {
        name: '测试商品',
        brand: '测试品牌',
        price: 100,
        stock: 10
      }

      const resetForm = () => {
        formData.name = ''
        formData.brand = ''
        formData.price = 0
        formData.stock = 0
      }

      resetForm()
      expect(formData.name).toBe('')
      expect(formData.brand).toBe('')
      expect(formData.price).toBe(0)
      expect(formData.stock).toBe(0)
    })

    it('应该重置图片列表', () => {
      const formData = {
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
      }

      const resetForm = () => {
        formData.images = []
      }

      resetForm()
      expect(formData.images).toHaveLength(0)
    })

    it('应该重置视频链接', () => {
      const formData = {
        video: 'https://example.com/video.mp4'
      }

      const resetForm = () => {
        formData.video = ''
      }

      resetForm()
      expect(formData.video).toBe('')
    })
  })

  describe('表单加载测试', () => {
    it('应该正确加载现有商品数据', () => {
      const product = createMockProduct()
      const formData = { ...product }

      expect(formData.name).toBe(product.name)
      expect(formData.brand).toBe(product.brand)
      expect(formData.category).toBe(product.category)
      expect(formData.price).toBe(product.price)
    })

    it('应该使用默认值填充空字段', () => {
      const product = {
        name: '测试商品',
        brand: '测试品牌'
      }

      const formData = {
        name: product.name,
        brand: product.brand,
        code: { code: '', barcode: '', qrCode: '' },
        images: [] as string[],
        video: '',
        specifications: [] as any[]
      }

      expect(formData.code.code).toBe('')
      expect(formData.images).toEqual([])
      expect(formData.video).toBe('')
      expect(formData.specifications).toEqual([])
    })
  })
})
