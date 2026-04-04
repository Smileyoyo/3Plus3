import { get, post, put, del } from './index'

/**
 * 获取VIP列表
 * @param {Object} params - 查询参数
 */
export function getVIPList(params = {}) {
  return get('/vips', params)
}

/**
 * 获取VIP详情
 * @param {string|number} id - VIP ID
 */
export function getVIPDetail(id) {
  return get(`/vips/${id}`)
}

/**
 * 创建VIP
 * @param {Object} data - VIP数据
 */
export function createVIP(data) {
  return post('/vips', data)
}

/**
 * 更新VIP
 * @param {string|number} id - VIP ID
 * @param {Object} data - VIP数据
 */
export function updateVIP(id, data) {
  return put(`/vips/${id}`, data)
}

/**
 * 删除VIP
 * @param {string|number} id - VIP ID
 */
export function deleteVIP(id) {
  return del(`/vips/${id}`)
}

/**
 * VIP充值
 * @param {string|number} id - VIP ID
 * @param {number} amount - 充值金额
 * @param {string} type - 充值类型
 */
export function rechargeVIP(id, amount, type = 'balance') {
  return post(`/vips/${id}/recharge`, { amount, type })
}

/**
 * 获取VIP等级列表
 */
export function getVIPLevels() {
  return get('/vips/levels')
}

/**
 * VIP升级
 * @param {string|number} id - VIP ID
 * @param {number} level - 目标等级
 */
export function upgradeVIPLevel(id, level) {
  return post(`/vips/${id}/upgrade`, { level })
}
