<script setup>
import { ChevronDown as ChevronDownIcon } from 'lucide-vue-next'
import { useForumApi } from '~/api/forum'

const dropdowns = ref({
  study: false,
  about: false,
  lang: false,
  sort: false
})

const toggleDropdown = (name) => {
  dropdowns.value[name] = !dropdowns.value[name]
}

const topics = ref([])

definePageMeta({
  layout: 'forum'
})

const bannerConfig = inject('bannerConfig');

const getPostsList = async (method = 0, start = 0, limit = 20) => {
  const res = await useForumApi().getPostsList(method, start, limit);
  if (res.status === 'success') {
    topics.value = res.data.posts;
  }
}

onMounted(async () => {
  bannerConfig.value = {
    title: '欢迎来到本论坛',
    subTitle: '知识图谱成就世界',
    hueColor: '250'
  }

  await getPostsList(0, 0, 20);
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
      <NuxtLink :to="`/forum/${topic.postId}`" class="topic-card" v-for="topic in topics" :key="topic.postId">
        <div class="topic-left">
          <img :src="topic.author.attributes.avatarUrl" class="avatar" :alt="topic.author.attributes.userName + '的头像'">
          <div class="topic-info">
            <h3 class="topic-title">{{ topic.title }}</h3>
            <div class="topic-meta">
              <TopRight style="width: 1em; height: 1em; margin-right: 8px;" />
              <span> {{ topic.lastCommentedUser.userName }} </span>
              <span> 回复于 {{ topic.lastCommentedAt }}</span>
            </div>
          </div>
        </div>
        <div class="topic-right">
          <span v-for="tag in topic.tags" :key="tag.tagId" class="tag" :class="'tag' + tag.tagId">
            {{ tag.tagName }}
          </span>
          <div class="reply-count">
            <ChatSquare style="width: 1em; height: 1em; margin-right: 8px;" />
            <span>{{ topic.commentsCount }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
@import url(~/assets/css/forum_interface.css);
</style>