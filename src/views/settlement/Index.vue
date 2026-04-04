<script setup>
import { ref, onMounted } from 'vue'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatCurrency, formatDate } from '@/utils/format'

const loading = ref(true)
const settlements = ref([])
const stats = ref({
  pendingAmount: 0,
  processingAmount: 0,
  completedAmount: 0,
  totalPlayers: 0
})

async function fetchData() {
  loading.value = true
  try {
    // Mock data
    stats.value = {
      pendingAmount: 15680,
      processingAmount: 10800,
      completedAmount: 89600,
      totalPlayers: 24
    }
    settlements.value = [
      {
        id: 1,
        playerName: '蝴蝶小王子',
        period: '2024-03',
        totalOrders: 45,
        totalAmount: 8500,
        platformFee: 850,
        settledAmount: 7650,
        status: 'completed',
        paidAt: '2024-04-01 10:00:00'
      },
      {
        id: 2,
        playerName: '云端漫步',
        period: '2024-03',
        totalOrders: 28,
        totalAmount: 5200,
        platformFee: 520,
        settledAmount: 4680,
        status: 'pending'
      },
      {
        id: 3,
        playerName: '暗夜精灵',
        period: '2024-03',
        totalOrders: 62,
        totalAmount: 12000,
        platformFee: 1200,
        settledAmount: 10800,
        status: 'processing'
      },
      {
        id: 4,
        playerName: '雷霆战魂',
        period: '2024-03',
        totalOrders: 35,
        totalAmount: 6800,
        platformFee: 680,
        settledAmount: 6120,
        status: 'pending'
      }
    ]
  } finally {
    loading.value = false
  }
}

function getStatusType(status) {
  const map = { pending: 'warning', processing: 'primary', completed: 'success' }
  return map[status] || 'info'
}

function getStatusText(status) {
  const map = { pending: '待结算', processing: '结算中', completed: '已结算' }
  return map[status] || status
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="settlement-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">工资结算</h1>
        <p class="page-subtitle">管理打手工资结算</p>
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
          <span class="stat-icon">🔄</span>
          <div class="stat-info">
            <p class="stat-value">{{ formatCurrency(stats.processingAmount) }}</p>
            <p class="stat-label">结算中</p>
          </div>
        </div>
      </ButterflyCard>
      <ButterflyCard class="stat-card">
        <div class="stat-content">
          <span class="stat-icon">✅</span>
          <div class="stat-info">
            <p class="stat-value">{{ formatCurrency(stats.completedAmount) }}</p>
            <p class="stat-label">已结算</p>
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

    <!-- Settlements Table -->
    <ButterflyCard title="结算列表" subtitle="Settlement List" padding="0">
      <el-table v-loading="loading" :data="settlements" stripe>
        <el-table-column prop="playerName" label="打手" width="120" />
        <el-table-column prop="period" label="结算周期" width="100" />
        <el-table-column prop="totalOrders" label="完成订单" width="100" align="center" />
        <el-table-column prop="totalAmount" label="总金额" width="100">
          <template #default="{ row }">
            <span class="amount">{{ formatCurrency(row.totalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platformFee" label="平台费" width="100">
          <template #default="{ row }">
            <span class="fee">{{ formatCurrency(row.platformFee) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="settledAmount" label="结算金额" width="120">
          <template #default="{ row }">
            <span class="settled">{{ formatCurrency(row.settledAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paidAt" label="支付时间" width="160">
          <template #default="{ row }">
            {{ row.paidAt ? formatDate(row.paidAt) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text>
              {{ row.status === 'pending' ? '审核' : row.status === 'processing' ? '支付' : '查看' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </ButterflyCard>
  </div>
</template>

<style scoped lang="scss">
.settlement-page { max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
.page-title { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #4a4a4a; }
.page-subtitle { margin: 0; font-size: 14px; color: #888; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
.stat-content { display: flex; align-items: center; gap: 16px; }
.stat-icon { font-size: 32px; }
.stat-value { margin: 0; font-size: 24px; font-weight: 700; color: #4a4a4a; }
.stat-label { margin: 4px 0 0; font-size: 14px; color: #888; }
.amount { font-weight: 600; color: #4a4a4a; }
.fee { color: #888; }
.settled { font-weight: 600; color: #B8A9D9; }
</style>
