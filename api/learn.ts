import type {
  GetFinalLearningPathRequestBody,
  GraphNodeData,
  LearningPathData,
  NodeResourceData,
  PlanUserLearningPathRequestBody,
  QuestionData,
} from './type/learn'
import { get, post } from '@/utils/apiClient'

const BASE_API = '/api/learn'
const CACHE_48H = 48 * 60 * 60 * 1000 // 48 hours in milliseconds

// 获取知识图谱所有节点
export const getAllKnowledgeNodes = async () => {
  return await get<GraphNodeData[]>(`${BASE_API}/knowledge_graph`, undefined, {
    cache: CACHE_48H,
  })
}

// 获取知识图谱指定节点的下分关系
export const getKnowledgeRelationships = async (nodeName: string) => {
  return await get<GraphNodeData[]>(
    `${BASE_API}/knowledge_graph/category`,
    {
      nodeName,
    },
    { cache: CACHE_48H }
  )
}

// 获取节点多模态学习资源
export const getNodeLearningResources = async (nodeName: string) => {
  return await get<NodeResourceData>(
    `${BASE_API}/knowledge_graph/resources`,
    {
      nodeName,
    },
    { cache: CACHE_48H }
  )
}

// 获取指定节点的同级关系
export const getNodeSiblings = async (nodeName: string) => {
  return await get<GraphNodeData[]>(
    `${BASE_API}/knowledge_graph/same_level_relationship`,
    {
      nodeName,
    },
    { cache: CACHE_48H }
  )
}

// 获取用户的学习路径
export const getUserLearningPath = async (userId: number) => {
  return await get<LearningPathData>(`${BASE_API}/gain/learning_path`, {
    userId,
  })
}

// 判断用户是否定制过学习路线
// 返回 'old' 表示定制过; 'new' 表示没有定制过
export const checkUserHasCustomPath = async (userId: number) => {
  return await get<'old' | 'new'>(`${BASE_API}/judge/learning_path`, {
    userId,
  })
}

// 学习路线规划，获取题目
export const planUserLearningPath = async (
  body: PlanUserLearningPathRequestBody
) => {
  return await post<QuestionData>(`${BASE_API}/quiz/learning_path`, body)
}

// 根据答题情况获取最终的学习路线
export const getFinalLearningPath = async (
  body: GetFinalLearningPathRequestBody
) => {
  return await post<LearningPathData>(
    `${BASE_API}/generate/learning_path`,
    body
  )
}

// 获取可选的学习目标列表
export const getAvailableLearningTargets = async () => {
  return await get<{ target: string[] }>(
    `${BASE_API}/quiz/choose_learning_target`
  )
}
