export interface UserOverview {
  userId: number
  userName: string
  email: string
  type: string
  replies: number
  topics: number
  followers: number
  following: number
  lastConnectedDate: string
}

export interface GraphNode {
  name: string | null
  info: string | null
  level: number | null
  type1: string | null
  type2: string | null
}

export interface GraphRelationship {
  info: string | null
  type: string | null
}

export interface LearningPathNode {
  startNode: GraphNode
  endNode: GraphNode
  nodeRelationship: GraphRelationship
}

export interface UserDetail {
  userId: number
  userName: string
  email: string
  type: string
  replies: number
  topics: number
  followers: number
  following: number
  lastConnectedDate: string
  selfDescription: string
  avatarURL: string
  learningPath: LearningPathNode[] | null
  learningPathDescription: string | null
}

export interface BanUserParams {
  adminId: number
  reason: string
  expire: number
}
