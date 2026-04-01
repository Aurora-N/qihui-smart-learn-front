import type { GraphNodeData, NodeResourceData } from './type/learn'
import { get } from '@/utils/apiClient'

const BASE_API = '/api/learn'

// 获取知识图谱所有节点
export const getAllKnowledgeNodes = async () => {
  return await get<GraphNodeData[]>(`${BASE_API}/knowledge_graph`)
}

// 获取知识图谱指定节点的下分关系
export const getKnowledgeRelationships = async (nodeName: string) => {
  return await get<GraphNodeData[]>(`${BASE_API}/knowledge_graph/category`, {
    nodeName,
  })
}

// 获取节点多模态学习资源
export const getNodeLearningResources = async (nodeName: string) => {
  return await get<NodeResourceData>(`${BASE_API}/knowledge_graph/resources`, {
    nodeName,
  })
}

// 获取指定节点的同级关系
export const getNodeSiblings = async (nodeName: string) => {
  return await get<GraphNodeData[]>(
    `${BASE_API}/knowledge_graph/same_level_relationship`,
    {
      nodeName,
    }
  )
}
