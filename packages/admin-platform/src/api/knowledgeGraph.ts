import { get, post } from "../utils/apiClient"
import type { KnowledgeGraphData } from "./types/knowledgeGraph"

const BASE_API = "/api/admin/knowledge_graph"

// 获取知识图谱所有节点
export const getKnowledgeGraph = async () => {
  return await get<KnowledgeGraphData[]>(`${BASE_API}`)
}

// 图谱更新 (上传 json 文件)
export const updateKnowledgeGraph = async (file: File) => {
  const formData = new FormData()
  formData.append("graphFile", file)

  return await post<void>(`${BASE_API}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
