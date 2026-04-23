export interface AdminInfo {
  userName: string
  email: string
  lastConnectedDate: string
}

export interface CreateAdminRequest {
  userName: string
  email: string
  password?: string
}

// 审核
export interface ExamineRequest {
  content: string
  type: "post" | "comment"
}

// 统计
export interface UserStats {
  userNum: number
  bannedNum: number
  adminNum: number
}

export interface PostStats {
  postNum: number
  commentNum: number
}

export interface InteractionStats {
  favoritesNum: number
  likesNum: number
}

export interface LearningStats {
  nodeNum: number
  relationshipNum: number
}

export interface RagStats {
  documentNum: number
  paragraphNum: number
}

export interface ModelStats {
  modelNum: number
}

export interface OtherStats {
  dailyVisits: number
  dailyUniqueVisitors: number
}

export interface StatisticsData {
  userStats: UserStats
  postStats: PostStats
  interactionStats: InteractionStats
  learningStats: LearningStats
  ragStats: RagStats
  modelStats: ModelStats
  otherStats: OtherStats
}
