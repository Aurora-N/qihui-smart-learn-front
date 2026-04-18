<script setup lang="ts">
import { ChevronDown as ChevronDownIcon } from 'lucide-vue-next'
import { useForumApi } from '~/api/forum'

const dropdowns = ref<any>({
  study: false,
  about: false,
  lang: false,
  sort: false,
})

const toggleDropdown = (name: string) => {
  dropdowns.value[name] = !dropdowns.value[name]
}

const topics = ref<any>([])

definePageMeta({
  layout: 'forum',
})

const bannerConfig = inject<any>('bannerConfig')

const getPostsList = async (method = 0, start = 0, limit = 20) => {
  const res = (await useForumApi().getPostsList({
    method,
    start,
    limit,
  })) as any
  if (res.status === 'success') {
    topics.value = (res.data as any).posts.reverse()
  }
}

const currentListStatus = ref('最新回复')

const currentListStatusIndex = ref(0)

const changeCurrentListStatus = async (index: number) => {
  switch (index) {
    case 0:
      currentListStatus.value = '最新回复'
      break
    case 1:
      currentListStatus.value = '热门帖子'
      break
    case 2:
      currentListStatus.value = '最新发布'
      break
    default:
      return
  }
  currentListStatusIndex.value = index
  await getPostsList(currentListStatusIndex.value, 0, 20)
}

onMounted(async () => {
  bannerConfig.value = {
    title: '启慧论坛',
    subTitle: '来一场思想上的碰撞',
    hueColor: '250',
  }

  await getPostsList(currentListStatusIndex.value, 0, 20)
})
</script>

<template>
  <!-- Content Section -->
  <main class="main-content">
    <div class="content-header">
      <Dropdown>
        <template #trigger>
          <button class="sort-button" @click="toggleDropdown('sort')">
            {{ currentListStatus }}
            <chevron-down-icon class="icon-small" />
          </button>
        </template>
        <button @click="changeCurrentListStatus(0)">最新回复</button>
        <button @click="changeCurrentListStatus(1)">热门帖子</button>
        <button @click="changeCurrentListStatus(2)">最新发布</button>
      </Dropdown>
    </div>

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
