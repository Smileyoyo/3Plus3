import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getVIPList, getVIPDetail, createVIP, updateVIP, deleteVIP, rechargeVIP, getVIPLevels, upgradeVIPLevel } from '@/api/vip'
import { VIP_LEVEL, DEFAULT_PAGE_SIZE } from '@/utils/constants'

export const useVIPStore = defineStore('vip', () => {
  // State
  const vips = ref([])
  const currentVIP = ref(null)
  const vipLevels = ref([])
  const total = ref(0)
  const loading = ref(false)
  const filters = ref({
    level: '',
    keyword: ''
  })
  const pagination = ref({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  })

  // Getters
  const vipStats = computed(() => ({
    total: total.value,
    totalBalance: vips.value.reduce((sum, v) => sum + (v.balance || 0), 0),
    totalRecharge: vips.value.reduce((sum, v) => sum + (v.totalRecharge || 0), 0),
    levelCounts: {
      bronze: vips.value.filter(v => v.level === VIP_LEVEL.BRONZE).length,
      silver: vips.value.filter(v => v.level === VIP_LEVEL.SILVER).length,
      gold: vips.value.filter(v => v.level === VIP_LEVEL.GOLD).length,
      platinum: vips.value.filter(v => v.level === VIP_LEVEL.PLATINUM).length,
      diamond: vips.value.filter(v => v.level === VIP_LEVEL.DIAMOND).length
    }
  }))

  // Actions
  async function fetchVIPs(params = {}) {
    loading.value = true
    try {
      const queryParams = {
        ...filters.value,
        ...pagination.value,
        ...params
      }
      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) delete queryParams[key]
      })
      
      const response = await getVIPList(queryParams)
      vips.value = response.list || response.data || []
      total.value = response.total || 0
      return response
    } finally {
      loading.value = false
    }
  }

  async function fetchVIPDetail(id) {
    loading.value = true
    try {
      const response = await getVIPDetail(id)
      currentVIP.value = response
      return response
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    loading.value = true
    try {
      const response = await createVIP(data)
      await fetchVIPs()
      return response
    } finally {
      loading.value = false
    }
  }

  async function update(id, data) {
    loading.value = true
    try {
      const response = await updateVIP(id, data)
      const index = vips.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vips.value[index] = { ...vips.value[index], ...response }
      }
      return response
    } finally {
      loading.value = false
    }
  }

  async function remove(id) {
    loading.value = true
    try {
      await deleteVIP(id)
      vips.value = vips.value.filter(v => v.id !== id)
      total.value = Math.max(0, total.value - 1)
    } finally {
      loading.value = false
    }
  }

  async function recharge(id, amount, type = 'balance') {
    loading.value = true
    try {
      const response = await rechargeVIP(id, amount, type)
      const index = vips.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vips.value[index] = { ...vips.value[index], ...response }
      }
      return response
    } finally {
      loading.value = false
    }
  }

  async function fetchVIPLevels() {
    try {
      const response = await getVIPLevels()
      vipLevels.value = response
      return response
    } catch (error) {
      console.error('Fetch VIP levels error:', error)
      return []
    }
  }

  async function upgradeLevel(id, level) {
    loading.value = true
    try {
      const response = await upgradeVIPLevel(id, level)
      const index = vips.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vips.value[index].level = level
      }
      return response
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1
  }

  function setPage(page) {
    pagination.value.page = page
  }

  function setPageSize(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
  }

  function resetFilters() {
    filters.value = {
      level: '',
      keyword: ''
    }
    pagination.value.page = 1
  }

  function clearCurrentVIP() {
    currentVIP.value = null
  }

  return {
    // State
    vips,
    currentVIP,
    vipLevels,
    total,
    loading,
    filters,
    pagination,
    // Getters
    vipStats,
    // Actions
    fetchVIPs,
    fetchVIPDetail,
    create,
    update,
    remove,
    recharge,
    fetchVIPLevels,
    upgradeLevel,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
    clearCurrentVIP
  }
})
