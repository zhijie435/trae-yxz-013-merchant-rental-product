<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem, ElBadge } from 'element-plus'
import type { ProductStatus, ProductCounts, BatchAction } from '@/types/product'
import {
  Goods,
  Top,
  Clock,
  CloseBold,
  Bottom,
  More
} from '@element-plus/icons-vue'

interface Props {
  activeStatus: ProductStatus
  counts: ProductCounts
  selectedCount: number
}

interface Emits {
  (e: 'update:activeStatus', status: ProductStatus): void
  (e: 'batch-action', action: BatchAction): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const filterOptions: Array<{
  key: ProductStatus
  label: string
  icon: any
  count: number
}> = [
  { key: 'all', label: '全部', icon: Goods, count: props.counts.all },
  { key: 'online', label: '上架中', icon: Top, count: props.counts.online },
  { key: 'pending', label: '待审核', icon: Clock, count: props.counts.pending },
  { key: 'rejected', label: '已驳回', icon: CloseBold, count: props.counts.rejected },
  { key: 'offline', label: '已下架', icon: Bottom, count: props.counts.offline }
]

const handleStatusChange = (status: ProductStatus) => {
  emit('update:activeStatus', status)
}

const handleBatchAction = (action: BatchAction['type']) => {
  if (props.selectedCount === 0) {
    return
  }
  emit('batch-action', {
    type: action,
    productIds: []
  })
}
</script>

<template>
  <div class="filter-bar bg-white rounded-lg shadow-sm p-4 mb-4">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-2 flex-wrap">
        <el-button
          v-for="option in filterOptions"
          :key="option.key"
          :type="activeStatus === option.key ? 'primary' : 'default'"
          :class="[
            'filter-tag transition-all duration-300 hover:scale-105',
            activeStatus === option.key ? 'shadow-md' : ''
          ]"
          @click="handleStatusChange(option.key)"
        >
          <el-icon class="mr-1">
            <component :is="option.icon" />
          </el-icon>
          {{ option.label }}
          <el-badge
            :value="option.count"
            :max="99"
            class="ml-2"
            :type="activeStatus === option.key ? 'primary' : 'info'"
          />
        </el-button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500" v-if="selectedCount > 0">
          已选择 {{ selectedCount }} 个商品
        </span>
        <el-dropdown trigger="click" :disabled="selectedCount === 0">
          <el-button
            type="primary"
            :disabled="selectedCount === 0"
            :class="[
              'transition-all duration-300',
              selectedCount > 0 ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
            ]"
          >
            <el-icon class="mr-1"><More /></el-icon>
            批量操作
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleBatchAction('online')">
                <el-icon class="mr-2 text-green-500"><Top /></el-icon>
                批量上架
              </el-dropdown-item>
              <el-dropdown-item @click="handleBatchAction('offline')">
                <el-icon class="mr-2 text-gray-500"><Bottom /></el-icon>
                批量下架
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleBatchAction('delete')">
                <el-icon class="mr-2 text-red-500"><CloseBold /></el-icon>
                批量删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-tag {
  @apply font-medium border-2;
  min-width: 100px;
}

.filter-tag.is-disabled {
  @apply opacity-60;
}
</style>
