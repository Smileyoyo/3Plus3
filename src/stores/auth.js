import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, logout as apiLogout, getUserInfo } from '@/api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const permissions = ref([])
  const loading = ref(false)

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isManager = computed(() => user.value?.role === 'manager' || user.value?.role === 'admin')
  const userId = computed(() => user.value?.id)
  const userName = computed(() => user.value?.nickname || user.value?.username || '')
  const userRole = computed(() => user.value?.role || '')

  // Actions
  async function login(username, password) {
    loading.value = true
    try {
      const response = await apiLogin({ username, password })
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return response
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = ''
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
      loading.value = false
    }
  }

  async function fetchUserInfo() {
    if (!token.value) return null
    try {
      const response = await getUserInfo()
      user.value = response
      localStorage.setItem('user', JSON.stringify(response))
      return response
    } catch (error) {
      console.error('Fetch user info error:', error)
      logout()
      return null
    }
  }

  function hasPermission(permission) {
    if (!permissions.value.length) return true
    return permissions.value.includes(permission)
  }

  function hasRole(role) {
    return user.value?.role === role
  }

  function clearAuth() {
    token.value = ''
    user.value = null
    permissions.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    // State
    token,
    user,
    permissions,
    loading,
    // Getters
    isLoggedIn,
    isAdmin,
    isManager,
    userId,
    userName,
    userRole,
    // Actions
    login,
    logout,
    fetchUserInfo,
    hasPermission,
    hasRole,
    clearAuth
  }
})
