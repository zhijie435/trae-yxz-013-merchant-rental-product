<script setup lang="ts">
import { computed } from 'vue'
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElImage, ElTag, ElDivider, ElIcon } from 'element-plus'
import { Document, List, Setting, Collection, Van } from '@element-plus/icons-vue'
import type { Product } from '@/types/product'
import { STATUS_CONFIG, RENTAL_METHOD_OPTIONS, MINIMUM_RENTAL_TIME_OPTIONS, DELIVERY_METHOD_OPTIONS } from '@/types/product'

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

const getRentalMethodLabel = (value: string) => {
  const method = RENTAL_METHOD_OPTIONS.find(m => m.value === value)
  return method?.label || value
}

const getMinimumRentalTimeLabel = (value: string) => {
  const time = MINIMUM_RENTAL_TIME_OPTIONS.find(t => t.value === value)
  return time?.label || value
}

const getDeliveryMethodLabel = (value: string) => {
  const method = DELIVERY_METHOD_OPTIONS.find(m => m.value === value)
  return method?.label || value
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

        <div class="detail-section specifications">
          <h3 class="section-title">
            <el-icon><List /></el-icon>
            规格参数
          </h3>
          <div v-if="product.specifications && product.specifications.length > 0" class="spec-list">
            <div
              v-for="(spec, index) in product.specifications"
              :key="index"
              class="spec-item"
            >
              <div class="spec-label">{{ spec.label }}</div>
              <div class="spec-value">{{ spec.value }}</div>
            </div>
          </div>
          <div v-else class="spec-empty">
            <span class="text-gray-400">暂无规格参数</span>
          </div>

          <el-divider v-if="product.rentalConfig?.specificationOptions && product.rentalConfig.specificationOptions.length > 0" />

          <h3 v-if="product.rentalConfig?.specificationOptions && product.rentalConfig.specificationOptions.length > 0" class="section-subtitle">
            <el-icon><Collection /></el-icon>
            规格选择
          </h3>
          <div v-if="product.rentalConfig?.specificationOptions && product.rentalConfig.specificationOptions.length > 0" class="spec-options-list">
            <div
              v-for="(specOpt, index) in product.rentalConfig.specificationOptions"
              :key="index"
              class="spec-option-item"
            >
              <div class="spec-option-label">{{ specOpt.label }}</div>
              <div class="spec-option-values">
                <el-tag
                  v-for="(value, valueIndex) in specOpt.values"
                  :key="valueIndex"
                  size="small"
                  type="info"
                  class="spec-value-tag"
                >
                  {{ value }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section rental-config" v-if="product.rentalConfig">
          <h3 class="section-title">
            <el-icon><Setting /></el-icon>
            租赁配置
          </h3>
          <div class="rental-info">
            <div class="rental-info-item">
              <div class="rental-info-label">起租台数</div>
              <div class="rental-info-value">
                {{ product.rentalConfig.minimumQuantity }} 台
              </div>
            </div>

            <div class="rental-info-item">
              <div class="rental-info-label">租赁方式</div>
              <div class="rental-info-value">
                <el-tag type="success" size="small">
                  {{ getRentalMethodLabel(product.rentalConfig.rentalMethod) }}
                </el-tag>
              </div>
            </div>

            <div class="rental-info-item">
              <div class="rental-info-label">起租时间规则</div>
              <div class="rental-info-value">
                <el-tag type="warning" size="small">
                  {{ getMinimumRentalTimeLabel(product.rentalConfig.minimumRentalTime) }}
                </el-tag>
              </div>
            </div>

            <div class="rental-info-item">
              <div class="rental-info-label">押金设置</div>
              <div class="rental-info-value">
                <span class="text-red-500 font-bold text-lg">
                  ¥{{ product.rentalConfig.depositAmount.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <template v-if="product.deliveryConfig">
            <el-divider />
            <h3 class="section-subtitle">
              <el-icon><Van /></el-icon>
              交付设置
            </h3>
            <div class="delivery-info">
              <div class="delivery-info-item">
                <div class="delivery-info-label">交付方式</div>
                <div class="delivery-info-value">
                  <el-tag :type="product.deliveryConfig.method === 'express' ? 'primary' : 'success'" size="small">
                    {{ getDeliveryMethodLabel(product.deliveryConfig.method) }}
                  </el-tag>
                </div>
              </div>

              <template v-if="product.deliveryConfig.method === 'express'">
                <div class="delivery-info-item">
                  <div class="delivery-info-label">快递公司</div>
                  <div class="delivery-info-value">
                    {{ product.deliveryConfig.expressCompany || '未设置' }}
                  </div>
                </div>

                <div class="delivery-info-item">
                  <div class="delivery-info-label">快递单号</div>
                  <div class="delivery-info-value">
                    {{ product.deliveryConfig.trackingNumber || '未设置' }}
                  </div>
                </div>

                <div class="delivery-info-item">
                  <div class="delivery-info-label">预计配送天数</div>
                  <div class="delivery-info-value">
                    {{ product.deliveryConfig.estimatedDeliveryDays }} 天
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="delivery-info-item">
                  <div class="delivery-info-label">操作员姓名</div>
                  <div class="delivery-info-value">
                    {{ product.deliveryConfig.installerName || '未设置' }}
                  </div>
                </div>

                <div class="delivery-info-item">
                  <div class="delivery-info-label">联系电话</div>
                  <div class="delivery-info-value">
                    {{ product.deliveryConfig.installerPhone || '未设置' }}
                  </div>
                </div>

                <div class="delivery-info-item">
                  <div class="delivery-info-label">服务费用</div>
                  <div class="delivery-info-value">
                    <span class="text-red-500 font-bold">
                      ¥{{ (product.deliveryConfig.serviceFee || 0).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <div class="delivery-info-item" v-if="product.deliveryConfig.serviceDescription">
                  <div class="delivery-info-label">服务说明</div>
                  <div class="delivery-info-value">
                    {{ product.deliveryConfig.serviceDescription }}
                  </div>
                </div>
              </template>
            </div>
          </template>
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
  grid-template-columns: 1fr 1fr 1fr;
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

.spec-empty {
  text-align: center;
  padding: 24px;
  color: #909399;
  font-size: 14px;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin-top: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.spec-option-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.spec-option-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.spec-option-label {
  font-weight: 600;
  color: #606266;
  font-size: 13px;
  margin-bottom: 8px;
}

.spec-option-values {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.spec-value-tag {
  margin: 2px;
}

.rental-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rental-info-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.rental-info-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.rental-info-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
  font-weight: 500;
}

.rental-info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.delivery-info-item {
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.delivery-info-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.delivery-info-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
  font-weight: 500;
}

.delivery-info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .detail-layout {
    grid-template-columns: 1fr 1fr;
  }
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
