<script setup lang="ts">
import { onMounted } from 'vue'
import { useChatState } from '~/composables/useChatState'
import Navbar from '~/components/Navbar.vue'
import ChatSidebar from '~/components/chat/Sidebar.vue'
import ChatMain from '~/components/chat/Main.vue'

definePageMeta({
  layout: false,
})

useHead({
  title: '计算机在线学习平台问答助手',
})

const { userId, loadModels, loadSessions } = useChatState()

// 初始化
onMounted(async () => {
  if (userId.value) {
    await loadModels()
    await loadSessions()
  } else {
    // 未登录时仅加载模型列表，不加载会话
    await loadModels()
  }
})
</script>

<template>
  <div class="chat-page">
    <Navbar :transparent="false" />
    <div class="chat-container">
      <ChatSidebar />
      <ChatMain />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/style/abstracts/variables' as *;

.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-background);
}

.chat-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding-top: 55px; // account for navbar height
}
</style>
