// 与鉴权相关的接口函数
import type {
  SignupRequestBody,
  GetPublicKeyResponse,
  LoginRequestBody,
  UserLoginOrRegisterData,
} from './type/auth'
import { encryptWithRSA } from '~/utils/rsaEncrypt'

export const useUserApi = () => {
  const nuxtApp = useNuxtApp()
  const tokenCookie = useCookie('token') // 处理 Token
  const API_BASE = '/api/auth'

  return {
    login: async (userData: LoginRequestBody) => {
      const { password, ...rest } = userData
      const encryptedPassword = await encryptWithRSA(password)
      const response = (await nuxtApp.$axios.post(`${API_BASE}/login`, {
        ...rest,
        password: encryptedPassword, // 发送加密后的密码
      })) as { data: UserLoginOrRegisterData }
      tokenCookie.value = response.data.token // 登录成功后保存 token
      return response
    },

    signup: async (userData: SignupRequestBody) => {
      const { password, ...rest } = userData

      const encryptedPassword = await encryptWithRSA(password)
      const response = (await nuxtApp.$axios.post(`${API_BASE}/register`, {
        ...rest,
        password: encryptedPassword, // 发送加密后的密码
      })) as { data: UserLoginOrRegisterData }
      tokenCookie.value = response.data.token // 登录成功后保存 token
      return response
    },

    logout: () => {
      tokenCookie.value = null // 退出时清除 token
    },

    getKey: async () => {
      const response = (await nuxtApp.$axios.get(
        `${API_BASE}/publicKey`
      )) as GetPublicKeyResponse // 获取公钥
      if (response.msg === 'success') {
        return response.data!.key || null
      }
    },
  }
}
