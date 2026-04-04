import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElNotification } from 'element-plus'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref([])
  const unreadCount = ref(0)
  const ws = ref(null)
  const wsConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = 3000

  // Getters
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read)
  )
  const recentNotifications = computed(() => 
    notifications.value.slice(0, 10)
  )

  // Actions
  function addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      read: false,
      timestamp: new Date().toISOString(),
      ...notification
    }
    
    notifications.value.unshift(newNotification)
    unreadCount.value++
    
    // Show toast notification
    showToast(notification)
    
    return newNotification
  }

  function showToast(notification) {
    ElNotification({
      title: notification.title || '新通知',
      message: notification.message || notification.content,
      type: notification.type || 'info',
      duration: notification.duration || 4500,
      position: 'top-right',
      showClose: true
    })
  }

  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => {
      n.read = true
    })
    unreadCount.value = 0
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      if (!notifications.value[index].read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
    unreadCount.value = 0
  }

  // WebSocket
  function connectWebSocket() {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      return
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    
    try {
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = () => {
        console.log('WebSocket connected')
        wsConnected.value = true
        reconnectAttempts.value = 0
        
        // Authenticate if needed
        const token = localStorage.getItem('token')
        if (token) {
          ws.value.send(JSON.stringify({
            type: 'auth',
            token
          }))
        }
      }

      ws.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWSMessage(data)
        } catch (error) {
          console.error('WebSocket message parse error:', error)
        }
      }

      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        wsConnected.value = false
      }

      ws.value.onclose = () => {
        console.log('WebSocket disconnected')
        wsConnected.value = false
        attemptReconnect()
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }

  function handleWSMessage(data) {
    switch (data.type) {
      case 'new_order':
        addNotification({
          type: 'info',
          title: '🎯 新订单',
          message: `收到新订单：${data.orderNo}`,
          data: data
        })
        break
        
      case 'order_update':
        addNotification({
          type: 'success',
          title: '📋 订单更新',
          message: `订单 ${data.orderNo} 状态已更新`,
          data: data
        })
        break
        
      case 'player_status_change':
        addNotification({
          type: 'warning',
          title: '👤 打手状态',
          message: `${data.playerName} 状态变更为 ${data.status}`,
          data: data
        })
        break
        
      case 'notification':
        addNotification({
          type: data.level || 'info',
          title: data.title,
          message: data.message,
          data: data
        })
        break
        
      case 'settlement_update':
        addNotification({
          type: 'success',
          title: '💰 结算通知',
          message: data.message,
          data: data
        })
        break
        
      default:
        console.log('Unknown WebSocket message type:', data.type)
    }
  }

  function attemptReconnect() {
    if (reconnectAttempts.value >= maxReconnectAttempts) {
      console.log('Max reconnect attempts reached')
      return
    }

    reconnectAttempts.value++
    console.log(`Attempting to reconnect (${reconnectAttempts.value}/${maxReconnectAttempts})...`)
    
    setTimeout(() => {
      connectWebSocket()
    }, reconnectInterval * reconnectAttempts.value)
  }

  function disconnectWebSocket() {
    if (ws.value) {
      ws.value.close()
      ws.value = null
      wsConnected.value = false
    }
  }

  function sendMessage(message) {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(message))
    }
  }

  return {
    // State
    notifications,
    unreadCount,
    wsConnected,
    // Getters
    unreadNotifications,
    recentNotifications,
    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    connectWebSocket,
    disconnectWebSocket,
    sendMessage
  }
})
