<script setup>
import { ref, reactive, onMounted } from 'vue'
import ButterflyCard from '@/components/ButterflyCard.vue'
import { formatDateTime } from '@/utils/format'
import { USER_ROLE_TEXT, USER_ROLE_COLOR, DEFAULT_PAGE_SIZE } from '@/utils/constants'
import { ElMessage, ElMessageBox } from 'element-plus'
import { get, post, put, del } from '@/api/index'

const loading = ref(true)
const users = ref([])
const showAddDialog = ref(false)
const addLoading = ref(false)
const editMode = ref(false)

const addForm = reactive({
  id: null,
  username: '',
  password: '',
  nickname: '',
  role: 'operator'
})

async function fetchUsers() {
  loading.value = true
  try {
    const res = await get('/users')
    users.value = res.list || res || []
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

function getRoleText(role) {
  return USER_ROLE_TEXT[role] || role
}

function getRoleType(role) {
  return USER_ROLE_COLOR[role] || 'info'
}

// Open add dialog
function openAddDialog() {
  editMode.value = false
  Object.assign(addForm, {
    id: null,
    username: '',
    password: '',
    nickname: '',
    role: 'operator'
  })
  showAddDialog.value = true
}

// Open edit dialog
function openEditDialog(user) {
  editMode.value = true
  Object.assign(addForm, {
    id: user.id,
    username: user.username,
    password: '',
    nickname: user.nickname,
    role: user.role
  })
  showAddDialog.value = true
}

// Submit add/edit
async function submitForm() {
  if (!addForm.username) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!editMode.value && !addForm.password) {
    ElMessage.warning('请输入密码')
    return
  }
  
  addLoading.value = true
  try {
    if (editMode.value) {
      const data = { nickname: addForm.nickname, role: addForm.role }
      if (addForm.password) data.password = addForm.password
      await put(`/users/${addForm.id}`, data)
      ElMessage.success('用户信息已更新')
    } else {
      await post('/users', addForm)
      ElMessage.success('用户创建成功')
    }
    showAddDialog.value = false
    fetchUsers()
  } catch (error) {
    ElMessage.error(editMode.value ? '更新失败' : '创建失败')
  } finally {
    addLoading.value = false
  }
}

// Delete user
async function handleDelete(user) {
  if (user.role === 'admin') {
    ElMessage.warning('不能删除管理员账户')
    return
  }
  
  try {
    await ElMessageBox.confirm(`确定要删除用户 "${user.nickname || user.username}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await del(`/users/${user.id}`)
    ElMessage.success('已删除')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
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
      <div class="header-actions">
        <el-button type="primary" @click="openAddDialog">+ 添加用户</el-button>
        <el-button @click="fetchUsers">🔄 刷新</el-button>
      </div>
    </div>

    <ButterflyCard class="table-card" padding="0">
      <el-table v-loading="loading" :data="users" stripe>
        <el-table-column prop="nickname" label="姓名" width="180" align="center">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="40" class="user-avatar">
                {{ (row.nickname || row.username)?.charAt(0) }}
              </el-avatar>
              <div class="user-info">
                <p class="name">{{ row.nickname || row.username }}</p>
                <p class="username">@{{ row.username }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)" size="small">{{ getRoleText(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" align="center">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at || row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="160" align="center">
          <template #default="{ row }">
            {{ formatDateTime(row.updated_at || row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" size="small" text @click="openEditDialog(row)">编辑</el-button>
              <el-button v-if="row.role !== 'admin'" type="danger" size="small" text @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </ButterflyCard>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="showAddDialog" :title="editMode ? '编辑用户' : '添加用户'" width="450px">
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="用户名" required>
          <el-input v-model="addForm.username" :disabled="editMode" placeholder="登录用户名" />
        </el-form-item>
        
        <el-form-item :label="editMode ? '新密码' : '密码'" :required="!editMode">
          <el-input 
            v-model="addForm.password" 
            type="password" 
            show-password
            :placeholder="editMode ? '不修改请留空' : '至少6位密码'" 
          />
        </el-form-item>
        
        <el-form-item label="昵称">
          <el-input v-model="addForm.nickname" placeholder="显示名称" />
        </el-form-item>
        
        <el-form-item label="角色">
          <el-select v-model="addForm.role" placeholder="选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="经理" value="manager" />
            <el-option label="操作员" value="operator" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="submitForm">
          {{ editMode ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.user-management { max-width: 1400px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #4a4a4a; }
.page-subtitle { margin: 0; font-size: 14px; color: #888; }
.header-actions { display: flex; gap: 12px; }

.table-card { overflow: hidden; }

.user-cell { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  justify-content: center;
  
  .user-avatar { 
    background: linear-gradient(135deg, #B8A9D9, #FFB7B2);
    flex-shrink: 0;
  } 
  
  .user-info { 
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  
  .name { 
    margin: 0; 
    font-weight: 600; 
    color: #4a4a4a; 
  } 
  
  .username { 
    margin: 0; 
    font-size: 12px; 
    color: #888; 
  } 
}

.action-btns { 
  display: flex; 
  gap: 8px; 
  justify-content: center; 
}

:deep(.el-table) {
  th.el-table__cell {
    text-align: center;
  }
}
</style>
