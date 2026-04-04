<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { usePlayerStore } from '@/stores/player'
import { useDispatch } from '@/composables/useDispatch'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/utils/format'
import { ORDER_STATUS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR, VIP_LEVEL_TEXT, DEFAULT_PAGE_SIZE } from '@/utils/constants'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const playerStore = usePlayerStore()
const { openDispatchDialog, showDispatchDialog, dispatch, loading: dispatchLoading } = useDispatch()

const loading = ref(true)
const selectedOrders = ref([])
const showFilterPanel = ref(false)

// Filter form
const filterForm = reactive({
  status: '',
  gameType: '',
  keyword: '',
  dateRange: []
})

// Game types for filter
const gameTypes = [
  { label: '王者荣耀', value: '王者荣耀' },
  { label: '英雄联盟', value: '英雄联盟' },
  { label: '和平精英', value: '和平精英' },
  { label: '其他', value: '其他' }
]

// Order status options
const statusOptions = Object.entries(ORDER_STATUS_TEXT).map(([value, label]) => ({
  label,
  value
}))

// Table columns
const columns = [
  { prop: 'orderNo', label: '订单号', width: '150' },
  { prop: 'vipName', label: 'VIP客户', width: '120' },
  { prop: 'gameType', label: '游戏', width: '100' },
  { prop: 'tier', label: '段位', width: '140' },
  { prop: 'price', label: '价格', width: '100' },
  { prop: 'status', label: '状态', width: '100' },
  { prop: 'playerName', label: '打手', width: '100' },
  { prop: 'createdAt', label: '创建时间', width: '150' },
  { prop: 'actions', label: '操作', width: '180', fixed: 'right' }
]

// Fetch orders
async function fetchOrders() {
  loading.value = true
  try {
    const params = {
      page: orderStore.pagination.page,
      pageSize: orderStore.pagination.pageSize
    }
    if (filterForm.status) params.status = filterForm.status
    if (filterForm.gameType) params.gameType = filterForm.gameType
    if (filterForm.keyword) params.keyword = filterForm.keyword
    if (filterForm.dateRange?.length === 2) {
      params.startDate = filterForm.dateRange[0]
      params.endDate = filterForm.dateRange[1]
    }
    
    await orderStore.fetchOrders(params)
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// Handle filter
function handleFilter() {
  orderStore.setFilters(filterForm)
  fetchOrders()
  showFilterPanel.value = false
}

// Reset filter
function resetFilter() {
  Object.assign(filterForm, {
    status: '',
    gameType: '',
    keyword: '',
    dateRange: []
  })
  orderStore.resetFilters()
  fetchOrders()
}

// Handle selection change
function handleSelectionChange(selection) {
  selectedOrders.value = selection
}

// Handle pagination change
function handlePageChange(page) {
  orderStore.setPage(page)
  fetchOrders()
}

function handleSizeChange(size) {
  orderStore.setPageSize(size)
  fetchOrders()
}

// Handle assign
function handleAssign(order) {
  openDispatchDialog(order)
}

// Handle cancel
async function handleCancel(order) {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await orderStore.cancel(order.id, '管理员取消')
    ElMessage.success('订单已取消')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败')
    }
  }
}

