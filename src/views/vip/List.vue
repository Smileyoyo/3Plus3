<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useVIPStore } from '@/stores/vip'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatCurrency, formatDate } from '@/utils/format'
import { VIP_LEVEL, VIP_LEVEL_TEXT, DEFAULT_PAGE_SIZE } from '@/utils/constants'
import { ElMessage, ElMessageBox } from 'element-plus'

const vipStore = useVIPStore()
const loading = ref(true)
const showAddDialog = ref(false)
const showRechargeDialog = ref(false)
const addLoading = ref(false)
const rechargeLoading = ref(false)
const editMode = ref(false)

// Add/Edit form
const addForm = reactive({
  id: null,
  nickname: '',
  phone: '',
  level: 1,
  balance: 0,
  remark: ''
})

// Recharge form
const rechargeForm = reactive({
  vipId: null,
  vipName: '',
  amount: 0,
  type: 'balance'
})

// Filter form
const filterForm = reactive({
  level: '',
  keyword: ''
})

// Level options
const levelOptions = Object.entries(VIP_LEVEL_TEXT).map(([value, label]) => ({
  label,
  value: Number(value)
}))

// Level colors
const levelColors = {
  [VIP_LEVEL.BRONZE]: '#CD7F32',
  [VIP_LEVEL.SILVER]: '#C0C0C0',
  [VIP_LEVEL.GOLD]: '#FFD700',
  [VIP_LEVEL.PLATINUM]: '#E5E4E2',
  [VIP_LEVEL.DIAMOND]: '#B9F2FF'
}

const stats = computed(() => vipStore.vipStats)

async function fetchVIPs() {
  loading.value = true
  try {
    const params = {}
    if (filterForm.level) params.level = filterForm.level
    if (filterForm.keyword) params.keyword = filterForm.keyword
    
    await vipStore.fetchVIPs(params)
  } finally {
    loading.value = false
  }
}

// Handle filter
function handleFilter() {
  vipStore.setFilters(filterForm)
  fetchVIPs()
}

// Reset filter
function resetFilter() {
  Object.assign(filterForm, {
    level: '',
    keyword: ''
  })
  vipStore.resetFilters()
  fetchVIPs()
}

// Handle pagination
function handlePageChange(page) {
  vipStore.setPage(page)
  fetchVIPs()
}

function handleSizeChange(size) {
  vipStore.setPageSize(size)
  fetchVIPs()
}

// Open add dialog
function openAddDialog() {
  editMode.value = false
  Object.assign(addForm, {
    id: null,
    nickname: '',
    phone: '',
    level: 1,
    balance: 0,
    remark: ''
  })
  showAddDialog.value = true
}

// Open edit dialog
function openEditDialog(vip) {
  editMode.value = true
  Object.assign(addForm, {
    id: vip.id,
    nickname: vip.nickname,
    phone: vip.phone,
    level: vip.level,
    balance: vip.balance,
    remark: vip.remark
  })
  showAddDialog.value = true
}

// Submit add/edit
async function submitForm() {
  if (!addForm.nickname) {
    ElMessage.warning('请填写VIP名称')
    return
  }
  
  addLoading.value = true
  try {
    if (editMode.value) {
      await vipStore.update(addForm.id, addForm)
      ElMessage.success('VIP信息已更新')
    } else {
      await vipStore.create(addForm)
      ElMessage.success('VIP添加成功')
    }
    showAddDialog.value = false
    fetchVIPs()
  } catch (error) {
    ElMessage.error(editMode.value ? '更新失败' : '添加失败')
  } finally {
    addLoading.value = false
  }
}

