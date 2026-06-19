<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import FilterBar from '@/components/FilterBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductEditDialog from '@/components/ProductEditDialog.vue'
import ProductDetailDialog from '@/components/ProductDetailDialog.vue'
import { useProductStore } from '@/stores/product'
import { productApi } from '@/api/product'
import type { ProductStatus, Product, BatchAction } from '@/types/product'

const productStore = useProductStore()

const editDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentProduct = ref<Product | null>(null)

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
  currentProduct.value = product
  detailDialogVisible.value = true
}

const handleProductEdit = (product: Product) => {
  currentProduct.value = product
  editDialogVisible.value = true
}

const handleSaveProduct = async (productData: Partial<Product>) => {
  try {
    if (currentProduct.value) {
      const response = await productApi.updateProduct(currentProduct.value.id, productData)
      if (response.code === 200) {
        ElMessage.success('商品更新成功')
        loadProducts()
      }
    }
  } catch (error) {
    ElMessage.error('保存商品失败')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3">
          租赁商品管理
        </h1>
        <p class="text-gray-600 text-lg">高效管理您的租赁商品库存和状态</p>
      </div>

      <FilterBar
        v-model:active-status="productStore.currentStatus"
        :counts="productStore.counts"
        :selected-count="productStore.selectedCount"
        @batch-action="handleBatchAction"
      />

      <div v-if="productStore.loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent shadow-lg"></div>
      </div>

      <div v-else>
        <div v-if="productStore.filteredProducts.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm">
          <div class="text-8xl mb-6">📦</div>
          <div class="text-2xl text-gray-600 font-medium mb-3">暂无商品</div>
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
        class="mt-8 bg-white rounded-xl p-6 shadow-sm"
      >
        <div class="flex items-center justify-between text-sm text-gray-600">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-2">
              <span class="font-semibold">共</span>
              <span class="text-blue-600 font-bold text-lg">{{ productStore.pagination.total }}</span>
              <span class="font-semibold">个商品</span>
            </span>
            <span class="text-gray-300">|</span>
            <span class="flex items-center gap-2">
              <span class="font-semibold">当前显示</span>
              <span class="text-green-600 font-bold text-lg">{{ productStore.filteredProducts.length }}</span>
              <span class="font-semibold">个</span>
            </span>
            <span v-if="productStore.selectedCount > 0" class="text-gray-300">|</span>
            <span v-if="productStore.selectedCount > 0" class="flex items-center gap-2">
              <span class="text-orange-500 font-bold">{{ productStore.selectedCount }}</span>
              <span class="text-gray-600">个已选中</span>
            </span>
          </div>

          <div class="text-gray-400">
            筛选状态: <span class="font-semibold text-gray-700">{{ productStore.currentStatus === 'all' ? '全部' : productStore.currentStatus }}</span>
          </div>
        </div>
      </div>
    </div>

    <ProductEditDialog
      v-model:visible="editDialogVisible"
      :product="currentProduct"
      @save="handleSaveProduct"
    />

    <ProductDetailDialog
      v-model:visible="detailDialogVisible"
      :product="currentProduct"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 1600px;
}
</style>
