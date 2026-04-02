<script setup lang="ts">
import { useForumApi } from '~/api/forum'

definePageMeta({
  layout: 'forum',
})

const tags = ref<any>([])

const getAllTags = async () => {
  const res = await useForumApi().getAllTags()
  tags.value = res.data
}

const tagDetail = ref<any>({})

const topics = ref<any>([])

const route = useRoute()

const getTagLists = async () => {
  const res = await useForumApi().getTagPostsList(Number(route.params.id))
  topics.value = (res.data as any).posts || res.data
}

const bannerConfig = inject<any>('bannerConfig')

onMounted(async () => {
  await getAllTags()
  tagDetail.value = tags.value.filter(
    (item: any) => String(item.tagId) === String(route.params.id)
  )[0]
  if (tagDetail.value) {
    await getTagLists()

    if (bannerConfig) {
      bannerConfig.value = {
        title: tagDetail.value?.tagName,
        subTitle: tagDetail.value?.description,
        hueColor: tagDetail.value?.hueColor,
      }
    }
  }
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