// Delete VIP
async function handleDelete(vip) {
  try {
    await ElMessageBox.confirm(`确定要删除VIP "${vip.nickname}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await vipStore.remove(vip.id)
    ElMessage.success('已删除')
    fetchVIPs()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// Open recharge dialog
function openRechargeDialog(vip) {
  Object.assign(rechargeForm, {
    vipId: vip.id,
    vipName: vip.nickname,
    amount: 0,
    type: 'balance'
  })
  showRechargeDialog.value = true
}

// Submit recharge
async function submitRecharge() {
  if (!rechargeForm.amount || rechargeForm.amount <= 0) {
    ElMessage.warning('请输入充值金额')
    return
  }
  
  rechargeLoading.value = true
  try {
    await vipStore.recharge(rechargeForm.vipId, rechargeForm.amount, rechargeForm.type)
    ElMessage.success(`充值成功，已充值 ${formatCurrency(rechargeForm.amount)}`)
    showRechargeDialog.value = false
    fetchVIPs()
  } catch (error) {
    ElMessage.error('充值失败')
  } finally {
    rechargeLoading.value = false
  }
}

// Upgrade level
async function handleUpgrade(vip, level) {
  try {
    await ElMessageBox.confirm(`确定要将 "${vip.nickname}" 升级为 ${VIP_LEVEL_TEXT[level]} 吗？`, '升级VIP等级', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    await vipStore.upgradeLevel(vip.id, level)
    ElMessage.success('升级成功')
    fetchVIPs()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('升级失败')
    }
  }
}

onMounted(() => {
  fetchVIPs()
})
</script>

<template>
  <div class="vip-list">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">VIP列表</h1>
        <p class="page-subtitle">管理所有VIP会员</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="openAddDialog">+ 添加VIP</el-button>
        <el-button @click="fetchVIPs">🔄 刷新</el-button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-item" :class="{ active: !filterForm.level }" @click="filterForm.level = ''; handleFilter()">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">VIP总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ formatCurrency(stats.totalBalance) }}</span>
        <span class="stat-label">总余额</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ formatCurrency(stats.totalRecharge) }}</span>
        <span class="stat-label">累计充值</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ formatCurrency(stats.totalSpent) }}</span>
        <span class="stat-label">累计消费</span>
      </div>
      <div class="stat-item diamond" :class="{ active: filterForm.level === 5 }" @click="filterForm.level = 5; handleFilter()">
        <span class="stat-value">{{ stats.levelCounts?.diamond || 0 }}</span>
        <span class="stat-label">钻石会员</span>
      </div>
    </div>

    <!-- Filter Bar -->
    <ButterflyCard class="filter-card" padding="16px">
      <div class="filter-bar">
        <div class="filter-left">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索VIP名称/手机号..."
            prefix-icon="Search"
            clearable
            style="width: 240px"
            @keyup.enter="handleFilter"
          />
          <el-select
            v-model="filterForm.level"
            placeholder="会员等级"
            clearable
            style="width: 140px"
          >
            <el-option
              v-for="level in levelOptions"
              :key="level.value"
              :label="level.label"
              :value="level.value"
            />
          </el-select>
        </div>
        <div class="filter-right">
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
        </div>
      </div>
    </ButterflyCard>

    <!-- VIP Table -->
    <ButterflyCard class="table-card" padding="0">
      <el-table
        v-loading="loading"
        :data="vipStore.vips"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="nickname" label="VIP客户" width="180" align="center">
          <template #default="{ row }">
            <div class="vip-cell">
              <el-avatar :size="40" class="vip-avatar">{{ row.nickname?.charAt(0) }}</el-avatar>
              <div class="vip-info">
                <span class="vip-name">{{ row.nickname }}</span>
                <span class="vip-phone">{{ row.phone }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="level" label="等级" width="100" align="center">
          <template #default="{ row }">
            <el-tag 
              class="level-tag"
              :style="{ background: levelColors[row.level], color: '#fff' }"
            >
              {{ VIP_LEVEL_TEXT[row.level] }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="balance" label="余额" width="120" align="center">
          <template #default="{ row }">
            <span class="balance">{{ formatCurrency(row.balance) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="totalRecharge" label="累计充值" width="120" align="center">
          <template #default="{ row }">
            <span class="recharge">{{ formatCurrency(row.totalRecharge) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="totalSpent" label="累计消费" width="120" align="center">
          <template #default="{ row }">
            <span class="spent">{{ formatCurrency(row.totalSpent || 0) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="totalOrders" label="订单数" width="100" align="center">
          <template #default="{ row }">
            <span class="order-count">{{ row.totalOrders || 0 }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="注册时间" width="120" align="center">
          <template #default="{ row }">
            <span class="time">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="280" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button size="small" text type="primary" @click="openEditDialog(row)">编辑</el-button>
              <el-button size="small" text type="success" @click="openRechargeDialog(row)">充值</el-button>
              <el-dropdown @command="(cmd) => handleUpgrade(row, cmd)">
                <el-button size="small" text type="warning">
                  升级 <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item 
                      v-for="level in levelOptions.filter(l => l.value > row.level)" 
                      :key="level.value"
                      :command="level.value"
                    >
                      {{ level.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button size="small" text type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="vipStore.pagination.page"
          v-model:page-size="vipStore.pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="vipStore.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </ButterflyCard>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="showAddDialog" :title="editMode ? '编辑VIP' : '添加VIP'" width="500px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="客户名称" required>
          <el-input v-model="addForm.nickname" placeholder="VIP名称" />
        </el-form-item>
        
        <el-form-item label="手机号">
          <el-input v-model="addForm.phone" placeholder="联系电话" />
        </el-form-item>
        
        <el-form-item label="会员等级">
          <el-select v-model="addForm.level" placeholder="选择等级" style="width: 100%">
            <el-option
              v-for="level in levelOptions"
              :key="level.value"
              :label="level.label"
              :value="level.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="初始余额">
          <el-input v-model="addForm.balance" type="number" placeholder="初始余额">
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="2" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="submitForm">
          {{ editMode ? '保存' : '添加' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Recharge Dialog -->
    <el-dialog v-model="showRechargeDialog" title="VIP充值" width="400px">
      <div class="recharge-info">
        <p>VIP客户：<strong>{{ rechargeForm.vipName }}</strong></p>
      </div>
      <el-form :model="rechargeForm" label-width="80px" style="margin-top: 16px">
        <el-form-item label="充值金额" required>
          <el-input v-model="rechargeForm.amount" type="number" placeholder="输入金额">
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="充值类型">
          <el-radio-group v-model="rechargeForm.type">
            <el-radio value="balance">余额充值</el-radio>
            <el-radio value="gift">赠送金额</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showRechargeDialog = false">取消</el-button>
        <el-button type="primary" :loading="rechargeLoading" @click="submitRecharge">
          确认充值
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.vip-list { max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #4a4a4a; }
.page-subtitle { margin: 0; font-size: 14px; color: #888; }
.header-actions { display: flex; gap: 12px; }

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
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
    
    &:hover { transform: translateY(-2px); }
    &.active { border-color: #B8A9D9; background: rgba(#B8A9D9, 0.1); }
    
    .stat-value { font-size: 20px; font-weight: 700; color: #4a4a4a; }
    .stat-label { font-size: 13px; color: #888; margin-top: 4px; }
    &.diamond .stat-value { color: #B9F2FF; text-shadow: 0 0 10px rgba(#B9F2FF, 0.5); }
  }
}

.filter-card { margin-bottom: 20px; }
.filter-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filter-left { display: flex; gap: 12px; flex-wrap: wrap; }
.filter-right { display: flex; gap: 8px; }

.table-card { overflow: hidden; }

.vip-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  
  .vip-avatar { background: linear-gradient(135deg, #B8A9D9, #FFB7B2); }
  .vip-info { display: flex; flex-direction: column; gap: 2px; text-align: left; }
  .vip-name { font-weight: 600; color: #4a4a4a; }
  .vip-phone { font-size: 12px; color: #888; }
}

.level-tag {
  border: none;
  font-weight: 600;
}

.balance { font-weight: 600; color: #67c23a; }
.recharge { font-weight: 600; color: #B8A9D9; }
.spent { font-weight: 600; color: #e6a23c; }
.order-count { font-weight: 500; color: #4a4a4a; }
.time { font-size: 13px; color: #888; }

.action-btns { display: flex; gap: 4px; justify-content: center; }

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 1px solid rgba(#B8A9D9, 0.1);
}

.recharge-info {
  padding: 12px 16px;
  background: rgba(#B8A9D9, 0.1);
  border-radius: 12px;
  
  p { margin: 0; color: #6a6a6a; }
  strong { color: #4a4a4a; }
}
</style>
