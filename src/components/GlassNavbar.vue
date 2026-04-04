<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const showUserMenu = ref(false)
const showNotificationPanel = ref(false)

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  return matched.map(item => ({
    title: item.meta.title,
    path: item.path
  }))
})

const unreadCount = computed(() => notificationStore.unreadCount)

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) {
    showNotificationPanel.value = false
  }
}

function toggleNotificationPanel() {
  showNotificationPanel.value = !showNotificationPanel.value
  if (showNotificationPanel.value) {
    showUserMenu.value = false
  }
}

function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
}

function markAllRead() {
  notificationStore.markAllAsRead()
}

function handleNotificationClick(notification) {
  notificationStore.markAsRead(notification.id)
  if (notification.data?.orderId) {
    router.push(`/order?id=${notification.data.orderId}`)
  }
  showNotificationPanel.value = false
}

function closeAll() {
  showUserMenu.value = false
  showNotificationPanel.value = false
}
</script>

<template>
  <header class="glass-navbar" @click.self="closeAll">
    <!-- Breadcrumb -->
    <div class="navbar-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <span class="home-icon">🏠</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.path">
          {{ crumb.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Right Section -->
    <div class="navbar-right">
      <!-- WebSocket Status -->
      <div class="ws-status" :class="{ connected: notificationStore.wsConnected }">
        <span class="status-dot"></span>
        <span class="status-text">{{ notificationStore.wsConnected ? '在线' : '离线' }}</span>
      </div>

      <!-- Notification Bell -->
      <div class="notification-wrapper">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99">
          <button class="notification-btn" @click.stop="toggleNotificationPanel">
            <span class="bell-icon">🔔</span>
          </button>
        </el-badge>

        <!-- Notification Panel -->
        <Transition name="fade">
          <div v-if="showNotificationPanel" class="notification-panel" @click.stop>
            <div class="panel-header">
              <span class="panel-title">通知</span>
              <button v-if="unreadCount > 0" class="mark-all-btn" @click="markAllRead">
                全部已读
              </button>
            </div>
            
            <div class="notification-list">
              <template v-if="notificationStore.notifications.length > 0">
                <div 
                  v-for="notification in notificationStore.recentNotifications" 
                  :key="notification.id"
                  class="notification-item"
                  :class="{ unread: !notification.read }"
                  @click="handleNotificationClick(notification)"
                >
                  <div class="notification-icon">
                    {{ notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : 'ℹ️' }}
                  </div>
                  <div class="notification-content">
                    <p class="notification-title">{{ notification.title }}</p>
                    <p class="notification-message">{{ notification.message }}</p>
                    <span class="notification-time">{{ notification.timestamp }}</span>
                  </div>
                </div>
              </template>
              <div v-else class="empty-notifications">
                <span class="empty-icon">📭</span>
                <p>暂无通知</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- User Avatar -->
      <div class="user-wrapper">
        <button class="user-btn" @click.stop="toggleUserMenu">
          <el-avatar :size="36" class="user-avatar">
            {{ authStore.userName?.charAt(0) || 'U' }}
          </el-avatar>
          <span class="user-name">{{ authStore.userName }}</span>
          <span class="dropdown-arrow">▼</span>
        </button>

        <!-- User Menu -->
        <Transition name="fade">
          <div v-if="showUserMenu" class="user-menu" @click.stop>
            <div class="menu-header">
              <el-avatar :size="48">{{ authStore.userName?.charAt(0) || 'U' }}</el-avatar>
              <div class="user-info">
                <p class="user-nickname">{{ authStore.userName }}</p>
                <p class="user-role">{{ authStore.userRole === 'admin' ? '管理员' : authStore.userRole === 'manager' ? '经理' : '操作员' }}</p>
              </div>
            </div>
            
            <div class="menu-divider"></div>
            
            <button class="menu-item" @click="router.push('/profile'); closeAll()">
              <span>👤</span> 个人设置
            </button>
            <button class="menu-item" @click="handleLogout">
              <span>🚪</span> 退出登录
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.glass-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(#B8A9D9, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-breadcrumb {
  .home-icon {
    font-size: 16px;
  }
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ws-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(#FFB7B2, 0.2);
  border-radius: 20px;
  font-size: 12px;
  color: #c97070;

  &.connected {
    background: rgba(#B5EAD7, 0.3);
    color: #5a9a7a;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;

    .connected & {
      animation: pulse 2s infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.notification-wrapper {
  position: relative;
}

.notification-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(#B8A9D9, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(#B8A9D9, 0.2);
    transform: scale(1.05);
  }

  .bell-icon {
    font-size: 18px;
  }
}

.notification-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  max-height: 480px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(#B8A9D9, 0.15);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(#B8A9D9, 0.1);

  .panel-title {
    font-weight: 600;
    color: #4a4a4a;
  }

  .mark-all-btn {
    border: none;
    background: none;
    color: #B8A9D9;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      color: #9a8ab9;
    }
  }
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(#B8A9D9, 0.05);
  }

  &.unread {
    background: rgba(#B8A9D9, 0.05);

    &::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background: #B8A9D9;
      border-radius: 50%;
    }
  }
}

.notification-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(#B8A9D9, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;

  .notification-title {
    margin: 0 0 4px;
    font-weight: 500;
    font-size: 14px;
    color: #4a4a4a;
  }

  .notification-message {
    margin: 0 0 4px;
    font-size: 13px;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .notification-time {
    font-size: 11px;
    color: #aaa;
  }
}

.empty-notifications {
  padding: 48px 16px;
  text-align: center;
  color: #aaa;

  .empty-icon {
    font-size: 32px;
    display: block;
    margin-bottom: 8px;
  }
}

.user-wrapper {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(#B8A9D9, 0.2);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(#B8A9D9, 0.1);
    border-color: #B8A9D9;
  }

  .user-avatar {
    background: linear-gradient(135deg, #B8A9D9, #FFB7B2);
  }

  .user-name {
    font-weight: 500;
    color: #4a4a4a;
  }

  .dropdown-arrow {
    font-size: 10px;
    color: #888;
  }
}

.user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(#B8A9D9, 0.15);
  overflow: hidden;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;

  :deep(.el-avatar) {
    background: linear-gradient(135deg, #B8A9D9, #FFB7B2);
  }

  .user-info {
    .user-nickname {
      margin: 0;
      font-weight: 600;
      color: #4a4a4a;
    }

    .user-role {
      margin: 2px 0 0;
      font-size: 12px;
      color: #888;
    }
  }
}

.menu-divider {
  height: 1px;
  background: rgba(#B8A9D9, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #4a4a4a;
  text-align: left;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(#B8A9D9, 0.1);
  }

  span:first-child {
    font-size: 16px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
