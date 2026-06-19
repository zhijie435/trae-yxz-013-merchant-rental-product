<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElButton, ElMessage } from 'element-plus'
import type { Product } from '@/types/product'

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
  description: '',
  price: 0,
  stock: 0,
  category: '',
  images: []
})

const imagesInput = ref('')

const formRef = ref()

watch(() => props.visible, (val) => {
  if (val && props.product) {
    formData.value = { ...props.product }
    imagesInput.value = (props.product.images || []).join('\n')
  } else {
    resetForm()
  }
})

watch(imagesInput, (val) => {
  formData.value.images = val.split('\n').filter(url => url.trim() !== '')
})

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    images: []
  }
  imagesInput.value = ''
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
  if (!formData.value.price || formData.value.price <= 0) {
    ElMessage.warning('请输入有效的价格')
    return
  }

  emit('save', formData.value)
  handleClose()
  ElMessage.success('商品信息保存成功')
}

const categoryOptions = [
  { value: '礼服', label: '礼服' },
  { value: '西装', label: '西装' },
  { value: '古装', label: '古装' },
  { value: '运动', label: '运动' },
  { value: '儿童', label: '儿童' },
  { value: '角色扮演', label: '角色扮演' },
  { value: '其他', label: '其他' }
]
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="product ? '编辑商品' : '新增商品'"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      class="product-form"
    >
      <el-form-item label="商品名称" required>
        <el-input
          v-model="formData.name"
          placeholder="请输入商品名称"
          maxlength="200"
          show-word-limit
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
        />
      </el-form-item>

      <el-form-item label="商品分类" required>
        <el-select
          v-model="formData.category"
          placeholder="请选择商品分类"
          class="w-full"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="租赁价格" required>
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

      <el-form-item label="库存数量">
        <el-input-number
          v-model="formData.stock"
          :min="0"
          :step="1"
          controls-position="right"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="商品图片">
        <el-input
          v-model="imagesInput"
          type="textarea"
          :rows="3"
          placeholder="请输入图片URL，多个图片用换行分隔"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.product-form {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}

:deep(.el-input-number) {
  width: 200px;
}
</style>
