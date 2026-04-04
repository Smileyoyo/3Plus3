// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待接单',
  [ORDER_STATUS.ASSIGNED]: '已派单',
  [ORDER_STATUS.PROCESSING]: '进行中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消'
}

export const ORDER_STATUS_COLOR = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.ASSIGNED]: 'info',
  [ORDER_STATUS.PROCESSING]: 'primary',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger'
}

// Player Status
export const PLAYER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  BUSY: 'busy'
}

export const PLAYER_STATUS_TEXT = {
  [PLAYER_STATUS.ONLINE]: '在线',
  [PLAYER_STATUS.OFFLINE]: '离线',
  [PLAYER_STATUS.BUSY]: '忙碌'
}

export const PLAYER_STATUS_COLOR = {
  [PLAYER_STATUS.ONLINE]: 'success',
  [PLAYER_STATUS.OFFLINE]: 'info',
  [PLAYER_STATUS.BUSY]: 'warning'
}

// VIP Level
export const VIP_LEVEL = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  DIAMOND: 5
}

export const VIP_LEVEL_TEXT = {
  [VIP_LEVEL.BRONZE]: '青铜',
  [VIP_LEVEL.SILVER]: '白银',
  [VIP_LEVEL.GOLD]: '黄金',
  [VIP_LEVEL.PLATINUM]: '铂金',
  [VIP_LEVEL.DIAMOND]: '钻石'
}

// Settlement Status
export const SETTLEMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
}

export const SETTLEMENT_STATUS_TEXT = {
  [SETTLEMENT_STATUS.PENDING]: '待结算',
  [SETTLEMENT_STATUS.PROCESSING]: '结算中',
  [SETTLEMENT_STATUS.COMPLETED]: '已结算',
  [SETTLEMENT_STATUS.FAILED]: '结算失败'
}

// User Roles
export const USER_ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator'
}

export const USER_ROLE_TEXT = {
  [USER_ROLE.ADMIN]: '管理员',
  [USER_ROLE.MANAGER]: '经理',
  [USER_ROLE.OPERATOR]: '操作员'
}

// API Endpoints
export const API_BASE_URL = '/api'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  USER_INFO: '/auth/user',

  // Orders
  ORDER_LIST: '/orders',
  ORDER_DETAIL: '/orders/:id',
  ORDER_CREATE: '/orders',
  ORDER_UPDATE: '/orders/:id',
  ORDER_ASSIGN: '/orders/:id/assign',

  // Players
  PLAYER_LIST: '/players',
  PLAYER_DETAIL: '/players/:id',
  PLAYER_CREATE: '/players',
  PLAYER_UPDATE: '/players/:id',
  PLAYER_STATUS: '/players/:id/status',

  // Settlements
  SETTLEMENT_LIST: '/settlements',
  SETTLEMENT_CREATE: '/settlements',
  SETTLEMENT_APPROVE: '/settlements/:id/approve',
  SETTLEMENT_PAY: '/settlements/:id/pay',
  SETTLEMENT_LOGS: '/settlements/logs',

  // VIP
  VIP_LIST: '/vips',
  VIP_DETAIL: '/vips/:id',
  VIP_CREATE: '/vips',
  VIP_UPDATE: '/vips/:id',

  // Users
  USER_LIST: '/users',
  USER_DETAIL: '/users/:id',
  USER_CREATE: '/users',
  USER_UPDATE: '/users/:id',
  USER_DELETE: '/users/:id',

  // Statistics
  STATS_DASHBOARD: '/stats/dashboard',
  STATS_ORDERS: '/stats/orders',
  STATS_REVENUE: '/stats/revenue'
}

// WebSocket Events
export const WS_EVENTS = {
  NEW_ORDER: 'new_order',
  ORDER_UPDATE: 'order_update',
  PLAYER_STATUS_CHANGE: 'player_status_change',
  NOTIFICATION: 'notification',
  SETTLEMENT_UPDATE: 'settlement_update'
}

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const TIME_FORMAT = 'HH:mm'
