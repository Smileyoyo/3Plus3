<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { usePlayerStore } from '@/stores/player'
import { useVIPStore } from '@/stores/vip'
import { useDispatch } from '@/composables/useDispatch'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/utils/format'
import { ORDER_STATUS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR, VIP_LEVEL_TEXT, DEFAULT_PAGE_SIZE } from '@/utils/constants'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const playerStore = usePlayerStore()
const vipStore = useVIPStore()
const { openDispatchDialog, showDispatchDialog, dispatch, loading: dispatchLoading } = useDispatch()

const loading = ref(true)
const selectedPlayerIds = ref([])
const showAddDialog = ref(false)
const addLoading = ref(false)

// Order type: 'temp' = 临时单, 'vip' = VIP单子
const orderType = ref('temp')

// VIP search keyword
const vipSearchKeyword = ref('')

// Player search keyword
const playerSearchKeyword = ref('')

// Add order form
const addForm = reactive({
  vipId: '',
  vipName: '',
  vipPhone: '',
  gameType: '',
  currentTier: '',
  targetTier: '',
  price: '',
  remark: ''
})

// Filter form
const filterForm = reactive({
  status: '',
  gameType: '',
  keyword: '',
  dateRange: []
})

// Stats data (from dashboard)
const stats = ref({
  todayOrders: 0,
  todayRevenue: 0,
  pendingOrders: 0,
  activePlayers: 0
})

// Filtered VIP list based on search
const filteredVIPs = computed(() => {
  if (!vipSearchKeyword.value) {
    return vipStore.vips
  }
  const keyword = vipSearchKeyword.value.toLowerCase()
  return vipStore.vips.filter(vip => 
    (vip.nickname && vip.nickname.toLowerCase().includes(keyword)) ||
    (vip.phone && vip.phone.includes(keyword))
  )
})

// Filtered player list based on search
const filteredPlayers = computed(() => {
  const keyword = playerSearchKeyword.value.toLowerCase()
  const baseList = playerStore.availablePlayers || []
  if (!keyword) {
    return baseList
  }
  return baseList.filter(player => 
    (player.nickname && player.nickname.toLowerCase().includes(keyword)) ||
    (player.phone && player.phone.includes(keyword))
  )
})

