export interface ModelInfo {
  modelName: string
  modelVersion: string
}

export interface DocsMetaData {
  documentId: number
  kbId: string
}

export interface ChatMessage {
  messageId: number // 消息id
  content: string // 消息内容
  role: 'system' | 'user' | 'assistant' // 角色名
  createdAt: string // 消息发送时间
  references?: { metadata: DocsMetaData; index: number }[] // 参考文章列表
  referenceData?: { metadata: DocsMetaData; index: number }[]
}

export interface StreamChoice {
  delta: {
    content?: string
    role?: string
  }
  index: number
}

export type StreamResponse =
  | {
      choices: StreamChoice[]
      created: number
      id: string
      model: string
      service_tier?: string
      object: string
      usage?: unknown
    }
  | { emotion: string }

export interface ChatSession {
  sessionId: number // 会话id
  sessionName: string // 会话名称
  modelName: string // 模型名称
  createdAt: string // 会话创建时间
}
