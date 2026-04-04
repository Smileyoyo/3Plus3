<script setup>
import { ref, onMounted } from 'vue'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatDateTime } from '@/utils/format'

const loading = ref(true)
const logs = ref([])

async function fetchLogs() {
  loading.value = true
  try {
    logs.value = [
      { id: 1, playerName: '蝴蝶小王子', action: '创建结算', amount: 7650, operator: 'admin', remark: '3月份结算', createdAt: '2024-04-01 09:00:00' },
      { id: 2, playerName: '蝴蝶小王子', action: '审核通过', amount: 7650, operator: 'admin', remark: '审核通过', createdAt: '2024-04-01 09:30:00' },
      { id: 3, playerName: '蝴蝶小王子', action: '支付完成', amount: 7650, operator: 'admin', remark: '微信转账', createdAt: '2024-04-01 10:00:00' },
      { id: 4, playerName: '云端漫步', action: '创建结算', amount: 4680, operator: 'admin', remark: '3月份结算', createdAt: '2024-04-01 11:00:00' },
      { id: 5, playerName: '暗夜精灵', action: '创建结算', amount: 10800, operator: 'admin', remark: '3月份结算', createdAt: '2024-04-01 11:30:00' }
    ]
  } finally {
    loading.value = false
  }
}

function getActionType(action) {
  const map = { '创建结算': 'primary', '审核通过': 'success', '支付完成': 'success', '审核拒绝': 'danger' }
  return map[action] || 'info'
}

onMounted(() => fetchLogs())
</script>

<template>
  <div class="logs-page">
    <div class="page-header">
      <h1 class="page-title">结算日志</h1>
      <p class="page-subtitle">查看所有结算操作记录</p>
    </div>

    <ButterflyCard padding="0">
      <el-table v-loading="loading" :data="logs" stripe>
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="playerName" label="打手" width="120" />
        <el-table-column prop="action" label="操作" width="120">
          <template #default="{ row }">
            <el-tag :type="getActionType(row.action)" size="small">{{ row.action }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #B8A9D9">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </ButterflyCard>
  </div>
</template>

<style scoped lang="scss">
.logs-page { max-width: 1200px; margin: 0 auto; }
.page-header { margin-bottom: 24px; }
.page-title { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #4a4a4a; }
.page-subtitle { margin: 0; font-size: 14px; color: #888; }
</style>
