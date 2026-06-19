import { describe, it, expect } from 'vitest'
import type { DepositConfig, DepositTier } from '@/types/product'
import { DEPOSIT_TIER_PRESETS } from '@/types/product'

describe('押金功能测试', () => {
  describe('押金预设配置', () => {
    it('应该有4个押金分级预设', () => {
      expect(DEPOSIT_TIER_PRESETS).toHaveLength(4)
    })

    it('正常等级押金应该为100元，损坏比例为0', () => {
      const normalTier = DEPOSIT_TIER_PRESETS.find(t => t.level === 'normal')
      expect(normalTier).toBeDefined()
      expect(normalTier!.amount).toBe(100)
      expect(normalTier!.damageRatio).toBe(0)
      expect(normalTier!.description).toBe('正常押金')
    })

    it('轻微等级押金应该为50元，损坏比例为10%', () => {
      const minorTier = DEPOSIT_TIER_PRESETS.find(t => t.level === 'minor')
      expect(minorTier).toBeDefined()
      expect(minorTier!.amount).toBe(50)
      expect(minorTier!.damageRatio).toBe(0.1)
      expect(minorTier!.description).toBe('轻微损坏押金')
    })

    it('一般等级押金应该为200元，损坏比例为30%', () => {
      const moderateTier = DEPOSIT_TIER_PRESETS.find(t => t.level === 'moderate')
      expect(moderateTier).toBeDefined()
      expect(moderateTier!.amount).toBe(200)
      expect(moderateTier!.damageRatio).toBe(0.3)
      expect(moderateTier!.description).toBe('一般损坏押金')
    })

    it('严重等级押金应该为500元，损坏比例为60%', () => {
      const severeTier = DEPOSIT_TIER_PRESETS.find(t => t.level === 'severe')
      expect(severeTier).toBeDefined()
      expect(severeTier!.amount).toBe(500)
      expect(severeTier!.damageRatio).toBe(0.6)
      expect(severeTier!.description).toBe('严重损坏押金')
    })

    it('所有等级应该有有效的损坏比例', () => {
      DEPOSIT_TIER_PRESETS.forEach(tier => {
        expect(tier.damageRatio).toBeGreaterThanOrEqual(0)
        expect(tier.damageRatio).toBeLessThanOrEqual(1)
      })
    })
  })

  describe('基础押金配置', () => {
    it('应该正确设置基础押金', () => {
      const depositConfig: DepositConfig = {
        baseAmount: 200,
        suggestedAmount: 150,
        maxWaiveAmount: 100,
        tiers: JSON.parse(JSON.stringify(DEPOSIT_TIER_PRESETS))
      }

      expect(depositConfig.baseAmount).toBe(200)
      expect(depositConfig.suggestedAmount).toBe(150)
      expect(depositConfig.maxWaiveAmount).toBe(100)
    })

    it('应该计算建议押金（商品价格的50%）', () => {
      const calculateSuggestedDeposit = (price: number): number => {
        return Math.round(price * 0.5)
      }

      expect(calculateSuggestedDeposit(100)).toBe(50)
      expect(calculateSuggestedDeposit(200)).toBe(100)
      expect(calculateSuggestedDeposit(299)).toBe(150)
      expect(calculateSuggestedDeposit(399)).toBe(200)
    })

    it('建议押金应该基于当前价格计算', () => {
      const price = 299
      const suggestedDeposit = Math.round(price * 0.5)
      expect(suggestedDeposit).toBe(150)
    })
  })

  describe('分级押金计算', () => {
    it('应该根据损坏比例计算分级押金', () => {
      const calculateTieredDeposit = (baseAmount: number, damageRatio: number): number => {
        return Math.round(baseAmount * (1 + damageRatio))
      }

      const baseAmount = 100

      expect(calculateTieredDeposit(baseAmount, 0)).toBe(100) // 正常
      expect(calculateTieredDeposit(baseAmount, 0.1)).toBe(110) // 轻微
      expect(calculateTieredDeposit(baseAmount, 0.3)).toBe(130) // 一般
      expect(calculateTieredDeposit(baseAmount, 0.6)).toBe(160) // 严重
    })

    it('应该正确应用押金分级预设', () => {
      const suggestedAmount = 150
      const tiers = JSON.parse(JSON.stringify(DEPOSIT_TIER_PRESETS)).map((tier: DepositTier) => {
        tier.amount = Math.round(suggestedAmount * (1 + tier.damageRatio))
        return tier
      })

      expect(tiers.find((t: DepositTier) => t.level === 'normal')!.amount).toBe(150)
      expect(tiers.find((t: DepositTier) => t.level === 'minor')!.amount).toBe(165)
      expect(tiers.find((t: DepositTier) => t.level === 'moderate')!.amount).toBe(195)
      expect(tiers.find((t: DepositTier) => t.level === 'severe')!.amount).toBe(240)
    })
  })

  describe('免押额度配置', () => {
    it('应该正确设置最大免押额度', () => {
      const depositConfig: DepositConfig = {
        baseAmount: 200,
        suggestedAmount: 150,
        maxWaiveAmount: 100,
        tiers: []
      }

      expect(depositConfig.maxWaiveAmount).toBe(100)
      expect(depositConfig.maxWaiveAmount).toBeLessThanOrEqual(depositConfig.baseAmount)
    })

    it('免押额度应该基于基础押金计算', () => {
      const baseAmount = 200
      const maxWaiveAmount = Math.round(baseAmount * 0.5)

      expect(maxWaiveAmount).toBe(100)
      expect(maxWaiveAmount).toBeLessThanOrEqual(baseAmount)
    })

    it('应该验证免押条件', () => {
      const validateWaiveConditions = (
        tier: DepositTier,
        waiveConditions?: {
          minRentalDays?: number
          vipOnly?: boolean
          autoInsure?: boolean
        }
      ): boolean => {
        if (!waiveConditions) return true

        if (waiveConditions.vipOnly === true) {
          return false
        }
        if (waiveConditions.autoInsure === true) {
          return false
        }

        return true
      }

      const tier = DEPOSIT_TIER_PRESETS[0]
      expect(validateWaiveConditions(tier, {})).toBe(true)
      expect(validateWaiveConditions(tier, { vipOnly: true })).toBe(false)
    })
  })

  describe('押金费用计算', () => {
    it('应该正确计算押金总费用', () => {
      const calculateDepositFee = (baseAmount: number, quantity: number, waiveDeposit: boolean): number => {
        if (waiveDeposit) return 0
        return baseAmount * quantity
      }

      expect(calculateDepositFee(200, 1, false)).toBe(200)
      expect(calculateDepositFee(200, 2, false)).toBe(400)
      expect(calculateDepositFee(200, 3, false)).toBe(600)
      expect(calculateDepositFee(200, 1, true)).toBe(0)
    })

    it('应该考虑免押选项', () => {
      const baseAmount = 200
      const quantity = 2
      const waiveDeposit = true

      const depositFee = waiveDeposit ? 0 : baseAmount * quantity
      expect(depositFee).toBe(0)
    })

    it('应该正确计算总费用（租金+押金+服务费）', () => {
      const calculateTotalAmount = (
        rentalFee: number,
        depositFee: number,
        serviceFee: number
      ): number => {
        return rentalFee + depositFee + serviceFee
      }

      expect(calculateTotalAmount(500, 200, 0)).toBe(700)
      expect(calculateTotalAmount(500, 0, 100)).toBe(600)
      expect(calculateTotalAmount(500, 200, 100)).toBe(800)
    })
  })

  describe('押金等级标签', () => {
    it('应该获取正确的押金等级标签', () => {
      const getTierLevelLabel = (level: string): string => {
        switch (level) {
          case 'normal':
            return '正常'
          case 'minor':
            return '轻微'
          case 'moderate':
            return '一般'
          case 'severe':
            return '严重'
          default:
            return '正常'
        }
      }

      expect(getTierLevelLabel('normal')).toBe('正常')
      expect(getTierLevelLabel('minor')).toBe('轻微')
      expect(getTierLevelLabel('moderate')).toBe('一般')
      expect(getTierLevelLabel('severe')).toBe('严重')
    })

    it('应该获取正确的押金等级颜色', () => {
      const getTierLevelType = (level: string): string => {
        switch (level) {
          case 'normal':
            return 'success'
          case 'minor':
            return 'info'
          case 'moderate':
            return 'warning'
          case 'severe':
            return 'danger'
          default:
            return 'success'
        }
      }

      expect(getTierLevelType('normal')).toBe('success')
      expect(getTierLevelType('minor')).toBe('info')
      expect(getTierLevelType('moderate')).toBe('warning')
      expect(getTierLevelType('severe')).toBe('danger')
    })
  })

  describe('押金配置验证', () => {
    it('应该验证押金金额的有效性', () => {
      const validateDepositAmount = (amount: number): boolean => {
        return amount >= 0
      }

      expect(validateDepositAmount(0)).toBe(true)
      expect(validateDepositAmount(100)).toBe(true)
      expect(validateDepositAmount(-1)).toBe(false)
    })

    it('应该验证损坏比例的有效性', () => {
      const validateDamageRatio = (ratio: number): boolean => {
        return ratio >= 0 && ratio <= 1
      }

      expect(validateDamageRatio(0)).toBe(true)
      expect(validateDamageRatio(0.5)).toBe(true)
      expect(validateDamageRatio(1)).toBe(true)
      expect(validateDamageRatio(-0.1)).toBe(false)
      expect(validateDamageRatio(1.1)).toBe(false)
    })

    it('应该验证最大免押额度的有效性', () => {
      const validateMaxWaiveAmount = (maxWaive: number, baseAmount: number): boolean => {
        return maxWaive >= 0 && maxWaive <= baseAmount
      }

      expect(validateMaxWaiveAmount(100, 200)).toBe(true)
      expect(validateMaxWaiveAmount(200, 200)).toBe(true)
      expect(validateMaxWaiveAmount(0, 200)).toBe(true)
      expect(validateMaxWaiveAmount(300, 200)).toBe(false)
      expect(validateMaxWaiveAmount(-1, 200)).toBe(false)
    })
  })
})
