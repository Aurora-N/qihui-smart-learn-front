<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useChatState } from '~/composables/useChatState'

const {
  messages,
  inputMessage,
  isGenerating,
  userId,
  isMessagesLoading,
  sendMessage,
  scrollToBottomTrigger,
} = useChatState()

const messagesContainer = ref<HTMLElement | null>(null)
const showScrollButton = ref(false)

const checkScroll = () => {
  if (!messagesContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
  // 若距离底部的距离大于 50px，则显示“回到底部”按钮
  showScrollButton.value = scrollHeight - scrollTop - clientHeight > 50
}

const doScrollToBottom = (smooth = false) => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    })
  }
}

const handleScrollToBottomClick = () => {
  doScrollToBottom(true)
}

watch(scrollToBottomTrigger, async () => {
  await nextTick()
  doScrollToBottom(false)

  // 为了防止含有复杂的Markdown渲染或加载导致容器高度后续变化，增加一个异步延时滚动兜底
  setTimeout(() => {
    doScrollToBottom(false)
    checkScroll()
  }, 150)
})

const handleKeydown = (e: KeyboardEvent | Event) => {
  const evt = e as KeyboardEvent

  // 避免中文输入法(IME)组合按下回车时直接发出
  if (evt.isComposing) return

  if (evt.key === 'Enter' && !evt.shiftKey) {
    evt.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <main v-loading="isMessagesLoading" class="chat-main">
    <div
      ref="messagesContainer"
      class="messages-container"
      @scroll="checkScroll"
    >
      <template v-if="messages.length">
        <div
          v-for="msg in messages"
          :key="msg.messageId"
          class="message-wrapper"
          :class="msg.role === 'user' ? 'message-user' : 'message-assistant'"
        >
          <div class="avatar" :class="msg.role">
            {{ msg.role === 'user' ? '我' : 'AI' }}
          </div>
          <div class="message-content">
            <ChatMarkdown
              :content="msg.content || '...'"
              :is-generating="
                isGenerating &&
                msg.messageId === messages[messages.length - 1].messageId
              "
            />
            <div
              v-if="msg.references && msg.references.length"
              class="message-references"
            >
              <span class="ref-title">参考资料：</span>
              <div class="ref-buttons">
                <NuxtLink
                  v-for="(refItem, i) in msg.references"
                  :key="i"
                  :to="`/articles/${refItem.articlePath.split('/').map(encodeURIComponent).join('/')}`"
                  class="ref-btn"
                  target="_blank"
                >
                  {{ refItem.articleName }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="empty-state">
        <h3>我是您的 AI 学习助手</h3>
        <p v-if="!userId" class="login-tip">
          您当前未登录，<nuxt-link to="/login">点此登录</nuxt-link>
          或在下方输入框中发送消息自动跳转登录以使用聊天功能。
        </p>
        <p v-else>在这里，您可以随时与我交流关于计算机学习的任何问题。</p>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <transition name="el-fade-in-linear">
        <div
          v-show="showScrollButton"
          class="scroll-bottom-btn"
          @click="handleScrollToBottomClick"
        >
          <el-icon><ArrowDown /></el-icon>
        </div>
      </transition>
      <div class="input-box">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="1"
          :autosize="{ minRows: 1, maxRows: 6 }"
          resize="none"
          placeholder="输入你的问题... (Enter 发送, Shift+Enter 换行)"
          @keydown="handleKeydown"
        />
        <div class="input-actions">
          <el-button
            type="primary"
            class="send-btn"
            :loading="isGenerating"
            :disabled="!inputMessage.trim()"
            @click="sendMessage"
          >
            发送
          </el-button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '~/assets/style/abstracts/variables' as *;

// 主区域
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-soft);
  position: relative;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  scroll-behavior: smooth;
  margin-bottom: 120px;

  .empty-state {
    margin: auto;
    text-align: center;
    color: var(--color-text-mute);
    h3 {
      font-size: $font-size-2xl;
      margin-bottom: $spacing-md;
      color: var(--color-text);
    }

    .login-tip a {
      color: var(--link-color);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.message-wrapper {
  display: flex;
  gap: $spacing-md;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;

  &.message-user {
    flex-direction: row-reverse;
  }

  .avatar {
    width: $avatar-size-md;
    height: $avatar-size-md;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    flex-shrink: 0;

    &.user {
      background-color: var(--main-color);
      color: var(--white);
    }
    &.assistant {
      background-color: #10a37f;
      color: var(--white);
    }
  }

  .message-content {
    background: var(--color-background);
    padding: $spacing-md;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-sm;
    line-height: $line-height-relaxed;
    color: var(--color-text);

    // 针对不同角色略微调整样式
    .message-user & {
      background: var(--main-color);
      color: var(--white);
      border-top-right-radius: 4px;
    }
    .message-assistant & {
      background: var(--color-background-layer);
      border-top-left-radius: 4px;
      border: 1px solid var(--color-border);
    }

    .message-references {
      margin-top: $spacing-md;
      padding-top: $spacing-sm;
      border-top: 1px dashed var(--divider-light-1);

      .ref-title {
        font-size: $font-size-sm;
        color: var(--color-text-mute);
        margin-bottom: $spacing-xs;
        display: block;
      }

      .ref-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-sm;

        .ref-btn {
          font-size: $font-size-xs;
          color: var(--primary-color);
          background: var(--color-background-soft);
          border: 1px solid var(--primary-color);
          border-radius: 4px;
          padding: 2px 8px;
          text-decoration: none;
          transition: all $transition-fast;
          cursor: pointer;

          &:hover {
            background: var(--primary-color);
            color: var(--white);
          }
        }
      }
    }
  }
}

// 输入区
.input-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-md $spacing-xl $spacing-xl;
  background: linear-gradient(
    0deg,
    var(--color-background-soft) 80%,
    transparent 100%
  );
  z-index: 10;
  pointer-events: none; // 允许点击穿透渐变层背景

  // 悬浮向下滚动按钮
  .scroll-bottom-btn {
    pointer-events: auto; // 恢复按钮自身的点击响应
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-background-layer);
    border: 1px solid var(--color-border);
    box-shadow: $shadow-md;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-text-mute);
    transition: all $transition-fast;
    z-index: 10;

    &:hover {
      color: var(--main-color);
      border-color: var(--main-color);
      box-shadow: $shadow-lg;
    }
  }

  .input-box {
    pointer-events: auto; // 恢复输入框区域的点击响应
    max-width: 800px;
    margin: 0 auto;
    background: var(--color-background-layer);
    border-radius: $border-radius-lg;
    border: 1px solid var(--color-border);
    padding: $spacing-sm;
    box-shadow: $shadow-md;
    transition: box-shadow $transition-fast;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    &:focus-within {
      box-shadow: $shadow-lg;
      border-color: var(--main-color);
    }

    :deep(.el-textarea__inner) {
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
      font-size: $font-size-base;
      color: var(--color-text);
      padding: $spacing-xs $spacing-sm;

      /* 美化滚动条 */
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: var(--divider-light-2);
        border-radius: 3px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }

    .input-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: $spacing-xs;
      border-top: 1px solid transparent; // 预留边框位置可按需调整
      min-height: 32px; // 确保有一行高度

      .send-btn {
        background-color: var(--primary-color);
        color: var(--primary-foreground);
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
      }
    }
  }
}
</style>
