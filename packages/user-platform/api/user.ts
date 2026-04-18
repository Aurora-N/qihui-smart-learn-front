import type { BaseResponse } from './type/base'
import type { BasePost } from './type/forum'
import type {
  GetUserProfileResponseData,
  ProfilePost,
  UpdateUserInfoRequestBody,
} from './type/user'

// 与用户相关的接口函数
export const useUserApi = () => {
  const nuxtApp = useNuxtApp()
  const API_BASE = '/api/user'

  return {
    // 获取用户主页信息
    getUserInfo: (userId: number) =>
      nuxtApp.$axios.get(`${API_BASE}/profile/${userId}`) as Promise<{
        data: GetUserProfileResponseData
      }>,

    // 获取用户发布的帖子列表
    getUserPostedList: (userId: number) =>
      nuxtApp.$axios.get(`${API_BASE}/profile/${userId}/posts`) as Promise<{
        data: { posts: ProfilePost[] }
      }>,

    // 获取用户收藏的帖子列表
    getFavoritePostsList: (userId: number) =>
      nuxtApp.$axios.get(`${API_BASE}/forum/${userId}/favorite`) as Promise<{
        data: { posts: BasePost[] }
      }>,

    // 修改用户个人信息
    updateUserInfo: (
      userId: number,
      userData: Partial<UpdateUserInfoRequestBody>
    ) => {
      // 构造FormData
      const formData = new FormData()
      // 遍历userData并将非空的字段添加到 FormData 中
      Object.entries(userData).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value)
        }
      })

      const response = nuxtApp.$axios.put(
        `api/auth/edit/${userId}`,
        formData
      ) as Promise<BaseResponse<undefined>>
      return response
    },
  }
}
