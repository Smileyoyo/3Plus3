import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Computed
  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const user = computed(() => authStore.user)
  const userName = computed(() => authStore.userName)
  const userRole = computed(() => authStore.userRole)
  const isAdmin = computed(() => authStore.isAdmin)
  const isManager = computed(() => authStore.isManager)
  const loading = computed(() => authStore.loading)

  // Methods
  async function login(username, password) {
    try {
      const response = await authStore.login(username, password)
      ElMessage.success('登录成功')
      const redirect = router.currentRoute.value.query.redirect
      router.push(redirect || '/')
      return response
    } catch (error) {
      ElMessage.error(error.message || '登录失败')
      throw error
    }
  }

  async function logout() {
    try {
      await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await authStore.logout()
      ElMessage.success('已退出登录')
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Logout error:', error)
      }
    }
  }

  async function checkAuth() {
    if (!authStore.isLoggedIn) {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          await authStore.fetchUserInfo()
        } catch (error) {
          router.push('/login')
        }
      }
    }
  }

  function hasPermission(permission) {
    return authStore.hasPermission(permission)
  }

  function hasRole(role) {
    return authStore.hasRole(role)
  }

  return {
    // State
    isLoggedIn,
    user,
    userName,
    userRole,
    isAdmin,
    isManager,
    loading,
    // Methods
    login,
    logout,
    checkAuth,
    hasPermission,
    hasRole
  }
}
