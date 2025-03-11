<script setup>
const postsCategoryList = ref([
  {
    id: '0', // Number as ID
    name: '前端',
    icon: '',
    posts: [{ id: '00', title: 'Bootstrap4教程 1', likesCount: 11 },
    { id: '01', title: 'Bootstrap教程 2', likesCount: 12 },
    { id: '02', title: 'Bootstrap教程 3', likesCount: 3 },
    { id: '03', title: 'Bootstrap教程 4', likesCount: 4 }
    ]
  },
  {
    id: '1', // Number as ID
    name: '后端',
    icon: '',
    posts: [{ id: '00', title: '计算机思维导论', likesCount: 114 },
    { id: '01', title: 'C语言基础语法', likesCount: 51 },
    { id: '02', title: 'C语言高级特性', likesCount: 41 }
    ]
  },
  {
    id: '2', // Number as ID
    name: '测试',
    icon: '',
    posts: [{ id: 'hm', title: 'Reading 2: Basic Java', likesCount: 19 },
    { id: 'custom', title: '用户端', likesCount: 0 },
    { id: 'needs', title: '界面设计需求一览', likesCount: 0 },
    { id: 'nuxt3bili', title: 'Nuxt3 - 哔哩哔哩 - 项目实战', likesCount: 10 }
    ]
  },
])

const currentPostCategory = ref(postsCategoryList.value[0])

definePageMeta({
  layout: 'articles-menu'
})
</script>

<template>
  <!-- Forum posts -->
  <div class="posts-list">
    <NuxtLink :to="`/articles/${post.id}`" class="post-card" v-for="post in currentPostCategory.posts" :key="post.id">
      <h3 class="post-title">{{ post.title }}</h3>
      <div class="post-meta">
        <IconsLike />
        <span>{{ post.likesCount }}</span>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.posts {
  background-color: while;
  margin-top: 55px;
  width: 100%;
}

.banner-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.banner-links a {
  color: #2563eb;
  text-decoration: none;
}

.post-content {
  display: flex;
  justify-content: center;
  width: 100%;
}

.container {
  display: flex;
  justify-content: space-between;
  margin: 2rem 4rem;
  padding: 0;
  width: 100%;
  max-width: 1200px;
}

.sidebar {
  width: 15rem;
  margin-right: 2rem;
}

.posts-category {
  margin-top: 0.5rem;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgb(231, 236, 243);
}

.posts-category-menu {
  border: 0;
}

.posts-category-item {
  --el-menu-active-color: #2563eb;
  --el-menu-base-level-padding: 0;
  transition: all 0.3s ease-out;
  margin: 0;
}

.posts-category-item:hover {
  color: #2563eb;
  background-color: rgb(248, 250, 252);
  --el-menu-base-level-padding: 10px;
  border-radius: 6px;
}

.main-content {
  width: 100%;
}

.content-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.content-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #374151;
  margin: 0 0 0.5rem 0.5rem;
}

.publish-button {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  width: 100%;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
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
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.post-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  text-decoration: none;
  color: #374151;
}

.post-card:hover {
  background-color: #f9fafb;
}

.post-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.post-info {
  display: flex;
  flex-direction: column;
}

.post-title {
  font-weight: 500;
  margin: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.post-right {
  display: flex;
  align-items: center;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.tag.secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.tag.success {
  background-color: #10b981;
  color: white;
}

.tag.purple {
  background-color: #8b5cf6;
  color: white;
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