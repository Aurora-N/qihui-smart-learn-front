<script setup lang="ts">
import { reactive, computed } from 'vue'

interface ArticleNode {
  category?: string
  title?: string
  link?: string
  links?: ArticleNode[]
  author?: string
  date?: string
  [key: string]: unknown
}

const props = withDefaults(
  defineProps<{
    articleList: ArticleNode[]
    level?: number
  }>(),
  {
    level: 1,
  }
)

const expandedStates = reactive<Record<number, boolean>>({})

const toggleExpand = (index: number) => {
  expandedStates[index] = !expandedStates[index]
}

const hasSubCategory = (obj: ArticleNode) => {
  return 'links' in obj && Array.isArray(obj.links)
}

const processedArticleList = computed(() => {
  return (props.articleList || []).map(node => {
    if (!hasSubCategory(node)) return node

    let currentCategory = node.category || ''
    let currentLinks = node.links || []

    while (currentLinks.length === 1 && hasSubCategory(currentLinks[0])) {
      const singleChild = currentLinks[0]
      if (currentCategory && singleChild.category) {
        currentCategory = `${currentCategory} · ${singleChild.category}`
      } else {
        currentCategory = singleChild.category || currentCategory
      }
      currentLinks = singleChild.links || []
    }

    return {
      ...node,
      category: currentCategory,
      links: currentLinks,
    }
  })
})

const titleTag = computed(() => {
  const headingLevel = Math.min(props.level + 1, 6)
  return `h${headingLevel}`
})

const getVisibleLinks = (obj: ArticleNode, index: number) => {
  const links = obj.links || []
  if (expandedStates[index]) return links

  let articleCount = 0
  return links.filter(item => {
    if (hasSubCategory(item)) return true
    articleCount++
    return articleCount <= 6
  })
}

const hasMoreArticles = (obj: ArticleNode) => {
  const links = obj.links || []
  return links.filter(item => !hasSubCategory(item)).length > 6
}

// Hue collection for tag_color aesthetics
const HUES = [250, 150, 45, 30, 200, 320, 100, 60]
const getHue = (index: number) => {
  return HUES[index % HUES.length]
}
</script>

<template>
  <div class="article-card-list" :class="{ 'masonry-layout': props.level > 1 }">
    <div
      v-for="(obj, index) in processedArticleList"
      :key="obj.link || obj.category || index"
      class="list-item tag-card"
      :style="
        props.level === 1 || hasSubCategory(obj)
          ? { '--hue': getHue(index) }
          : undefined
      "
    >
      <!-- Article Card -->
      <div v-if="!hasSubCategory(obj)" class="article-card-wrapper">
        <NuxtLink
          :to="obj.link ? `/articles/page?path=${obj.link}` : '#'"
          class="article-card"
          target="_blank"
        >
          <div class="card-content">
            <h3 class="article-title tag-title">{{ obj.title }}</h3>
            <div v-if="obj.author || obj.date" class="article-meta">
              <span v-if="obj.author" class="author">{{ obj.author }}</span>
              <span v-if="obj.date" class="date">{{ obj.date }}</span>
            </div>
          </div>
          <div class="card-arrow">
            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
            >
              <path
                fill="currentColor"
                d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 533.376a32 32 0 0 0 0-42.752L382.592 149.312a29.12 29.12 0 0 0-41.728 0z"
              ></path>
            </svg>
          </div>
        </NuxtLink>
      </div>

      <!-- Category Section -->
      <div v-else class="category-section">
        <div class="category-header">
          <component
            :is="titleTag"
            class="category-title tag-title"
            :class="`level-${level}`"
          >
            {{ obj.category }}
          </component>
        </div>

        <div class="category-children">
          <!-- Recursive call with either full list or first 6 items -->
          <ArticleCardList
            :article-list="getVisibleLinks(obj, index)"
            :level="props.level + 1"
          />

          <div v-if="hasMoreArticles(obj)" class="show-more-wrapper">
            <button class="show-more-btn" @click="toggleExpand(index)">
              <span>{{ expandedStates[index] ? '收起' : '查看更多' }}</span>
              <svg
                class="chevron-icon"
                :class="{ 'is-expanded': expandedStates[index] }"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
              >
                <path
                  fill="currentColor"
                  d="M831.872 340.864 512 652.736 192.128 340.864a30.59 30.59 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.728l341.376 331.648a32 32 0 0 0 42.752 0l341.376-331.648a29.12 29.12 0 0 0 0-41.728 30.59 30.59 0 0 0-42.752 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/style/tag_color.scss';

