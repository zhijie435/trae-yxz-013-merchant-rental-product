<script setup lang="ts">
import { computed } from 'vue'
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElImage, ElTag, ElDivider, ElIcon } from 'element-plus'
import { Document, List } from '@element-plus/icons-vue'
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
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    title="商品详情"
    width="900px"
    @close="handleClose"
  >
    <div v-if="product">
      <el-image
        v-if="product.images.length > 0"
        :src="product.images[0]"
        :preview-src-list="product.images"
        fit="cover"
        class="w-full h-64 rounded-lg mb-4"
      />
      <div v-else class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <span class="text-gray-400">暂无图片</span>
      </div>

      <el-divider />

      <div class="detail-layout">
        <div class="detail-section product-info">
          <h3 class="section-title">
            <el-icon><Document /></el-icon>
            商品详情
          </h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="商品名称">
              <span class="font-bold">{{ product.name }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="商品分类">
              <el-tag size="small">{{ product.category }}</el-tag>
              <el-tag size="small" type="info" class="ml-2" v-if="product.subCategory">
                {{ product.subCategory }}
              </el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="商品状态">
              <el-tag :type="statusInfo.type" size="small" effect="dark">
                {{ statusInfo.label }}
              </el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="品牌">
              {{ product.brand || '暂无' }}
            </el-descriptions-item>

            <el-descriptions-item label="型号">
              {{ product.model || '暂无' }}
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

            <el-descriptions-item label="商品描述">
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

        <div class="detail-section specifications" v-if="product.specifications && product.specifications.length > 0">
          <h3 class="section-title">
            <el-icon><List /></el-icon>
            规格参数
          </h3>
          <div class="spec-list">
            <div
              v-for="(spec, index) in product.specifications"
              :key="index"
              class="spec-item"
            >
              <div class="spec-label">{{ spec.label }}</div>
              <div class="spec-value">{{ spec.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.detail-section {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #409eff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec-item {
  display: flex;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.spec-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.spec-label {
  flex: 0 0 120px;
  font-weight: 600;
  color: #606266;
  font-size: 14px;
  padding-right: 12px;
  border-right: 1px solid #e4e7ed;
}

.spec-value {
  flex: 1;
  color: #303133;
  font-size: 14px;
  padding-left: 12px;
}

@media (max-width: 768px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}

.dialog-footer {
  text-align: right;
}
</style>
