export interface ForumTag {
  tagId: number
  tagName: string
}

export interface ForumTagDetail {
  tagId: number | string 
  title: string
  hueColor: string
  description: string
  postsCount: number
  lastPostTime: string
}

export interface UserAttribute {
  avatarUrl: string
  userName: string
  email?: string
}

export interface AuthorInfo {
  userId: number
  attributes: UserAttribute
}

export interface CommentModel {
  commentId: number
  author: AuthorInfo
  content: string
  createdAt: string
  likesCount: number
  liked: boolean
  repliedID?: number
}

export interface PostOverview {
  postId: number | string
  title: string
  author: AuthorInfo
  tags: ForumTag[]
  createdAt: string
  lastCommentedAt: string | null
  lastCommentedUser: {
    id?: string
    userId?: number
    userName: string
  } | null
  commentsCount: number
}

export interface PostDetail {
  postId: number | string
  title: string
  author: AuthorInfo
  tags: ForumTag[]
  createdAt: string
  lastCommentedAt: string | null
  commentsCount: number
  likesCount: number
  favorite: boolean
  liked: boolean
  content: string
  comments: CommentModel[]
}

export interface FetchPostsResponse {
  posts: PostOverview[]
}

export interface FetchPostDetailResponse {
  posts: PostDetail
}
