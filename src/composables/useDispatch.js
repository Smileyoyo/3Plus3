import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import { usePlayerStore } from '@/stores/player'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useDispatch() {
  const orderStore = useOrderStore()
  const playerStore = usePlayerStore()

  const loading = ref(false)
  const selectedOrder = ref(null)
  const selectedPlayer = ref(null)
  const showDispatchDialog = ref(false)

  // 获取可用的打手（在线且不忙碌）
  const availablePlayers = computed(() => playerStore.availablePlayers)

  // 打开派单对话框
  function openDispatchDialog(order) {
    selectedOrder.value = order
    selectedPlayer.value = null
    showDispatchDialog.value = true
  }

  // 关闭派单对话框
  function closeDispatchDialog() {
    showDispatchDialog.value = false
    selectedOrder.value = null
    selectedPlayer.value = null
  }

  // 执行派单
  async function dispatch(playerId) {
    if (!selectedOrder.value) {
      ElMessage.error('请选择订单')
      return
    }

    if (!playerId) {
      ElMessage.error('请选择打手')
      return
    }

    loading.value = true
    try {
      await orderStore.assign(selectedOrder.value.id, playerId)
      ElMessage.success('派单成功')
      closeDispatchDialog()
      return true
    } catch (error) {
      ElMessage.error(error.message || '派单失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 快速派单（直接指定打手）
  async function quickDispatch(order, player) {
    loading.value = true
    try {
      await orderStore.assign(order.id, player.id)
      ElMessage.success(`已派单给 ${player.nickname}`)
      return true
    } catch (error) {
      ElMessage.error(error.message || '派单失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 自动派单（分配给在线打手中完成订单最多的）
  async function autoDispatch(order) {
    if (availablePlayers.value.length === 0) {
      ElMessage.warning('暂无可用打手')
      return false
    }

    // 选择完成订单最多的打手
    const bestPlayer = availablePlayers.value.reduce((best, current) => {
      return (current.completedOrders || 0) > (best.completedOrders || 0) 
        ? current 
        : best
    })

    return quickDispatch(order, bestPlayer)
  }

  // 批量派单
  async function batchDispatch(orderIds, playerId) {
    if (!orderIds || orderIds.length === 0) {
      ElMessage.error('请选择订单')
      return
    }

    if (!playerId) {
      ElMessage.error('请选择打手')
      return
    }

    loading.value = true
    let successCount = 0
    let failCount = 0

    try {
      for (const orderId of orderIds) {
        try {
          await orderStore.assign(orderId, playerId)
          successCount++
        } catch (error) {
          failCount++
        }
      }

      if (successCount > 0) {
        ElMessage.success(`成功派单 ${successCount} 个`)
      }
      if (failCount > 0) {
        ElMessage.warning(`失败 ${failCount} 个`)
      }

      return { successCount, failCount }
    } finally {
      loading.value = false
    }
  }

  // 取消派单
  async function cancelDispatch(orderId, reason = '') {
    try {
      await ElMessageBox.confirm(
        `确定要取消该订单的派单吗？${reason ? `原因：${reason}` : ''}`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      loading.value = true
      await orderStore.cancel(orderId, reason)
      ElMessage.success('已取消派单')
      return true
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(error.message || '取消失败')
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // 获取推荐打手（基于订单类型）
  function getRecommendedPlayers(order) {
    const { gameType, mode } = order
    
    return availablePlayers.value.filter(player => {
      // 可以根据打手擅长的游戏类型、模式等进行筛选
      // 这里简化为返回所有可用打手
      return true
    }).sort((a, b) => {
      // 按完成订单数排序
      return (b.completedOrders || 0) - (a.completedOrders || 0)
    })
  }

  return {
    // State
    loading,
    selectedOrder,
    selectedPlayer,
    showDispatchDialog,
    availablePlayers,
    // Methods
    openDispatchDialog,
    closeDispatchDialog,
    dispatch,
    quickDispatch,
    autoDispatch,
    batchDispatch,
    cancelDispatch,
    getRecommendedPlayers
  }
}
