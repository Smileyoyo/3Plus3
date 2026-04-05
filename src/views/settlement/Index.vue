<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format'
import { SETTLEMENT_STATUS, SETTLEMENT_STATUS_TEXT, SETTLEMENT_STATUS_COLOR, DEFAULT_PAGE_SIZE } from '@/utils/constants'
import { ElMessage, ElMessageBox } from 'element-plus'
import { get, post } from '@/api/index'

const loading = ref(true)
const settlements = ref([])
const stats = ref({
  pendingAmount: 0,
  approvedAmount: 0,
  paidAmount: 0,
  totalPlayers: 0
})

// Filter form
const filterForm = reactive({
  status: '',
  keyword: '',
  period: ''
})

// Status options
const statusOptions = Object.entries(SETTLEMENT_STATUS_TEXT).map(([value, label]) => ({
  label,
  value
}))

async function fetchSettlements() {
  loading.value = true
  try {
    const params = {}
    if (filterForm.status) params.status = filterForm.status
    if (filterForm.keyword) params.keyword = filterForm.keyword
    if (filterForm.period) params.period = filterForm.period
    
    const res = await get('/settlements', params)
    settlements.value = res.list || res || []
    
    // Calculate stats
    stats.value = {
      pendingAmount: settlements.value.filter(s => s.status === 'pending').reduce((sum, s) => sum + (s.net_amount || s.netAmount || 0), 0),
      approvedAmount: settlements.value.filter(s => s.status === 'approved').reduce((sum, s) => sum + (s.net_amount || s.netAmount || 0), 0),
      paidAmount: settlements.value.filter(s => s.status === 'paid').reduce((sum, s) => sum + (s.net_amount || s.netAmount || 0), 0),
      totalPlayers: new Set(settlements.value.map(s => s.player_id || s.playerId)).size
    }
  } catch (error) {
    console.error('获取结算列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleFilter() {
  fetchSettlements()
}

function resetFilter() {
  Object.assign(filterForm, { status: '', keyword: '', period: '' })
  fetchSettlements()
}

function getStatusType(status) {
  return SETTLEMENT_STATUS_COLOR[status] || 'info'
}

function getStatusText(status) {
  return SETTLEMENT_STATUS_TEXT[status] || status
}

// Approve settlement
async function handleApprove(settlement) {
  try {
    await ElMessageBox.confirm(`确定审核通过该结算吗？`, '审核结算', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    await post(`/settlements/${settlement.id || settlement.settlement_id}/approve`)
    ElMessage.success('审核通过')
    fetchSettlements()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// Pay settlement
async function handlePay(settlement) {
  try {
    await ElMessageBox.confirm(`确定已支付该结算吗？`, '支付确认', {
      confirmButtonText: '确定支付',
      cancelButtonText: '取消',
      type: 'success'
    })
    await post(`/settlements/${settlement.id || settlement.settlement_id}/pay`)
    ElMessage.success('已标记为已支付')
    fetchSettlements()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// Get action button
function getAction(settlement) {
  switch (settlement.status) {
    case 'pending':
      return { label: '审核', type: 'primary', action: () => handleApprove(settlement) }
    case 'approved':
      return { label: '支付', type: 'success', action: () => handlePay(settlement) }
    default:
      return { label: '查看', type: 'info', action: () => {} }
  }
}

onMounted(() => {
  fetchSettlements()
})
</script>

<template>
  <div class="settlement-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">工资结算</h1>
        <p class="page-subtitle">管理打手工资结算</p>
      </div>
      <div class="header-actions">
        <el-button @click="fetchSettlements">🔄 刷新</el-button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <ButterflyCard class="stat-card">
        <div class="stat-content">
          <span class="stat-icon">⏰</span>
          <div class="stat-info">
            <p class="stat-value">{{ formatCurrency(stats.pendingAmount) }}</p>
            <p class="stat-label">待结算</p>
          </div>
        </div>
      </ButterflyCard>
      <ButterflyCard class="stat-card">
        <div class="stat-content">
          <span class="stat-icon">✅</span>
          <div class="stat-info">
            <p class="stat-value">{{ formatCurrency(stats.approvedAmount) }}</p>
            <p class="stat-label">已审核</p>
          </div>
        </div>
      </ButterflyCard>
      <ButterflyCard class="stat-card">
        <div class="stat-content">
          <span class="stat-icon">💰</span>
          <div class="stat-info">
            <p class="stat-value">{{ formatCurrency(stats.paidAmount) }}</p>
            <p class="stat-label">已支付</p>
          </div>
        </div>
      </ButterflyCard>
      <ButterflyCard class="stat-card">
        <div class="stat-content">
          <span class="stat-icon">👥</span>
          <div class="stat-info">
            <p class="stat-value">{{ stats.totalPlayers }}</p>
            <p class="stat-label">打手总数</p>
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
            placeholder="搜索打手名称..."
            prefix-icon="Search"
            clearable
            style="width: 200px"
            @keyup.enter="handleFilter"
          />
          <el-select
            v-model="filterForm.status"
            placeholder="结算状态"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>
        <div class="filter-right">
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
        </div>
      </div>
    </ButterflyCard>

    <!-- Settlements Table -->
    <ButterflyCard class="table-card" padding="0">
      <el-table v-loading="loading" :data="settlements" stripe>
        <el-table-column prop="playerName" label="打手" width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.player_name || row.playerName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="150" align="center">
          <template #default="{ row }">
            <span class="order-no">{{ row.order_no || row.orderNo || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="grossAmount" label="订单金额" width="100" align="center">
          <template #default="{ row }">
            <span class="amount">{{ formatCurrency(row.gross_amount || row.grossAmount || row.totalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="studioFee" label="平台费" width="100" align="center">
          <template #default="{ row }">
            <span class="fee">{{ formatCurrency(row.studio_fee || row.studioFee) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="managerFee" label="店长费" width="100" align="center">
          <template #default="{ row }">
            <span class="fee">{{ formatCurrency(row.manager_fee || row.managerFee) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="netAmount" label="结算金额" width="120" align="center">
          <template #default="{ row }">
            <span class="settled">{{ formatCurrency(row.net_amount || row.netAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" align="center">
          <template #default="{ row }">
            <span class="time">{{ formatDateTime(row.created_at || row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paidAt" label="支付时间" width="160" align="center">
          <template #default="{ row }">
            <span class="time">{{ row.paid_at || row.paidAt ? formatDateTime(row.paid_at || row.paidAt) : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button 
              :type="getAction(row).type" 
              size="small" 
              text
              @click="getAction(row).action"
            >
              {{ getAction(row).label }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="1"
          :page-size="20"
          :total="settlements.length"
          layout="total, prev, pager, next"
        />
      </div>
    </ButterflyCard>
  </div>
</template>

<style scoped lang="scss">
.settlement-page { max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #4a4a4a; }
.page-subtitle { margin: 0; font-size: 14px; color: #888; }
.header-actions { display: flex; gap: 12px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
.stat-content { display: flex; align-items: center; gap: 16px; justify-content: center; }
.stat-icon { font-size: 32px; }
.stat-value { margin: 0; font-size: 20px; font-weight: 700; color: #4a4a4a; }
.stat-label { margin: 4px 0 0; font-size: 13px; color: #888; }

.filter-card { margin-bottom: 20px; }
.filter-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filter-left { display: flex; gap: 12px; flex-wrap: wrap; }
.filter-right { display: flex; gap: 8px; }

.table-card { overflow: hidden; }

.order-no { font-family: monospace; color: #B8A9D9; }
.amount { font-weight: 600; color: #4a4a4a; }
.fee { color: #888; font-size: 13px; }
.settled { font-weight: 600; color: #67c23a; }
.time { font-size: 13px; color: #888; }

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 1px solid rgba(#B8A9D9, 0.1);
}

:deep(.el-table) {
  th.el-table__cell {
    text-align: center;
  }
}
</style>
