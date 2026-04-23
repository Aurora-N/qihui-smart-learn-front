import { get, post } from "../utils/apiClient"
import type { AdminLoginRequest, AdminLoginResponse } from "./types/auth"

const BASE_API = "/api/auth"

// 管理员登录
export const adminLogin = async (data: AdminLoginRequest) => {
  return await post<AdminLoginResponse>(`${BASE_API}/admin/login`, data)
}

// 获取验证码
export const getCaptcha = async () => {
  return await get<{ base64Image: string; key: string }>(`${BASE_API}/captcha`)
}
