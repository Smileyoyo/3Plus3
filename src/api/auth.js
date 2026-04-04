import { get, post } from './index'

/**
 * 用户登录
 * @param {Object} data - 登录信息 { username, password }
 */
export function login(data) {
  return post('/auth/login', data)
}

/**
 * 用户登出
 */
export function logout() {
  return post('/auth/logout')
}

/**
 * 刷新 Token
 */
export function refreshToken() {
  return post('/auth/refresh')
}

/**
 * 获取当前用户信息
 */
export function getUserInfo() {
  return get('/auth/user')
}

/**
 * 修改密码
 * @param {Object} data - { oldPassword, newPassword }
 */
export function changePassword(data) {
  return post('/auth/change-password', data)
}

/**
 * 更新用户资料
 * @param {Object} data - 用户资料
 */
export function updateProfile(data) {
  return post('/auth/profile', data)
}
