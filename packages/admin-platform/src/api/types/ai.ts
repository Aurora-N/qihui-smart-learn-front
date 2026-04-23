export interface ChunkingRule {
  ruleId: number
  ruleName: string
  description: string
}

export interface KnowledgeDocumentDetail {
  documentId: number
  documentName: string
  documentSize: number
  documentParts: number
  documentLoadedAt: string
  documentContent: string
  documentType: string
}

export interface KnowledgeBaseSummary {
  kbId: number
  kbName: string
}

export interface KnowledgeBaseDetail {
  kbId: number
  kbName: string
  kbDescription: string
  kbDocNum: number
  creator: {
    userId: number
    userName: string
  }
  documents: {
    documentId: number
    documentName: string
    documentSize: string
    documentParts: number
  }[]
}

export interface CreateKnowledgeBaseRequest {
  kbName: string
  kbDescription: string
  embeddingModel: string
  rerankerModel: string
  kbType: string
}

export interface KnowledgeBaseCreationResult {
  kbId: number
  kbName: string
  creator: string
  kbDescription: string
  embeddingModel: string
  rerankerModel: string
  kbType: string
  createdAt: string
}

export interface DocumentUploadResult {
  documentId: number
  documentName: string
  documentSize: number
  documentParts: number
  documentLoadedAt: string
}

export interface DeleteDocumentsRequest {
  documentIds: number[]
  kbId: number
}
