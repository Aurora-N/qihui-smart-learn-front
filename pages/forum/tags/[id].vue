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
.main-content {
  /* justify-content: baseline; */
  width: 100%;
}

.content-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.sort-button {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

/* 论坛主题 */
.topics-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.topic-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #374151;
}

.topic-card:hover {
  background-color: #f9fafb;
  text-decoration: none;
}

.topic-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.topic-info {
  display: flex;
  flex-direction: column;
}

.topic-title {
  font-weight: 500;
  margin: 0;
}

.topic-meta {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.topic-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.reply-count {
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  color: #6b7280;
}

.icon-small {
  width: 1rem;
  height: 1rem;
}




/* temp */
.tag.main {
  --hue: 235;
  background-color: oklch(.95 .025 var(--hue));
  color: oklch(.55 .12 var(--hue));
}

.tag.water {
  --hue: 210;
  background-color: oklch(.95 .025 var(--hue));
  color: oklch(.55 .12 var(--hue));
}

.tag.learn {
  --hue: 160;
  background-color: oklch(.95 .025 var(--hue));
  color: oklch(.55 .12 var(--hue));
}

.tag.upgrade {
  --hue: 40;
  background-color: oklch(.95 .025 var(--hue));
  color: oklch(.55 .12 var(--hue));
}
</style>