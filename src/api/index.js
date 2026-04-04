import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建 axios 实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 适配后端 { code, message, data } 格式
instance.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 统一处理响应格式
    if (res.code !== undefined) {
      if (res.code === 200 || res.code === 0) {
        return res.data
      } else {
        ElMessage.error(res.message || '请求失败')
        return Promise.reject(new Error(res.message || '请求失败'))
      }
    }
    
    return res
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      
      // 尝试从后端错误格式中提取消息
      const errorMessage = data?.message || data?.msg || '请求失败'
      
      switch (status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/login')
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 409:
          ElMessage.error('数据已被修改，请刷新后重试')
          break
        case 429:
          ElMessage.error('操作过于频繁，请稍后再试')
          break
        case 500:
          ElMessage.error('服务器错误，请稍后重试')
          break
        default:
          ElMessage.error(errorMessage)
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

export default instance

// 通用请求方法
export async function request(url, options = {}) {
  try {
    const response = await instance.request({
      url,
      ...options
    })
    return response
  } catch (error) {
    throw error
  }
}

// GET 请求
export function get(url, params = {}, options = {}) {
  return request(url, {
    method: 'GET',
    params,
    ...options
  })
}

// POST 请求
export function post(url, data = {}, options = {}) {
  return request(url, {
    method: 'POST',
    data,
    ...options
  })
}

// PUT 请求
export function put(url, data = {}, options = {}) {
  return request(url, {
    method: 'PUT',
    data,
    ...options
  })
}

// PATCH 请求
export function patch(url, data = {}, options = {}) {
  return request(url, {
    method: 'PATCH',
    data,
    ...options
  })
}

// DELETE 请求
export function del(url, params = {}, options = {}) {
  return request(url, {
    method: 'DELETE',
    params,
    ...options
  })
}
