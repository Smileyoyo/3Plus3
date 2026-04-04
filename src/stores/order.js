import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getOrderList, getOrderDetail, createOrder, updateOrder, assignOrder, cancelOrder, completeOrder } from '@/api/order'
import { ORDER_STATUS, DEFAULT_PAGE_SIZE } from '@/utils/constants'

export const useOrderStore = defineStore('order', () => {
  // State
  const orders = ref([])
  const currentOrder = ref(null)
  const total = ref(0)
  const loading = ref(false)
  const filters = ref({
    status: '',
    gameType: '',
    keyword: '',
    dateRange: []
  })
  const pagination = ref({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  })

  // Getters
  const pendingOrders = computed(() => orders.value.filter(o => o.status === ORDER_STATUS.PENDING))
  const processingOrders = computed(() => orders.value.filter(o => o.status === ORDER_STATUS.PROCESSING))
  const completedOrders = computed(() => orders.value.filter(o => o.status === ORDER_STATUS.COMPLETED))
  const orderCountByStatus = computed(() => {
    const counts = {}
    for (const status in ORDER_STATUS) {
      counts[ORDER_STATUS[status]] = orders.value.filter(o => o.status === ORDER_STATUS[status]).length
    }
    return counts
  })

  // Actions
  async function fetchOrders(params = {}) {
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
      
      const response = await getOrderList(queryParams)
      orders.value = response.list || response.data || []
      total.value = response.total || 0
      return response
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderDetail(id) {
    loading.value = true
    try {
      const response = await getOrderDetail(id)
      currentOrder.value = response
      return response
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    loading.value = true
    try {
      const response = await createOrder(data)
      await fetchOrders()
      return response
    } finally {
      loading.value = false
    }
  }

  async function update(id, data) {
    loading.value = true
    try {
      const response = await updateOrder(id, data)
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], ...response }
      }
      return response
    } finally {
      loading.value = false
    }
  }

  async function assign(id, playerId) {
    loading.value = true
    try {
      const response = await assignOrder(id, playerId)
      await fetchOrders()
      return response
    } finally {
      loading.value = false
    }
  }

  async function cancel(id, reason) {
    loading.value = true
    try {
      const response = await cancelOrder(id, reason)
      await fetchOrders()
      return response
    } finally {
      loading.value = false
    }
  }

  async function complete(id, data = {}) {
    loading.value = true
    try {
      const response = await completeOrder(id, data)
      await fetchOrders()
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
      gameType: '',
      keyword: '',
      dateRange: []
    }
    pagination.value.page = 1
  }

  function clearCurrentOrder() {
    currentOrder.value = null
  }

  return {
    // State
    orders,
    currentOrder,
    total,
    loading,
    filters,
    pagination,
    // Getters
    pendingOrders,
    processingOrders,
    completedOrders,
    orderCountByStatus,
    // Actions
    fetchOrders,
    fetchOrderDetail,
    create,
    update,
    assign,
    cancel,
    complete,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
    clearCurrentOrder
  }
})
