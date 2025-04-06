import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserApi } from '~/api/user';

export const useUserStore = defineStore('user',
    () => {
        // 定义管理用户数据的state
        const userInfo = ref({})
        // 定义action
        const userApi = useUserApi()
        // 登录获取token及userId
        const userLogin = async ({ account, password }) => {
            const res = await userApi.login({ account, password })
            userInfo.value = {
                id: res.data.userId,
                token: res.data.token,
            };
        }
        // 注册新用户，如果用户成功注册，获取token以及userId
        const userSignUp = async (userData) => {
            const res = await userApi.signup(userData);
            userInfo.value = {
                id: res.data.userId,
                token: res.data.token,
            };
        }
        // 获取用户信息
        const getUserInfo = async () => {
            const res = await userApi.getUserInfo(userInfo.value.id)
            userInfo.value.data = res.data
            return { status: res.status, msg: res.message }
        }
        // 退出登录并清空数据（插件会同步清除持久化数据）
        const clearUserInfo = () => {
            userInfo.value = {}
        }
        return {
            userInfo,
            userLogin,
            userSignUp,
            getUserInfo,
            clearUserInfo
        }
    },
    {
        persist: true,
    },
)