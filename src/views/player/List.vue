<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatCurrency, formatDate } from '@/utils/format'
import { PLAYER_STATUS, PLAYER_STATUS_TEXT, PLAYER_STATUS_COLOR } from '@/utils/constants'

const playerStore = usePlayerStore()
const loading = ref(true)
const showAddDialog = ref(false)

const statusOptions = Object.entries(PLAYER_STATUS_TEXT).map(([value, label]) => ({ label, value }))

const stats = computed(() => playerStore.playerStats)

async function fetchPlayers() {
  loading.value = true
  try {
    await playerStore.fetchPlayers()
  } finally {
    loading.value = false
  }
}

function getStatusClass(status) {
  return `status-${status}`
}

onMounted(() => {
  fetchPlayers()
})
</script>

<template>
  <div class="player-list">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">打手列表</h1>
        <p class="page-subtitle">管理所有游戏陪练打手</p>
      </div>
      <el-button type="primary" @click="showAddDialog = true">+ 添加打手</el-button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">总人数</span>
      </div>
      <div class="stat-item online">
        <span class="stat-value">{{ stats.online }}</span>
        <span class="stat-label">在线</span>
      </div>
      <div class="stat-item busy">
        <span class="stat-value">{{ stats.busy }}</span>
        <span class="stat-label">忙碌</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.avgRating }}</span>
        <span class="stat-label">平均评分</span>
      </div>
    </div>

    <!-- Players Grid -->
    <div class="players-grid">
      <ButterflyCard v-for="player in playerStore.players" :key="player.id" hoverable>
        <div class="player-card">
          <div class="player-header">
            <el-avatar :size="56" class="player-avatar">{{ player.nickname?.charAt(0) }}</el-avatar>
            <div :class="['player-status', player.status]">{{ PLAYER_STATUS_TEXT[player.status] }}</div>
          </div>
          <div class="player-info">
            <h3 class="player-name">{{ player.nickname }}</h3>
            <p class="player-game">{{ player.gameTier }} • {{ player.gameId }}</p>
          </div>
          <div class="player-stats">
            <div class="stat-item">
              <span class="value">{{ player.completedOrders }}</span>
              <span class="label">完成订单</span>
            </div>
            <div class="stat-item">
              <span class="value">{{ player.rating || '-' }}</span>
              <span class="label">评分</span>
            </div>
          </div>
          <div class="player-footer">
            <span class="balance">余额: {{ formatCurrency(player.balance) }}</span>
          </div>
        </div>
      </ButterflyCard>
    </div>

    <!-- Add Dialog -->
    <el-dialog v-model="showAddDialog" title="添加打手" width="500px">
      <p>添加打手功能开发中...</p>
      <template #footer>
        <el-button @click="showAddDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.player-list { max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #4a4a4a; }
.page-subtitle { margin: 0; font-size: 14px; color: #888; }

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    .value, .stat-value { font-size: 24px; font-weight: 700; color: #4a4a4a; }
    .label, .stat-label { font-size: 13px; color: #888; margin-top: 4px; }
    &.online .stat-value { color: #67c23a; }
    &.busy .stat-value { color: #e6a23c; }
  }
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.player-card {
  .player-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  .player-avatar { background: linear-gradient(135deg, #B8A9D9, #FFB7B2); }
  .player-status {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    &.online { background: rgba(#67c23a, 0.2); color: #67c23a; }
    &.offline { background: rgba(#909399, 0.2); color: #909399; }
    &.busy { background: rgba(#e6a23c, 0.2); color: #e6a23c; }
  }
  .player-name { margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #4a4a4a; }
  .player-game { margin: 0; font-size: 13px; color: #888; }
  .player-stats {
    display: flex;
    gap: 24px;
    margin: 16px 0;
    padding: 16px 0;
    border-top: 1px solid rgba(#B8A9D9, 0.1);
    border-bottom: 1px solid rgba(#B8A9D9, 0.1);
    .stat-item { text-align: center; }
    .value { font-size: 20px; font-weight: 700; color: #B8A9D9; }
    .label { font-size: 12px; color: #888; margin-top: 2px; }
  }
  .player-footer { display: flex; justify-content: space-between; align-items: center; }
  .balance { font-size: 14px; font-weight: 600; color: #67c23a; }
}
</style>
