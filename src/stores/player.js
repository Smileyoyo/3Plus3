import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPlayerList, getPlayerDetail, createPlayer, updatePlayer, deletePlayer, updatePlayerStatus, getOnlinePlayers } from '@/api/player'
import { PLAYER_STATUS, DEFAULT_PAGE_SIZE } from '@/utils/constants'

export const usePlayerStore = defineStore('player', () => {
  // State
  const players = ref([])
  const currentPlayer = ref(null)
  const total = ref(0)
  const loading = ref(false)
  const filters = ref({
    status: '',
    gameTier: '',
    keyword: ''
  })
  const pagination = ref({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  })

  // Getters
  const onlinePlayers = computed(() => 
    players.value.filter(p => p.status === PLAYER_STATUS.ONLINE)
  )
  const busyPlayers = computed(() => 
    players.value.filter(p => p.status === PLAYER_STATUS.BUSY)
  )
  const availablePlayers = computed(() => 
    players.value.filter(p => p.status === PLAYER_STATUS.ONLINE)
  )
  const playerStats = computed(() => ({
    total: players.value.length,
    online: onlinePlayers.value.length,
    busy: busyPlayers.value.length,
    offline: players.value.filter(p => p.status === PLAYER_STATUS.OFFLINE).length,
    avgRating: players.value.length > 0 
      ? (players.value.reduce((sum, p) => sum + (p.rating || 0), 0) / players.value.length).toFixed(1)
      : 0,
    totalCompleted: players.value.reduce((sum, p) => sum + (p.completedOrders || 0), 0)
  }))

  // Actions
  async function fetchPlayers(params = {}) {
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
      
      const response = await getPlayerList(queryParams)
      players.value = response.list || response.data || []
      total.value = response.total || 0
      return response
    } finally {
      loading.value = false
    }
  }

  async function fetchOnlinePlayers() {
    try {
      const response = await getOnlinePlayers()
      return response
    } catch (error) {
      console.error('Fetch online players error:', error)
      return []
    }
  }

  async function fetchPlayerDetail(id) {
    loading.value = true
    try {
      const response = await getPlayerDetail(id)
      currentPlayer.value = response
      return response
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    loading.value = true
    try {
      const response = await createPlayer(data)
      await fetchPlayers()
      return response
    } finally {
      loading.value = false
    }
  }

  async function update(id, data) {
    loading.value = true
    try {
      const response = await updatePlayer(id, data)
      const index = players.value.findIndex(p => p.id === id)
      if (index !== -1) {
        players.value[index] = { ...players.value[index], ...response }
      }
      return response
    } finally {
      loading.value = false
    }
  }

  async function remove(id) {
    loading.value = true
    try {
      await deletePlayer(id)
      players.value = players.value.filter(p => p.id !== id)
      total.value = Math.max(0, total.value - 1)
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id, status) {
    loading.value = true
    try {
      const response = await updatePlayerStatus(id, status)
      const index = players.value.findIndex(p => p.id === id)
      if (index !== -1) {
        players.value[index].status = status
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
      status: '',
      gameTier: '',
      keyword: ''
    }
    pagination.value.page = 1
  }

  function clearCurrentPlayer() {
    currentPlayer.value = null
  }

  // Update player status locally (for WebSocket updates)
  function updatePlayerLocally(id, data) {
    const index = players.value.findIndex(p => p.id === id)
    if (index !== -1) {
      players.value[index] = { ...players.value[index], ...data }
    }
    if (currentPlayer.value && currentPlayer.value.id === id) {
      currentPlayer.value = { ...currentPlayer.value, ...data }
    }
  }

  return {
    // State
    players,
    currentPlayer,
    total,
    loading,
    filters,
    pagination,
    // Getters
    onlinePlayers,
    busyPlayers,
    availablePlayers,
    playerStats,
    // Actions
    fetchPlayers,
    fetchOnlinePlayers,
    fetchPlayerDetail,
    create,
    update,
    remove,
    updateStatus,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
    clearCurrentPlayer,
    updatePlayerLocally
  }
})
