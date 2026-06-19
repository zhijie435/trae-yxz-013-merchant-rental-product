// api/utils/seed.ts
import { seedProducts, seedAuditAccounts } from '../data/seeds'

declare global {
  // eslint-disable-next-line no-var
  var products: any[]
  // eslint-disable-next-line no-var
  var auditAccounts: any[]
}

export const initializeDatabase = () => {
  if (!global.products) {
    global.products = [...seedProducts]
  }

  if (!global.auditAccounts) {
    global.auditAccounts = [...seedAuditAccounts]
  }

  console.log('✅ 种子数据初始化完成')
  console.log(`📦 已加载 ${seedProducts.length} 个商品`)
  console.log(`👤 已加载 ${seedAuditAccounts.length} 个审核账号`)
}

export const resetDatabase = () => {
  global.products = [...seedProducts]
  global.auditAccounts = [...seedAuditAccounts]

  console.log('🔄 数据库已重置')
  console.log(`📦 已重新加载 ${seedProducts.length} 个商品`)
  console.log(`👤 已重新加载 ${seedAuditAccounts.length} 个审核账号`)
}

export const clearDatabase = () => {
  global.products = []
  global.auditAccounts = []

  console.log('🗑️ 数据库已清空')
}
