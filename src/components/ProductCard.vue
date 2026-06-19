<script setup lang="ts">
import { computed } from 'vue'
import { ElCard, ElImage, ElButton, ElTag, ElCheckbox, ElTooltip, ElDivider } from 'element-plus'
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
</script>

<template>
  <el-card
    class="product-card transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
    :body-style="{ padding: '0px' }"
    shadow="hover"
  >
    <div class="relative overflow-hidden">
      <el-image
        :src="product.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'"
        class="w-full h-52 object-cover transition-transform duration-500 hover:scale-110"
        fit="cover"
        :preview-src-list="product.images"
        :initial-index="0"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

      <div class="absolute top-3 left-3 flex gap-2">
        <el-checkbox
          :model-value="selected"
          @update:model-value="handleSelect"
          @click.stop
          class="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg hover:bg-white transition-colors"
        >
          <span class="text-sm font-medium">选择</span>
        </el-checkbox>
      </div>

      <div class="absolute top-3 right-3">
        <el-tag :type="statusInfo.type" effect="dark" size="large" class="font-bold shadow-lg">
          {{ statusInfo.label }}
        </el-tag>
      </div>

      <div class="absolute bottom-3 right-3" v-if="product.stock > 0">
        <el-tag type="info" size="small" effect="plain" class="bg-white/95 backdrop-blur-sm">
          库存: {{ product.stock }}
        </el-tag>
      </div>
      <div class="absolute bottom-3 right-3" v-else>
        <el-tag type="danger" size="small" effect="dark" class="font-bold">
          缺货
        </el-tag>
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-center gap-2 mb-3">
        <el-tag size="small" effect="plain" class="font-medium">
          {{ product.category }}
        </el-tag>
        <el-tag size="small" type="info" effect="plain" v-if="product.brand">
          {{ product.brand }}
        </el-tag>
      </div>

      <h3 class="text-lg font-bold mb-2 line-clamp-2 text-gray-800 leading-tight hover:text-blue-600 transition-colors">
        {{ product.name }}
      </h3>

      <div class="text-xs text-gray-400 mb-3 flex items-center gap-2">
        <span v-if="product.model">型号: {{ product.model }}</span>
        <span v-if="product.subCategory">| {{ product.subCategory }}</span>
      </div>

      <p class="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
        {{ product.description }}
      </p>

      <el-divider class="my-3" />

      <div class="flex items-end justify-between mb-4">
        <div class="flex flex-col">
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-extrabold text-gradient bg-gradient-to-r from-red-500 to-orange-500">
              {{ formatPrice(product.price) }}
            </span>
          </div>
          <span class="text-xs text-gray-400 mt-1">元/天</span>
        </div>

        <div class="text-right">
          <div class="text-xs text-gray-400">租赁价格</div>
        </div>
      </div>

      <el-divider class="my-3" />

      <div class="flex gap-2">
        <el-button
          v-if="product.status === 'offline'"
          type="success"
          size="default"
          class="flex-1 font-bold shadow-md hover:shadow-lg transition-shadow"
          @click.stop="handleStatusChange('online')"
        >
          <el-icon class="mr-1"><Top /></el-icon>
          上架
        </el-button>
        <el-button
          v-if="product.status === 'online'"
          type="default"
          size="default"
          class="flex-1 font-bold shadow-md hover:shadow-lg transition-shadow"
          @click.stop="handleStatusChange('offline')"
        >
          <el-icon class="mr-1"><Bottom /></el-icon>
          下架
        </el-button>
      </div>

      <div class="flex gap-2 mt-2">
        <el-button
          type="primary"
          size="default"
          class="flex-1"
          @click.stop="handleEdit"
        >
          <el-icon class="mr-1"><Edit /></el-icon>
          编辑
        </el-button>
        <el-button
          type="info"
          size="default"
          class="flex-1"
          @click.stop="handleView"
        >
          <el-icon class="mr-1"><View /></el-icon>
          查看
        </el-button>
        <el-tooltip content="删除商品" placement="top">
          <el-button
            type="danger"
            size="default"
            @click.stop="handleDelete"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.product-card {
  @apply border-2 border-gray-100 rounded-xl;
}

.product-card:hover {
  @apply border-blue-400;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
