<script setup>
import { useForumApi } from '~/api/forum'

const topics = ref([])

definePageMeta({
  layout: 'forum',
})

const userStore = useUserStore()

const router = useRouter()

onMounted(async () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    ElMessage({ type: 'warning', message: '请先登录', plain: true })
    router.push('/login')
    return
  }
  const res = await useForumApi().getFavoritePostsList(
    userStore.userInfo.data.userId
  )
  topics.value = res.favorites
})
</script>

<template>
  <!-- Content Section -->
  <main class="main-content">
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
