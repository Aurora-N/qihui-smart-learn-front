<script setup lang="ts">
import { Plus, ChatDotRound, Delete, Brush } from '@element-plus/icons-vue'
import { useChatState } from '~/composables/useChatState'

const {
  sessions,
  currentSessionId,
  handleNewSession,
  selectSession,
  handleDeleteSession,
  handleClearSession,
} = useChatState()
</script>

<template>
  <aside class="chat-sidebar">
    <div class="sidebar-header">
      <el-button
        class="new-chat-btn"
        type="primary"
        :icon="Plus"
        @click="handleNewSession"
      >
        新建对话
      </el-button>
    </div>
    <div class="session-list">
      <template v-if="sessions.length">
        <div class="session-list-title">历史聊天</div>
        <div
          v-for="session in sessions"
          :key="session.sessionId"
          class="session-item"
          :class="{ active: currentSessionId === session.sessionId }"
          @click="selectSession(session.sessionId)"
        >
          <el-icon><ChatDotRound /></el-icon>
          <span class="session-name">{{
            session.sessionName || '新对话'
          }}</span>
          <div class="session-actions">
            <el-popconfirm
              title="确定清空聊天记录吗？"
              @confirm="handleClearSession(session.sessionId)"
            >
              <template #reference>
                <el-button
                  type="warning"
                  class="action-btn"
                  text
                  :icon="Brush"
                  @click.stop
                />
              </template>
            </el-popconfirm>
            <el-popconfirm
              title="确定删除该聊天吗？"
              @confirm="handleDeleteSession(session.sessionId)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  class="action-btn"
                  text
                  :icon="Delete"
                  @click.stop
                />
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
      <div v-else class="empty-sessions">
        <el-icon class="empty-icon"><ChatDotRound /></el-icon>
        <p>暂无历史聊天</p>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
@use '~/assets/style/abstracts/variables' as *;

.chat-sidebar {
  width: $sidebar-width;
  background-color: var(--color-background-layer);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .sidebar-header {
    padding: $spacing-md;
    border-bottom: 1px solid var(--color-border);
    .new-chat-btn {
      width: 100%;
      height: 40px;
      font-size: $font-size-base;
    }
  }

  .session-list {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-sm;

    .session-list-title {
      font-size: $font-size-sm;
      color: var(--color-text-mute);
      padding: $spacing-sm $spacing-md;
      margin-bottom: $spacing-xs;
      font-weight: $font-weight-medium;
    }

    .empty-sessions {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-mute);
      text-align: center;
      padding: $spacing-xl;

      .empty-icon {
        font-size: 32px;
        margin-bottom: $spacing-md;
        opacity: 0.5;
      }

      p {
        margin: 0;
        font-size: $font-size-base;
        font-weight: $font-weight-medium;
      }

      .sub-text {
        margin-top: $spacing-xs;
        font-size: $font-size-sm;
        font-weight: $font-weight-normal;
        opacity: 0.8;
      }
    }

    .session-item {
      display: flex;
      align-items: center;
      padding: $spacing-sm $spacing-md;
      margin-bottom: $spacing-xs;
      border-radius: $border-radius-md;
      cursor: pointer;
      color: var(--color-text);
      transition: background-color $transition-fast;

      &:hover,
      &.active {
        background-color: var(--color-background-mute);
      }
      &.active {
        color: var(--main-color);
        font-weight: $font-weight-medium;
      }

      .session-name {
        flex: 1;
        margin-left: $spacing-sm;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .session-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity $transition-fast;
        .action-btn {
          padding: 4px;
          margin: 0;
          height: auto;
        }
      }
      &:hover .session-actions {
        opacity: 1;
      }
    }
  }
}
</style>
