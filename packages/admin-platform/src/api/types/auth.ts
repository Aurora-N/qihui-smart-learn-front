export interface AdminLoginRequest {
  account: string
  password?: string
  captchaKey?: string
  captcha?: string
}

export interface AdminLoginResponse {
  token: string
  userId: number
}
