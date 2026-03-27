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

// 基础请求方法，通过T指定返回数据类型；可通过config改写配置
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const nuxtApp = useNuxtApp()
  const response = await (nuxtApp.$axios as AxiosInstance).request(config)
  // 有data就直接返回data（防止部分接口未走标准拦截器或多层嵌套），否则返回整个响应
  return response?.data !== undefined ? (response.data as T) : (response as T)
}

// 封装HTTP请求方法
export function get<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'params'>
): Promise<T> {
  return request<T>({ ...config, url, method: 'GET', params })
}

export function post<T, B = unknown>(
  url: string,
  body?: B,
  config?: Omit<AxiosRequestConfig<B>, 'url' | 'method' | 'data'>
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
  config?: Omit<AxiosRequestConfig<B>, 'url' | 'method' | 'data'>
): Promise<T> {
  return request<T>({ ...config, url, method: 'PUT', data: body })
}

export function del<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: Omit<AxiosRequestConfig, 'url' | 'method'>
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

  const API_BASE_URL = 'http://120.76.138.103:5050/'
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
