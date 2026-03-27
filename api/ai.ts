import type { ModelInfo } from './type/ai'
import { get, post, put, del, fetchStream } from '@/utils/apiClient'

// export interface ChatHistory {
//   chatId: number; // 聊天室id
//   chatName: string; // 聊天名称
//   lastUpdateTime: string; // 最新更新时间
// }

const BASE_API = '/api/ai'

export interface ChatMessage {
  messageId: number // 消息id
  content: string // 消息内容
  role: 'system' | 'user' | 'assistant' // 角色名
  createdAt: string // 消息发送时间
}

export interface StreamChoice {
  delta: {
    content?: string
    role?: string
  }
  index: number
}

export type StreamResponse = {
  choices: StreamChoice[]
  created: number
  id: string
  model: string
  service_tier?: string
  object: string
  usage?: unknown
} | { emotion: string }

export interface ChatSession {
  sessionId: number // 会话id
  sessionName: string // 会话名称
  modelName: string // 模型名称
  createdAt: string // 会话创建时间
}

// 获取AI角色回复的消息,在发送消息后调用
export const receiveMessageResponse = async (
  chatId: number,
  latestMessageId: number
) => {
  return await get<ChatMessage>(`${BASE_API}/${chatId}/receive`, {
    latestMessageId,
  })
}

// 获取当前用户指定会话下的所有消息
export const fetchChatMessages = async (sessionId: number) => {
  return await get<ChatMessage[]>(`${BASE_API}/session/${sessionId}/messages`)
}

// 获取当前用户的所有聊天会话
export const fetchChatHistoryList = async (userId: number) => {
  return await get<ChatSession[]>('${BASE_API}/session/list', { userId })
}

// 获取大模型列表
export const fetchModelList = async () => {
  return await get<ModelInfo[]>(`${BASE_API}/model/list`)
}

// 获取本地部署的大模型列表
export const fetchLocalModelList = async () => {
  return await get<ModelInfo[]>(`${BASE_API}/model/local`)
}

// 获取本地部署的大模型列表
export const fetchApiModelList = async () => {
  return await get<ModelInfo[]>(`${BASE_API}/model/api`)
}

// 用户发送消息
export const sendMessageStream = async (sessionId: number, message: string) => {
  return await fetchStream(`${BASE_API}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify({ sessionId, message }),
  })
}

// 创建新的聊天会话
export const createChatSession = async (userId: number, modelName: string) => {
  return await post<ChatSession>(`${BASE_API}/session/create`, {
    userId,
    modelName,
  })
}

// 修改聊天会话
export const updateChatSession = async (
  sessionId: number,
  sessionName: string,
  modelName: string
) => {
  return await put<string>(`${BASE_API}/session/update`, {
    sessionId,
    sessionName,
    modelName,
  })
}

// 删除聊天会话
export const deleteChatSession = async (sessionId: number) => {
  return await del<string>(`${BASE_API}/session/delete`, {
    sessionId,
  })
}

// 清空会话历史
export const clearChatSession = async (sessionId: number) => {
  return await del<string>(`${BASE_API}/session/clear/${sessionId}`)
}

// 删除单条消息
export const deleteChatMessage = async (messageId: number) => {
  return await del<string>(`${BASE_API}/session/clear/${messageId}`)
}
