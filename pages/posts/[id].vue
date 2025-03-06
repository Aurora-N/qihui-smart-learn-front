<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(`/${route.params.id}`).first()
})

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})

definePageMeta({
  layout: 'default'
})

const selectedItem = computed(() => {
  const firstId = page.value?.body.toc?.links[0].id
  const fullPath = route.fullPath;
  const index = fullPath.indexOf('#') + 1;
  return decodeURI(fullPath.substring(index, fullPath.length)) || firstId
})

const selectTocItem = (id: string) => {
  // if (id === page.value?.body.toc?.links[0].id) {
  //   // do nothing
  // } else {
  router.push(route.path + `#${id}`);
}

const parentCategory = ref('测试');

// 控制箭头的显示，使用对象存储每个 item 的状态
const showArrow = reactive({});

// 推荐阅读的文章
const recommendPostsList = ref([{ id: '1', title: 'mit-6.031', link: '/posts/hm', type: '理论' }, { id: '2', title: '测试', link: '', type: '理论' }, { id: '3', title: '动手做一做', link: '', type: '实践' }]);
</script>

<template>
  <div class="main-container">
    <div class="side">
      <Sidebar title="目录" height="20rem">
        <el-menu :default-active="selectedItem" class="posts-category-menu" @select="selectTocItem">
          <el-menu-item v-for="item of page?.body.toc?.links" :key="item.id" :index="item.id"
            class="posts-category-item" @mouseenter="showArrow[item.id] = true"
            @mouseleave="showArrow[item.id] = false">
            <div v-if="showArrow[item.id]" class="arrow"><el-icon>
                <ArrowRight />
              </el-icon></div>
            <span>{{ item.text }}</span>
          </el-menu-item>
        </el-menu>
      </Sidebar>
    </div>

    <div class="content">
      <article v-if="page">
        <Breadcrumb :current-title="page?.title" :parent="{ title: parentCategory, link: '/posts' }" />
        <ContentRenderer :value="page" />
      </article>
      <div v-else>page not found</div>
      <Recommend title="推荐阅读" :lists="recommendPostsList" style="margin-top: 1rem;" />
    </div>
  </div>
</template>

<style scope>
@import url("~/assets/css/post.css");

.main-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  margin-top: 55px;
}

.content {
  max-width: 60rem;
  width: 100%;
}

.side {
  margin-top: 0.5rem;
  width: 15rem;
}

.posts-category-menu {
  border: 0;
  overflow: hidden;
}

.side .posts-category-item {
  --el-menu-active-color: #2563eb;
  --el-menu-base-level-padding: 0;
  transition: all 0.3s ease-out;
  margin: 0;
  height: 2rem;
}

.posts-category-item:hover {
  color: #2563eb;
  background-color: rgb(248, 250, 252);
  --el-menu-base-level-padding: 10px;
  border-radius: 6px;
}

.content article a::before {
  content: "";
  display: block;
  height: 80px;
  /* 占位高度 */
  margin-top: -80px;
  /* 抵消滚动位置 */
}

.arrow {
  margin: 0 -5px 2px -5px;
}
</style>