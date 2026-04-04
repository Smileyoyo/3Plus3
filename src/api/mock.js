// Mock Data for Development
import { ORDER_STATUS, PLAYER_STATUS, VIP_LEVEL, SETTLEMENT_STATUS } from '@/utils/constants'

// Mock Users
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    role: 'admin',
    avatar: '',
    email: 'admin@3plus3.com',
    phone: '13800138000',
    createdAt: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    username: 'manager',
    nickname: '运营经理',
    role: 'manager',
    avatar: '',
    email: 'manager@3plus3.com',
    phone: '13800138001',
    createdAt: '2024-01-15 00:00:00'
  }
]

// Mock Players
export const mockPlayers = [
  {
    id: 1,
    nickname: '蝴蝶小王子',
    phone: '13900139001',
    gameTier: '王者',
    gameId: '傲娇蝴蝶#1234',
    status: PLAYER_STATUS.ONLINE,
    totalOrders: 156,
    completedOrders: 152,
    rating: 4.9,
    balance: 3500.00,
    createdAt: '2024-01-10 10:00:00'
  },
  {
    id: 2,
    nickname: '云端漫步',
    phone: '13900139002',
    gameTier: '星耀',
    gameId: '漫步云端#5678',
    status: PLAYER_STATUS.BUSY,
    totalOrders: 89,
    completedOrders: 87,
    rating: 4.8,
    balance: 2100.00,
    createdAt: '2024-01-20 14:30:00'
  },
  {
    id: 3,
    nickname: '星光刺客',
    phone: '13900139003',
    gameTier: '钻石',
    gameId: '刺客联盟#9012',
    status: PLAYER_STATUS.OFFLINE,
    totalOrders: 234,
    completedOrders: 228,
    rating: 4.7,
    balance: 4800.00,
    createdAt: '2024-02-05 09:15:00'
  },
  {
    id: 4,
    nickname: '暗夜精灵',
    phone: '13900139004',
    gameTier: '王者',
    gameId: '精灵一族#3456',
    status: PLAYER_STATUS.ONLINE,
    totalOrders: 312,
    completedOrders: 305,
    rating: 4.95,
    balance: 6200.00,
    createdAt: '2024-02-15 16:45:00'
  },
  {
    id: 5,
    nickname: '雷霆战魂',
    phone: '13900139005',
    gameTier: '星耀',
    gameId: '雷霆万钧#7890',
    status: PLAYER_STATUS.ONLINE,
    totalOrders: 178,
    completedOrders: 172,
    rating: 4.6,
    balance: 2800.00,
    createdAt: '2024-03-01 11:20:00'
  }
]

// Mock Orders
export const mockOrders = [
  {
    id: 1001,
    orderNo: 'ORD202404010001',
    vipId: 1,
    vipName: '至尊VIP会员',
    vipLevel: VIP_LEVEL.DIAMOND,
    gameType: '王者荣耀',
    currentTier: '钻石II',
    targetTier: '星耀V',
    mode: '单排',
    price: 500.00,
    status: ORDER_STATUS.PENDING,
    remark: '加急单，请尽快处理',
    createdAt: '2024-04-01 10:30:00'
  },
  {
    id: 1002,
    orderNo: 'ORD202404010002',
    vipId: 2,
    vipName: '黄金会员',
    vipLevel: VIP_LEVEL.GOLD,
    gameType: '英雄联盟',
    currentTier: '白银I',
    targetTier: '黄金IV',
    mode: '双排',
    price: 280.00,
    status: ORDER_STATUS.ASSIGNED,
    playerId: 1,
    playerName: '蝴蝶小王子',
    createdAt: '2024-04-01 11:45:00'
  },
  {
    id: 1003,
    orderNo: 'ORD202404010003',
    vipId: 3,
    vipName: '铂金会员',
    vipLevel: VIP_LEVEL.PLATINUM,
    gameType: '王者荣耀',
    currentTier: '铂金I',
    targetTier: '钻石V',
    mode: '五排',
    price: 800.00,
    status: ORDER_STATUS.PROCESSING,
    playerId: 4,
    playerName: '暗夜精灵',
    startedAt: '2024-04-01 14:00:00',
    createdAt: '2024-04-01 13:30:00'
  },
  {
    id: 1004,
    orderNo: 'ORD202404010004',
    vipId: 4,
    vipName: '白银会员',
    vipLevel: VIP_LEVEL.SILVER,
    gameType: '和平精英',
    currentTier: '黄金III',
    targetTier: '铂金V',
    mode: '单排',
    price: 350.00,
    status: ORDER_STATUS.COMPLETED,
    playerId: 2,
    playerName: '云端漫步',
    completedAt: '2024-04-01 16:30:00',
    settledAmount: 280.00,
    createdAt: '2024-04-01 08:00:00'
  },
  {
    id: 1005,
    orderNo: 'ORD202404010005',
    vipId: 5,
    vipName: '钻石会员',
    vipLevel: VIP_LEVEL.DIAMOND,
    gameType: '英雄联盟',
    currentTier: '钻石II',
    targetTier: '大师',
    mode: '单排',
    price: 1200.00,
    status: ORDER_STATUS.PENDING,
    remark: '需要指定打手',
    createdAt: '2024-04-01 18:00:00'
  }
]

