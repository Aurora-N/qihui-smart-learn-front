import { get, post, del } from "../utils/apiClient"
import type {
  ChunkingRule,
  KnowledgeDocumentDetail,
  KnowledgeBaseSummary,
  KnowledgeBaseDetail,
  CreateKnowledgeBaseRequest,
  KnowledgeBaseCreationResult,
  DocumentUploadResult,
  DeleteDocumentsRequest,
} from "./types/ai"

const BASE_API = "/api/ai"

// 获取分段规则列表
export const getChunkingRules = async () => {
  return await get<ChunkingRule[]>(`${BASE_API}/knowledgebase/chunkingrules`)
}

// 获取文档详细信息
export const getKnowledgeDocumentDetail = async (documentId: number) => {
  return await get<KnowledgeDocumentDetail>(
    `${BASE_API}/knowledgebase/document/${documentId}`
  )
}

// 获取用户的知识库概要信息列表
export const getKnowledgeBaseList = async (userId: number) => {
  return await get<KnowledgeBaseSummary[]>(
    `${BASE_API}/knowledgebase/list/${userId}`
  )
}

// 获取知识库详细信息
export const getKnowledgeBaseDetail = async (userId: number) => {
  return await get<KnowledgeBaseDetail>(
    `${BASE_API}/knowledgebase/detail/${userId}`
  )
}

// 创建知识库
export const createKnowledgeBase = async (
  userId: number,
  data: CreateKnowledgeBaseRequest
) => {
  // query passed via params
  return await post<KnowledgeBaseCreationResult>(
    `${BASE_API}/knowledgebase/create`,
    data,
    {
      params: { userId },
    }
  )
}

// 上传文档到知识库
export const uploadDocuments = async (
  kbId: number,
  modelId: number,
  file: File | File[]
) => {
  const formData = new FormData()
  formData.append("kbId", kbId.toString())
  formData.append("modelId", modelId.toString())

  if (Array.isArray(file)) {
    file.forEach((f) => formData.append("documents", f))
  } else {
    formData.append("documents", file)
  }

  return await post<DocumentUploadResult[]>(
    `${BASE_API}/knowledgebase/documents/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
}

// 删除知识库
export const deleteKnowledgeBase = async (kbId: number) => {
  return await del<number>(`${BASE_API}/knowledgebase/${kbId}/delete`)
}

// 批量删除文档
export const deleteDocuments = async (data: DeleteDocumentsRequest) => {
  return await del<number[]>(`${BASE_API}/knowledgebase/documents/delete`, {
    data,
  })
}
