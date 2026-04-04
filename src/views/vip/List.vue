<script setup>
import { ref, onMounted } from 'vue'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatCurrency, formatDate } from '@/utils/format'
import { VIP_LEVEL_TEXT } from '@/utils/constants'

const loading = ref(true)
const vips = ref([])
const stats = ref({
  total: 0,
  totalBalance: 0,
  totalRecharge: 0,
  newThisMonth: 0
})

const levelColors = {
  1: '#CD7F32',
  2: '#C0C0C0',
  3: '#FFD700',
  4: '#E5E4E2',
  5: '#B9F2FF'
}

async function fetchVIPs() {
  loading.value = true
  try {
    stats.value = { total: 89, totalBalance: 156000, totalRecharge: 580000, newThisMonth: 12 }
    vips.value = [
      { id: 1, nickname: '至尊VIP会员', phone: '137****7001', level: 5, balance: 5000, totalRecharge: 20000, totalOrders: 45, createdAt: '2023-06-01' },
      { id: 2, nickname: '黄金会员', phone: '137****7002', level: 3, balance: 1200, totalRecharge: 3000, totalOrders: 12, createdAt: '2023-09-15' },
      { id: 3, nickname: '铂金会员', phone: '137****7003', level: 4, balance: 3500, totalRecharge: 8000, totalOrders: 28, createdAt: '2024-01-10' },
      { id: 4, nickname: '白银会员', phone: '137****7004', level: 2, balance: 500, totalRecharge: 1000, totalOrders: 5, createdAt: '2024-02-20' },
      { id: 5, nickname: '钻石会员', phone: '137****7005', level: 5, balance: 8000, totalRecharge: 15000, totalOrders: 38, createdAt: '2023-08-01' }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchVIPs())
</script>

<template>
  <div class="vip-list">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">VIP列表</h1>
        <p class="page-subtitle">管理所有VIP会员</p>
      </div>
      <el-button type="primary">+ 添加VIP</el-button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <ButterflyCard><div class="stat"><span class="icon">👥</span><div><p class="value">{{ stats.total }}</p><p class="label">VIP总数</p></div></div></ButterflyCard>
      <ButterflyCard><div class="stat"><span class="icon">💰</span><div><p class="value">{{ formatCurrency(stats.totalBalance) }}</p><p class="label">总余额</p></div></div></ButterflyCard>
      <ButterflyCard><div class="stat"><span class="icon">💎</span><div><p class="value">{{ formatCurrency(stats.totalRecharge) }}</p><p class="label">累计充值</p></div></div></ButterflyCard>
      <ButterflyCard><div class="stat"><span class="icon">⭐</span><div><p class="value">{{ stats.newThisMonth }}</p><p class="label">本月新增</p></div></div></ButterflyCard>
    </div>

    <!-- VIP Grid -->
    <div class="vip-grid">
      <ButterflyCard v-for="vip in vips" :key="vip.id" hoverable>
        <div class="vip-card">
          <div class="vip-level-badge" :style="{ background: levelColors[vip.level] }">
            {{ VIP_LEVEL_TEXT[vip.level] }}
          </div>
          <el-avatar :size="64" class="vip-avatar">{{ vip.nickname?.charAt(0) }}</el-avatar>
          <h3 class="vip-name">{{ vip.nickname }}</h3>
          <p class="vip-phone">{{ vip.phone }}</p>
          <div class="vip-stats">
            <div class="stat"><span class="value">{{ formatCurrency(vip.balance) }}</span><span class="label">余额</span></div>
            <div class="stat"><span class="value">{{ formatCurrency(vip.totalRecharge) }}</span><span class="label">累计充值</span></div>
          </div>
          <div class="vip-meta">
            <span>订单: {{ vip.totalOrders }}</span>
            <span>注册: {{ formatDate(vip.createdAt) }}</span>
          </div>
        </div>
      </ButterflyCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vip-list { max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #4a4a4a; }
.page-subtitle { margin: 0; font-size: 14px; color: #888; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
.stat { display: flex; align-items: center; gap: 12px; .icon { font-size: 28px; } .value { margin: 0; font-size: 22px; font-weight: 700; color: #4a4a4a; } .label { margin: 2px 0 0; font-size: 13px; color: #888; } }
.vip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.vip-card { text-align: center; position: relative; }
.vip-level-badge { position: absolute; top: 0; right: 0; padding: 4px 12px; border-radius: 12px; color: #fff; font-size: 12px; font-weight: 600; }
.vip-avatar { background: linear-gradient(135deg, #B8A9D9, #FFB7B2); margin: 0 auto 12px; }
.vip-name { margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #4a4a4a; }
.vip-phone { margin: 0 0 16px; font-size: 13px; color: #888; }
.vip-stats { display: flex; justify-content: center; gap: 32px; padding: 16px 0; border-top: 1px solid rgba(#B8A9D9, 0.1); border-bottom: 1px solid rgba(#B8A9D9, 0.1); .stat .value { font-size: 16px; font-weight: 600; color: #B8A9D9; } .stat .label { font-size: 12px; color: #888; } }
.vip-meta { display: flex; justify-content: space-between; margin-top: 12px; font-size: 12px; color: #888; }
</style>