// Mock VIPs
export const mockVIPs = [
  {
    id: 1,
    nickname: '至尊VIP会员',
    phone: '13700137001',
    level: VIP_LEVEL.DIAMOND,
    balance: 5000.00,
    totalRecharge: 20000.00,
    totalOrders: 45,
    completedOrders: 43,
    createdAt: '2023-06-01 00:00:00',
    expireAt: '2025-06-01 00:00:00'
  },
  {
    id: 2,
    nickname: '黄金会员',
    phone: '13700137002',
    level: VIP_LEVEL.GOLD,
    balance: 1200.00,
    totalRecharge: 3000.00,
    totalOrders: 12,
    completedOrders: 11,
    createdAt: '2023-09-15 00:00:00',
    expireAt: '2024-09-15 00:00:00'
  },
  {
    id: 3,
    nickname: '铂金会员',
    phone: '13700137003',
    level: VIP_LEVEL.PLATINUM,
    balance: 3500.00,
    totalRecharge: 8000.00,
    totalOrders: 28,
    completedOrders: 26,
    createdAt: '2024-01-10 00:00:00',
    expireAt: '2025-01-10 00:00:00'
  },
  {
    id: 4,
    nickname: '白银会员',
    phone: '13700137004',
    level: VIP_LEVEL.SILVER,
    balance: 500.00,
    totalRecharge: 1000.00,
    totalOrders: 5,
    completedOrders: 4,
    createdAt: '2024-02-20 00:00:00',
    expireAt: '2025-02-20 00:00:00'
  },
  {
    id: 5,
    nickname: '钻石会员',
    phone: '13700137005',
    level: VIP_LEVEL.DIAMOND,
    balance: 8000.00,
    totalRecharge: 15000.00,
    totalOrders: 38,
    completedOrders: 37,
    createdAt: '2023-08-01 00:00:00',
    expireAt: '2025-08-01 00:00:00'
  }
]

// Mock Settlements
export const mockSettlements = [
  {
    id: 1,
    playerId: 1,
    playerName: '蝴蝶小王子',
    period: '2024-03',
    totalOrders: 45,
    totalAmount: 8500.00,
    platformFee: 850.00,
    settledAmount: 7650.00,
    status: SETTLEMENT_STATUS.COMPLETED,
    paidAt: '2024-04-01 10:00:00',
    createdAt: '2024-04-01 00:00:00'
  },
  {
    id: 2,
    playerId: 2,
    playerName: '云端漫步',
    period: '2024-03',
    totalOrders: 28,
    totalAmount: 5200.00,
    platformFee: 520.00,
    settledAmount: 4680.00,
    status: SETTLEMENT_STATUS.PENDING,
    createdAt: '2024-04-01 00:00:00'
  },
  {
    id: 3,
    playerId: 4,
    playerName: '暗夜精灵',
    period: '2024-03',
    totalOrders: 62,
    totalAmount: 12000.00,
    platformFee: 1200.00,
    settledAmount: 10800.00,
    status: SETTLEMENT_STATUS.PROCESSING,
    createdAt: '2024-04-01 00:00:00'
  }
]

