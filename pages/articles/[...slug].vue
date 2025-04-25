<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug || '';

const isLoading = ref(true);

const { data: page, error } = await useAsyncData(`content-${slug}`, async () => {
  const articles = await queryCollection('content').all();
  const result = articles.find(article => article.stem === slug);
  return result;
});

const showMenu = computed(()=> {
  const links = page.value?.body.toc?.links;
  return links && links.length > 0;
});

onMounted(() => {
  if (page.value) isLoading.value = false;
});

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
});

definePageMeta({
  layout: 'default'
});

const selectedItem = computed(() => {
  const firstId = page.value?.body.toc?.links?.[0]?.id;
  const fullPath = route.fullPath;
  const index = fullPath.indexOf('#') + 1;
  return decodeURI(fullPath.substring(index)) || firstId;
});

const selectTocItem = (id: string) => {
  router.push(route.path + `#${id}`);
};

const showArrow = reactive<{ [key: string]: boolean }>({});

const recommendPostsList = ref([
  { id: '1', title: '测试', link: '', type: '理论' },
  { id: '2', title: '动手做一做', link: '', type: '实践' }
]);
</script>


<template>
  <!-- <ContentSkeleton v-if="isLoading" /> -->

  <div class="main-container">
    <div class="side" v-if="showMenu">
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
        <Breadcrumb :current-title="page?.title" :parents="page?.id.split('/').slice(1, -1)" />
        <ContentRenderer :value="page" />
      </article>
      <div v-else>page not found</div>
      <Recommend title="推荐阅读" :lists="recommendPostsList" style="margin-top: 1rem;" />
    </div>
  </div>

  <Footer />
</template>

<style scope>
@import url("~/assets/css/post.css");

.main-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  padding-top: 60px;
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
  background-color: var(--color-background-nav-hover);
  --el-menu-base-level-padding: 10px;
  border-radius: 6px;
}

/* .content article a::before {
  content: "";
  display: block;
  height: 80px;
  margin-top: -80px;
  pointer-events: none;
} */

.arrow {
  margin: 0 -5px 2px -5px;
}
</style>