import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  fetchChatHistoryList,
  fetchChatMessages,
  createChatSession,
  sendMessageStream,
  deleteChatSession,
  clearChatSession,
  fetchApiModelList,
} from '~/api/ai'
import type { ChatSession, ChatMessage, ModelInfo } from '~/api/type/ai'
import { useUserStore } from '~/stores/userStore'

// 将状态提取到外部作为共享状态
const isMock = ref(true) // 是否开启本地Mock模式
const sessions = ref<ChatSession[]>([])
const currentSessionId = ref<number | null>(null)
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const isGenerating = ref(false)
const models = ref<ModelInfo[]>([])
const scrollToBottomTrigger = ref(0)

export function useChatState() {
  const userStore = useUserStore()
  const userInfo = userStore.userInfo as { id?: number }
  const userId = ref<number | null>(userInfo?.id || null)

  const triggerScrollToBottom = () => {
    scrollToBottomTrigger.value++
  }

  // 加载模型列表
  const loadModels = async () => {
    if (isMock.value) {
      models.value = [{ modelName: 'gpt-3.5-turbo', modelVersion: '1.0' }]
      return
    }
    try {
      const res = await fetchApiModelList()
      models.value = res || []
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load models:', error)
    }
  }

  // 选择会话
  const selectSession = async (sessionId: number) => {
    currentSessionId.value = sessionId
    if (isMock.value) {
      if (sessionId === 1) {
        messages.value = [
          {
            messageId: 101,
            content: '请问什么是计算机科学？',
            role: 'user',
            createdAt: new Date().toISOString(),
          },
          {
            messageId: 102,
            content:
              '计算机科学(Computer Science，简称CS)，是系统性研究信息与计算的理论基础以及它们在计算机系统中如何实现与应用的实用技术的学科。',
            role: 'assistant',
            createdAt: new Date().toISOString(),
          },
        ]
      } else {
        messages.value = []
      }
      triggerScrollToBottom()
      return
    }

    try {
      const res = await fetchChatMessages(sessionId)
      messages.value = res || []
      triggerScrollToBottom()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch messages:', error)
    }
  }

  // 加载历史会话
  const loadSessions = async () => {
    if (isMock.value) {
      sessions.value = [
        {
          sessionId: 1,
          sessionName: '什么是计算机科学',
          modelName: 'gpt-3.5-turbo',
          createdAt: new Date().toISOString(),
        },
        {
          sessionId: 2,
          sessionName: '学习Vue框架',
          modelName: 'gpt-3.5-turbo',
          createdAt: new Date().toISOString(),
        },
      ]
      if (sessions.value.length > 0 && !currentSessionId.value) {
        await selectSession(sessions.value[0].sessionId)
      }
      return
    }

    if (!userId.value) return
    try {
      const res = await fetchChatHistoryList(userId.value)
      sessions.value = res || []
      if (sessions.value.length > 0 && !currentSessionId.value) {
        await selectSession(sessions.value[0].sessionId)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load sessions:', error)
    }
  }

  // 新建会话
  const handleNewSession = async () => {
    if (!userId.value && !isMock.value) {
      ElMessage.warning('请先登录再新建对话')
      navigateTo('/login')
      return
    }

    if (isMock.value) {
      const newSession = {
        sessionId: Date.now(),
        sessionName: '新对话', // MOCK ID
        modelName: 'gpt-3.5-turbo',
        createdAt: new Date().toISOString(),
      }
      sessions.value.unshift(newSession)
      await selectSession(newSession.sessionId)
      return
    }

    try {
      const defaultModel = models.value[0]?.modelName || 'gpt-3.5-turbo'
      const res = await createChatSession(userId.value!, defaultModel)
      if (res) {
        sessions.value.unshift(res)
        await selectSession(res.sessionId)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create session:', error)
      ElMessage.error('创建会话失败')
    }
  }

  // 删除会话
  const handleDeleteSession = async (sessionId: number) => {
    if (isMock.value) {
      sessions.value = sessions.value.filter(s => s.sessionId !== sessionId)
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = null
        messages.value = []
        if (sessions.value.length > 0) {
          await selectSession(sessions.value[0].sessionId)
        }
      }
      ElMessage.success('会话已删除')
      return
    }

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
    if (isMock.value) {
      if (currentSessionId.value === sessionId) {
        messages.value = []
      }
      ElMessage.success('聊天记录已清空')
      return
    }

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

    if (!userId.value && !isMock.value) {
      ElMessage.warning('请先登录再使用AI问答功能')
      navigateTo('/login')
      return
    }

    if (!currentSessionId.value && !isMock.value) {
      ElMessage.warning('请先选择或新建一个会话')
      return
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
    }
    messages.value.push(assistantMessage)
    const targetMsg = messages.value[messages.value.length - 1]

    if (isMock.value) {
      const mockReply =
        '这是一个Mock的流式回复内容。支持未登录用户浏览和体验。\n下面我们演示一下打字机效果。这里是更多一些的文字...'
      let i = 0
      const timer = setInterval(() => {
        if (i < mockReply.length) {
          targetMsg.content += mockReply[i]
          i++
          triggerScrollToBottom()
        } else {
          clearInterval(timer)
          isGenerating.value = false
          triggerScrollToBottom()
        }
      }, 50)
      return
    }

    try {
      const response = await sendMessageStream(
        currentSessionId.value!,
        userText
      )
      const reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false

      if (!reader) throw new Error('流数据提取失败')

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const dataStr = line.slice(5).trim()
              if (dataStr === '[DONE]') break
              try {
                const data = JSON.parse(dataStr)
                if (data.choices?.[0]?.delta?.content) {
                  targetMsg.content += data.choices[0].delta.content
                  triggerScrollToBottom()
                }
              } catch {
                targetMsg.content += dataStr
              }
            } else if (line.trim()) {
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
    isMock,
    sessions,
    currentSessionId,
    messages,
    inputMessage,
    isGenerating,
    models,
    scrollToBottomTrigger,
    loadModels,
    loadSessions,
    selectSession,
    handleNewSession,
    handleDeleteSession,
    handleClearSession,
    sendMessage,
  }
}
