<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElButton, ElMessage, ElImage, ElIcon, ElSwitch, ElDivider, ElCollapse, ElCollapseItem, ElTabs, ElTabPane } from 'element-plus'
import { Plus, Delete, VideoPlay, InfoFilled, Setting, PriceTag, Wallet, Van, DocumentChecked, Check, Refresh, RefreshRight } from '@element-plus/icons-vue'
import type { Product } from '@/types/product'
import { CATEGORY_OPTIONS, BRAND_OPTIONS, RENTAL_METHOD_OPTIONS, MINIMUM_RENTAL_TIME_OPTIONS, EXPRESS_COMPANY_OPTIONS, DELIVERY_METHOD_OPTIONS, WASHING_INSTRUCTIONS_OPTIONS, SIZE_OPTIONS, COLOR_OPTIONS, DEPOSIT_TIER_PRESETS, TIERED_PRICE_PRESETS } from '@/types/product'
import type { ProductSpecification, RentalConfig, SpecificationOption, DeliveryConfig, TieredPrice, DepositTier, ProductAttributes, ProductCode } from '@/types/product'

interface Props {
  visible: boolean
  product?: Product | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', product: Partial<Product>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const createDefaultRentalConfig = (): RentalConfig => ({
  minimumQuantity: 1,
  rentalMethod: 'daily',
  minimumRentalTime: 'none',
  tieredPricingEnabled: false,
  tieredPrices: [],
  specificationOptions: [],
  depositConfig: {
    baseAmount: 0,
    suggestedAmount: 0,
    maxWaiveAmount: 0,
    tiers: JSON.parse(JSON.stringify(DEPOSIT_TIER_PRESETS))
  }
})

const createDefaultDeliveryConfig = (): DeliveryConfig => ({
  method: 'pickup',
  pickupConfig: {
    storeName: '',
    storeAddress: '',
    storePhone: '',
    availableSlots: []
  }
})

const createDefaultAttributes = (): ProductAttributes => ({
  origin: '',
  material: '',
  washingInstructions: '',
  size: '',
  color: '',
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0
  }
})

const formData = ref<Partial<Product>>({
  code: {
    code: '',
    barcode: '',
    qrCode: ''
  },
  name: '',
  brand: '',
  model: '',
  category: '',
  subCategory: '',
  description: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  images: [],
  video: '',
  specifications: [],
  attributes: createDefaultAttributes(),
  rentalConfig: createDefaultRentalConfig(),
  deliveryConfig: createDefaultDeliveryConfig()
})

const newImageUrl = ref('')
const newVideoUrl = ref('')
const formRef = ref()
const activeTab = ref('basic')

