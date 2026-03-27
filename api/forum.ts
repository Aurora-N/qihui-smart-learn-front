import type {
  BasePost,
  CreateNewCommentRequestBody,
  CreateNewCommentRequestQuery,
  CreateNewCommentResponse,
  CreateNewPostRequestBody,
  CreateNewPostResponseData,
  FavoriteResponseData,
  LikeResponseData,
  Post,
  PostListRequestQuery,
  TagWithConfig,
} from './type/forum'

export const useForumApi = () => {
  const nuxtApp = useNuxtApp()
  const BASE_API = '/api/forum'

  return {
    // 获取所有帖子列表
    getPostsList: ({ method, start, limit }: PostListRequestQuery) =>
      nuxtApp.$axios.get(
        `${BASE_API}/posts?limit=${limit}&start=${start}&method=${method}`
      ) as Promise<{ data: BasePost[] }>,

    // 获取具体帖子内容
    getPostContent: (postId: number, userId?: number) =>
      nuxtApp.$axios.get(
        `${BASE_API}/posts/${postId}${userId ? `?userId=${userId}` : ''}`
      ) as Promise<{
        data: Post
      }>,

    // 获取全部标签
    getAllTags: () =>
      nuxtApp.$axios.get(`${BASE_API}/tags/list`) as Promise<{
        data: TagWithConfig[]
      }>,

    // 获取指定标签对应的帖子列表
    getTagPostsList: (tagId: number) =>
      nuxtApp.$axios.get(`/tags/${tagId}/postlist`) as Promise<{
        data: BasePost[]
      }>,

    // 发表新帖子
    createNewPost: ({ title, content, tags = [] }: CreateNewPostRequestBody) =>
      nuxtApp.$axios.post(`${BASE_API}/newpost`, {
        data: {
          title,
          tags,
          content,
        },
      }) as Promise<{ data: CreateNewPostResponseData }>,

    // 发表评论
    replyPost: async (
      replyData: CreateNewCommentRequestQuery & CreateNewCommentRequestBody
    ) => {
      const res = (await nuxtApp.$axios.post(
        `${BASE_API}/newcomment?userId=${replyData.userId}&postId=${replyData.postId}`,
        {
          repliedId: replyData.repliedId,
          comment: replyData.comment,
        }
      )) as CreateNewCommentResponse
      ElMessage({ type: 'success', message: res.msg, plain: true })
      return res
    },

    // 点赞
    doLike: (userId: number, postId?: number, commentId?: number) =>
      nuxtApp.$axios.put(`/forum/${postId}/likes`, {
        type: commentId ? 'comment' : 'post',
        likeId: commentId || postId,
        userId,
      }) as Promise<{ data: LikeResponseData }>,

    // 收藏
    doFavor: (postId: number, userId?: number) =>
      nuxtApp.$axios.put(
        `${BASE_API}/${postId}/favorite${userId ? `?userId=${userId}` : ''}`
      ) as Promise<{
        data: FavoriteResponseData
      }>,
  }
}
