<script setup>
import { getArticlesLists, getSubCategories } from '~/utils/getArticles'

definePageMeta({
  layout: 'articles-menu'
})

const route = useRoute()

const category = route.params.category

const bannerConfig = inject('bannerConfig')
const articlesList = inject('articlesList')

onMounted(async () => {
  bannerConfig.value = {
    title: category,
    subTitle: category + '系列教程',
    hueColor: '250'
  }
  articlesList.value = await getSubCategories(category)
})

// 获取与[category]相应的文章及其分类
const { data: articles, error } = await getArticlesLists(category)
</script>

<template>
  <ul>
    <li v-for="article in articles" :key="article.stem">
      <NuxtLink :to="`/articles/${article.stem.split('/').join('/')}`">
        {{ article.title }}
      </NuxtLink>
    </li>
  </ul>
</template>