watch(() => props.visible, (val) => {
  if (val && props.product) {
    formData.value = {
      ...props.product,
      code: props.product.code || { code: '', barcode: '', qrCode: '' },
      images: props.product.images || [],
      video: props.product.video || '',
      specifications: props.product.specifications || [],
      attributes: props.product.attributes || createDefaultAttributes(),
      rentalConfig: props.product.rentalConfig || createDefaultRentalConfig(),
      deliveryConfig: props.product.deliveryConfig || createDefaultDeliveryConfig()
    }
  } else {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    code: {
      code: '',
      barcode: '',
      qrCode: ''
    },
    name: '',
    brand: '',
    model: '',
    category: '',
    subCategory: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    images: [],
    video: '',
    specifications: [],
    attributes: createDefaultAttributes(),
    rentalConfig: createDefaultRentalConfig(),
    deliveryConfig: createDefaultDeliveryConfig()
  }
  newImageUrl.value = ''
  newVideoUrl.value = ''
  formRef.value?.resetFields()
}

const handleClose = () => {
  emit('update:visible', false)
  resetForm()
}

const handleSave = async () => {
  if (!formData.value.name) {
    ElMessage.warning('请输入商品名称')
    return
  }
  if (!formData.value.brand) {
    ElMessage.warning('请选择品牌')
    return
  }
  if (!formData.value.category) {
    ElMessage.warning('请选择产品分类')
    return
  }
  if (!formData.value.price || formData.value.price <= 0) {
    ElMessage.warning('请输入有效的价格')
    return
  }

  emit('save', formData.value)
  handleClose()
  ElMessage.success('商品信息保存成功')
}

const handleImageAdd = (url?: string) => {
  const imageUrl = url || newImageUrl.value.trim()
  if (!imageUrl) {
    ElMessage.warning('请输入图片URL')
    return
  }

  if (!formData.value.images) {
    formData.value.images = []
  }

  if (formData.value.images.length < 10) {
    formData.value.images.push(imageUrl)
    newImageUrl.value = ''
    ElMessage.success('图片添加成功')
  } else {
    ElMessage.warning('最多只能添加10张图片')
  }
}

const handleImageRemove = (index: number) => {
  if (formData.value.images) {
    formData.value.images.splice(index, 1)
    ElMessage.success('图片移除成功')
  }
}

const handleVideoAdd = (url?: string) => {
  const videoUrl = url || newVideoUrl.value.trim()
  if (!videoUrl) {
    ElMessage.warning('请输入视频URL')
    return
  }

  formData.value.video = videoUrl
  newVideoUrl.value = ''
  ElMessage.success('视频添加成功')
}

const handleVideoRemove = () => {
  formData.value.video = ''
  ElMessage.success('视频移除成功')
}

const handleCategoryChange = (value: string | string[]) => {
  if (Array.isArray(value)) {
    formData.value.category = value[0] || ''
    formData.value.subCategory = value[1] || ''
  } else {
    formData.value.category = value
  }
}

const handleSpecificationAdd = () => {
  if (!formData.value.specifications) {
    formData.value.specifications = []
  }
  formData.value.specifications.push({
    label: '',
    value: ''
  })
}

const handleSpecificationRemove = (index: number) => {
  if (formData.value.specifications) {
    formData.value.specifications.splice(index, 1)
  }
}

const handleSpecOptionAdd = () => {
  if (!formData.value.rentalConfig) {
    formData.value.rentalConfig = createDefaultRentalConfig()
  }
  if (!formData.value.rentalConfig.specificationOptions) {
    formData.value.rentalConfig.specificationOptions = []
  }
  formData.value.rentalConfig.specificationOptions.push({
    label: '',
    values: []
  })
}

const handleSpecOptionRemove = (index: number) => {
  if (formData.value.rentalConfig?.specificationOptions) {
    formData.value.rentalConfig.specificationOptions.splice(index, 1)
  }
}

const handleValueAdd = (specIndex: number) => {
  if (formData.value.rentalConfig?.specificationOptions) {
    formData.value.rentalConfig.specificationOptions[specIndex].values.push({
      label: '',
      price: {
        price: 0,
        originalPrice: 0,
        stock: 0
      },
      tieredPrices: []
    })
  }
}

const handleValueRemove = (specIndex: number, valueIndex: number) => {
  if (formData.value.rentalConfig?.specificationOptions) {
    formData.value.rentalConfig.specificationOptions[specIndex].values.splice(valueIndex, 1)
  }
}

const handleDeliveryMethodChange = (method: 'express' | 'installer' | 'pickup') => {
  if (method === 'pickup') {
    formData.value.deliveryConfig = {
      method: 'pickup',
      pickupConfig: {
        storeName: '',
        storeAddress: '',
        storePhone: '',
        availableSlots: []
      }
    }
  } else if (method === 'express') {
    formData.value.deliveryConfig = {
      method: 'express',
      expressConfig: {
        method: 'express',
        expressCompany: '',
        trackingNumber: '',
        estimatedDeliveryDays: 3,
        deliveryDate: ''
      }
    }
  } else {
    formData.value.deliveryConfig = {
      method: 'installer',
      installerConfig: {
        method: 'installer',
        installerName: '',
        installerPhone: '',
        serviceFee: 0,
        serviceDescription: '',
        availableSlots: []
      }
    }
  }
}

const handleTieredPriceAdd = () => {
  if (!formData.value.rentalConfig) {
    formData.value.rentalConfig = createDefaultRentalConfig()
  }
  if (!formData.value.rentalConfig.tieredPrices) {
    formData.value.rentalConfig.tieredPrices = []
  }
  formData.value.rentalConfig.tieredPrices.push({
    minDays: 1,
    maxDays: 7,
    pricePerDay: 100,
    discount: 0
  })
}

const handleTieredPriceRemove = (index: number) => {
  if (formData.value.rentalConfig?.tieredPrices) {
    formData.value.rentalConfig.tieredPrices.splice(index, 1)
  }
}

const calculateSuggestedDeposit = () => {
  if (!formData.value.price) return 0
  return Math.round(formData.value.price * 0.5)
}

const applyTieredPricingPreset = () => {
  if (!formData.value.rentalConfig) return
  formData.value.rentalConfig.tieredPrices = JSON.parse(JSON.stringify(TIERED_PRICE_PRESETS))
  formData.value.rentalConfig.tieredPrices.forEach(tp => {
    tp.pricePerDay = formData.value.price!
  })
  ElMessage.success('已应用阶梯定价预设')
}

const applyDepositTierPreset = () => {
  if (!formData.value.rentalConfig) return
  const suggestedAmount = calculateSuggestedDeposit()
  formData.value.rentalConfig.depositConfig.suggestedAmount = suggestedAmount
  formData.value.rentalConfig.depositConfig.baseAmount = suggestedAmount
  formData.value.rentalConfig.depositConfig.tiers = JSON.parse(JSON.stringify(DEPOSIT_TIER_PRESETS)).map((tier: DepositTier) => {
    tier.amount = Math.round(suggestedAmount * (1 + tier.damageRatio))
    return tier
  })
  ElMessage.success(`已应用分级押金预设（建议押金：¥${suggestedAmount}）`)
}

const generateProductCode = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  formData.value.code!.code = `PRD-${timestamp}-${random}`
}

