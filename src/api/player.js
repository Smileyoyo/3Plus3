import { get, post, put, del } from './index'

/**
 * 获取打手列表
 * @param {Object} params - 查询参数
 */
export function getPlayerList(params = {}) {
  return get('/players', params)
}

/**
 * 获取打手详情
 * @param {string|number} id - 打手ID
 */
export function getPlayerDetail(id) {
  return get(`/players/${id}`)
}

/**
 * 创建打手
 * @param {Object} data - 打手数据
 */
export function createPlayer(data) {
  return post('/players', data)
}

/**
 * 更新打手
 * @param {string|number} id - 打手ID
 * @param {Object} data - 打手数据
 */
export function updatePlayer(id, data) {
  return put(`/players/${id}`, data)
}

/**
 * 删除打手
 * @param {string|number} id - 打手ID
 */
export function deletePlayer(id) {
  return del(`/players/${id}`)
}

/**
 * 更新打手状态
 * @param {string|number} id - 打手ID
 * @param {string} status - 状态
 */
export function updatePlayerStatus(id, status) {
  return put(`/players/${id}/status`, { status })
}

/**
 * 获取在线打手
 */
export function getOnlinePlayers() {
  return get('/players/online')
}

/**
 * 获取打手统计
 * @param {Object} params - 统计参数
 */
export function getPlayerStats(params = {}) {
  return get('/players/stats', params)
}

/**
 * 打手充值
 * @param {string|number} id - 打手ID
 * @param {number} amount - 充值金额
 */
export function rechargePlayer(id, amount) {
  return post(`/players/${id}/recharge`, { amount })
}
