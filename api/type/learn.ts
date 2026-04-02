export interface GraphNodeData {
  endNode: Node
  nodeRelationship: NodeRelationship
  startNode: Node
}

export interface Node {
  info: null | string
  level: number | null
  name: null | string
  type1: null | string
  type2: null | string
}

export interface NodeRelationship {
  info: null | string
  type: null | string
}

export interface NodeResourceData {
  /**
   * 节点文章集合
   */
  articles: Article[]
  /**
   * 视频集合
   */
  videos: Video[]
}

export interface Article {
  /**
   * 文章名称
   */
  articleName: string
  /**
   * 文章地址
   */
  articlePath: string
}

export interface Video {
  /**
   * 视频名称
   */
  name: string
  /**
   * 视频链接
   */
  url: string
}

export interface LearningPathData {
  finalPath: FinalPath[] | null
}

export interface FinalPath {
  endNode: Node
  nodeRelationship: NodeRelationship
  startNode: Node
}

export interface PlanUserLearningPathRequestBody {
  userId: number
  learningTarget: string // 用户想学习的目标知识
  learningStage: number // 用户主观认为自己所处的学习阶段（可选项有入门、初级、进阶、深入四个，对应1-4）
  availableTime: number // 用户主观认为的自己每日能用于学习此路线知识的时间，单位为小时
}

export interface QuestionData {
  correct_answer: string
  difficulty: string
  knowledge_point: string
  options: string[] | null
  question: string
  scoring_rules: string
  type: 'single_choice' | 'multiple_choice' | 'fill_blank'
}

export interface GetFinalLearningPathRequestBody {
  quizResults: QuizResult[] // 用户的答题情况
  tartget: string // 用户想学习的目标知识
  tend: string // 用户倾向于从什么路线开始学习
  userId: number
}

// 答题情况
export interface QuizResult {
  correct_rate: number // 对应知识点的正确率
  knowledge_point: string // 知识点
}
