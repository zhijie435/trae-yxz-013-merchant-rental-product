<script setup lang="ts">
import { computed } from 'vue'
import { ElCard, ElImage, ElButton, ElTag, ElCheckbox } from 'element-plus'
import type { Product } from '@/types/product'
import { STATUS_CONFIG } from '@/types/product'
import {
  Top,
  Bottom,
  Delete,
  View,
  Edit
} from '@element-plus/icons-vue'

interface Props {
  product: Product
  selected: boolean
}

interface Emits {
  (e: 'update:selected', value: boolean): void
  (e: 'status-change', status: 'online' | 'offline'): void
  (e: 'delete'): void
  (e: 'view'): void
  (e: 'edit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const statusInfo = computed(() => STATUS_CONFIG[props.product.status])

const handleSelect = (value: boolean) => {
  emit('update:selected', value)
}

const handleStatusChange = (status: 'online' | 'offline') => {
  emit('status-change', status)
}

const handleDelete = () => {
  emit('delete')
}

const handleView = () => {
  emit('view')
}

const handleEdit = () => {
  emit('edit')
}

const formatPrice = (price: number) => {
  return `¥${price.toFixed(2)}`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<template>
  <el-card
    class="product-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    :body-style="{ padding: '0px' }"
    shadow="hover"
  >
    <div class="relative">
      <el-image
        :src="product.images[0] || '/placeholder.png'"
        class="w-full h-48 object-cover"
        fit="cover"
        :preview-src-list="product.images"
        :initial-index="0"
      />
      <div class="absolute top-2 left-2">
        <el-checkbox
          :model-value="selected"
          @update:model-value="handleSelect"
          @click.stop
          class="bg-white rounded px-2 py-1 shadow-sm"
        >
          选择
        </el-checkbox>
      </div>
      <div class="absolute top-2 right-2">
        <el-tag :type="statusInfo.type" effect="dark" class="font-medium">
          {{ statusInfo.label }}
        </el-tag>
      </div>
    </div>

    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2 line-clamp-2 text-gray-800">
        {{ product.name }}
      </h3>

      <p class="text-sm text-gray-500 mb-3 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between mb-3">
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-red-500">
            {{ formatPrice(product.price) }}
          </span>
          <span class="text-xs text-gray-400">日租金</span>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-600">
            库存: <span class="font-semibold">{{ product.stock }}</span>
          </div>
          <div class="text-xs text-gray-400">
            {{ product.category }}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs text-gray-400 mb-3">
        <span>创建时间: {{ formatDate(product.createTime) }}</span>
      </div>

      <div class="flex gap-2">
        <el-button
          v-if="product.status === 'offline'"
          type="success"
          size="small"
          class="flex-1"
          @click.stop="handleStatusChange('online')"
        >
          <el-icon class="mr-1"><Top /></el-icon>
          上架
        </el-button>
        <el-button
          v-if="product.status === 'online'"
          type="info"
          size="small"
          class="flex-1"
          @click.stop="handleStatusChange('offline')"
        >
          <el-icon class="mr-1"><Bottom /></el-icon>
          下架
        </el-button>
        <el-button
          type="primary"
          size="small"
          class="flex-1"
          @click.stop="handleView"
        >
          <el-icon class="mr-1"><View /></el-icon>
          查看
        </el-button>
        <el-button
          type="warning"
          size="small"
          class="flex-1"
          @click.stop="handleEdit"
        >
          <el-icon class="mr-1"><Edit /></el-icon>
          编辑
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click.stop="handleDelete"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.product-card {
  @apply border-2 border-gray-100;
}

.product-card:hover {
  @apply border-blue-300;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
