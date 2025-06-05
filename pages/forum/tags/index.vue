<script setup>
import { ClockIcon, FolderIcon } from 'lucide-vue-next'
import { useForumApi } from '~/api/forum'

const tags = ref([])

const getAllTags = async () => {
  const res = await useForumApi().getAllTags()
  tags.value = res.data
}

const bannerConfig = inject('bannerConfig')

onMounted(() => {
  getAllTags()
  bannerConfig.value = {
    title: '标签',
    subTitle: '来看看我们都有哪些栏目吧',
    hueColor: '250',
  }
})

definePageMeta({
  layout: 'forum',
})
</script>

<template>
  <div class="tags-container">
    <h1 class="tags-title">标签</h1>
    <div class="tags-list">
      <div
        v-for="tag in tags"
        :key="tag.tagId"
        class="tag-card"
        :style="{
          '--hue': tag.hueColor,
        }"
      >
        <div class="tag-header">
          <div class="tag-title">
            <div class="tag-color-indicator" />
            <h3 class="tag-name">
              {{ tag.title }}
            </h3>
          </div>
          <div class="tag-posts-count">{{ tag.postsCount }} 篇帖子</div>
        </div>

        <p class="tag-description">
          {{ tag.description }}
        </p>

        <div class="tag-footer">
          <div class="tag-recent">
            <clock-icon class="icon" size="16" />
            <span>最近更新: {{ tag.lastPostTime }}</span>
          </div>

          <button
            class="link-btn"
            @click="$router.push(`/forum/tags/${tag.tagId}`)"
          >
            去看看
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url(~/assets/style/tag_color.scss);

.tags-container {
  width: 100%;
}

.tags-container .tags-title {
  margin: -0.5rem 0 1.6rem 0;
}

.tags-list {
  display: flex;
  gap: 1rem;
  flex-flow: row wrap;
  justify-content: space-between;
}

.tag-card {
  width: 48%;
  border-radius: 12px;
  background-color: var(--color-background);
  padding: 20px;
  transition: 0.3s ease;
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

.tag-card:hover {
  border: 1px solid var(--primary);
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tag-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  background-color: var(--btn-regular-bg);
  padding: 4px 8px;
  border-radius: 5px;
}

.tag-color-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--primary);
  margin-right: 10px;
}

.tag-name {
  font-size: 18px;
  color: var(--color-heading);
  margin: 0;
}

.tag-posts-count {
  font-size: 14px;
  color: var(--color-meta-text);
  /* background-color: #f5f5f5; */
}

.tag-description {
  color: var(--color-text-2);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  overflow: hidden;
  max-height: 1.5rem;
}

.tag-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--color-meta-text);
}

.tag-recent,
.tag-category {
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 6px;
  color: var(--color-meta-text);
}

.tag-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-devider);
}

.link-btn {
  background-color: var(--color-background-mute);
  color: var(--color-text-2);
  border: none;
  border-radius: 5px;
  padding: 6px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.link-btn:hover {
  background-color: var(--color-background-hover);
}

@media (max-width: 480px) {
  .tag-card {
    width: 100%;
  }
}
</style>
