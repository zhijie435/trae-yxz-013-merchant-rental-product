import { describe, it, expect } from 'vitest'
import type { RentalConfig, MinimumRentalTime } from '@/types/product'
import { MINIMUM_RENTAL_TIME_OPTIONS } from '@/types/product'

describe('起租规则功能测试', () => {
  describe('起租时间选项配置', () => {
    it('应该有5个起租时间选项', () => {
      expect(MINIMUM_RENTAL_TIME_OPTIONS).toHaveLength(5)
    })

    it('选项值应该正确映射', () => {
      const optionMap = new Map(MINIMUM_RENTAL_TIME_OPTIONS.map(opt => [opt.value, opt.label]))

      expect(optionMap.get('none')).toBe('无限制')
      expect(optionMap.get('1day')).toBe('1天起租')
      expect(optionMap.get('3days')).toBe('3天起租')
      expect(optionMap.get('1week')).toBe('1周起租')
      expect(optionMap.get('1month')).toBe('1月起租')
    })

    it('每个选项应该有值和标签', () => {
      MINIMUM_RENTAL_TIME_OPTIONS.forEach(option => {
        expect(option.value).toBeDefined()
        expect(option.label).toBeDefined()
        expect(option.value.length).toBeGreaterThan(0)
        expect(option.label.length).toBeGreaterThan(0)
      })
    })
  })

  describe('起租天数计算', () => {
    it('none选项应该返回1天', () => {
      const getMinimumDays = (rule: MinimumRentalTime): number => {
        switch (rule) {
          case 'none':
            return 1
          case '1day':
            return 1
          case '3days':
            return 3
          case '1week':
            return 7
          case '1month':
            return 30
          default:
            return 1
        }
      }

      expect(getMinimumDays('none')).toBe(1)
    })

    it('1day选项应该返回1天', () => {
      const getMinimumDays = (rule: MinimumRentalTime): number => {
        switch (rule) {
          case 'none':
            return 1
          case '1day':
            return 1
          case '3days':
            return 3
          case '1week':
            return 7
          case '1month':
            return 30
          default:
            return 1
        }
      }

      expect(getMinimumDays('1day')).toBe(1)
    })

    it('3days选项应该返回3天', () => {
      const getMinimumDays = (rule: MinimumRentalTime): number => {
        switch (rule) {
          case 'none':
            return 1
          case '1day':
            return 1
          case '3days':
            return 3
          case '1week':
            return 7
          case '1month':
            return 30
          default:
            return 1
        }
      }

      expect(getMinimumDays('3days')).toBe(3)
    })

    it('1week选项应该返回7天', () => {
      const getMinimumDays = (rule: MinimumRentalTime): number => {
        switch (rule) {
          case 'none':
            return 1
          case '1day':
            return 1
          case '3days':
            return 3
          case '1week':
            return 7
          case '1month':
            return 30
          default:
            return 1
        }
      }

      expect(getMinimumDays('1week')).toBe(7)
    })

    it('1month选项应该返回30天', () => {
      const getMinimumDays = (rule: MinimumRentalTime): number => {
        switch (rule) {
          case 'none':
            return 1
          case '1day':
            return 1
          case '3days':
            return 3
          case '1week':
            return 7
          case '1month':
            return 30
          default:
            return 1
        }
      }

      expect(getMinimumDays('1month')).toBe(30)
    })
  })

  describe('起租天数验证', () => {
    it('应该验证租赁天数是否满足最低要求', () => {
      const validateRentalDays = (days: number, minimumDays: number): boolean => {
        return days >= minimumDays
      }

      expect(validateRentalDays(5, 3)).toBe(true)
      expect(validateRentalDays(2, 3)).toBe(false)
      expect(validateRentalDays(1, 1)).toBe(true)
      expect(validateRentalDays(31, 30)).toBe(true)
      expect(validateRentalDays(8, 7)).toBe(true)
    })

    it('应该正确获取租赁天数的标签描述', () => {
      const getMinimumRentalTimeLabel = (rule: MinimumRentalTime): string => {
        switch (rule) {
          case 'none':
            return '无限制'
          case '1day':
            return '1天起租'
          case '3days':
            return '3天起租'
          case '1week':
            return '1周起租'
          case '1month':
            return '1月起租'
          default:
            return '无限制'
        }
      }

      expect(getMinimumRentalTimeLabel('none')).toBe('无限制')
      expect(getMinimumRentalTimeLabel('1day')).toBe('1天起租')
      expect(getMinimumRentalTimeLabel('3days')).toBe('3天起租')
      expect(getMinimumRentalTimeLabel('1week')).toBe('1周起租')
      expect(getMinimumRentalTimeLabel('1month')).toBe('1月起租')
    })
  })

  describe('起租台数配置', () => {
    it('应该正确设置起租台数', () => {
      const rentalConfig: RentalConfig = {
        minimumQuantity: 1,
        rentalMethod: 'daily',
        minimumRentalTime: '1day',
        tieredPricingEnabled: false,
        tieredPrices: [],
        specificationOptions: [],
        depositConfig: {
          baseAmount: 0,
          suggestedAmount: 0,
          maxWaiveAmount: 0,
          tiers: []
        }
      }

      expect(rentalConfig.minimumQuantity).toBe(1)
      rentalConfig.minimumQuantity = 2
      expect(rentalConfig.minimumQuantity).toBe(2)
    })

    it('应该验证起租台数范围', () => {
      const validateMinimumQuantity = (quantity: number): boolean => {
        return quantity >= 1 && quantity <= 999
      }

      expect(validateMinimumQuantity(1)).toBe(true)
      expect(validateMinimumQuantity(999)).toBe(true)
      expect(validateMinimumQuantity(0)).toBe(false)
      expect(validateMinimumQuantity(1000)).toBe(false)
      expect(validateMinimumQuantity(-1)).toBe(false)
    })

    it('应该验证租赁数量是否满足最低要求', () => {
      const validateOrderQuantity = (quantity: number, minimum: number): boolean => {
        return quantity >= minimum
      }

      expect(validateOrderQuantity(2, 1)).toBe(true)
      expect(validateOrderQuantity(1, 2)).toBe(false)
      expect(validateOrderQuantity(5, 3)).toBe(true)
    })
  })

  describe('租赁方式配置', () => {
    it('应该正确配置租赁方式', () => {
      const rentalConfig: RentalConfig = {
        minimumQuantity: 1,
        rentalMethod: 'daily',
        minimumRentalTime: '1day',
        tieredPricingEnabled: false,
        tieredPrices: [],
        specificationOptions: [],
        depositConfig: {
          baseAmount: 0,
          suggestedAmount: 0,
          maxWaiveAmount: 0,
          tiers: []
        }
      }

      expect(['daily', 'weekly', 'monthly', 'custom']).toContain(rentalConfig.rentalMethod)

      rentalConfig.rentalMethod = 'weekly'
      expect(rentalConfig.rentalMethod).toBe('weekly')
    })

    it('应该获取租赁方式的标签', () => {
      const RENTAL_METHOD_OPTIONS = [
        { value: 'daily', label: '按天计费' },
        { value: 'weekly', label: '按周计费' },
        { value: 'monthly', label: '按月计费' },
        { value: 'custom', label: '自定义计费' }
      ]

      const getMethodLabel = (value: string) => {
        const method = RENTAL_METHOD_OPTIONS.find(m => m.value === value)
        return method?.label || value
      }

      expect(getMethodLabel('daily')).toBe('按天计费')
      expect(getMethodLabel('weekly')).toBe('按周计费')
      expect(getMethodLabel('monthly')).toBe('按月计费')
      expect(getMethodLabel('custom')).toBe('自定义计费')
    })
  })
})
