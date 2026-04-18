import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  fetchChatHistoryList,
  fetchChatMessages,
  createChatSession,
  updateChatSession,
  sendMessageStream,
  deleteChatSession,
  clearChatSession,
  fetchApiModelList,
} from '~/api/ai'
import type { ChatSession, ChatMessage, ModelInfo } from '~/api/type/ai'
import { useUserStore } from '~/stores/userStore'
import { useArticleApi } from '~/api/article'

// 将状态提取到外部作为共享状态
const sessions = ref<ChatSession[]>([])
const currentSessionId = ref<number | null>(null)
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const isGenerating = ref(false)
const isSessionsLoading = ref(false)
const isMessagesLoading = ref(false)
const isModelsLoading = ref(false)
const models = ref<ModelInfo[]>([])
const scrollToBottomTrigger = ref(0)

export function useChatState() {
  const userStore = useUserStore()
  const userInfo = userStore.userInfo as { id?: number }
  const userId = ref<number | null>(userInfo?.id || null)

  const { getArticleLinkById } = useArticleApi()

  const triggerScrollToBottom = () => {
    scrollToBottomTrigger.value++
  }

  // 加载模型列表
  const loadModels = async () => {
    isModelsLoading.value = true
    try {
      const res = await fetchApiModelList()
      models.value = res || []
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load models:', error)
    } finally {
      isModelsLoading.value = false
    }
  }

  // 选择会话
  const selectSession = async (sessionId: number) => {
    currentSessionId.value = sessionId
    isMessagesLoading.value = true
    try {
      const res = await fetchChatMessages(sessionId)

      const formattedMessages = await Promise.all(
        (res || []).map(async msg => {
          const rawRefs = msg.references || msg.referenceData || []
          const newMsg = {
            ...msg,
            references: [] as any[],
          }

          // 收集所有的 documentId
          const docIds = new Set<number>()
          for (const refItem of rawRefs) {
            if (refItem.metadata && refItem.metadata.documentId) {
              docIds.add(refItem.metadata.documentId)
            } else if (refItem.articlePath) {
              // 如果已经有了完整的结构，直接保留
              newMsg.references.push(refItem)
            }
          }

          // 同步等待所有文献链接请求完成
          if (docIds.size > 0) {
            const promises = Array.from(docIds).map(id =>
              getArticleLinkById(id).catch(err => {
                console.error('Failed to fetch article ref:', err)
                return null
              })
            )
            const links = await Promise.all(promises)
            for (const articleLink of links) {
              if (
                articleLink &&
                !newMsg.references.some(
                  (r: any) => r.articlePath === articleLink.articlePath
                )
              ) {
                newMsg.references.push(articleLink)
              }
            }
          }

          return newMsg
        })
      )

      messages.value = formattedMessages
      triggerScrollToBottom()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch messages:', error)
    } finally {
      isMessagesLoading.value = false
    }
  }

  // 加载历史会话
  const loadSessions = async () => {
    if (!userId.value) return
    isSessionsLoading.value = true
    try {
      const res = await fetchChatHistoryList(userId.value)
      sessions.value = res || []
      if (sessions.value.length > 0 && !currentSessionId.value) {
        await selectSession(sessions.value[0].sessionId)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load sessions:', error)
    } finally {
      isSessionsLoading.value = false
    }
  }

  // 新建会话
  const handleNewSession = async () => {
    if (!userId.value) {
      ElMessage.warning('请先登录再新建对话')
      navigateTo('/login')
      return false
    }

    try {
      const defaultModel = models.value[0]?.modelName || 'gpt-3.5-turbo'
      const res = await createChatSession(userId.value!, defaultModel)
      if (res) {
        sessions.value.unshift(res)
        await selectSession(res.sessionId)
        return true
      }
      return false
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create session:', error)
      ElMessage.error('创建会话失败')
      return false
    }
  }

  // 修改会话
  const handleUpdateSession = async (
    sessionId: number,
    sessionName: string,
    modelName: string
  ) => {
    try {
      await updateChatSession(sessionId, sessionName, modelName)
      const index = sessions.value.findIndex(s => s.sessionId === sessionId)
      if (index !== -1) {
        sessions.value[index].sessionName = sessionName
        sessions.value[index].modelName = modelName
      }
      ElMessage.success('会话已更新')
      return true
    } catch (error) {
      console.error('Failed to update session:', error)
      ElMessage.error('更新会话失败')
      return false
    }
  }

  // 删除会话
  const handleDeleteSession = async (sessionId: number) => {
    try {
      await deleteChatSession(sessionId)
      sessions.value = sessions.value.filter(s => s.sessionId !== sessionId)
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = null
        messages.value = []
        if (sessions.value.length > 0) {
          await selectSession(sessions.value[0].sessionId)
        }
      }
      ElMessage.success('会话已删除')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete session:', error)
    }
  }

  // 清空会话
  const handleClearSession = async (sessionId: number) => {
    try {
      await clearChatSession(sessionId)
      if (currentSessionId.value === sessionId) {
        messages.value = []
      }
      ElMessage.success('聊天记录已清空')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to clear session:', error)
    }
  }

  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.value.trim() || isGenerating.value) {
      return
    }

    if (!userId.value) {
      ElMessage.warning('请先登录再使用AI问答功能')
      navigateTo('/login')
      return
    }

    if (!currentSessionId.value) {
      const success = await handleNewSession()
      if (!success || !currentSessionId.value) return
    }

    const userText = inputMessage.value.trim()
    inputMessage.value = ''

    messages.value.push({
      messageId: Date.now(),
      content: userText,
      role: 'user',
      createdAt: new Date().toISOString(),
    })
    triggerScrollToBottom()

    isGenerating.value = true

    const assistantMessage: ChatMessage = {
      messageId: Date.now() + 1,
      content: '',
      role: 'assistant',
      createdAt: new Date().toISOString(),
      references: [],
    }
    messages.value.push(assistantMessage)
    const targetMsg = messages.value[messages.value.length - 1]

    try {
      const response = await sendMessageStream(
        currentSessionId.value!,
        userText
      )
      const reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false

      if (!reader) throw new Error('流数据提取失败')

      let isReferenceEvent = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('event:')) {
              const eventName = line.replace(/^event:/, '').trim()
              if (eventName === 'references') {
                isReferenceEvent = true
              } else {
                isReferenceEvent = false
              }
            } else if (line.startsWith('data:')) {
              const dataStr = line.slice(5).trim()
              if (dataStr === '[DONE]') break

              if (isReferenceEvent) {
                try {
                  const data = JSON.parse(dataStr)
                  if (
                    data.type === 'references' &&
                    data.references &&
                    Array.isArray(data.references)
                  ) {
                    // 收集去重后的 documentId
                    const docIds = new Set<number>()
                    for (const refItem of data.references) {
                      if (refItem.metadata && refItem.metadata.documentId) {
                        docIds.add(refItem.metadata.documentId)
                      }
                    }
                    // 异步请求文献链接
                    for (const docId of docIds) {
                      getArticleLinkById(docId)
                        .then(articleLink => {
                          if (articleLink) {
                            if (!targetMsg.references) targetMsg.references = []
                            // 防复查
                            if (
                              !targetMsg.references.some(
                                (r: any) =>
                                  r.articlePath === articleLink.articlePath
                              )
                            ) {
                              targetMsg.references.push(articleLink)
                              triggerScrollToBottom()
                            }
                          }
                        })
                        .catch(err => {
                          console.error('Failed to fetch article ref:', err)
                        })
                    }
                  }
                } catch (e) {
                  // ignore parse error if stream split
                }
              } else {
                try {
                  const data = JSON.parse(dataStr)
                  if (data.choices?.[0]?.delta?.content) {
                    targetMsg.content += data.choices[0].delta.content
                    triggerScrollToBottom()
                  }
                } catch {
                  targetMsg.content += dataStr
                }
              }
            } else if (
              line.trim() &&
              !isReferenceEvent &&
              !line.startsWith('event:')
            ) {
              targetMsg.content += line.replace(/^data:/, '').trim()
            }
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Send message error:', error)
      targetMsg.content = '抱歉，生成回复时发生错误，请稍后再试。'
    } finally {
      isGenerating.value = false
      triggerScrollToBottom()
    }
  }

  return {
    userId,
    sessions,
    currentSessionId,
    messages,
    inputMessage,
    isGenerating,
    isSessionsLoading,
    isMessagesLoading,
    isModelsLoading,
    models,
    scrollToBottomTrigger,
    loadModels,
    loadSessions,
    selectSession,
    handleNewSession,
    handleUpdateSession,
    handleDeleteSession,
    handleClearSession,
    sendMessage,
  }
}
