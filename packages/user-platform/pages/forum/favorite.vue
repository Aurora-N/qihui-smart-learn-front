<script setup lang="ts">
import { useUserApi } from '~/api/user'

const topics = ref<any>([])

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
  const res = await useUserApi().getFavoritePostsList(
    userStore.userInfo.data!.userId
  )
  topics.value = (res as any).favorites || res.data?.posts || []
})
</script>

<template>
  <!-- Content Section -->
  <main class="main-content">
    <!-- Forum Topics -->
    <div class="topics-list">
      <ForumTopicCard
        v-for="topic in topics"
        :key="topic.postId"
        :topic="topic"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import url(~/assets/style/forum_interface.scss);
</style>
