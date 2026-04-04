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

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      
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
        case 500:
          ElMessage.error('服务器错误，请稍后重试')
          break
        default:
          ElMessage.error(data?.message || '请求失败')
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
