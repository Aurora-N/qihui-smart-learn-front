import axios from 'axios'
import { useUserStore } from '~/stores/userStore'

export default defineNuxtPlugin(nuxtApp => {
  const router = useRouter()
  const config = useRuntimeConfig()

  const apiClient = axios.create({
    baseURL: config.public.apiBase, // 统一服务器地址配置
    timeout: 20000,
  })

  // 请求拦截器：自动添加 Token
  apiClient.interceptors.request.use(
    config => {
      // 从pinia获取token数据
      const userStore = useUserStore()
      // 拼接token数据
      const token = userStore.userInfo.token
      if (token) {
        config.headers.Authorization = `${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  apiClient.interceptors.response.use(
    response => {
      return response.data
    },
    error => {
      const userStore = useUserStore()

      if (error.code === 'ECONNABORTED') {
        ElMessage({
          type: 'error',
          message: '请求超时，请稍后重试',
          plain: true,
        })
        return Promise.reject(error)
      }

      switch (error.response?.status) {
        case 400:
          ElMessage({
            type: 'error',
            message: error.response.data.msg,
            plain: true,
          })
          break
        case 401:
          ElMessage({
            type: 'error',
            message: error.response.data.msg + '请先登录！',
            plain: true,
          })
          userStore.clearUserInfo()
          router.push('/login')
          break
        case 404:
          ElMessage({
            type: 'error',
            message: error.response.data.msg + ' 内容未找到！',
            plain: true,
          })
          break
        case 500:
          ElMessage({
            type: 'error',
            message: '服务器内部错误：' + error.message,
            plain: true,
          })
          break
        case 502:
          ElMessage({
            type: 'error',
            message: error.message,
            plain: true,
          })
          break
        default:
          break
      }

      return Promise.reject(error)
    }
  )

  return {
    provide: {
      axios: apiClient,
    },
  }
})
