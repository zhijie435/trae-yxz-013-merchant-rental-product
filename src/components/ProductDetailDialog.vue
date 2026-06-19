<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElImage, ElTag, ElDivider, ElIcon, ElInputNumber, ElCheckbox, ElButton } from 'element-plus'
import { Document, List, Setting, Collection, Van, ShoppingCart, Money } from '@element-plus/icons-vue'
import type { Product } from '@/types/product'
import { STATUS_CONFIG, RENTAL_METHOD_OPTIONS, MINIMUM_RENTAL_TIME_OPTIONS, DELIVERY_METHOD_OPTIONS } from '@/types/product'

interface Props {
  visible: boolean
  product?: Product | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'order', orderData: OrderData): void
}

interface OrderData {
  productId: number
  quantity: number
  rentalDays: number
  waiveDeposit: boolean
  totalAmount: number
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const orderQuantity = ref(1)
const rentalDays = ref(1)
const waiveDeposit = ref(false)

watch(() => props.visible, (val) => {
  if (val) {
    orderQuantity.value = 1
    rentalDays.value = 1
    waiveDeposit.value = false
  }
})

const statusInfo = computed(() => {
  if (props.product) {
    return STATUS_CONFIG[props.product.status]
  }
  return { label: '', type: 'info' as const }
})

const rentalFee = computed(() => {
  if (!props.product) return 0
  return props.product.price * rentalDays.value * orderQuantity.value
})

const depositFee = computed(() => {
  if (!props.product?.rentalConfig || waiveDeposit.value) return 0
  return props.product.rentalConfig.depositAmount * orderQuantity.value
})

const serviceFee = computed(() => {
  if (!props.product?.deliveryConfig) return 0
  if (props.product.deliveryConfig.method === 'installer') {
    return props.product.deliveryConfig.serviceFee || 0
  }
  return 0
})

const totalAmount = computed(() => {
  return rentalFee.value + depositFee.value + serviceFee.value
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

const handleOrder = () => {
  if (!props.product) return
  
  const orderData: OrderData = {
    productId: props.product.id,
    quantity: orderQuantity.value,
    rentalDays: rentalDays.value,
    waiveDeposit: waiveDeposit.value,
    totalAmount: totalAmount.value
  }
  
  emit('order', orderData)
  handleClose()
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

        <div class="detail-section order-section" v-if="product.status === 'online' && product.stock > 0">
          <h3 class="section-title">
            <el-icon><ShoppingCart /></el-icon>
            租赁下单
          </h3>
          
          <div class="order-form">
            <div class="order-form-item">
              <div class="order-form-label">租赁数量</div>
              <el-input-number
                v-model="orderQuantity"
                :min="product.rentalConfig?.minimumQuantity || 1"
                :max="product.stock"
                :step="1"
                controls-position="right"
                class="w-full"
              />
              <span class="ml-2 text-gray-500 text-sm">台</span>
            </div>

            <div class="order-form-item">
              <div class="order-form-label">租赁天数</div>
              <el-input-number
                v-model="rentalDays"
                :min="1"
                :max="365"
                :step="1"
                controls-position="right"
                class="w-full"
              />
              <span class="ml-2 text-gray-500 text-sm">天</span>
            </div>

            <div class="order-form-item waive-deposit-item">
              <el-checkbox v-model="waiveDeposit" class="waive-checkbox">
                <span class="waive-checkbox-label">申请免押</span>
              </el-checkbox>
              <div class="text-xs text-gray-400 mt-1">
                免押可不支付押金，降低租赁成本
              </div>
            </div>
          </div>

          <el-divider />

          <h4 class="section-subtitle">
            <el-icon><Money /></el-icon>
            费用明细
          </h4>
          
          <div class="fee-details">
            <div class="fee-item">
              <div class="fee-label">租金费用</div>
              <div class="fee-value">
                ¥{{ rentalFee.toFixed(2) }}
              </div>
              <div class="fee-desc">
                ({{ product.price }}元/天 × {{ rentalDays }}天 × {{ orderQuantity }}台)
              </div>
            </div>

            <div class="fee-item" v-if="depositFee > 0">
              <div class="fee-label">押金</div>
              <div class="fee-value">
                ¥{{ depositFee.toFixed(2) }}
              </div>
              <div class="fee-desc">
                ({{ product.rentalConfig?.depositAmount }}元 × {{ orderQuantity }}台)
              </div>
            </div>

            <div class="fee-item" v-else-if="waiveDeposit">
              <div class="fee-label">押金</div>
              <div class="fee-value text-green-500">
                已免押
              </div>
              <div class="fee-desc text-green-500">
                免押优惠节省 ¥{{ (product.rentalConfig?.depositAmount || 0) * orderQuantity }} 元
              </div>
            </div>

            <div class="fee-item" v-if="serviceFee > 0">
              <div class="fee-label">服务费</div>
              <div class="fee-value">
                ¥{{ serviceFee.toFixed(2) }}
              </div>
              <div class="fee-desc">
                (专业操作员服务费)
              </div>
            </div>

            <el-divider />

            <div class="fee-total">
              <div class="fee-total-label">应付总额</div>
              <div class="fee-total-value">
                ¥{{ totalAmount.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button 
          v-if="product && product.status === 'online' && product.stock > 0"
          type="primary" 
          @click="handleOrder"
          size="large"
        >
          <el-icon class="mr-1"><ShoppingCart /></el-icon>
          立即下单
        </el-button>
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

.order-section {
  background: linear-gradient(135deg, #f0f9eb 0%, #e8f5e9 100%);
  border: 2px solid #67c23a;
}

.order-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.order-form-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-form-label {
  flex: 0 0 80px;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.waive-deposit-item {
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.waive-checkbox {
  font-weight: 600;
}

.waive-checkbox-label {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.fee-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.fee-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.fee-item:hover {
  border-color: #67c23a;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.1);
}

.fee-label {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
  margin-bottom: 4px;
}

.fee-value {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
}

.fee-desc {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
}

.fee-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border-radius: 8px;
  margin-top: 8px;
}

.fee-total-label {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.fee-total-value {
  font-size: 24px;
  font-weight: 800;
  color: white;
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
