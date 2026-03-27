import type { BasePost } from './forum'

export interface GetUserProfileResponseData {
  /**
   * 用户头像地址
   */
  avatarURL: string
  /**
   * 用户论坛数据
   */
  counts: UseForumData
  /**
   * 邮箱
   */
  email: string
  /**
   * 用户最近登录日期
   */
  lastLoginDate: string
  /**
   * 用户个性签名（自我描述）
   */
  selfDescription: string
  /**
   * 用户id
   */
  userId: number
  /**
   * 用户名
   */
  userName: string
}

/**
 * 用户论坛数据
 */
export interface UseForumData {
  /**
   * 粉丝数
   */
  followers: number
  /**
   * 关注数
   */
  following: number
  /**
   * 用户的回复数目
   */
  replies: number
  /**
   * 用户创建的帖子数目
   */
  topics: number
}

export interface ProfilePost extends BasePost {
  likesCount: number
  favoritesCount: number
}

export interface UpdateUserInfoRequestBody {
  userName: string
  selfDescription: string
  /**
   * 密码（前端已经用公钥加密）
   */
  password: string
  avatarFile: File
}