// Game types for filter and add form
const gameTypes = [
  { label: '暗区突围', value: '暗区突围' },
  { label: '三角洲行动', value: '三角洲行动' },
  { label: '瓦罗兰特', value: '瓦罗兰特' },
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

// VIP level options
const vipLevelOptions = Object.entries(VIP_LEVEL_TEXT).map(([value, label]) => ({
  label,
  value: Number(value)
}))

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
    await fetchStats()
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// Fetch dashboard-style stats
async function fetchStats() {
  // 模拟统计数据，实际应从API获取
  stats.value = {
    todayOrders: 23,
    todayRevenue: 12580,
    pendingOrders: orderStore.orderCountByStatus[ORDER_STATUS.PENDING] || 0,
    activePlayers: playerStore.availablePlayers?.length || 0
  }
}

// Handle filter
function handleFilter() {
  orderStore.setFilters(filterForm)
  fetchOrders()
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

// Dispatch dialog handlers - now supports multiple players
function handleDispatchSelect() {
  if (!selectedPlayerIds.value || selectedPlayerIds.value.length === 0) {
    ElMessage.warning('请选择至少一个打手')
    return
  }
  
  // For each selected player, create a dispatch
  const promises = selectedPlayerIds.value.map(playerId => dispatch(playerId))
  
  Promise.all(promises).then(() => {
    selectedPlayerIds.value = []
    fetchOrders()
  }).catch(error => {
    ElMessage.error('派单失败')
  })
}

// Open add dialog
function openAddDialog() {
  orderType.value = 'temp'
  vipSearchKeyword.value = ''
  Object.assign(addForm, {
    vipId: '',
    vipName: '',
    vipPhone: '',
    gameType: '',
    currentTier: '',
    targetTier: '',
    price: '',
    remark: ''
  })
  showAddDialog.value = true
}

// Submit add order
async function submitAddOrder() {
  if (orderType.value === 'vip' && !addForm.vipId) {
    ElMessage.warning('请选择VIP客户')
    return
  }
  
  if (!addForm.gameType || !addForm.price) {
    ElMessage.warning('请填写必填项')
    return
  }
  
  addLoading.value = true
  try {
    await orderStore.create({
      vipId: orderType.value === 'vip' ? addForm.vipId : null,
      vipName: addForm.vipName || '临时客户',
      vipPhone: addForm.vipPhone || '',
      gameType: addForm.gameType,
      currentTier: addForm.currentTier,
      targetTier: addForm.targetTier,
      price: Number(addForm.price),
      remark: addForm.remark
    })
    ElMessage.success('订单创建成功')
    showAddDialog.value = false
    fetchOrders()
  } catch (error) {
    ElMessage.error('创建失败')
  } finally {
    addLoading.value = false
  }
}

// Select VIP from dropdown
function handleSelectVIP(vip) {
  addForm.vipId = vip.id
  addForm.vipName = vip.nickname
  addForm.vipPhone = vip.phone
}

// Handle order type change
function handleOrderTypeChange(type) {
  orderType.value = type
  if (type === 'temp') {
    addForm.vipId = ''
    addForm.vipName = ''
    addForm.vipPhone = ''
    vipSearchKeyword.value = ''
  }
}

// Format selected players for display
const selectedPlayersDisplay = computed(() => {
  return selectedPlayerIds.value.map(id => {
    const player = playerStore.availablePlayers?.find(p => p.id === id)
    return player ? player.nickname : id
  }).join(', ')
})

onMounted(() => {
  fetchOrders()
  playerStore.fetchPlayers({ status: 'online' })
  vipStore.fetchVIPs({ pageSize: 100 })
  
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
        <el-button type="primary" @click="openAddDialog">
          + 新建订单
        </el-button>
        <el-button @click="fetchOrders">
          🔄 刷新
        </el-button>
      </div>
    </div>

    <!-- Dashboard Stats Cards -->
    <div class="dashboard-stats">
      <ButterflyCard class="stat-card" hoverable>
        <div class="stat-content stat-purple">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.todayOrders }}</p>
            <p class="stat-title">今日订单</p>
          </div>
        </div>
      </ButterflyCard>
      
      <ButterflyCard class="stat-card" hoverable>
        <div class="stat-content stat-pink">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <p class="stat-value">¥{{ formatCurrency(stats.todayRevenue) }}</p>
            <p class="stat-title">今日收入</p>
          </div>
        </div>
      </ButterflyCard>
      
      <ButterflyCard class="stat-card" hoverable>
        <div class="stat-content stat-orange">
          <div class="stat-icon">⏰</div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.pendingOrders }}</p>
            <p class="stat-title">待处理订单</p>
          </div>
        </div>
      </ButterflyCard>
      
      <ButterflyCard class="stat-card" hoverable>
        <div class="stat-content stat-green">
          <div class="stat-icon">🎮</div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.activePlayers }}</p>
            <p class="stat-title">在线打手</p>
          </div>
        </div>
      </ButterflyCard>
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
      >
        <el-table-column prop="orderNo" label="订单号" width="150">
          <template #default="{ row }">
            <span class="order-no" @click="viewOrderDetail(row)">{{ row.orderNo }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="vipName" label="VIP客户" width="120">
          <template #default="{ row }">
            <div class="vip-cell">
              <span v-if="row.vipLevel" class="vip-level">{{ VIP_LEVEL_TEXT[row.vipLevel] || '' }}</span>
              <span>{{ row.vipName || '临时客户' }}</span>
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
        
        <el-table-column prop="playerName" label="打手" width="120">
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

    <!-- Dispatch Dialog (Multi-player support) -->
    <el-dialog
      v-model="showDispatchDialog"
      title="派单"
      width="600px"
    >
      <div class="dispatch-form">
        <p class="dispatch-tip">选择要派单的打手（可多选）：</p>
        <el-select
          v-model="selectedPlayerIds"
          placeholder="选择打手"
          style="width: 100%"
          multiple
          filterable
          :filter-method="(val) => playerSearchKeyword = val"
          @focus="playerSearchKeyword = ''"
        >
          <el-option
            v-for="player in filteredPlayers"
            :key="player.id"
            :label="`${player.nickname} (完成${player.completedOrders || 0}单, ⭐${player.rating || 'N/A'})`"
            :value="player.id"
          >
            <div class="player-option">
              <span>{{ player.nickname }}</span>
              <span class="player-meta">完成 {{ player.completedOrders || 0 }} 单, ⭐ {{ player.rating || 'N/A' }}</span>
            </div>
          </el-option>
        </el-select>
        
        <div v-if="selectedPlayerIds.length > 0" class="selected-players">
          <span class="selected-label">已选打手：</span>
          <el-tag
            v-for="playerId in selectedPlayerIds"
            :key="playerId"
            closable
            @close="selectedPlayerIds = selectedPlayerIds.filter(id => id !== playerId)"
          >
            {{ playerStore.availablePlayers?.find(p => p.id === playerId)?.nickname || playerId }}
          </el-tag>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDispatchDialog = false; selectedPlayerIds = []">取消</el-button>
        <el-button type="primary" :loading="dispatchLoading" @click="handleDispatchSelect">
          确认派单 ({{ selectedPlayerIds.length }})
        </el-button>
      </template>
    </el-dialog>

    <!-- Add Order Dialog -->
    <el-dialog
      v-model="showAddDialog"
      title="新建订单"
      width="600px"
    >
      <el-form :model="addForm" label-width="100px">
        <!-- Order Type Radio -->
        <el-form-item label="订单类型" required>
          <el-radio-group v-model="orderType" @change="handleOrderTypeChange">
            <el-radio value="temp">临时单</el-radio>
            <el-radio value="vip">VIP单子</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- VIP Customer Selection (Searchable Dropdown) -->
        <el-form-item v-if="orderType === 'vip'" label="VIP客户" required>
          <el-select
            v-model="addForm.vipId"
            placeholder="搜索并选择VIP客户"
            style="width: 100%"
            filterable
            remote
            :remote-method="(val) => vipSearchKeyword = val"
            :loading="vipStore.loading"
            @change="handleSelectVIP(filteredVIPs.find(v => v.id === addForm.vipId) || {})"
          >
            <el-option
              v-for="vip in filteredVIPs"
              :key="vip.id"
              :label="`${vip.nickname} (${VIP_LEVEL_TEXT[vip.vipLevel] || 'VIP'})`"
              :value="vip.id"
            >
              <div class="vip-option">
                <span class="vip-name">{{ vip.nickname }}</span>
                <span class="vip-level-tag">{{ VIP_LEVEL_TEXT[vip.vipLevel] || 'VIP' }}</span>
                <span class="vip-phone">{{ vip.phone || '' }}</span>
              </div>
            </el-option>
          </el-select>
          
          <!-- Selected VIP info display -->
          <div v-if="addForm.vipId" class="selected-vip-info">
            <span>已选择：{{ addForm.vipName }}</span>
            <span v-if="addForm.vipPhone" class="vip-phone-detail"> ({{ addForm.vipPhone }})</span>
          </div>
        </el-form-item>
        
        <!-- Temp order customer info (optional) -->
        <el-form-item v-if="orderType === 'temp'" label="客户名称">
          <el-input v-model="addForm.vipName" placeholder="可填写客户名称（选填）" />
        </el-form-item>
        
        <el-form-item label="游戏类型" required>
          <el-select v-model="addForm.gameType" placeholder="选择游戏" style="width: 100%">
            <el-option
              v-for="game in gameTypes"
              :key="game.value"
              :label="game.label"
              :value="game.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="段位信息">
          <div class="tier-row">
            <el-input v-model="addForm.currentTier" placeholder="当前段位" />
            <span class="arrow">→</span>
            <el-input v-model="addForm.targetTier" placeholder="目标段位" />
          </div>
        </el-form-item>
        
        <el-form-item label="价格" required>
          <el-input v-model="addForm.price" type="number" placeholder="订单金额">
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="3" placeholder="订单备注信息" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="submitAddOrder">
          创建订单
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

.header-actions {
  display: flex;
  gap: 12px;
}

// Dashboard Stats Cards (from dashboard page)
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  :deep(.butterfly-card) {
    padding: 0;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  
  &.stat-purple {
    background: linear-gradient(135deg, rgba(184, 169, 217, 0.3), rgba(184, 169, 217, 0.1));
  }
  
  &.stat-pink {
    background: linear-gradient(135deg, rgba(255, 183, 178, 0.3), rgba(255, 183, 178, 0.1));
  }
  
  &.stat-orange {
    background: linear-gradient(135deg, rgba(245, 230, 211, 0.4), rgba(245, 230, 211, 0.2));
  }
  
  &.stat-green {
    background: linear-gradient(135deg, rgba(181, 234, 215, 0.3), rgba(181, 234, 215, 0.1));
  }
}

.stat-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #4a4a4a;
  line-height: 1.2;
}

