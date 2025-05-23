<script setup>
const props = defineProps({
  articleList: Array,
  level: {
    type: Number,
    default: 1,
  },
})

const hasSubCategory = obj => {
  return 'links' in obj
}

const tag = computed(() => `h${props.level}`)
</script>

<template>
  <!-- articles -->
  <div
    v-for="obj of props.articleList"
    :key="obj.link || obj.category"
    class="articles-list"
  >
    <div v-if="!hasSubCategory(obj)">
      <NuxtLink
        :key="obj.link"
        :to="`/articles${obj.link}`"
        class="article-card"
      >
        <h3 class="article-title">{{ obj.title }}</h3>
        <div class="article-meta">
          <!-- <IconsLike />
          <span>{{ obj.likesCount }}</span> -->
        </div>
      </NuxtLink>
    </div>

    <div v-else>
      <component :is="tag" class="content-title">
        {{ obj.category }}
      </component>
      <ArticleList :article-list="obj.links" :level="props.level + 1" />
    </div>
  </div>
</template>

<style scoped>
.content-title {
  font-weight: bold;
  color: var(--color-text);
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.article-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  text-decoration: none;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.article-card:hover {
  background-color: var(--color-background-hover);
}

.article-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.article-info {
  display: flex;
  flex-direction: column;
}

.article-title {
  font-weight: 500;
  margin: 0;
}

.article-meta {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.article-right {
  display: flex;
  align-items: center;
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
</style>
