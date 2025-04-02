<script setup>
import { ChevronDown as ChevronDownIcon } from 'lucide-vue-next'

const dropdowns = ref({
  study: false,
  about: false,
  lang: false,
  sort: false
})

const toggleDropdown = (name) => {
  dropdowns.value[name] = !dropdowns.value[name]
}

const topics = ref([
  {
    id: 1,
    title: '如何成为全栈高手',
    author: 'Uika',
    replyTime: '2 天前',
    avatar: 'https://avatars.githubusercontent.com/u/35548919',
    tags: [
      { text: '综合板块', type: 'main' },
      { text: '学习讨论', type: 'learn' },
      { text: '升学就业', type: 'upgrade' }
    ],
    replyCount: 3
  },
  {
    id: 2,
    title: '寻找Rust学习伙伴',
    author: 'soyo',
    replyTime: '3 天前',
    avatar: '/soyo.png',
    tags: [
      { text: '综合板块', type: 'main' },
      { text: 'Rust', type: 'basic' }
    ],
    replyCount: 2
  },
  {
    id: 3,
    title: '我的 2024 - 稳中求进、热爱生活',
    author: '0x0001',
    replyTime: '7 天前',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20163813-glxOOqHLKGGQRNcY2ioERBWbWGADnq.png',
    tags: [
      { text: '综合板块', type: 'main' },
      { text: '水吧', type: 'water' }
    ],
    replyCount: 1
  },
  {
    id: 4,
    title: '如何拥抱AI',
    author: '阿农',
    replyTime: '7 天前',
    avatar: '/anno.gif',
    tags: [
      { text: '学习讨论', type: 'learn' },
      { text: '综合板块', type: 'main' }
    ],
    replyCount: 1
  },

])

definePageMeta({
  layout: 'forum'
})

const bannerConfig = inject('bannerConfig');

onMounted(() => {
  bannerConfig.value = {
    title: '欢迎来到本论坛',
    subTitle: '知识图谱成就世界',
    hueColor: '250'
  }
})
</script>

<template>
  <!-- Content Section -->
  <main class="main-content">
    <div class="content-header">
      <Dropdown>
        <template #trigger>
          <button class="sort-button" @click="toggleDropdown('sort')">
            最新回复
            <chevron-down-icon class="icon-small" />
          </button>
        </template>
        <a href="#">最新回复</a>
        <a href="#">最新发布</a>
      </Dropdown>
    </div>

    <!-- Forum Topics -->
    <div class="topics-list">
      <NuxtLink :to="`/forum/${topic.id}`" class="topic-card" v-for="topic in topics" :key="topic.id">
        <div class="topic-left">
          <img :src="topic.avatar" class="avatar" :alt="topic.author">
          <div class="topic-info">
            <h3 class="topic-title">{{ topic.title }}</h3>
            <div class="topic-meta">
              <TopRight style="width: 1em; height: 1em; margin-right: 8px;" />
              <span> {{ topic.author }} </span>
              <span> 回复于 {{ topic.replyTime }}</span>
            </div>
          </div>
        </div>
        <div class="topic-right">
          <span v-for="tag in topic.tags" :key="tag.text" class="tag" :class="tag.type">
            {{ tag.text }}
          </span>
          <div class="reply-count">
            <ChatSquare style="width: 1em; height: 1em; margin-right: 8px;" />
            <span>{{ topic.replyCount }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
@import url(~/assets/css/forum_interface.css);
</style>