const suggestedDeposit = computed(() => calculateSuggestedDeposit())
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="product ? '编辑商品' : '新增商品'"
    width="1000px"
    :close-on-click-modal="false"
    @close="handleClose"
    class="product-edit-dialog"
  >
    <div class="dialog-content">
      <el-tabs v-model="activeTab" class="product-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <el-form
            ref="formRef"
            :model="formData"
            label-width="100px"
            class="product-form"
          >
            <div class="form-section">
              <h3 class="section-title">
                <el-icon><DocumentChecked /></el-icon>
                商品编码信息
              </h3>

              <div class="form-row">
                <el-form-item label="商品编码" class="flex-1">
                  <el-input
                    v-model="formData.code!.code"
                    placeholder="系统自动生成"
                    class="w-full"
                  >
                    <template #append>
                      <el-button @click="generateProductCode" title="生成编码">
                        <el-icon><Refresh /></el-icon>
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item label="条形码" class="flex-1">
                  <el-input
                    v-model="formData.code!.barcode"
                    placeholder="可选"
                    class="w-full"
                  />
                </el-form-item>

                <el-form-item label="二维码" class="flex-1">
                  <el-input
                    v-model="formData.code!.qrCode"
                    placeholder="可选"
                    class="w-full"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">
                <el-icon><DocumentChecked /></el-icon>
                基础信息
              </h3>

              <el-form-item label="商品名称" required>
                <el-input
                  v-model="formData.name"
                  placeholder="请输入商品名称"
                  maxlength="200"
                  show-word-limit
                  class="w-full"
                />
              </el-form-item>

              <div class="form-row">
                <el-form-item label="品牌" required class="flex-1">
                  <el-select
                    v-model="formData.brand"
                    placeholder="请选择品牌"
                    class="w-full"
                    filterable
                    allow-create
                  >
                    <el-option
                      v-for="brand in BRAND_OPTIONS"
                      :key="brand"
                      :label="brand"
                      :value="brand"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="型号" class="flex-1">
                  <el-input
                    v-model="formData.model"
                    placeholder="请输入商品型号"
                    maxlength="50"
                    class="w-full"
                  />
                </el-form-item>
              </div>

              <el-form-item label="产品分类" required>
                <el-cascader
                  v-model="formData.category"
                  :options="CATEGORY_OPTIONS"
                  :props="{ checkStrictly: true, expandTrigger: 'hover' }"
                  placeholder="请选择产品分类"
                  class="w-full"
                  @change="handleCategoryChange"
                />
              </el-form-item>

              <el-form-item label="商品描述">
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入商品描述"
                  maxlength="500"
                  show-word-limit
                  class="w-full"
                />
              </el-form-item>

              <div class="form-row">
                <el-form-item label="租赁价格" required class="flex-1">
                  <el-input-number
                    v-model="formData.price"
                    :min="0"
                    :precision="2"
                    :step="10"
                    controls-position="right"
                    class="w-full"
                  />
                  <span class="ml-2 text-gray-500">元/天</span>
                </el-form-item>

                <el-form-item label="划线价格" class="flex-1">
                  <el-input-number
                    v-model="formData.originalPrice"
                    :min="0"
                    :precision="2"
                    :step="10"
                    controls-position="right"
                    class="w-full"
                  />
                  <span class="ml-2 text-gray-500">元/天</span>
                </el-form-item>

                <el-form-item label="库存数量" class="flex-1">
                  <el-input-number
                    v-model="formData.stock"
                    :min="0"
                    :step="1"
                    controls-position="right"
                    class="w-full"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">
                <el-icon><Setting /></el-icon>
                商品属性
              </h3>

              <div class="form-row">
                <el-form-item label="产地" class="flex-1">
                  <el-input
                    v-model="formData.attributes!.origin"
                    placeholder="如：中国上海"
                    class="w-full"
                  />
                </el-form-item>

                <el-form-item label="材质" class="flex-1">
                  <el-input
                    v-model="formData.attributes!.material"
                    placeholder="如：聚酯纤维"
                    class="w-full"
                  />
                </el-form-item>
              </div>

              <div class="form-row">
                <el-form-item label="尺码" class="flex-1">
                  <el-select
                    v-model="formData.attributes!.size"
                    placeholder="请选择尺码"
                    class="w-full"
                    allow-create
                    filterable
                  >
                    <el-option
                      v-for="size in SIZE_OPTIONS"
                      :key="size"
                      :label="size"
                      :value="size"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="颜色" class="flex-1">
                  <el-select
                    v-model="formData.attributes!.color"
                    placeholder="请选择颜色"
                    class="w-full"
                    allow-create
                    filterable
                  >
                    <el-option
                      v-for="color in COLOR_OPTIONS"
                      :key="color"
                      :label="color"
                      :value="color"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="重量" class="flex-1">
                  <el-input-number
                    v-model="formData.attributes!.weight"
                    :min="0"
                    :precision="2"
                    :step="0.1"
                    controls-position="right"
                    class="w-full"
                  />
                  <span class="ml-2 text-gray-500">kg</span>
                </el-form-item>
              </div>

              <el-form-item label="洗涤说明">
                <el-select
                  v-model="formData.attributes!.washingInstructions"
                  placeholder="请选择洗涤方式"
                  class="w-full"
                  allow-create
                  filterable
                >
                  <el-option
                    v-for="instruction in WASHING_INSTRUCTIONS_OPTIONS"
                    :key="instruction"
                    :label="instruction"
                    :value="instruction"
                  />
                </el-select>
              </el-form-item>

              <div class="form-row" v-if="formData.attributes!.dimensions">
                <el-form-item label="尺寸(cm)" class="flex-1">
                  <div class="dimensions-input">
                    <el-input-number
                      v-model="formData.attributes!.dimensions!.length"
                      :min="0"
                      :precision="1"
                      :step="1"
                      controls-position="right"
                      placeholder="长"
                    />
                    <span class="mx-2">×</span>
                    <el-input-number
                      v-model="formData.attributes!.dimensions!.width"
                      :min="0"
                      :precision="1"
                      :step="1"
                      controls-position="right"
                      placeholder="宽"
                    />
                    <span class="mx-2">×</span>
                    <el-input-number
                      v-model="formData.attributes!.dimensions!.height"
                      :min="0"
                      :precision="1"
                      :step="1"
                      controls-position="right"
                      placeholder="高"
                    />
                  </div>
                </el-form-item>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">
                <el-icon><DocumentChecked /></el-icon>
                商品图片
                <span class="text-xs text-gray-400 ml-2">(最多10张)</span>
              </h3>

              <div class="images-grid">
                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  class="image-item"
                >
                  <el-image
                    :src="image"
                    fit="cover"
                    class="image-preview"
                    :preview-src-list="formData.images"
                    :initial-index="index"
                  />
                  <div class="image-actions">
                    <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="handleImageRemove(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                  <div v-if="index === 0" class="image-badge">主图</div>
                </div>

                <div v-if="!formData.images || formData.images.length < 10" class="image-upload">
                  <el-input
                    v-model="newImageUrl"
                    placeholder="输入图片URL"
                    size="small"
                    class="mb-2 w-full"
                    @keyup.enter="handleImageAdd()"
                  />
                  <el-button type="primary" size="small" @click="handleImageAdd()">
                    <el-icon class="mr-1"><Plus /></el-icon>
                    添加图片
                  </el-button>
                </div>
              </div>

              <div v-if="!formData.images || formData.images.length === 0" class="text-center text-gray-400 py-4">
                暂无图片，请添加图片
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">
                <el-icon><VideoPlay /></el-icon>
                商品视频
                <span class="text-xs text-gray-400 ml-2">(最多1个)</span>
              </h3>

              <div v-if="formData.video" class="video-preview">
                <video
                  :src="formData.video"
                  controls
                  class="video-player"
                />
                <el-button
                  type="danger"
                  size="small"
                  class="video-remove-btn"
                  @click="handleVideoRemove"
                >
                  <el-icon class="mr-1"><Delete /></el-icon>
                  移除视频
                </el-button>
              </div>

              <div v-else class="video-upload">
                <el-input
                  v-model="newVideoUrl"
                  placeholder="输入视频URL"
                  size="default"
                  class="mb-2 w-full"
                  @keyup.enter="handleVideoAdd()"
                />
                <el-button type="primary" @click="handleVideoAdd()">
                  <el-icon class="mr-1"><VideoPlay /></el-icon>
                  添加视频
                </el-button>
              </div>

              <div class="video-tip">
                <el-icon><VideoPlay /></el-icon>
                <span>支持 MP4、WebM 等主流视频格式，建议时长30秒-1分钟</span>
              </div>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="规格与参数" name="specs">
          <el-form
            ref="formRef"
            :model="formData"
            label-width="100px"
            class="product-form"
          >
            <div class="form-section">
              <h3 class="section-title">
                <el-icon><List /></el-icon>
                规格参数
                <span class="text-xs text-gray-400 ml-2">(每行一个参数)</span>
              </h3>

              <div class="spec-list" v-if="formData.specifications && formData.specifications.length > 0">
                <div
                  v-for="(spec, index) in formData.specifications"
                  :key="index"
                  class="spec-item"
                >
                  <el-input
                    v-model="spec.label"
                    placeholder="参数名称"
                    class="spec-input"
                  />
                  <el-input
                    v-model="spec.value"
                    placeholder="参数值"
                    class="spec-input"
                  />
                  <el-button
                    type="danger"
                    size="small"
                    circle
                    @click="handleSpecificationRemove(index)"
                    class="spec-remove-btn"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>

              <div v-else class="spec-empty">
                <span class="text-gray-400">暂无规格参数，请点击下方按钮添加</span>
              </div>

              <div class="spec-actions">
                <el-button
                  type="primary"
                  size="default"
                  @click="handleSpecificationAdd"
                  class="spec-add-btn"
                >
                  <el-icon class="mr-1"><Plus /></el-icon>
                  添加规格参数
                </el-button>
              </div>

              <div class="spec-tip">
                <el-icon><InfoFilled /></el-icon>
                <span>建议添加常用的规格参数，如：材质、尺码、颜色、重量等</span>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">
                <el-icon><PriceTag /></el-icon>
                规格选择配置
                <span class="text-xs text-gray-400 ml-2">(可选，如颜色、尺码等)</span>
              </h3>

              <div class="spec-options-list" v-if="formData.rentalConfig?.specificationOptions && formData.rentalConfig.specificationOptions.length > 0">
                <div
                  v-for="(specOpt, specIndex) in formData.rentalConfig.specificationOptions"
                  :key="specIndex"
                  class="spec-option-item"
                >
                  <div class="spec-option-header">
                    <el-input
                      v-model="specOpt.label"
                      placeholder="规格名称（如：颜色、尺码）"
                      class="spec-option-label-input"
                    />
                    <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="handleSpecOptionRemove(specIndex)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>

                  <div class="spec-values-list">
                    <div
                      v-for="(value, valueIndex) in specOpt.values"
                      :key="valueIndex"
                      class="spec-value-item"
                    >
                      <el-input
                        v-model="specOpt.values[valueIndex].label"
                        placeholder="规格值"
                        class="spec-value-input"
                      />
                      <el-input-number
                        v-model="specOpt.values[valueIndex].price!.price"
                        :min="0"
                        :precision="2"
                        :step="10"
                        controls-position="right"
                        placeholder="价格"
                        class="spec-price-input"
                      />
                      <el-button
                        type="danger"
                        size="small"
                        circle
                        @click="handleValueRemove(specIndex, valueIndex)"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                    <el-button
                      type="primary"
                      size="small"
                      @click="handleValueAdd(specIndex)"
                      class="add-value-btn"
                    >
                      <el-icon class="mr-1"><Plus /></el-icon>
                      添加规格值
                    </el-button>
                  </div>
                </div>
              </div>

              <div v-else class="spec-options-empty">
                <span class="text-gray-400">暂无规格选择配置，如需要请添加（如颜色、尺码等）</span>
              </div>

              <div class="spec-actions">
                <el-button
                  type="primary"
                  size="default"
                  @click="handleSpecOptionAdd"
                  class="spec-add-btn"
                >
                  <el-icon class="mr-1"><Plus /></el-icon>
                  添加规格选项
                </el-button>
              </div>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="租赁配置" name="rental">
          <el-form
            ref="formRef"
            :model="formData"
            label-width="120px"
            class="product-form"
          >
            <div class="form-section">
              <h3 class="section-title">
                <el-icon><Setting /></el-icon>
                基础租赁配置
              </h3>

              <div class="rental-config-form">
                <el-form-item label="起租台数" class="config-item">
                  <el-input-number
                    v-model="formData.rentalConfig!.minimumQuantity"
                    :min="1"
                    :max="999"
                    :step="1"
                    controls-position="right"
                    class="w-full"
                  />
                  <span class="ml-2 text-gray-500 text-sm">台</span>
                </el-form-item>

                <el-form-item label="租赁方式" class="config-item">
                  <el-select
                    v-model="formData.rentalConfig!.rentalMethod"
                    placeholder="请选择租赁方式"
                    class="w-full"
                  >
                    <el-option
                      v-for="method in RENTAL_METHOD_OPTIONS"
                      :key="method.value"
                      :label="method.label"
                      :value="method.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="起租时间规则" class="config-item">
                  <el-select
                    v-model="formData.rentalConfig!.minimumRentalTime"
                    placeholder="请选择起租时间"
                    class="w-full"
                  >
                    <el-option
                      v-for="time in MINIMUM_RENTAL_TIME_OPTIONS"
                      :key="time.value"
                      :label="time.label"
                      :value="time.value"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <div class="rental-config-tip">
                <el-icon><InfoFilled /></el-icon>
                <span>配置租赁的基本规则，包括最低起租数量和计费方式</span>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">
                <el-icon><PriceTag /></el-icon>
                阶梯定价配置
                <el-switch
                  v-model="formData.rentalConfig!.tieredPricingEnabled"
                  class="ml-4"
                  active-text="启用"
                  inactive-text="禁用"
                />
              </h3>

              <div v-if="formData.rentalConfig!.tieredPricingEnabled" class="tiered-pricing-section">
                <div class="tiered-pricing-actions">
                  <el-button type="primary" size="small" @click="applyTieredPricingPreset">
                    <el-icon class="mr-1"><Sparkles /></el-icon>
                    应用预设
                  </el-button>
                  <el-button type="success" size="small" @click="handleTieredPriceAdd">
                    <el-icon class="mr-1"><Plus /></el-icon>
                    添加价格区间
                  </el-button>
                </div>

                <div class="tiered-pricing-list" v-if="formData.rentalConfig!.tieredPrices && formData.rentalConfig!.tieredPrices.length > 0">
                  <div
                    v-for="(tier, index) in formData.rentalConfig!.tieredPrices"
                    :key="index"
                    class="tiered-pricing-item"
                  >
                    <div class="tier-range">
                      <el-input-number
                        v-model="tier.minDays"
                        :min="1"
                        :step="1"
                        controls-position="right"
                        placeholder="起始天数"
                      />
                      <span class="mx-2">至</span>
                      <el-input-number
                        v-model="tier.maxDays"
                        :min="tier.minDays"
                        :step="1"
                        controls-position="right"
                        placeholder="结束天数（空为不限制）"
                      />
                      <span class="ml-2">天</span>
                    </div>
                    <div class="tier-price">
                      <el-input-number
                        v-model="tier.pricePerDay"
                        :min="0"
                        :precision="2"
                        :step="10"
                        controls-position="right"
                      />
                      <span class="ml-2">元/天</span>
                    </div>
                    <div class="tier-discount">
                      <el-input-number
                        v-model="tier.discount"
                        :min="0"
                        :max="100"
                        :step="5"
                        controls-position="right"
                      />
                      <span class="ml-2">% 折扣</span>
                    </div>
                    <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="handleTieredPriceRemove(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>

                <div v-else class="tiered-pricing-empty">
                  <span class="text-gray-400">暂无阶梯定价配置，点击上方按钮添加</span>
                </div>

                <div class="tiered-pricing-tip">
                  <el-icon><InfoFilled /></el-icon>
                  <span>配置不同租赁时长的阶梯价格，长租更优惠</span>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">
                <el-icon><Wallet /></el-icon>
                押金配置
                <span class="ml-4 text-sm text-gray-500">
                  建议押金：¥{{ suggestedDeposit }}
                </span>
              </h3>

              <div class="deposit-config-section">
                <div class="deposit-actions">
                  <el-button type="primary" size="small" @click="applyDepositTierPreset">
                    <el-icon class="mr-1"><Sparkles /></el-icon>
                    应用预设
                  </el-button>
                </div>

                <div class="deposit-form">
                  <el-form-item label="基础押金" class="config-item">
                    <el-input-number
                      v-model="formData.rentalConfig!.depositConfig.baseAmount"
                      :min="0"
                      :precision="2"
                      :step="100"
                      controls-position="right"
                      class="w-full"
                    />
                    <span class="ml-2 text-gray-500 text-sm">元</span>
                  </el-form-item>

                  <el-form-item label="最大免押额度" class="config-item">
                    <el-input-number
                      v-model="formData.rentalConfig!.depositConfig.maxWaiveAmount"
                      :min="0"
                      :precision="2"
                      :step="100"
                      controls-position="right"
                      class="w-full"
                    />
                    <span class="ml-2 text-gray-500 text-sm">元</span>
                  </el-form-item>
                </div>

                <el-divider>分级押金标准</el-divider>

                <div class="deposit-tiers-list">
                  <div
                    v-for="(tier, index) in formData.rentalConfig!.depositConfig.tiers"
                    :key="index"
                    class="deposit-tier-item"
                  >
                    <div class="tier-level">
                      <el-tag :type="tier.level === 'normal' ? 'success' : tier.level === 'minor' ? 'info' : tier.level === 'moderate' ? 'warning' : 'danger'">
                        {{ tier.level === 'normal' ? '正常' : tier.level === 'minor' ? '轻微' : tier.level === 'moderate' ? '一般' : '严重' }}
                      </el-tag>
                      <span class="ml-2">{{ tier.description }}</span>
                    </div>
                    <div class="tier-amount">
                      <el-input-number
                        v-model="tier.amount"
                        :min="0"
                        :precision="2"
                        :step="50"
                        controls-position="right"
                      />
                      <span class="ml-2">元</span>
                    </div>
                    <div class="tier-ratio">
                      <span class="text-gray-500">损坏比例：</span>
                      <el-input-number
                        v-model="tier.damageRatio"
                        :min="0"
                        :max="1"
                        :precision="2"
                        :step="0.1"
                        controls-position="right"
                        size="small"
                      />
                    </div>
                  </div>
                </div>

                <div class="deposit-tip">
                  <el-icon><InfoFilled /></el-icon>
                  <span>配置分级押金标准和损坏赔偿比例，支持差异化押金管理</span>
                </div>
              </div>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="交付设置" name="delivery">
          <el-form
            ref="formRef"
            :model="formData"
            label-width="120px"
            class="product-form"
          >
            <div class="form-section">
              <h3 class="section-title">
                <el-icon><Truck /></el-icon>
                交付方式
                <span class="text-xs text-gray-400 ml-2">(选择交付方式)</span>
              </h3>

              <div class="delivery-method-selector">
                <el-radio-group
                  v-model="formData.deliveryConfig!.method"
                  @change="handleDeliveryMethodChange"
                  class="delivery-method-group"
                >
                  <el-radio-button
                    v-for="method in DELIVERY_METHOD_OPTIONS"
                    :key="method.value"
                    :value="method.value"
                    :label="method.value"
                  >
                    <div class="delivery-method-option">
                      <div class="delivery-method-label">{{ method.label }}</div>
                      <div class="delivery-method-desc">{{ method.description }}</div>
                    </div>
                  </el-radio-button>
                </el-radio-group>
              </div>

              <div v-if="formData.deliveryConfig!.method === 'pickup'" class="delivery-form pickup-form">
                <el-form-item label="门店名称" required class="config-item">
                  <el-input
                    v-model="formData.deliveryConfig!.pickupConfig!.storeName"
                    placeholder="请输入门店名称"
                    class="w-full"
                  />
                </el-form-item>

                <el-form-item label="门店地址" required class="config-item">
                  <el-input
                    v-model="formData.deliveryConfig!.pickupConfig!.storeAddress"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入门店地址"
                    class="w-full"
                  />
                </el-form-item>

                <el-form-item label="联系电话" required class="config-item">
                  <el-input
                    v-model="formData.deliveryConfig!.pickupConfig!.storePhone"
                    placeholder="请输入联系电话"
                    class="w-full"
                  />
                </el-form-item>
              </div>

              <div v-else-if="formData.deliveryConfig!.method === 'express'" class="delivery-form express-form">
                <el-form-item label="快递公司" required class="config-item">
                  <el-select
                    v-model="formData.deliveryConfig!.expressConfig!.expressCompany"
                    placeholder="请选择快递公司"
                    class="w-full"
                    filterable
                    allow-create
                  >
                    <el-option
                      v-for="company in EXPRESS_COMPANY_OPTIONS"
                      :key="company"
                      :label="company"
                      :value="company"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="快递单号" required class="config-item">
                  <el-input
                    v-model="formData.deliveryConfig!.expressConfig!.trackingNumber"
                    placeholder="请输入快递单号"
                    class="w-full"
                  />
                </el-form-item>

                <el-form-item label="预计配送天数" class="config-item">
                  <el-input-number
                    v-model="formData.deliveryConfig!.expressConfig!.estimatedDeliveryDays"
                    :min="1"
                    :max="30"
                    :step="1"
                    controls-position="right"
                    class="w-full"
                  />
                  <span class="ml-2 text-gray-500 text-sm">天</span>
                </el-form-item>

                <el-form-item label="期望配送日期" class="config-item">
                  <el-input
                    v-model="formData.deliveryConfig!.expressConfig!.deliveryDate"
                    type="date"
                    placeholder="选择日期"
                    class="w-full"
                  />
                </el-form-item>
              </div>

              <div v-else-if="formData.deliveryConfig!.method === 'installer'" class="delivery-form installer-form">
                <el-form-item label="操作员姓名" required class="config-item">
                  <el-input
                    v-model="formData.deliveryConfig!.installerConfig!.installerName"
                    placeholder="请输入专业操作员姓名"
                    class="w-full"
                  />
                </el-form-item>

                <el-form-item label="联系电话" required class="config-item">
                  <el-input
                    v-model="formData.deliveryConfig!.installerConfig!.installerPhone"
                    placeholder="请输入联系电话"
                    class="w-full"
                  />
                </el-form-item>

                <el-form-item label="服务费用" class="config-item">
                  <el-input-number
                    v-model="formData.deliveryConfig!.installerConfig!.serviceFee"
                    :min="0"
                    :precision="2"
                    :step="10"
                    controls-position="right"
                    class="w-full"
                  />
                  <span class="ml-2 text-gray-500 text-sm">元</span>
                </el-form-item>

                <el-form-item label="服务说明" class="config-item">
                  <el-input
                    v-model="formData.deliveryConfig!.installerConfig!.serviceDescription"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入专业操作员现场交付的服务说明"
                    class="w-full"
                  />
                </el-form-item>
              </div>

              <div class="delivery-tip">
                <el-icon><InfoFilled /></el-icon>
                <span>选择合适的交付方式，确保客户能够顺利收到商品</span>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">
          <el-icon class="mr-1"><Check /></el-icon>
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 20px;
}

