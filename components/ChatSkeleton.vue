<template>
  <div class="chat-skeleton">
    <!-- 左侧边栏 -->
    <div class="sidebar">
      <!-- 新建对话按钮 -->
      <div class="new-chat-btn skeleton-item">
        <div class="skeleton-icon"></div>
        <div class="skeleton-text skeleton-text--medium"></div>
      </div>

      <!-- 历史记录标题 -->
      <div class="history-title">
        <div class="skeleton-text skeleton-text--small"></div>
      </div>

      <!-- 历史对话项 -->
      <div class="history-item skeleton-item">
        <div class="skeleton-text skeleton-text--long"></div>
      </div>

      <!-- 显示条数提示 -->
      <div class="history-count">
        <div class="skeleton-text skeleton-text--medium"></div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 头部标题 -->
      <div class="header">
        <div class="skeleton-text skeleton-text--medium"></div>
      </div>

      <!-- 聊天区域 -->
      <div class="chat-area">
        <!-- 欢迎消息 -->
        <div class="welcome-message">
          <div class="avatar skeleton-avatar"></div>
          <div class="message-content">
            <div class="skeleton-text skeleton-text--long"></div>
            <div class="skeleton-text skeleton-text--medium"></div>
          </div>
        </div>

        <!-- 建议问题按钮 -->
        <div class="suggestion-buttons">
          <div v-for="n in 3" :key="n" class="suggestion-btn skeleton-item">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text skeleton-text--medium"></div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <div class="input-container skeleton-item">
          <div class="skeleton-text skeleton-text--long"></div>
          <div class="skeleton-icon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 骨架屏组件，无需额外逻辑
</script>

<style lang="scss" scoped>
.chat-skeleton {
  display: flex;
  height: calc(100vh - 55px);
  background-color: #f5f5f5;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

// 骨架屏基础样式
.skeleton-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
}

.skeleton-text {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  height: 16px;

  &--small {
    width: 60px;
  }

  &--medium {
    width: 120px;
  }

  &--long {
    width: 200px;
  }
}

.skeleton-icon {
  width: 20px;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  flex-shrink: 0;
}

.skeleton-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 50%;
  flex-shrink: 0;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// 左侧边栏样式
.sidebar {
  width: 280px;
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .new-chat-btn {
    border: 1px solid #3b82f6;
    color: #3b82f6;
    justify-content: center;

    .skeleton-icon {
      background: linear-gradient(90deg, #dbeafe 25%, #bfdbfe 50%, #dbeafe 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }

    .skeleton-text {
      background: linear-gradient(90deg, #dbeafe 25%, #bfdbfe 50%, #dbeafe 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }
  }

  .history-title {
    margin-top: 8px;

    .skeleton-text {
      width: 80px;
    }
  }

  .history-item {
    padding: 8px 12px;

    .skeleton-text {
      width: 150px;
    }
  }

  .history-count {
    margin-top: auto;
    padding-top: 16px;

    .skeleton-text {
      width: 180px;
      height: 14px;
    }
  }
}

// 主内容区域样式
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .header {
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;

    .skeleton-text {
      width: 100px;
      height: 20px;
    }
  }

  .chat-area {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;

    .welcome-message {
      display: flex;
      gap: 12px;
      align-items: flex-start;

      .message-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;

        .skeleton-text:first-child {
          width: 300px;
        }

        .skeleton-text:last-child {
          width: 200px;
        }
      }
    }

    .suggestion-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-left: 44px;

      .suggestion-btn {
        max-width: 300px;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;

        .skeleton-text {
          width: 180px;
        }
      }
    }
  }

  .input-area {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;

    .input-container {
      margin-bottom: 8px;
      justify-content: space-between;

      .skeleton-text {
        width: 250px;
      }
    }

    .input-footer {
      display: flex;
      justify-content: center;

      .skeleton-icon {
        width: 16px;
        height: 16px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .chat-skeleton {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .main-content {
    height: calc(100vh - 200px);
  }
}
</style>
