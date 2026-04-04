<script setup>
import { ref, onMounted } from 'vue'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatDateTime } from '@/utils/format'

const loading = ref(true)
const users = ref([])

async function fetchUsers() {
  loading.value = true
  try {
    users.value = [
      { id: 1, username: 'admin', nickname: '管理员', role: 'admin', email: 'admin@3plus3.com', phone: '138****8000', lastLogin: '2024-04-01 18:00:00', createdAt: '2024-01-01 00:00:00' },
      { id: 2, username: 'manager', nickname: '运营经理', role: 'manager', email: 'manager@3plus3.com', phone: '138****8001', lastLogin: '2024-04-01 17:30:00', createdAt: '2024-01-15 00:00:00' },
      { id: 3, username: 'operator1', nickname: '操作员小王', role: 'operator', email: 'op1@3plus3.com', phone: '138****8002', lastLogin: '2024-04-01 16:00:00', createdAt: '2024-02-01 00:00:00' }
    ]
  } finally {
    loading.value = false
  }
}

function getRoleText(role) {
  const map = { admin: '管理员', manager: '经理', operator: '操作员' }
  return map[role] || role
}

function getRoleType(role) {
  const map = { admin: 'danger', manager: 'warning', operator: 'primary' }
  return map[role] || 'info'
}

onMounted(() => fetchUsers())
</script>

<template>
  <div class="user-management">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">用户管理</h1>
        <p class="page-subtitle">管理系统用户和权限</p>
      </div>
      <el-button type="primary">+ 添加用户</el-button>
    </div>

    <ButterflyCard padding="0">
      <el-table v-loading="loading" :data="users" stripe>
        <el-table-column prop="nickname" label="姓名" width="120">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="36">{{ row.nickname?.charAt(0) }}</el-avatar>
              <div>
                <p class="name">{{ row.nickname }}</p>
                <p class="username">@{{ row.username }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)" size="small">{{ getRoleText(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="lastLogin" label="最后登录" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.lastLogin) }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text>编辑</el-button>
            <el-button v-if="row.role !== 'admin'" type="danger" size="small" text>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ButterflyCard>
  </div>
</template>

<style scoped lang="scss">
.user-management { max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #4a4a4a; }
.page-subtitle { margin: 0; font-size: 14px; color: #888; }
.user-cell { display: flex; align-items: center; gap: 10px; :deep(.el-avatar) { background: linear-gradient(135deg, #B8A9D9, #FFB7B2); } .name { margin: 0; font-weight: 600; color: #4a4a4a; } .username { margin: 0; font-size: 12px; color: #888; } }
</style>