// Mock Settlement Logs
export const mockSettlementLogs = [
  {
    id: 1,
    settlementId: 1,
    playerName: '蝴蝶小王子',
    action: 'create',
    beforeAmount: 0,
    afterAmount: 7650.00,
    operator: 'admin',
    remark: '3月份结算',
    createdAt: '2024-04-01 09:00:00'
  },
  {
    id: 2,
    settlementId: 1,
    action: 'approve',
    beforeAmount: 7650.00,
    afterAmount: 7650.00,
    operator: 'admin',
    remark: '审核通过',
    createdAt: '2024-04-01 09:30:00'
  },
  {
    id: 3,
    settlementId: 1,
    action: 'pay',
    beforeAmount: 7650.00,
    afterAmount: 7650.00,
    operator: 'admin',
    remark: '微信转账',
    createdAt: '2024-04-01 10:00:00'
  }
]

// Mock Dashboard Stats
export const mockDashboardStats = {
  todayOrders: 23,
  todayOrdersChange: 15,
  todayRevenue: 12580.00,
  todayRevenueChange: 8,
  pendingOrders: 12,
  activePlayers: 18,
  monthlyRevenue: 358000.00,
  monthlyRevenueChange: 12,
  completedOrders: 156,
  cancelledOrders: 5,
  totalVIPs: 89,
  newVIPsThisMonth: 12,
  orderStatusDistribution: {
    pending: 12,
    assigned: 8,
    processing: 15,
    completed: 156,
    cancelled: 5
  },
  revenueTrend: [
    { date: '2024-03-28', amount: 12500 },
    { date: '2024-03-29', amount: 13800 },
    { date: '2024-03-30', amount: 14200 },
    { date: '2024-03-31', amount: 15600 },
    { date: '2024-04-01', amount: 12580 }
  ],
  topPlayers: mockPlayers.slice(0, 3),
  recentOrders: mockOrders.slice(0, 5)
}

// Simulate API delay
export function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock API handlers
export const mockHandlers = {
  // Auth
  'POST /api/auth/login': async (data) => {
    await delay()
    if (data.username === 'admin' && data.password === 'admin123') {
      return {
        token: 'mock_token_' + Date.now(),
        user: mockUsers[0]
      }
    }
    throw new Error('用户名或密码错误')
  },
  'GET /api/auth/user': async () => {
    await delay()
    return mockUsers[0]
  },

  // Orders
  'GET /api/orders': async (params) => {
    await delay()
    let result = [...mockOrders]
    if (params.status) {
      result = result.filter(o => o.status === params.status)
    }
    return {
      list: result,
      total: result.length,
      page: 1,
      pageSize: 20
    }
  },
  'GET /api/orders/:id': async (id) => {
    await delay()
    const order = mockOrders.find(o => o.id === Number(id))
    if (!order) throw new Error('订单不存在')
    return order
  },

  // Players
  'GET /api/players': async (params) => {
    await delay()
    let result = [...mockPlayers]
    if (params.status) {
      result = result.filter(p => p.status === params.status)
    }
    return {
      list: result,
      total: result.length,
      page: 1,
      pageSize: 20
    }
  },

  // VIPs
  'GET /api/vips': async (params) => {
    await delay()
    let result = [...mockVIPs]
    if (params.level) {
      result = result.filter(v => v.level === params.level)
    }
    return {
      list: result,
      total: result.length,
      page: 1,
      pageSize: 20
    }
  },

  // Settlements
  'GET /api/settlements': async () => {
    await delay()
    return {
      list: mockSettlements,
      total: mockSettlements.length,
      page: 1,
      pageSize: 20
    }
  },
  'GET /api/settlements/logs': async () => {
    await delay()
    return {
      list: mockSettlementLogs,
      total: mockSettlementLogs.length,
      page: 1,
      pageSize: 20
    }
  },

  // Dashboard
  'GET /api/stats/dashboard': async () => {
    await delay()
    return mockDashboardStats
  }
}
