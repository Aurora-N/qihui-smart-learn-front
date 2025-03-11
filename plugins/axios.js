import axios from 'axios'
import { useUserStore } from '~/stores/userStore'

export default defineNuxtPlugin((nuxtApp) => {
    const apiClient = axios.create({
        baseURL: 'http://127.0.0.1:4523/m1/5842556-5528325-default', // 服务器地址
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    // 请求拦截器：自动添加 Token
    apiClient.interceptors.request.use((config) => {
        // 从pinia获取token数据
        const userStore = useUserStore()
        // 拼接token数据
        const token = userStore.userInfo.token
        if (token) {
            console.log('token login')
            config.headers.Authorization = `${token}`
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    // 响应拦截器：处理 401 未授权
    apiClient.interceptors.response.use((response) => {
        return response.data;
    }, (error) => {
        const userStore = useUserStore()
        if (error.response?.status === 401) {
            console.warn('登录失败，请重新登陆')
            userStore.clearUserInfo()
            $router.push('/login')
        }
        return Promise.reject(error)
    })

    return {
        provide: {
            axios: apiClient,
        }
    }
})