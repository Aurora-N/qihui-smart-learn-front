import axios from 'axios'
import { useUserStore } from '~/stores/userStore'


export default defineNuxtPlugin((nuxtApp) => {
    const apiClient = axios.create({
        baseURL: 'http://120.76.138.103:5050/', // 服务器地址
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
        },
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
        console.log(error.response?.data.msg)
        switch (error.response?.status) {
            case 400:
                ElMessage({
                    type: 'error', message: error.response.data.msg,
                    plain: true,
                })
                userStore.clearUserInfo()
                break;
            case 401:
                ElMessage({
                    type: 'error', message: error.response.data.msg,
                    plain: true,
                })
                userStore.clearUserInfo()
                $router.push('/login')
                break;
            case 404:
                ElMessage({
                    type: 'error', message: error.response.data.msg,
                    plain: true,
                })
                userStore.clearUserInfo()
                break;
            default:
                break;
        }

        return Promise.reject(error)
    })

    return {
        provide: {
            axios: apiClient,
        }
    }
})