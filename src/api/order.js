import { get, post, put, del } from './index'

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 */
export function getOrderList(params = {}) {
  return get('/orders', params)
}

/**
 * 获取订单详情
 * @param {string|number} id - 订单ID
 */
export function getOrderDetail(id) {
  return get(`/orders/${id}`)
}

/**
 * 创建订单
 * @param {Object} data - 订单数据
 */
export function createOrder(data) {
  return post('/orders', data)
}

/**
 * 更新订单
 * @param {string|number} id - 订单ID
 * @param {Object} data - 订单数据
 */
export function updateOrder(id, data) {
  return put(`/orders/${id}`, data)
}

/**
 * 删除订单
 * @param {string|number} id - 订单ID
 */
export function deleteOrder(id) {
  return del(`/orders/${id}`)
}

/**
 * 派单
 * @param {string|number} id - 订单ID
 * @param {string|number} playerId - 打手ID
 */
export function assignOrder(id, playerId) {
  return post(`/orders/${id}/assign`, { playerId })
}

/**
 * 取消订单
 * @param {string|number} id - 订单ID
 * @param {string} reason - 取消原因
 */
export function cancelOrder(id, reason) {
  return post(`/orders/${id}/cancel`, { reason })
}

/**
 * 完成订单
 * @param {string|number} id - 订单ID
 * @param {Object} data - 完成信息
 */
export function completeOrder(id, data = {}) {
  return post(`/orders/${id}/complete`, data)
}

/**
 * 导出订单
 * @param {Object} params - 导出参数
 */
export function exportOrders(params = {}) {
  return get('/orders/export', params, { responseType: 'blob' })
}
