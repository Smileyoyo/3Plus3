/**
 * 格式化日期
 * @param {Date|string|number} date - 日期
 * @param {string} format - 格式
 * @returns {string}
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '-'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化日期时间
 * @param {Date|string|number} date - 日期
 * @returns {string}
 */
export function formatDateTime(date) {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化时间
 * @param {Date|string|number} date - 日期
 * @returns {string}
 */
export function formatTime(date) {
  return formatDate(date, 'HH:mm:ss')
}

/**
 * 相对时间
 * @param {Date|string|number} date - 日期
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return '-'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const now = new Date()
  const diff = now - d
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (days < 365) return `${Math.floor(days / 30)}月前`
  return `${Math.floor(days / 365)}年前`
}

/**
 * 格式化货币
 * @param {number} amount - 金额
 * @param {string} symbol - 货币符号
 * @returns {string}
 */
export function formatCurrency(amount, symbol = '¥') {
  if (amount === null || amount === undefined) return '-'
  return `${symbol}${Number(amount).toFixed(2)}`
}

/**
 * 格式化手机号
 * @param {string} phone - 手机号
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return '-'
  const str = String(phone)
  if (str.length === 11) {
    return str.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
  }
  return str
}

/**
 * 格式化金额（千分位）
 * @param {number} num - 数字
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '-'
  return Number(num).toLocaleString('zh-CN')
}

/**
 * 格式化百分比
 * @param {number} value - 值
 * @param {number} decimals - 小数位数
 * @returns {string}
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return '-'
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 脱敏姓名
 * @param {string} name - 姓名
 * @returns {string}
 */
export function maskName(name) {
  if (!name) return '-'
  if (name.length === 1) return name
  if (name.length === 2) return name[0] + '*'
  return name[0] + '*' + name[name.length - 1]
}

/**
 * 截断文本
 * @param {string} text - 文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀
 * @returns {string}
 */
export function truncate(text, maxLength = 50, suffix = '...') {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + suffix
}

/**
 * 首字母大写
 * @param {string} str - 字符串
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化游戏段位
 * @param {string} tier - 段位
 * @returns {string}
 */
export function formatGameTier(tier) {
  if (!tier) return '-'
  return tier.toUpperCase()
}
