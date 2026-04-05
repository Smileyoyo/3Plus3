<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatCurrency, formatDate } from '@/utils/format'
import { PLAYER_STATUS, PLAYER_STATUS_TEXT, PLAYER_STATUS_COLOR, DEFAULT_PAGE_SIZE } from '@/utils/constants'
import { ElMessage, ElMessageBox } from 'element-plus'

const playerStore = usePlayerStore()
const loading = ref(true)
const showAddDialog = ref(false)
const addLoading = ref(false)
const editMode = ref(false)

// Add/Edit form
const addForm = reactive({
  id: null,
  nickname: '',
  phone: '',
  gameId: '',
  gameTier: '',
  status: 'online'
})

// Filter form
const filterForm = reactive({
  status: '',
  gameTier: '',
  keyword: ''
})

// Status options
const statusOptions = Object.entries(PLAYER_STATUS_TEXT).map(([value, label]) => ({ label, value }))

// Game tier options
const gameTierOptions = [
  { label: '王者', value: '王者' },
  { label: '星耀', value: '星耀' },
  { label: '钻石', value: '钻石' },
  { label: '铂金', value: '铂金' },
  { label: '黄金', value: '黄金' },
  { label: '白银', value: '白银' },
  { label: '青铜', value: '青铜' }
]

const stats = computed(() => playerStore.playerStats)

async function fetchPlayers() {
  loading.value = true
  try {
    const params = {}
    if (filterForm.status) params.status = filterForm.status
    if (filterForm.gameTier) params.gameTier = filterForm.gameTier
    if (filterForm.keyword) params.keyword = filterForm.keyword
    
    await playerStore.fetchPlayers(params)
  } finally {
    loading.value = false
  }
}

// Handle filter
function handleFilter() {
  playerStore.setFilters(filterForm)
  fetchPlayers()
}

// Reset filter
function resetFilter() {
  Object.assign(filterForm, {
    status: '',
    gameTier: '',
    keyword: ''
  })
  playerStore.resetFilters()
  fetchPlayers()
}

// Handle pagination
function handlePageChange(page) {
  playerStore.setPage(page)
  fetchPlayers()
}

function handleSizeChange(size) {
  playerStore.setPageSize(size)
  fetchPlayers()
}

// Open add dialog
function openAddDialog() {
  editMode.value = false
  Object.assign(addForm, {
    id: null,
    nickname: '',
    phone: '',
    gameId: '',
    gameTier: '',
    status: 'online'
  })
  showAddDialog.value = true
}

// Open edit dialog
function openEditDialog(player) {
  editMode.value = true
  Object.assign(addForm, {
    id: player.id,
    nickname: player.nickname,
    phone: player.phone,
    gameId: player.gameId,
    gameTier: player.gameTier,
    status: player.status
  })
  showAddDialog.value = true
}

// Submit add/edit
async function submitForm() {
  if (!addForm.nickname) {
    ElMessage.warning('请填写打手昵称')
    return
  }
  
  addLoading.value = true
  try {
    if (editMode.value) {
      await playerStore.update(addForm.id, addForm)
      ElMessage.success('打手信息已更新')
    } else {
      await playerStore.create(addForm)
      ElMessage.success('打手添加成功')
    }
    showAddDialog.value = false
    fetchPlayers()
  } catch (error) {
    ElMessage.error(editMode.value ? '更新失败' : '添加失败')
  } finally {
    addLoading.value = false
  }
}

