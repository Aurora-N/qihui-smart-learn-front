import type { BaseResponse } from './base'

export type GetPublicKeyResponse = BaseResponse<string>

export interface GetCaptchaResponseData {
  key: string // 验证码标识
  base64Image: string // 验证码图片（Base64编码）
}

export interface UserLoginOrRegisterData {
  userId: number // 用户ID
  token: string // 登录成功后返回的Token
}

export interface LoginRequestBody {
  /**
   * 账号（可以是邮箱）
   */
  account: string
  captcha: string
  captchaKey: string
  /**
   * 密码（前端已经用公钥加密）
   */
  password: string
}

export interface SignupRequestBody {
  captcha: string
  captchaKey: string
  /**
   * 可用于登陆的邮箱
   */
  email: string
  /**
   * 加密后的密码
   */
  password: string
  /**
   * 用户名，名称
   */
  userName: string
}
