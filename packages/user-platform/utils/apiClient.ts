import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useUserStore } from '~/stores/userStore'

// 从全局或内置类型中提取 RequestInit 防止在某些严格配置下提示 undefined
export type RequestInit = NonNullable<Parameters<typeof fetch>[1]>

// 统一请求错误结构
export interface ApiError {
  status: number | null
  code: string
  message: string
  details?: unknown
}

// 可选：后端若有统一响应结构，可在此定义并在拦截器解包
// export interface ApiResponse<T> { code: string; message: string; data: T }

export interface CustomRequestConfig<D = unknown>
  extends AxiosRequestConfig<D> {
  cache?: boolean | number // true 为默认缓存时间，传入 number 为自定义缓存毫秒数
}

const apiCache = new Map<string, { data: unknown; expire: number }>()
const DEFAULT_CACHE_TIME = 5 * 60 * 1000 // 默认 5 分钟
const CACHE_STORAGE_PREFIX = 'api_cache_'

// Initialize cache from localStorage in browser environment
if (typeof window !== 'undefined') {
  try {
    // Collect expired keys to remove them safely
    const expiredKeys: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CACHE_STORAGE_PREFIX)) {
        try {
          const value = localStorage.getItem(key)
          if (value) {
            const parsed = JSON.parse(value)
            if (Date.now() < parsed.expire) {
              apiCache.set(key.replace(CACHE_STORAGE_PREFIX, ''), parsed)
            } else {
              expiredKeys.push(key)
            }
          }
        } catch (e) {
          expiredKeys.push(key)
        }
      }
    }

    // Clean up expired or invalid keys
    expiredKeys.forEach(key => localStorage.removeItem(key))
  } catch (e) {
    console.warn('Failed to initialize API cache from localStorage', e)
  }
}

function generateCacheKey(config: CustomRequestConfig) {
  return `${config.method || 'GET'}:${config.url}?${JSON.stringify(config.params || {})}&${JSON.stringify(config.data || {})}`
}

// 基础请求方法，通过T指定返回数据类型；可通过config改写配置
export async function request<T>(config: CustomRequestConfig): Promise<T> {
  const isCacheEnabled = config.cache !== undefined && config.cache !== false
  const cacheKey = isCacheEnabled ? generateCacheKey(config) : ''

  if (isCacheEnabled) {
    const cached = apiCache.get(cacheKey)
    console.log(`Checking cache for ${cacheKey}:`, isCacheEnabled, cached) // 调试日志
    if (cached && Date.now() < cached.expire) {
      console.log(`Cache hit for ${cacheKey}`)
      return Promise.resolve(cached.data as T)
    }
  }

  const nuxtApp = useNuxtApp()
  const response = await (nuxtApp.$axios as AxiosInstance).request(config)
  // 有data就直接返回data（防止部分接口未走标准拦截器或多层嵌套），否则返回整个响应
  const result =
    response?.data !== undefined ? (response.data as T) : (response as T)

  if (isCacheEnabled) {
    const cacheTime =
      typeof config.cache === 'number' ? config.cache : DEFAULT_CACHE_TIME
    const cacheData = {
      data: result,
      expire: Date.now() + cacheTime,
    }

    apiCache.set(cacheKey, cacheData)

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          CACHE_STORAGE_PREFIX + cacheKey,
          JSON.stringify(cacheData)
        )
      } catch (e) {
        console.warn('Failed to save API cache to localStorage', e)
        // If storage is full, we could clear old caches here,
        // but for now, we just bypass persistence
      }
    }
  }

  return result
}

// 封装HTTP请求方法
export function get<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: Omit<CustomRequestConfig, 'url' | 'method' | 'params'>
): Promise<T> {
  return request<T>({ ...config, url, method: 'GET', params })
}

export function post<T, B = unknown>(
  url: string,
  body?: B,
  config?: Omit<CustomRequestConfig<B>, 'url' | 'method' | 'data'>
): Promise<T> {
  // 处理 FormData 类型上传
  if (body instanceof FormData) {
    const formDataConfig = {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': undefined, // 让浏览器自动设置正确的 Content-Type
      },
    }
    return request<T>({ ...formDataConfig, url, method: 'POST', data: body })
  }

  // 普通 JSON 数据上传
  return request<T>({ ...config, url, method: 'POST', data: body })
}

export function put<T, B = unknown>(
  url: string,
  body?: B,
  config?: Omit<CustomRequestConfig<B>, 'url' | 'method' | 'data'>
): Promise<T> {
  return request<T>({ ...config, url, method: 'PUT', data: body })
}

export function del<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: Omit<CustomRequestConfig, 'url' | 'method'>
): Promise<T> {
  return request<T>({ ...config, url, method: 'DELETE', params })
}

// 流式请求方法，使用 fetch 实现
export async function fetchStream(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const userStore = useUserStore()
  const token = (userStore.userInfo as Record<string, string>).token
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `${token}`)
  }

  // 如果没有设置 Content-Type 且 body 不是 FormData，默认 json
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const API_BASE_URL = useRuntimeConfig().public.apiBase
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  })

  if (!response.ok) {
    // 尝试解析错误信息
    let errorMessage = response.statusText
    try {
      const errorData = await response.json()
      if (errorData && typeof errorData.message === 'string') {
        errorMessage = errorData.message
      }
    } catch {
      // 忽略 JSON 解析错误，使用默认 statusText
    }

    // 401 处理
    if (response.status === 401) {
      userStore.clearUserInfo()
    }

    throw new Error(
      errorMessage || `Request failed with status ${response.status}`
    )
  }

  return response
}
