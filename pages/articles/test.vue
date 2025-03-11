<template>
  <div>
    <h1>文章列表</h1>
    <ul>
      <li v-for="article in articles" :key="article.stem">
        <NuxtLink :to="`/articles/${article.stem.split('/').join('/')}`">
          {{ article.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { getArticlesLists } from '~/utils/getArticles'

// const { data: articles } = await useAsyncData('content', () =>
//   queryCollection('content')
//     // .select('title', 'path', 'id')
//     .all()
// )

const { data: articles } = await getArticlesLists('前端')

definePageMeta({
  layout: false
})

onMounted(() => console.log(articles.value))
</script>