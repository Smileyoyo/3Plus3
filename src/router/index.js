import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/order/List.vue'),
        meta: { title: '订单管理', icon: 'List' }
      },
      {
        path: 'settlement',
        name: 'Settlement',
        component: () => import('@/views/settlement/Index.vue'),
        meta: { title: '工资结算', icon: 'Money' }
      },
      {
        path: 'settlement/logs',
        name: 'SettlementLogs',
        component: () => import('@/views/settlement/Logs.vue'),
        meta: { title: '结算日志', icon: 'Document' }
      },
      {
        path: 'player',
        name: 'Player',
        component: () => import('@/views/player/List.vue'),
        meta: { title: '打手列表', icon: 'User' }
      },
      {
        path: 'vip',
        name: 'VIP',
        component: () => import('@/views/vip/List.vue'),
        meta: { title: 'VIP列表', icon: 'Star' }
      },
      {
        path: 'user',
        name: 'UserManagement',
        component: () => import('@/views/user/Management.vue'),
        meta: { title: '用户管理', icon: 'Setting', requiresAdmin: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 更新页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 3Plus3 Club`
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth !== false) {
    if (!authStore.isLoggedIn) {
      // 检查本地存储中是否有 token
      const token = localStorage.getItem('token')
      if (token) {
        // Token 存在，尝试获取用户信息
        try {
          await authStore.fetchUserInfo()
        } catch (error) {
          // 获取失败，跳转登录
          return next({ name: 'Login', query: { redirect: to.fullPath } })
        }
      } else {
        // 没有 token，跳转登录
        return next({ name: 'Login', query: { redirect: to.fullPath } })
      }
    }

    // 检查管理员权限
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return next({ name: 'Dashboard' })
    }
  }

  // 已登录用户访问登录页，跳转首页
  if (to.name === 'Login' && authStore.isLoggedIn) {
    return next({ name: 'Dashboard' })
  }

  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
