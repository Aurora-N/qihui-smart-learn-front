import { get, del } from "../utils/apiClient"
import type {
  FetchPostsResponse,
  FetchPostDetailResponse,
  ForumTagDetail,
} from "./types/forum"

// 获取指定标签对应的帖子列表
export const getPostsByTag = async (tag: number) => {
  return await get<FetchPostsResponse>(`/api/forum/${tag}/posts`)
}

// 获取具体帖子内容
export const getPostDetail = async (postId: number) => {
  return await get<FetchPostDetailResponse>(`/api/admin/forum/${postId}`)
}

// 获取所有标签列表
export const getForumTags = async () => {
  return await get<ForumTagDetail[]>(`/api/forum/tags/list`)
}

// 删除帖子
export const deletePost = async (postId: number) => {
  return await del<number>(`/api/admin/forum/post/delete/${postId}`)
}