// Delete player
async function handleDelete(player) {
  try {
    await ElMessageBox.confirm(`确定要删除打手 "${player.nickname}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await playerStore.remove(player.id)
    ElMessage.success('已删除')
    fetchPlayers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// Update status
async function handleStatusChange(player, status) {
  try {
    await playerStore.updateStatus(player.id, status)
    ElMessage.success('状态已更新')
  } catch (error) {
    ElMessage.error('更新失败')
  }
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
      <div class="header-actions">
        <el-button type="primary" @click="openAddDialog">+ 添加打手</el-button>
        <el-button @click="fetchPlayers">🔄 刷新</el-button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-item" :class="{ active: !filterForm.status }" @click="filterForm.status = ''; handleFilter()">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">总人数</span>
      </div>
      <div class="stat-item online" :class="{ active: filterForm.status === 'online' }" @click="filterForm.status = 'online'; handleFilter()">
        <span class="stat-value">{{ stats.online }}</span>
        <span class="stat-label">在线</span>
      </div>
      <div class="stat-item busy" :class="{ active: filterForm.status === 'busy' }" @click="filterForm.status = 'busy'; handleFilter()">
        <span class="stat-value">{{ stats.busy }}</span>
        <span class="stat-label">忙碌</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.avgRating }}</span>
        <span class="stat-label">平均评分</span>
      </div>
    </div>

    <!-- Filter Bar -->
    <ButterflyCard class="filter-card" padding="16px">
      <div class="filter-bar">
        <div class="filter-left">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索打手昵称/游戏ID..."
            prefix-icon="Search"
            clearable
            style="width: 240px"
            @keyup.enter="handleFilter"
          />
          <el-select
            v-model="filterForm.gameTier"
            placeholder="段位"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="tier in gameTierOptions"
              :key="tier.value"
              :label="tier.label"
              :value="tier.value"
            />
          </el-select>
          <el-select
            v-model="filterForm.status"
            placeholder="状态"
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

    <!-- Players Table -->
    <ButterflyCard class="table-card" padding="0">
      <el-table
        v-loading="loading"
        :data="playerStore.players"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="nickname" label="打手" width="150">
          <template #default="{ row }">
            <div class="player-cell">
              <el-avatar :size="36" class="player-avatar">{{ row.nickname?.charAt(0) }}</el-avatar>
              <span class="player-name">{{ row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="gameId" label="游戏ID" width="140" />
        
        <el-table-column prop="gameTier" label="段位" width="100" />
        
        <el-table-column prop="phone" label="手机号" width="130" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="PLAYER_STATUS_COLOR[row.status]" size="small">
              {{ PLAYER_STATUS_TEXT[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="completedOrders" label="完成订单" width="100">
          <template #default="{ row }">
            <span class="order-count">{{ row.completedOrders || 0 }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="rating" label="评分" width="80">
          <template #default="{ row }">
            <span class="rating">⭐ {{ row.rating || '-' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="balance" label="余额" width="100">
          <template #default="{ row }">
            <span class="balance">{{ formatCurrency(row.balance) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button size="small" text type="primary" @click="openEditDialog(row)">编辑</el-button>
              <el-dropdown @command="(cmd) => handleStatusChange(row, cmd)">
                <el-button size="small" text type="warning">
                  状态 <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="online">在线</el-dropdown-item>
                    <el-dropdown-item command="busy">忙碌</el-dropdown-item>
                    <el-dropdown-item command="offline">离线</el-dropdown-item>
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
          v-model:current-page="playerStore.pagination.page"
          v-model:page-size="playerStore.pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="playerStore.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </ButterflyCard>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="showAddDialog" :title="editMode ? '编辑打手' : '添加打手'" width="500px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="昵称" required>
          <el-input v-model="addForm.nickname" placeholder="打手昵称" />
        </el-form-item>
        
        <el-form-item label="手机号">
          <el-input v-model="addForm.phone" placeholder="联系电话" />
        </el-form-item>
        
        <el-form-item label="游戏ID">
          <el-input v-model="addForm.gameId" placeholder="游戏内ID" />
        </el-form-item>
        
        <el-form-item label="段位">
          <el-select v-model="addForm.gameTier" placeholder="选择段位" style="width: 100%">
            <el-option
              v-for="tier in gameTierOptions"
              :key="tier.value"
              :label="tier.label"
              :value="tier.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="初始状态">
          <el-select v-model="addForm.status" placeholder="选择状态" style="width: 100%">
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="submitForm">
          {{ editMode ? '保存' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.player-list { max-width: 1400px; margin: 0 auto; }
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
    
    .stat-value { font-size: 24px; font-weight: 700; color: #4a4a4a; }
    .stat-label { font-size: 13px; color: #888; margin-top: 4px; }
    &.online .stat-value { color: #67c23a; }
    &.busy .stat-value { color: #e6a23c; }
  }
}

.filter-card { margin-bottom: 20px; }
.filter-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filter-left { display: flex; gap: 12px; flex-wrap: wrap; }
.filter-right { display: flex; gap: 8px; }

.table-card { overflow: hidden; }

.player-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .player-avatar { background: linear-gradient(135deg, #B8A9D9, #FFB7B2); }
  .player-name { font-weight: 500; }
}

.order-count { font-weight: 600; color: #B8A9D9; }
.rating { color: #f7ba2a; }
.balance { font-weight: 600; color: #67c23a; }

.action-btns { display: flex; gap: 4px; }

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
  td.el-table__cell {
    text-align: center;
  }
}
</style>
