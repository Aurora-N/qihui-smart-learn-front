<script setup>
import { ChevronDown as ChevronDownIcon } from 'lucide-vue-next'
import { useForumApi } from '~/api/forum'

const dropdowns = ref({
  study: false,
  about: false,
  lang: false,
  sort: false,
})

const toggleDropdown = name => {
  dropdowns.value[name] = !dropdowns.value[name]
}

const topics = ref([])

definePageMeta({
  layout: 'forum',
})

const bannerConfig = inject('bannerConfig')

const getPostsList = async (method = 0, start = 0, limit = 20) => {
  const res = await useForumApi().getPostsList(method, start, limit)
  if (res.status === 'success') {
    topics.value = res.data.posts
  }
}

onMounted(async () => {
  bannerConfig.value = {
    title: '启慧论坛',
    subTitle: '来一场思想上的碰撞',
    hueColor: '250',
  }

  await getPostsList(0, 0, 20)
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
      <NuxtLink
        v-for="topic in topics"
        :key="topic.postId"
        :to="`/forum/${topic.postId}`"
        class="topic-card"
      >
        <div class="topic-left">
          <img
            :src="topic.author.attributes.avatarUrl"
            class="avatar"
            :alt="topic.author.attributes.userName + '的头像'"
          />
          <div class="topic-info">
            <h3 class="topic-title">{{ topic.title }}</h3>
            <div class="topic-meta">
              <User style="width: 1em; height: 1em" />
              <span> {{ topic.lastCommentedUser.userName }} </span>
              <div class="last-commented-time">
                <TopRight
                  v-if="topic.lastCommentedAt"
                  style="width: 1em; height: 1em"
                />
                <span v-if="topic.lastCommentedAt">
                  最新回复于 {{ topic.lastCommentedAt }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="topic-right">
          <div class="tags">
            <span
              v-for="tag in topic.tags"
              :key="tag.tagId"
              class="tag"
              :class="'tag' + tag.tagId"
            >
              {{ tag.tagName }}
            </span>
          </div>
          <div class="reply-count">
            <ChatSquare style="width: 1em; height: 1em; margin-right: 8px" />
            <span>{{ topic.commentsCount }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import url(~/assets/style/forum_interface.scss);
</style>
