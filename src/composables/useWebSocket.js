import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

export function useWebSocket() {
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()
  
  const ws = ref(null)
  const connected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000
  let reconnectTimer = null

  function connect() {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      return
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const wsUrl = `${protocol}//${host}/ws`

    try {
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = handleOpen
      ws.value.onmessage = handleMessage
      ws.value.onerror = handleError
      ws.value.onclose = handleClose
    } catch (error) {
      console.error('WebSocket connection error:', error)
      scheduleReconnect()
    }
  }

  function handleOpen() {
    console.log('WebSocket connected')
    connected.value = true
    reconnectAttempts.value = 0

    // Authenticate
    const token = authStore.token
    if (token) {
      send({
        type: 'auth',
        token
      })
    }

    // Subscribe to channels
    send({
      type: 'subscribe',
      channels: ['orders', 'notifications', 'players']
    })
  }

  function handleMessage(event) {
    try {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case 'new_order':
          notificationStore.addNotification({
            type: 'info',
            title: '🎯 新订单',
            message: `收到新订单：${data.orderNo || data.order?.orderNo}`,
            data
          })
          break

        case 'order_update':
          notificationStore.addNotification({
            type: 'success',
            title: '📋 订单更新',
            message: `订单 ${data.orderNo || data.order?.orderNo} 状态已更新为 ${data.status}`,
            data
          })
          break

        case 'player_status_change':
          notificationStore.addNotification({
            type: 'warning',
            title: '👤 打手状态变更',
            message: `${data.playerName} 状态变更为 ${data.status}`,
            data
          })
          break

        case 'notification':
          notificationStore.addNotification({
            type: data.level || 'info',
            title: data.title,
            message: data.message,
            data
          })
          break

        case 'settlement_update':
          notificationStore.addNotification({
            type: 'success',
            title: '💰 结算通知',
            message: data.message,
            data
          })
          break

        case 'pong':
          // Heartbeat response
          break

        default:
          console.log('Unknown WebSocket message:', data)
      }
    } catch (error) {
      console.error('WebSocket message parse error:', error)
    }
  }

  function handleError(error) {
    console.error('WebSocket error:', error)
    connected.value = false
  }

  function handleClose() {
    console.log('WebSocket disconnected')
    connected.value = false
    scheduleReconnect()
  }

  function scheduleReconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
    }

    if (reconnectAttempts.value >= maxReconnectAttempts) {
      console.log('Max reconnect attempts reached')
      return
    }

    reconnectAttempts.value++
    const delay = reconnectDelay * reconnectAttempts.value
    
    console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.value}/${maxReconnectAttempts})`)
    
    reconnectTimer = setTimeout(() => {
      connect()
    }, delay)
  }

  function send(data) {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(data))
      return true
    }
    return false
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    if (ws.value) {
      ws.value.close()
      ws.value = null
    }

    connected.value = false
    reconnectAttempts.value = 0
  }

  // Heartbeat
  let heartbeatTimer = null

  function startHeartbeat() {
    stopHeartbeat()
    heartbeatTimer = setInterval(() => {
      send({ type: 'ping' })
    }, 30000)
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  // Lifecycle
  onMounted(() => {
    if (authStore.isLoggedIn) {
      connect()
      startHeartbeat()
    }
  })

  onUnmounted(() => {
    disconnect()
    stopHeartbeat()
  })

  return {
    connected,
    reconnectAttempts,
    connect,
    disconnect,
    send
  }
}
