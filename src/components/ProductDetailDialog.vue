<script setup lang="ts">
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElImage, ElTag, ElDivider } from 'element-plus'
import type { Product } from '@/types/product'
import { STATUS_CONFIG } from '@/types/product'

interface Props {
  visible: boolean
  product?: Product | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const statusInfo = computed(() => {
  if (props.product) {
    return STATUS_CONFIG[props.product.status]
  }
  return { label: '', type: 'info' as const }
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleClose = () => {
  emit('update:visible', false)
}

import { computed } from 'vue'
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    title="商品详情"
    width="700px"
    @close="handleClose"
  >
    <div v-if="product">
      <div class="mb-4">
        <el-image
          v-if="product.images.length > 0"
          :src="product.images[0]"
          :preview-src-list="product.images"
          fit="cover"
          class="w-full h-64 rounded-lg"
        />
        <div v-else class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <span class="text-gray-400">暂无图片</span>
        </div>
      </div>

      <el-divider />

      <el-descriptions :column="2" border>
        <el-descriptions-item label="商品名称" :span="2">
          <span class="font-bold">{{ product.name }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="商品分类">
          <el-tag size="small">{{ product.category }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="商品状态">
          <el-tag :type="statusInfo.type" size="small" effect="dark">
            {{ statusInfo.label }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="租赁价格">
          <span class="text-red-500 font-bold text-xl">
            ¥{{ product.price.toFixed(2) }}/天
          </span>
        </el-descriptions-item>

        <el-descriptions-item label="库存数量">
          <span :class="product.stock > 0 ? 'text-green-500' : 'text-red-500'" class="font-bold">
            {{ product.stock }}
          </span>
        </el-descriptions-item>

        <el-descriptions-item label="商品描述" :span="2">
          <div class="text-gray-600">{{ product.description || '暂无描述' }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="创建时间">
          {{ formatDate(product.createTime) }}
        </el-descriptions-item>

        <el-descriptions-item label="更新时间">
          {{ formatDate(product.updateTime) }}
        </el-descriptions-item>

        <el-descriptions-item label="商品ID">
          <span class="text-gray-400">#{{ product.id }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="图片数量">
          {{ product.images.length }} 张
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
