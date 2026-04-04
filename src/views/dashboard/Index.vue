<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatCurrency, formatRelativeTime } from '@/utils/format'
import { ORDER_STATUS_TEXT } from '@/utils/constants'

const router = useRouter()
const authStore = useAuthStore()
const orderStore = useOrderStore()

const loading = ref(true)
const stats = ref({
  todayOrders: 0,
  todayOrdersChange: 0,
  todayRevenue: 0,
  todayRevenueChange: 0,
  pendingOrders: 0,
  activePlayers: 0,
  monthlyRevenue: 0,
  monthlyRevenueChange: 0
})
const recentOrders = ref([])
const topPlayers = ref([])

// 统计数据
const statCards = computed(() => [
  {
    title: '今日订单',
    value: stats.value.todayOrders,
    change: stats.value.todayOrdersChange,
    icon: '📋',
    color: '#B8A9D9',
    gradient: 'linear-gradient(135deg, rgba(184, 169, 217, 0.2), rgba(184, 169, 217, 0.05))'
  },
  {
    title: '今日收入',
    value: formatCurrency(stats.value.todayRevenue),
    change: stats.value.todayRevenueChange,
    icon: '💰',
    color: '#FFB7B2',
    gradient: 'linear-gradient(135deg, rgba(255, 183, 178, 0.2), rgba(255, 183, 178, 0.05))'
  },
  {
    title: '待处理订单',
    value: stats.value.pendingOrders,
    icon: '⏰',
    color: '#F5E6D3',
    gradient: 'linear-gradient(135deg, rgba(245, 230, 211, 0.3), rgba(245, 230, 211, 0.1))'
  },
  {
    title: '在线打手',
    value: stats.value.activePlayers,
    icon: '🎮',
    color: '#B5EAD7',
    gradient: 'linear-gradient(135deg, rgba(181, 234, 215, 0.2), rgba(181, 234, 215, 0.05))'
  }
])

// 获取统计数据
async function fetchDashboardData() {
  loading.value = true
  try {
    // 模拟数据
    stats.value = {
      todayOrders: 23,
      todayOrdersChange: 15,
      todayRevenue: 12580,
      todayRevenueChange: 8,
      pendingOrders: 12,
      activePlayers: 18,
      monthlyRevenue: 358000,
      monthlyRevenueChange: 12
    }

    // 模拟最近订单
    recentOrders.value = [
      {
        id: 1001,
        orderNo: 'ORD202404010001',
        vipName: '至尊VIP会员',
        gameType: '王者荣耀',
        targetTier: '星耀V',
        price: 500,
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: 1002,
        orderNo: 'ORD202404010002',
        vipName: '黄金会员',
        gameType: '英雄联盟',
        targetTier: '黄金IV',
        price: 280,
        status: 'assigned',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      },
      {
        id: 1003,
        orderNo: 'ORD202404010003',
        vipName: '铂金会员',
        gameType: '王者荣耀',
        targetTier: '钻石V',
        price: 800,
        status: 'processing',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: 1004,
        orderNo: 'ORD202404010004',
        vipName: '白银会员',
        gameType: '和平精英',
        targetTier: '铂金V',
        price: 350,
        status: 'completed',
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
      }
    ]

    // 模拟热门打手
    topPlayers.value = [
      { id: 1, nickname: '蝴蝶小王子', completedOrders: 156, rating: 4.9, status: 'online' },
      { id: 4, nickname: '暗夜精灵', completedOrders: 312, rating: 4.95, status: 'online' },
      { id: 3, nickname: '星光刺客', completedOrders: 234, rating: 4.7, status: 'offline' }
    ]
  } catch (error) {
    console.error('Fetch dashboard data error:', error)
  } finally {
    loading.value = false
  }
}

function goToOrder(order) {
  router.push(`/order?id=${order.id}`)
}

function goToOrderList() {
  router.push('/order')
}

