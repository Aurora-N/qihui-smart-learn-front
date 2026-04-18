import type { BaseResponse } from './base'

export enum FetchMethod {
  LATEST_REPLY = 0,
  HOTTEST_POST = 1,
  LATEST_POST = 2,
}

export interface PostListRequestQuery {
  /**
   * 一次获取帖子的数量
   */
  limit?: number
  /**
   * 获取帖子的方式（最新回复/最热门/最新发布等）
   */
  method: FetchMethod
  /**
   * 获取帖子的起点
   */
  start?: number
}

export interface Tag {
  tagId: number
  tagName: string
}

export interface TagWithConfig extends Tag {
  hueColor: number // 色相值，范围0-360
  description: string // 标签描述
  postsCount: number // 该标签下的帖子数量
  lastPostTime: string // 该标签下最新帖子的发布时间
}

export interface PostAuthor {
  userId: number
  attributes: {
    avatarUrl: string
    userName: string
    email: string
  }
}

export interface LastCommentedUser {
  id: number
  userName: string
}

// 列表获取帖子的基础信息
export interface BasePost {
  postId: number
  title: string
  author: PostAuthor
  tags: Tag[]
  createdAt: string
  lastCommentedAt: string
  lastCommentedUser: LastCommentedUser
  commentsCount: number
}

export interface PostComment {
  commentId: number
  author: PostAuthor
  content: string
  createdAt: string
  likesCount: number // 评论点赞数
  liked: boolean // 是否点赞该评论
  repliedId?: number // 所回复的评论的ID
}

// 进入帖子页面获取的详细信息
export interface Post extends BasePost {
  commentsCount: number
  likesCount: number
  favorite: boolean
  liked: boolean
  content: string
  comments: PostComment[]
}

export interface CreateNewPostRequestBody {
  content: string
  tags: Tag[]
  title: string
}

export interface CreateNewPostResponseData {
  postId: number
  title: string
}

export interface GetPostListResponseData {
  posts: BasePost[]
}

export interface CreateNewCommentRequestQuery {
  userId: number
  postId: string
}

export interface CreateNewCommentRequestBody {
  repliedId: number
  comment: string
}

export type CreateNewCommentResponse = BaseResponse<{
  postId: number
  commentId: number
  repliedId?: number
}>

export interface LikeResponseData {
  type: 'post' | 'comment' // 点赞对象类型
  liked: boolean // 当前操作后的点赞状态
  likeId: number // 点赞对应的ID
}

export interface FavoriteResponseData {
  favorite: boolean // 当前操作后的收藏状态
  postId: number // 收藏对应的ID
}
