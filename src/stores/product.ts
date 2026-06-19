import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Product,
  ProductStatus,
  ProductCounts,
  Pagination,
  BatchAction
} from '@/types/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const currentStatus = ref<ProductStatus>('all')
  const pagination = ref<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })
  const loading = ref(false)
  const selectedProducts = ref<Set<number>>(new Set())

  const counts = computed<ProductCounts>(() => {
    const all = products.value.length
    const online = products.value.filter(p => p.status === 'online').length
    const pending = products.value.filter(p => p.status === 'pending').length
    const approved = products.value.filter(p => p.status === 'approved').length
    const rejected = products.value.filter(p => p.status === 'rejected').length
    const offline = products.value.filter(p => p.status === 'offline').length

    return { all, online, pending, approved, rejected, offline }
  })

  const filteredProducts = computed(() => {
    if (currentStatus.value === 'all') {
      return products.value
    }
    return products.value.filter(p => p.status === currentStatus.value)
  })

  const selectedCount = computed(() => selectedProducts.value.size)

  const isSelected = (productId: number) => selectedProducts.value.has(productId)

  const setCurrentStatus = (status: ProductStatus) => {
    currentStatus.value = status
    pagination.value.page = 1
  }

  const setProducts = (newProducts: Product[]) => {
    products.value = newProducts
  }

  const setPagination = (newPagination: Pagination) => {
    pagination.value = newPagination
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const toggleSelection = (productId: number) => {
    if (selectedProducts.value.has(productId)) {
      selectedProducts.value.delete(productId)
    } else {
      selectedProducts.value.add(productId)
    }
  }

  const selectAll = () => {
    filteredProducts.value.forEach(p => {
      selectedProducts.value.add(p.id)
    })
  }

  const clearSelection = () => {
    selectedProducts.value.clear()
  }

  const updateProductStatus = (productId: number, status: 'online' | 'offline') => {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product.status = status
    }
  }

  const deleteProduct = (productId: number) => {
    const index = products.value.findIndex(p => p.id === productId)
    if (index > -1) {
      products.value.splice(index, 1)
      selectedProducts.value.delete(productId)
    }
  }

  const batchUpdateStatus = (productIds: number[], status: 'online' | 'offline') => {
    productIds.forEach(id => {
      updateProductStatus(id, status)
      selectedProducts.value.delete(id)
    })
  }

  const batchDelete = (productIds: number[]) => {
    productIds.forEach(id => {
      deleteProduct(id)
    })
  }

  return {
    products,
    currentStatus,
    pagination,
    loading,
    selectedProducts,
    counts,
    filteredProducts,
    selectedCount,
    isSelected,
    setCurrentStatus,
    setProducts,
    setPagination,
    setLoading,
    toggleSelection,
    selectAll,
    clearSelection,
    updateProductStatus,
    deleteProduct,
    batchUpdateStatus,
    batchDelete
  }
})
