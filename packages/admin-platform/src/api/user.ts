import { get, post, del } from "../utils/apiClient"
import type { UserOverview, UserDetail, BanUserParams } from "./types/user"

const BASE_API = "/api/admin/user"

// 获取用户列表
export const getUserList = async () => {
  return await get<UserOverview[]>(`${BASE_API}/list`)
}

// 获取用户详细信息
export const getUserDetail = async (userId: number) => {
  return await get<UserDetail>(`${BASE_API}/${userId}`)
}

// 用户封禁
export const banUser = async (userId: number, params: BanUserParams) => {
  return await post<number>(`${BASE_API}/${userId}/ban`, undefined, { params })
}

// 用户解封
export const unbanUser = async (userId: number) => {
  // 注意，解封接口是 /api/admin/users/{userId}/unban 根据文档 ("users" 而非 "user")
  return await post<number>(`/api/admin/users/${userId}/unban`)
}

// 删除用户
export const deleteUser = async (userId: number) => {
  return await del<number>(`${BASE_API}/delete/${userId}`)
}
