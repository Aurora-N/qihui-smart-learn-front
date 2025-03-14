<script setup>
definePageMeta({
  layout: 'forum'
})

const tagDetail = ref({})

const gettagDetail = async () => {
  const res = await {
    tagId: '1',
    data: {
      title: '综合板块', hueColor: '235', description: '综合讨论区，不知道选哪个tag就选这个吧', postCount: 114, updateTime: '今天',
      topics: [{
        id: 1,
        title: '关于大一寒假',
        author: '0x0001',
        replyTime: '2 天前',
        avatar: '/soyo.png',
        tags: [
          { text: '综合板块', type: 'main' },
          { text: '学习讨论', type: 'learn' },
          { text: '升学就业', type: 'upgrade' }
        ],
        replyCount: 3
      },
      {
        id: 2,
        title: 'Rust学习伙伴',
        author: '0x0001',
        replyTime: '3 天前',
        avatar: '/anno.gif',
        tags: [
          { text: '综合板块', type: 'main' },
          { text: 'Rust', type: 'basic' }
        ],
        replyCount: 1
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
      },]
    }
  }
  tagDetail.value = res.data
}

const bannerConfig = inject('bannerConfig');

onMounted(async () => {
  await gettagDetail();
  bannerConfig.value = {
    title: tagDetail.value?.title,
    subTitle: tagDetail.value?.description,
    hueColor: tagDetail.value?.hueColor,
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
      <NuxtLink :to="`/forum/${topic.id}`" class="topic-card" v-for="topic in tagDetail.topics" :key="topic.id">
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

<style>
@import url(~/assets/css/forum_interface.css);
</style>