function goToPlayerList() {
  router.push('/player')
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <h1 class="welcome-title">
        👋 你好，{{ authStore.userName }}
      </h1>
      <p class="welcome-subtitle">
        今天是美好的一天！来看看今天的运营数据吧 🌸
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <ButterflyCard 
        v-for="(stat, index) in statCards" 
        :key="index"
        class="stat-card"
        hoverable
      >
        <div class="stat-content" :style="{ background: stat.gradient }">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-info">
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-title">{{ stat.title }}</p>
          </div>
        </div>
        <div v-if="stat.change" class="stat-change" :class="{ positive: stat.change > 0 }">
          {{ stat.change > 0 ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%
        </div>
      </ButterflyCard>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Recent Orders -->
      <ButterflyCard title="最近订单" subtitle="Latest Orders" class="orders-card">
        <template #header>
          <div class="card-header-actions">
            <el-button type="primary" text @click="goToOrderList">
              查看全部 →
            </el-button>
          </div>
        </template>

        <div class="orders-list">
          <div 
            v-for="order in recentOrders" 
            :key="order.id"
            class="order-item"
            @click="goToOrder(order)"
          >
            <div class="order-info">
              <p class="order-no">{{ order.orderNo }}</p>
              <p class="order-detail">
                <span>{{ order.vipName }}</span>
                <span class="separator">•</span>
                <span>{{ order.gameType }}</span>
                <span class="separator">•</span>
                <span>{{ order.targetTier }}</span>
              </p>
            </div>
            <div class="order-meta">
              <p class="order-price">¥{{ order.price }}</p>
              <el-tag 
                :type="order.status === 'completed' ? 'success' : order.status === 'processing' ? 'primary' : 'warning'"
                size="small"
              >
                {{ ORDER_STATUS_TEXT[order.status] }}
              </el-tag>
              <p class="order-time">{{ formatRelativeTime(order.createdAt) }}</p>
            </div>
          </div>
        </div>
      </ButterflyCard>

      <!-- Top Players -->
      <ButterflyCard title="热门打手" subtitle="Top Players" class="players-card">
        <template #header>
          <div class="card-header-actions">
            <el-button type="primary" text @click="goToPlayerList">
              查看全部 →
            </el-button>
          </div>
        </template>

        <div class="players-list">
          <div 
            v-for="(player, index) in topPlayers" 
            :key="player.id"
            class="player-item"
          >
            <div class="player-rank" :class="{ gold: index === 0 }">
              {{ index + 1 }}
            </div>
            <el-avatar :size="40" class="player-avatar">
              {{ player.nickname?.charAt(0) }}
            </el-avatar>
            <div class="player-info">
              <p class="player-name">{{ player.nickname }}</p>
              <p class="player-stats">
                <span>完成 {{ player.completedOrders }}</span>
                <span class="separator">•</span>
                <span>⭐ {{ player.rating }}</span>
              </p>
            </div>
            <div class="player-status" :class="player.status">
              {{ player.status === 'online' ? '在线' : '离线' }}
            </div>
          </div>
        </div>
      </ButterflyCard>
    </div>

    <!-- Quick Actions -->
    <ButterflyCard title="快捷操作" subtitle="Quick Actions" class="actions-card">
      <div class="quick-actions">
        <button class="action-btn" @click="router.push('/order')">
          <span class="action-icon">📋</span>
          <span class="action-text">处理订单</span>
        </button>
        <button class="action-btn" @click="router.push('/player')">
          <span class="action-icon">👤</span>
          <span class="action-text">管理打手</span>
        </button>
        <button class="action-btn" @click="router.push('/vip')">
          <span class="action-icon">⭐</span>
          <span class="action-text">VIP管理</span>
        </button>
        <button class="action-btn" @click="router.push('/settlement')">
          <span class="action-icon">💰</span>
          <span class="action-text">工资结算</span>
        </button>
      </div>
    </ButterflyCard>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

// Welcome Section
.welcome-section {
  margin-bottom: 32px;
}

.welcome-title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: #4a4a4a;
}

.welcome-subtitle {
  margin: 0;
  font-size: 16px;
  color: #888;
}

// Stats Grid
.stats-grid {
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
  font-size: 28px;
  font-weight: 700;
  color: #4a4a4a;
  line-height: 1.2;
}

.stat-title {
  margin: 4px 0 0;
  font-size: 14px;
  color: #888;
}

.stat-change {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 2px 8px;
  background: rgba(#FFB7B2, 0.2);
  border-radius: 10px;
  font-size: 12px;
  color: #c97070;

  &.positive {
    background: rgba(#B5EAD7, 0.2);
    color: #5a9a7a;
  }
}

// Content Grid
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.card-header-actions {
  display: flex;
  justify-content: flex-end;
}

// Orders List
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(#B8A9D9, 0.1);
    transform: translateX(4px);
  }
}

.order-info {
  .order-no {
    margin: 0 0 4px;
    font-weight: 600;
    color: #4a4a4a;
  }

  .order-detail {
    margin: 0;
    font-size: 13px;
    color: #888;

    .separator {
      margin: 0 6px;
      color: #ddd;
    }
  }
}

.order-meta {
  text-align: right;

  .order-price {
    margin: 0 0 4px;
    font-weight: 600;
    color: #B8A9D9;
  }

  .order-time {
    margin: 4px 0 0;
    font-size: 12px;
    color: #aaa;
  }
}

// Players List
.players-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(#B8A9D9, 0.1);
  }
}

.player-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(#B8A9D9, 0.2);
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #8a7aa9;

  &.gold {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #fff;
  }
}

.player-avatar {
  background: linear-gradient(135deg, #B8A9D9, #FFB7B2);
}

.player-info {
  flex: 1;

  .player-name {
    margin: 0;
    font-weight: 600;
    color: #4a4a4a;
  }

  .player-stats {
    margin: 2px 0 0;
    font-size: 12px;
    color: #888;

    .separator {
      margin: 0 4px;
      color: #ddd;
    }
  }
}

.player-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  &.online {
    background: rgba(#B5EAD7, 0.3);
    color: #5a9a7a;
  }

  &.offline {
    background: rgba(#B8A9D9, 0.2);
    color: #8a7aa9;
  }

  &.busy {
    background: rgba(#F5E6D3, 0.4);
    color: #a67c52;
  }
}

// Quick Actions
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(#B8A9D9, 0.15);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(#B8A9D9, 0.1);
    border-color: #B8A9D9;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(#B8A9D9, 0.15);
  }

  .action-icon {
    font-size: 32px;
  }

  .action-text {
    font-size: 14px;
    font-weight: 500;
    color: #6a6a6a;
  }
}
</style>
