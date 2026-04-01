import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthApi } from '~/api/auth'
import { useUserApi } from '~/api/user'
import type { LoginRequestBody, SignupRequestBody } from '~/api/type/auth'
import type { GetUserProfileResponseData } from '~/api/type/user'

type UserInfoState = {
  id?: number
  token?: string
  data?: GetUserProfileResponseData
}

type LoginPayload = Pick<LoginRequestBody, 'account' | 'password'> &
  Partial<Pick<LoginRequestBody, 'captcha' | 'captchaKey'>>

type SignupPayload = Pick<
  SignupRequestBody,
  'email' | 'password' | 'userName'
> &
  Partial<Pick<SignupRequestBody, 'captcha' | 'captchaKey'>>

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义管理用户数据的state
    const userInfo = ref<UserInfoState>({})
    // 用户是否登录的state
    const isLoggedIn = ref(false)
    // 定义action
    const authApi = useAuthApi()
    const userApi = useUserApi()
    // 登录获取token及userId
    const userLogin = async ({
      account,
      password,
      captcha,
      captchaKey,
    }: LoginPayload) => {
      const res = await authApi.login({
        account,
        password,
        captcha: captcha || '',
        captchaKey: captchaKey || '',
      })
      userInfo.value = {
        id: res.data.userId,
        token: res.data.token,
      }
      isLoggedIn.value = true
    }
    // 注册新用户，如果用户成功注册，获取token以及userId
    const userSignUp = async ({
      userName,
      email,
      password,
      captcha,
      captchaKey,
    }: SignupPayload) => {
      const res = await authApi.signup({
        userName,
        email,
        password,
        captcha: captcha || '',
        captchaKey: captchaKey || '',
      })
      userInfo.value = {
        id: res.data.userId,
        token: res.data.token,
      }
      isLoggedIn.value = true
    }
    // 获取用户信息
    const getUserInfo = async () => {
      if (!userInfo.value.id) {
        return { status: 'error', msg: '用户ID不存在' as const }
      }

      const res = await userApi.getUserInfo(userInfo.value.id)
      userInfo.value.data = res.data
      return {
        status: (res as { status?: 'success' | 'error' }).status || 'success',
        msg: (res as { msg?: string }).msg || '获取用户信息成功',
      }
    }
    // 退出登录并清空数据（插件会同步清除持久化数据）
    const clearUserInfo = () => {
      userInfo.value = {}
      isLoggedIn.value = false
    }
    return {
      userInfo,
      userLogin,
      userSignUp,
      getUserInfo,
      clearUserInfo,
      isLoggedIn,
    }
  },
  {
    persist: true,
  }
)
