<script setup>
import { useForumApi } from '~/api/forum';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const userInfo = ref({})
const post = ref({
  postId: route.params.id,
  title: "",
  author: {
      attributes: {
          avatarUrl: "",
          userName: "",
          type: "user"
      }
  },
})
const comments = ref([])

const initialized = ref(false);

const initPostContent = async () => {
  const res = await useForumApi().getPostContent(route.params.id);
  console.log(res);
  post.value = res.data.posts;
  comments.value = res.data.posts.comments;
  initialized.value = true;
}

const editorRef = ref(null);

const scrollToReplyEditor = () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    ElMessage({type: 'warning', message: '请先登录', plain: true});
    router.push('/login');
    return;
  }
  editorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  const editorElement = editorRef.value?.querySelector('#reply-editor .ProseMirror');
  if (editorElement) {
    editorElement.focus();
  }
}

// 父组件接收清空前的内容
const handleBeforeSubmit = (content) => {
  if (!userInfo.value) {
    ElMessage({type:'warning', message:'用户未登录,请先登录!', plain:true});
    router.push('/login');
    return;
  }
  comments.value.push(
    {
      "commentId": "",
      "author": {
        "id": userInfo.value.id,
        "attributes": {
          "avatarUrl": userInfo.value.avatarUrl,
          "userName": userInfo.value.userName,
          "email": userInfo.value.email
        }
      },
      "content": content,
      "createdAt": "刚刚",
      "likesCount": 0,
      "repliedID": null
    });
  // TODO.接上评论API
};

onMounted(async ()=>{
  await initPostContent();
  userInfo.value = userStore.userInfo.data;
  useSeoMeta({
    title: `${post.value.title} —— 启慧论坛`
  })
})
</script>

<template>
  <div class="container"  v-if="initialized">
    <ForumBanner :title="post.title" :sub-title="post.author.attributes.userName"></ForumBanner>
    <!-- 内容区域 -->
    <div class="post-content">
      <!-- 帖子内容 -->
      <article class="main-content">
        <ForumComment :id="post.postId" :author="post.author" :content="post.content" :time="post.createdAt"
          :likes-count="post.likesCount" />
        <hr>
        <!-- 评论区内容 -->
        <div v-for="item of comments" :key="item.commentId">
          <ForumComment :id="item.commentId" :author="item.author" :content="item.content" :time="item.createdAt"
            :likes-count="item.likesCount" :replied-id="item.repliedID" />
          <hr>
        </div>
        <div ref="editorRef" class="editor">
          <MiniMarkdownEditor id="reply-editor" @beforeSubmit="handleBeforeSubmit" />
        </div>
      </article>

      <!-- 功能侧边栏 -->
      <div>
        <aside class="sidebar">
          <!-- position: sticky的外面还需包裹一层div才能生效 -->
          <div>
            <el-button type="primary" size="large" class="reply-btn" @click="scrollToReplyEditor">
              回复
            </el-button>
          </div>
          <div>
            <el-button type="primary" size="large" class="other-btn">
              收藏
            </el-button>
          </div>
        </aside>
      </div>
    </div>
  </div>
  <!-- 骨架屏 -->
  <ForumSkeleton v-else />
  <Footer />
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}

.container {
  min-height: 100vh;
  background-color: while;
  padding-top: 55px;
}

.post-content {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 1rem 0 2rem 0;
}

.main-content {
  width: 100%;
  max-width: 64rem;
}

.main-content .editor {
  padding-bottom: 1rem;
}

.sidebar {
  width: 10rem;
  margin-left: 2rem;
  position: sticky;
  top: 80px;
}

.sidebar .reply-btn {
  width: 100%;
  margin-top: 1rem;
  height: 48px;
  font-size: 1rem;
  background-color: #0060DF;
  border-color: #0060DF;
}

.sidebar .reply-btn:hover {
  background-color: var(--main-color-hover-lighter);
  border-color: var(--main-color-hover-lighter);
  box-shadow: 0 0 5px var(--main-color-hover-shadow);
}

.sidebar .other-btn {
  width: 100%;
  margin-top: 1rem;
  height: 48px;
  font-size: 1rem;
  color: var(--color-text);
  background-color: var(--color-background);
  border-color: var(--color-border);
}

.sidebar .other-btn:hover {
  background-color: var(--color-background-hover);
}
</style>