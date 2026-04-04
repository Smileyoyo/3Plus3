import { get, post, put } from './index'

/**
 * 获取结算列表
 * @param {Object} params - 查询参数
 */
export function getSettlementList(params = {}) {
  return get('/settlements', params)
}

/**
 * 获取结算详情
 * @param {string|number} id - 结算ID
 */
export function getSettlementDetail(id) {
  return get(`/settlements/${id}`)
}

/**
 * 创建结算
 * @param {Object} data - 结算数据
 */
export function createSettlement(data) {
  return post('/settlements', data)
}

/**
 * 审核结算
 * @param {string|number} id - 结算ID
 * @param {boolean} approved - 是否通过
 * @param {string} remark - 备注
 */
export function approveSettlement(id, approved, remark = '') {
  return post(`/settlements/${id}/approve`, { approved, remark })
}

/**
 * 执行结算付款
 * @param {string|number} id - 结算ID
 * @param {Object} data - 付款信息
 */
export function paySettlement(id, data = {}) {
  return post(`/settlements/${id}/pay`, data)
}

/**
 * 获取结算日志
 * @param {Object} params - 查询参数
 */
export function getSettlementLogs(params = {}) {
  return get('/settlements/logs', params)
}

/**
 * 批量结算
 * @param {Array} ids - 结算ID列表
 * @param {Object} data - 批量结算数据
 */
export function batchSettlement(ids, data = {}) {
  return post('/settlements/batch', { ids, ...data })
}

/**
 * 获取结算统计
 * @param {Object} params - 统计参数
 */
export function getSettlementStats(params = {}) {
  return get('/settlements/stats', params)
}
