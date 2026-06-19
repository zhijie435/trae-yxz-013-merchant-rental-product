<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import FilterBar from '@/components/FilterBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/product'
import { productApi } from '@/api/product'
import type { ProductStatus, Product, BatchAction } from '@/types/product'

const productStore = useProductStore()

onMounted(() => {
  loadProducts()
})

watch(() => productStore.currentStatus, () => {
  loadProducts()
})

const loadProducts = async () => {
  productStore.setLoading(true)
  try {
    const response = await productApi.getProducts(
      productStore.currentStatus,
      productStore.pagination.page,
      productStore.pagination.pageSize
    )
    productStore.setProducts(response.data.list)
    productStore.setPagination(response.data.pagination)
    ElMessage.success('商品列表加载成功')
  } catch (error) {
    console.error('加载商品列表失败:', error)
    ElMessage.error('商品列表加载失败')
  } finally {
    productStore.setLoading(false)
  }
}

const handleStatusChange = (status: ProductStatus) => {
  productStore.setCurrentStatus(status)
}

const handleBatchAction = async (action: BatchAction) => {
  if (action.type === 'delete') {
    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${productStore.selectedCount} 个商品吗？此操作不可恢复。`,
        '批量删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      const productIds = Array.from(productStore.selectedProducts)
      const response = await productApi.batchOperation(productIds, 'delete')

      if (response.code === 200) {
        productStore.batchDelete(productIds)
        ElMessage.success(response.message)
        loadProducts()
      } else {
        ElMessage.error(response.message)
      }
    } catch {
      ElMessage.info('已取消删除')
    }
  } else {
    const status = action.type === 'online' ? 'online' : 'offline'

    try {
      const productIds = Array.from(productStore.selectedProducts)
      const response = await productApi.batchOperation(productIds, action.type)

      if (response.code === 200) {
        productStore.batchUpdateStatus(productIds, status)
        const actionText = action.type === 'online' ? '上架' : '下架'
        ElMessage.success(response.message)
        loadProducts()
      } else {
        ElMessage.error(response.message)
      }
    } catch (error) {
      const actionText = action.type === 'online' ? '上架' : '下架'
      ElMessage.error(`批量${actionText}失败`)
    }
  }
}

const handleProductStatusChange = async (productId: number, status: 'online' | 'offline') => {
  try {
    const response = await productApi.updateProductStatus(productId, status)

    if (response.code === 200) {
      productStore.updateProductStatus(productId, status)
      const actionText = status === 'online' ? '上架' : '下架'
      ElMessage.success(`商品${actionText}成功`)
      loadProducts()
    } else {
      ElMessage.error(response.message)
    }
  } catch (error) {
    const actionText = status === 'online' ? '上架' : '下架'
    ElMessage.error(`商品${actionText}失败`)
  }
}

const handleProductDelete = async (productId: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个商品吗？此操作不可恢复。',
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await productApi.deleteProduct(productId)

    if (response.code === 200) {
      productStore.deleteProduct(productId)
      ElMessage.success('商品删除成功')
      loadProducts()
    } else {
      ElMessage.error(response.message)
    }
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleProductView = (product: Product) => {
  ElMessage.info(`查看商品: ${product.name}`)
}

const handleProductEdit = (product: Product) => {
  ElMessage.info(`编辑商品: ${product.name}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">租赁商品管理</h1>
        <p class="text-gray-600">高效管理您的租赁商品库存和状态</p>
      </div>

      <FilterBar
        v-model:active-status="productStore.currentStatus"
        :counts="productStore.counts"
        :selected-count="productStore.selectedCount"
        @batch-action="handleBatchAction"
      />

      <div v-if="productStore.loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <div v-else>
        <div v-if="productStore.filteredProducts.length === 0" class="text-center py-20">
          <div class="text-6xl mb-4">📦</div>
          <div class="text-xl text-gray-500 mb-2">暂无商品</div>
          <div class="text-gray-400">点击上方按钮添加新商品</div>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <ProductCard
            v-for="product in productStore.filteredProducts"
            :key="product.id"
            :product="product"
            :selected="productStore.isSelected(product.id)"
            @update:selected="productStore.toggleSelection(product.id)"
            @status-change="(status) => handleProductStatusChange(product.id, status)"
            @delete="handleProductDelete(product.id)"
            @view="handleProductView(product)"
            @edit="handleProductEdit(product)"
          />
        </div>
      </div>

      <div
        v-if="productStore.filteredProducts.length > 0"
        class="mt-8 flex justify-center"
      >
        <div class="text-gray-500 text-sm">
          共 {{ productStore.pagination.total }} 个商品，当前显示
          {{ productStore.filteredProducts.length }} 个
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style>
