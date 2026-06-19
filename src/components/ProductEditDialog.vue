<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElButton, ElMessage, ElImage, ElIcon } from 'element-plus'
import { Plus, Delete, VideoPlay, InfoFilled } from '@element-plus/icons-vue'
import type { Product } from '@/types/product'
import { CATEGORY_OPTIONS, BRAND_OPTIONS } from '@/types/product'
import type { ProductSpecification } from '@/types/product'

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

const formData = ref<Partial<Product>>({
  name: '',
  brand: '',
  model: '',
  category: '',
  subCategory: '',
  description: '',
  price: 0,
  stock: 0,
  images: [],
  video: '',
  specifications: []
})

const newImageUrl = ref('')
const newVideoUrl = ref('')
const formRef = ref()

watch(() => props.visible, (val) => {
  if (val && props.product) {
    formData.value = {
      ...props.product,
      images: props.product.images || [],
      video: props.product.video || '',
      specifications: props.product.specifications || []
    }
  } else {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    name: '',
    brand: '',
    model: '',
    category: '',
    subCategory: '',
    description: '',
    price: 0,
    stock: 0,
    images: [],
    video: '',
    specifications: []
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

const handleCategoryChange = (value: string) => {
  formData.value.category = value
  formData.value.subCategory = ''
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
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="product ? '编辑商品' : '新增商品'"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
    class="product-edit-dialog"
  >
    <div class="dialog-content">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="100px"
        class="product-form"
      >
        <div class="form-section">
          <h3 class="section-title">基础信息</h3>

          <el-form-item label="商品名称" required>
            <el-input
              v-model="formData.name"
              placeholder="请输入商品名称"
              maxlength="200"
              show-word-limit
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="品牌" required>
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

          <el-form-item label="型号">
            <el-input
              v-model="formData.model"
              placeholder="请输入商品型号"
              maxlength="50"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="产品分类" required>
            <el-cascader
              v-model="[formData.category, formData.subCategory]"
              :options="CATEGORY_OPTIONS"
              :props="{ checkStrictly: true, expandTrigger: 'hover' }"
              placeholder="请选择产品分类"
              class="w-full"
              @change="([val]) => handleCategoryChange(val as string)"
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

        <div class="form-section">
          <h3 class="section-title">
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
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
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
</style>