// Handle complete
async function handleComplete(order) {
  try {
    await ElMessageBox.confirm('确定该订单已完成吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })
    await orderStore.complete(order.id)
    ElMessage.success('订单已完成')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// View order detail
function viewOrderDetail(order) {
  router.push(`/order?id=${order.id}`)
}

// Quick actions based on status
function getQuickActions(order) {
  const actions = []
  switch (order.status) {
    case ORDER_STATUS.PENDING:
      actions.push({ label: '派单', type: 'primary', action: () => handleAssign(order) })
      actions.push({ label: '取消', type: 'danger', action: () => handleCancel(order) })
      break
    case ORDER_STATUS.ASSIGNED:
    case ORDER_STATUS.PROCESSING:
      actions.push({ label: '完成', type: 'success', action: () => handleComplete(order) })
      actions.push({ label: '取消', type: 'danger', action: () => handleCancel(order) })
      break
  }
  return actions
}

// Stats summary
const statsSummary = computed(() => ({
  total: orderStore.total,
  pending: orderStore.orderCountByStatus[ORDER_STATUS.PENDING] || 0,
  processing: orderStore.orderCountByStatus[ORDER_STATUS.PROCESSING] || 0,
  completed: orderStore.orderCountByStatus[ORDER_STATUS.COMPLETED] || 0
}))

// Dispatch dialog handlers
function handleDispatchSelect(playerId) {
  dispatch(playerId).then(() => {
    fetchOrders()
  })
}

onMounted(() => {
  fetchOrders()
  playerStore.fetchPlayers({ status: 'online' })
  
  // Check if there's an order ID in query
  if (route.query.id) {
    // Could open order detail modal here
  }
})
</script>

<template>
  <div class="order-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">订单管理</h1>
        <p class="page-subtitle">管理所有游戏陪练订单</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="fetchOrders">
          🔄 刷新
        </el-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-item" :class="{ active: !filterForm.status }" @click="filterForm.status = ''; handleFilter()">
        <span class="stat-value">{{ statsSummary.total }}</span>
        <span class="stat-label">全部订单</span>
      </div>
      <div class="stat-item pending" :class="{ active: filterForm.status === 'pending' }" @click="filterForm.status = 'pending'; handleFilter()">
        <span class="stat-value">{{ statsSummary.pending }}</span>
        <span class="stat-label">待派单</span>
      </div>
      <div class="stat-item processing" :class="{ active: filterForm.status === 'processing' }" @click="filterForm.status = 'processing'; handleFilter()">
        <span class="stat-value">{{ statsSummary.processing }}</span>
        <span class="stat-label">进行中</span>
      </div>
      <div class="stat-item completed" :class="{ active: filterForm.status === 'completed' }" @click="filterForm.status = 'completed'; handleFilter()">
        <span class="stat-value">{{ statsSummary.completed }}</span>
        <span class="stat-label">已完成</span>
      </div>
    </div>

    <!-- Filter Bar -->
    <ButterflyCard class="filter-card" padding="16px">
      <div class="filter-bar">
        <div class="filter-left">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索订单号/VIP名称..."
            prefix-icon="Search"
            clearable
            style="width: 240px"
            @keyup.enter="handleFilter"
          />
          <el-select
            v-model="filterForm.gameType"
            placeholder="游戏类型"
            clearable
            style="width: 140px"
          >
            <el-option
              v-for="game in gameTypes"
              :key="game.value"
              :label="game.label"
              :value="game.value"
            />
          </el-select>
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 260px"
          />
        </div>
        <div class="filter-right">
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
        </div>
      </div>
    </ButterflyCard>

    <!-- Orders Table -->
    <ButterflyCard class="table-card" padding="0">
      <el-table
        v-loading="loading"
        :data="orderStore.orders"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        
        <el-table-column prop="orderNo" label="订单号" width="150">
          <template #default="{ row }">
            <span class="order-no" @click="viewOrderDetail(row)">{{ row.orderNo }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="vipName" label="VIP客户" width="120">
          <template #default="{ row }">
            <div class="vip-cell">
              <span class="vip-level">{{ VIP_LEVEL_TEXT[row.vipLevel] || '' }}</span>
              <span>{{ row.vipName }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="gameType" label="游戏" width="100" />
        
        <el-table-column label="段位" width="150">
          <template #default="{ row }">
            <span class="tier-info">
              {{ row.currentTier }} → {{ row.targetTier }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="ORDER_STATUS_COLOR[row.status]" size="small">
              {{ ORDER_STATUS_TEXT[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="playerName" label="打手" width="100">
          <template #default="{ row }">
            <span v-if="row.playerName">{{ row.playerName }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="创建时间" width="150">
          <template #default="{ row }">
            <span class="time-info" :title="formatDateTime(row.createdAt)">
              {{ formatRelativeTime(row.createdAt) }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button 
                v-for="action in getQuickActions(row)" 
                :key="action.label"
                :type="action.type"
                size="small"
                text
                @click="action.action"
              >
                {{ action.label }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="orderStore.pagination.page"
          v-model:page-size="orderStore.pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="orderStore.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </ButterflyCard>

    <!-- Dispatch Dialog -->
    <el-dialog
      v-model="showDispatchDialog"
      title="派单"
      width="500px"
    >
      <div class="dispatch-form">
        <p class="dispatch-tip">选择要派单的打手：</p>
        <el-select
          v-model="selectedOrders[0]?.selectedPlayerId"
          placeholder="选择打手"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="player in playerStore.availablePlayers"
            :key="player.id"
            :label="`${player.nickname} (完成${player.completedOrders}单, ⭐${player.rating})`"
            :value="player.id"
          />
        </el-select>
      </div>
      <template #footer>
        <el-button @click="showDispatchDialog = false">取消</el-button>
        <el-button type="primary" :loading="dispatchLoading" @click="handleDispatchSelect(selectedOrders[0]?.selectedPlayerId)">
          确认派单
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.order-list {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: #4a4a4a;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #888;
}

// Stats Row
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
  }

  &.active {
    border-color: #B8A9D9;
    background: rgba(#B8A9D9, 0.1);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #4a4a4a;
  }

  .stat-label {
    font-size: 13px;
    color: #888;
    margin-top: 4px;
  }

  &.pending .stat-value { color: #e6a23c; }
  &.processing .stat-value { color: #409eff; }
  &.completed .stat-value { color: #67c23a; }
}

// Filter Bar
.filter-card {
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-left {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-right {
  display: flex;
  gap: 8px;
}

// Table
.table-card {
  overflow: hidden;
}

.order-no {
  color: #B8A9D9;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.vip-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .vip-level {
    font-size: 11px;
    color: #888;
  }
}

.tier-info {
  font-size: 13px;
  color: #6a6a6a;
}

.price {
  font-weight: 600;
  color: #B8A9D9;
}

.time-info {
  font-size: 13px;
  color: #888;
}

.text-muted {
  color: #aaa;
}

.action-btns {
  display: flex;
  gap: 4px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 1px solid rgba(#B8A9D9, 0.1);
}

// Dispatch Dialog
.dispatch-form {
  .dispatch-tip {
    margin: 0 0 12px;
    color: #6a6a6a;
  }
}
</style>