.product-tabs {
  padding: 20px 0;
}

.product-form {
  padding: 20px 0;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 3px solid #409eff;
  display: flex;
  align-items: center;
}

.form-row {
  display: flex;
  gap: 20px;
}

.flex-1 {
  flex: 1;
}

.w-full {
  width: 100%;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.image-item {
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.image-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-preview {
  width: 100%;
  height: 100%;
}

.image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.image-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.image-upload {
  width: 100%;
  min-height: 150px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  padding: 16px;
}

.image-upload:hover {
  border-color: #409eff;
  background: #f5f7fa;
}

.video-preview {
  position: relative;
  margin-top: 16px;
}

.video-player {
  width: 100%;
  max-height: 400px;
  border-radius: 8px;
  background: #000;
}

.video-remove-btn {
  position: absolute;
  top: 16px;
  right: 16px;
}

.video-upload {
  margin-top: 16px;
  padding: 32px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s;
}

.video-upload:hover {
  border-color: #409eff;
  background: #f5f7fa;
}

.video-tip {
  margin-top: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialog-footer {
  text-align: right;
  padding: 20px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-cascader) {
  width: 100%;
}

.spec-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.spec-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.spec-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.spec-input {
  flex: 1;
}

.spec-remove-btn {
  flex-shrink: 0;
}

.spec-empty {
  text-align: center;
  padding: 32px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  margin-top: 16px;
  transition: all 0.3s;
}

.spec-empty:hover {
  border-color: #409eff;
  background: #f5f7fa;
}

.spec-actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.spec-add-btn {
  width: 200px;
}

.spec-tip {
  margin-top: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-options-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.spec-option-item {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.spec-option-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.spec-option-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.spec-option-label-input {
  flex: 1;
}

.spec-values-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-value-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.spec-value-input {
  flex: 1;
}

.spec-price-input {
  width: 120px;
  flex-shrink: 0;
}

.add-value-btn {
  margin-top: 8px;
  width: fit-content;
}

.spec-options-empty {
  text-align: center;
  padding: 32px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  margin-top: 16px;
  transition: all 0.3s;
}

.spec-options-empty:hover {
  border-color: #409eff;
  background: #f5f7fa;
}

.rental-config-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.config-item {
  margin-bottom: 16px;
}

.rental-config-tip {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tiered-pricing-section {
  margin-top: 16px;
}

.tiered-pricing-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.tiered-pricing-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tiered-pricing-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.tiered-pricing-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.tier-range,
.tier-price,
.tier-discount {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tier-range {
  flex: 1;
}

.tier-price {
  flex: 0 0 150px;
}

.tier-discount {
  flex: 0 0 120px;
}

.tiered-pricing-empty {
  text-align: center;
  padding: 32px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  margin-top: 16px;
  transition: all 0.3s;
}

.tiered-pricing-empty:hover {
  border-color: #409eff;
  background: #f5f7fa;
}

.tiered-pricing-tip {
  margin-top: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
}

.deposit-config-section {
  margin-top: 16px;
}

.deposit-actions {
  margin-bottom: 16px;
}

.deposit-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.deposit-tiers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.deposit-tier-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.deposit-tier-item:hover {
  border-color: #67c23a;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.1);
}

.tier-level {
  flex: 1;
  display: flex;
  align-items: center;
}

.tier-amount {
  flex: 0 0 150px;
  display: flex;
  align-items: center;
}

.tier-ratio {
  flex: 0 0 200px;
  display: flex;
  align-items: center;
}

.deposit-tip {
  margin-top: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
}

.delivery-method-selector {
  margin-bottom: 20px;
}

.delivery-method-group {
  display: flex;
  gap: 12px;
}

.delivery-method-group :deep(.el-radio-button) {
  flex: 1;
}

.delivery-method-group :deep(.el-radio-button__inner) {
  width: 100%;
  height: auto;
  padding: 16px 20px;
  white-space: normal;
  text-align: left;
}

.delivery-method-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.delivery-method-label {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.delivery-method-desc {
  font-size: 12px;
  color: #909399;
}

.delivery-form {
  margin-top: 16px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.pickup-form,
.express-form,
.installer-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.delivery-tip {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dimensions-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .rental-config-form,
  .deposit-form {
    grid-template-columns: 1fr;
  }

  .tiered-pricing-item,
  .deposit-tier-item {
    flex-direction: column;
    align-items: stretch;
  }

  .tier-range,
  .tier-price,
  .tier-discount,
  .tier-level,
  .tier-amount,
  .tier-ratio {
    width: 100%;
    flex: none;
  }

  .delivery-method-group {
    flex-direction: column;
  }

  .form-row {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
