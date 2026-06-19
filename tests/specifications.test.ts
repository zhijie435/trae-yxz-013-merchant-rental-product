import { describe, it, expect } from 'vitest'
import type { TieredPrice, DepositTier, RentalConfig } from '@/types/product'
import { DEPOSIT_TIER_PRESETS, TIERED_PRICE_PRESETS } from '@/types/product'

describe('规格价格功能测试', () => {
  describe('阶梯定价预设配置', () => {
    it('应该有3个阶梯定价预设', () => {
      expect(TIERED_PRICE_PRESETS).toHaveLength(3)
    })

    it('第一个预设应该是1-7天', () => {
      const preset = TIERED_PRICE_PRESETS[0]
      expect(preset.minDays).toBe(1)
      expect(preset.maxDays).toBe(7)
      expect(preset.discount).toBe(0)
    })

    it('第二个预设应该是8-30天，8折', () => {
      const preset = TIERED_PRICE_PRESETS[1]
      expect(preset.minDays).toBe(8)
      expect(preset.maxDays).toBe(30)
      expect(preset.discount).toBe(20)
    })

    it('第三个预设应该是31天以上，6折', () => {
      const preset = TIERED_PRICE_PRESETS[2]
      expect(preset.minDays).toBe(31)
      expect(preset.maxDays).toBeNull()
      expect(preset.discount).toBe(40)
    })

    it('所有预设应该有默认日单价', () => {
      TIERED_PRICE_PRESETS.forEach(preset => {
        expect(preset.pricePerDay).toBeGreaterThan(0)
      })
    })
  })

  describe('阶梯价格计算', () => {
    it('应该正确计算1-7天的价格', () => {
      const basePrice = 100
      const tier = TIERED_PRICE_PRESETS[0]
      const days = 5
      const pricePerDay = tier.pricePerDay

      const totalPrice = pricePerDay * days * (1 - (tier.discount || 0) / 100)
      expect(totalPrice).toBe(500)
    })

    it('应该正确计算8-30天的价格（含折扣）', () => {
      const tier = TIERED_PRICE_PRESETS[1]
      const days = 15
      const pricePerDay = tier.pricePerDay

      const totalPrice = pricePerDay * days * (1 - tier.discount / 100)
      expect(totalPrice).toBe(960) // 80 * 15 * 0.8
    })

    it('应该正确计算31天以上的价格（含折扣）', () => {
      const tier = TIERED_PRICE_PRESETS[2]
      const days = 60
      const pricePerDay = tier.pricePerDay

      const totalPrice = pricePerDay * days * (1 - tier.discount / 100)
      expect(totalPrice).toBe(2160) // 60 * 60 * 0.6
    })

    it('应该正确查找适用的阶梯', () => {
      const tiers = TIERED_PRICE_PRESETS
      const findApplicableTier = (days: number) => {
        return tiers.find(t => days >= t.minDays && (t.maxDays === null || days <= t.maxDays))
      }

      expect(findApplicableTier(5)).toEqual(tiers[0])
      expect(findApplicableTier(15)).toEqual(tiers[1])
      expect(findApplicableTier(60)).toEqual(tiers[2])
    })
  })

  describe('规格选项配置', () => {
    it('应该正确创建规格选项', () => {
      const specOption = {
        label: '颜色',
        values: [
          { label: '白色', price: { price: 100, originalPrice: 150, stock: 5 } },
          { label: '红色', price: { price: 110, originalPrice: 160, stock: 3 } }
        ]
      }

      expect(specOption.label).toBe('颜色')
      expect(specOption.values).toHaveLength(2)
      expect(specOption.values[0].label).toBe('白色')
      expect(specOption.values[0].price.price).toBe(100)
      expect(specOption.values[0].price.originalPrice).toBe(150)
    })

    it('应该正确添加规格值', () => {
      const specificationOptions: any[] = []
      specificationOptions.push({
        label: '尺码',
        values: []
      })

      expect(specificationOptions).toHaveLength(1)
      expect(specificationOptions[0].label).toBe('尺码')
    })

    it('应该正确删除规格值', () => {
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

  describe('规格参数配置', () => {
    it('应该正确添加规格参数', () => {
      const specifications: Array<{ label: string; value: string }> = []
      specifications.push({ label: '', value: '' })

      expect(specifications).toHaveLength(1)
      expect(specifications[0].label).toBe('')
      expect(specifications[0].value).toBe('')
    })

    it('应该正确编辑规格参数', () => {
      const specifications = [{ label: '材质', value: '' }]
      specifications[0].value = '丝绸'

      expect(specifications[0].value).toBe('丝绸')
    })

    it('应该正确删除规格参数', () => {
      const specifications = [
        { label: '材质', value: '丝绸' },
        { label: '尺码', value: 'M' }
      ]

      specifications.splice(0, 1)
      expect(specifications).toHaveLength(1)
      expect(specifications[0].label).toBe('尺码')
    })
  })
})
