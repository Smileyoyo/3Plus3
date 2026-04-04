<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { useWebSocket } from '@/composables/useWebSocket'
import GlassNavbar from '@/components/GlassNavbar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Initialize WebSocket
const { connect, connected } = useWebSocket()

const isCollapsed = ref(false)

const menuItems = computed(() => {
  const items = [
    {
      path: '/',
      name: 'Dashboard',
      title: '仪表盘',
      icon: 'Odometer'
    },
    {
      path: '/order',
      name: 'Order',
      title: '订单管理',
      icon: 'List'
    },
    {
      path: '/settlement',
      name: 'Settlement',
      title: '工资结算',
      icon: 'Money'
    },
    {
      path: '/settlement/logs',
      name: 'SettlementLogs',
      title: '结算日志',
      icon: 'Document'
    },
    {
      path: '/player',
      name: 'Player',
      title: '打手列表',
      icon: 'User'
    },
    {
      path: '/vip',
      name: 'VIP',
      title: 'VIP列表',
      icon: 'Star'
    }
  ]

  // Add user management for admin only
  if (authStore.isAdmin) {
    items.push({
      path: '/user',
      name: 'UserManagement',
      title: '用户管理',
      icon: 'Setting'
    })
  }

  return items
})

const activeMenu = computed(() => {
  return route.path
})

function handleMenuSelect(index) {
  router.push(index)
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

onMounted(() => {
  if (authStore.isLoggedIn) {
    notificationStore.connectWebSocket()
  }
})
</script>

<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <!-- Logo -->
      <div class="sidebar-header">
        <div class="logo-wrapper">
          <img src="@/assets/logo.svg" alt="3Plus3" class="logo" />
          <Transition name="fade">
            <span v-if="!isCollapsed" class="logo-text">3Plus3</span>
          </Transition>
        </div>
        <button class="collapse-btn" @click="toggleCollapse">
          <span class="collapse-icon">{{ isCollapsed ? '→' : '←' }}</span>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          :collapse-transition="false"
          @select="handleMenuSelect"
        >
          <el-menu-item 
            v-for="item in menuItems" 
            :key="item.path"
            :index="item.path"
          >
            <component :is="'el-icon-' + item.icon" class="menu-icon" />
            <template #title>
              <span>{{ item.title }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="version-info">
          <span v-if="!isCollapsed" class="version">v1.0.0</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Top Navbar -->
      <GlassNavbar />

      <!-- Page Content -->
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #FDF8F5 0%, #F0EBF8 100%);
}

// Sidebar
.sidebar {
  width: 240px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid rgba(#B8A9D9, 0.15);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 200;

  &.collapsed {
    width: 72px;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(#B8A9D9, 0.1);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;

  .logo {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    animation: butterfly-float 3s ease-in-out infinite;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #B8A9D9, #FFB7B2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
  }
}

@keyframes butterfly-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(3deg); }
}

.collapse-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(#B8A9D9, 0.1);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(#B8A9D9, 0.2);
  }

  .collapse-icon {
    font-size: 12px;
    color: #888;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;

  :deep(.el-menu) {
    border: none;
    background: transparent;

    &.el-menu--collapse {
      width: 100%;

      .el-menu-item {
        padding: 0 !important;
        justify-content: center;
      }
    }
  }

  :deep(.el-menu-item) {
    height: 48px;
    margin: 4px 0;
    border-radius: 12px;
    color: #6a6a6a;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(#B8A9D9, 0.1);
      color: #B8A9D9;
    }

    &.is-active {
      background: linear-gradient(135deg, rgba(#B8A9D9, 0.2), rgba(#FFB7B2, 0.1));
      color: #8a7aa9;
      font-weight: 600;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background: linear-gradient(180deg, #B8A9D9, #FFB7B2);
        border-radius: 0 3px 3px 0;
      }
    }

    .menu-icon {
      font-size: 18px;
      margin-right: 12px;
    }
  }
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(#B8A9D9, 0.1);
}

.version-info {
  text-align: center;

  .version {
    font-size: 12px;
    color: #aaa;
  }
}

// Main Container
.main-container {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .sidebar.collapsed + & {
    margin-left: 72px;
  }
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-x: hidden;
}

// Page Transition
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: scale(0.98) translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: scale(1.02) translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