.article-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  /* Masonry layout inside nested lists */
  &.masonry-layout {
    display: block;
    column-count: 2;
    column-width: 300px;
    column-gap: 12px;

    & > .list-item {
      break-inside: avoid;
      page-break-inside: avoid; /* For older browsers compatibility */
      margin-top: 8px;
      display: inline-block; /* Forces block context keeping items intact */
      width: 100%;
    }
  }
}

.list-item {
  width: 100%;
  border-radius: 8px;
  background-color: var(--card-bg, var(--el-bg-color, #ffffff));
  border: 1px solid var(--btn-regular-bg, var(--el-border-color-lighter));
  overflow: hidden;
}

.article-card-wrapper {
  height: 100%;
}

.article-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  text-decoration: none;
  font-weight: 500;
  color: var(--el-text-color-primary, #303133);
  height: 100%;
  border-radius: inherit;

  &:hover {
    background-color: var(
      --btn-plain-bg-hover,
      var(--el-color-primary-light-9)
    );

    .article-title {
      color: var(--primary, var(--el-color-primary));
    }

    .card-arrow {
      color: var(--primary, var(--el-color-primary));
      transform: translateX(4px);
    }
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.article-title {
  font-size: 16px;
  margin: 0;
  line-height: 1.4;
  transition: color 0.2s ease;
  color: var(--el-text-color-primary);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--btn-content, var(--el-text-color-secondary));

  .author,
  .date {
    display: flex;
    align-items: center;
  }
}

.card-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--btn-content, var(--el-text-color-placeholder));
  transition: all 0.2s ease;
  font-size: 18px;
}

.category-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.category-header {
  padding: 12px 20px;
  border-bottom: 1px solid var(--btn-regular-bg, var(--el-border-color-lighter));
  background-color: var(--btn-regular-bg, rgba(0, 0, 0, 0.02));
}

.category-title {
  margin: 0;
  font-weight: 600;
  color: var(--primary, var(--el-text-color-primary));
  display: flex;
  align-items: center;

  &::before {
    content: '';
    width: 4px;
    height: 1em;
    background-color: var(--primary, var(--el-color-primary));
    margin-right: 8px;
    border-radius: 2px;
  }

  &.level-1 {
    font-size: 18px;
  }
  &.level-2 {
    font-size: 16px;
  }
  &.level-3 {
    font-size: 15px;
  }
}

.category-children {
  display: flex;
  flex-direction: column;
  padding: 8px 12px 12px;
  flex: 1;
  gap: 8px;
}

.show-more-wrapper {
  display: flex;
  justify-content: center;
}

.show-more-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background-color: transparent;
  border: 1px solid var(--btn-regular-bg-hover, var(--el-border-color-lighter));
  border-radius: 20px;
  color: var(--btn-content, var(--el-text-color-regular));
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(
      --btn-plain-bg-hover,
      var(--el-color-primary-light-9)
    );
    color: var(--primary, var(--el-color-primary));
    border-color: var(--primary, var(--el-color-primary-light-5));
  }

  .chevron-icon {
    transition: transform 0.3s ease;
    font-size: 12px;

    &.is-expanded {
      transform: rotate(180deg);
    }
  }
}
</style>