.stat-title {
  margin: 4px 0 0;
  font-size: 14px;
  color: #888;
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

.player-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  
  .player-meta {
    font-size: 12px;
    color: #888;
  }
}

.selected-players {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  
  .selected-label {
    font-size: 13px;
    color: #888;
  }
}

// Add Order Dialog
.vip-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  
  .vip-name {
    font-weight: 500;
  }
  
  .vip-level-tag {
    font-size: 11px;
    padding: 2px 6px;
    background: rgba(#B8A9D9, 0.2);
    color: #8a7aa9;
    border-radius: 8px;
  }
  
  .vip-phone {
    font-size: 12px;
    color: #888;
  }
}

.selected-vip-info {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(#B8A9D9, 0.1);
  border-radius: 8px;
  font-size: 13px;
  color: #6a6a6a;
  
  .vip-phone-detail {
    color: #888;
  }
}

.vip-select-row {
  display: flex;
  gap: 12px;
}

.vip-quick-select {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  
  .label {
    font-size: 13px;
    color: #888;
  }
  
  .vip-tag {
    cursor: pointer;
    
    &:hover {
      background: #B8A9D9;
      color: #fff;
    }
  }
}

.tier-row {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .arrow {
    color: #B8A9D9;
    font-weight: 600;
  }
}

:deep(.el-table) {
  th.el-table__cell {
    text-align: center;
  }
  td.el-table__cell {
    text-align: center;
  }
}
</style>
