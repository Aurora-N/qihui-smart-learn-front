<script setup lang="ts">
import { useForumApi } from '~/api/forum'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const userInfo = ref<any>({})
const post = ref<any>({
  postId: route.query.id,
  title: '',
  author: {
    attributes: {
      avatarUrl: '',
      userName: '',
      type: 'user',
    },
  },
})

const comments = ref<any>([])

const initialized = ref(false)

const initPostContent = async () => {
  const isLogin = Object.keys(userStore.userInfo).length !== 0
  const res = await useForumApi().getPostContent(
    Number(route.query.id),
    isLogin ? userStore.userInfo.data?.userId : undefined
  )
  post.value = (res.data as any).posts || res.data
  comments.value = post.value?.comments || []
  initialized.value = true
}

const editorRef = ref<any>(null)

const scrollToReplyEditor = () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    ElMessage({ type: 'warning', message: '请先登录', plain: true })
    router.push('/login')
    return
  }
  editorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  const editorElement = editorRef.value?.querySelector(
    '#reply-editor .ProseMirror'
  )
  if (editorElement) {
    editorElement.focus()
  }
}

// 父组件接收清空前的内容
const handleBeforeSubmit = async (content: string) => {
  if (!userInfo.value) {
    ElMessage({ type: 'warning', message: '用户未登录,请先登录!', plain: true })
    router.push('/login')
    return
  }
  // 接入评论API
  const res = await useForumApi().replyPost({
    userId: userStore.userInfo.data!.userId,
    postId: Number(route.query.id),
    repliedId: null, // 或对应需要回复的ID
    comment: content,
  } as any)
  await initPostContent()
}

// 标签相关
const tags = ref<any[]>([])

const getTagsAttributes = async () => {
  if (!post.value.tags) return
  const allTags = await (await useForumApi().getAllTags()).data

  for (const tag of post.value.tags) {
    const tagWithAttr = allTags.filter((item: any) => item.tagId === tag.tagId)
    if (tagWithAttr.length > 0) {
      tags.value.push({
        tagId: tagWithAttr[0].tagId,
        title: tagWithAttr[0].tagName,
        hueColor: tagWithAttr[0].hueColor,
      })
    }
  }
}

onMounted(async () => {
  await initPostContent()
  userInfo.value = userStore.userInfo.data
  useSeoMeta({
    title: `${post.value?.title || '帖子'} —— 启慧论坛`,
  })
  await getTagsAttributes()
})

const handleLike = async (commentId: number | null = null) => {
  if (Object.keys(userStore.userInfo).length === 0) {
    ElMessage({ type: 'warning', message: '请先登录', plain: true })
    router.push('/login')
    return
  }

  await useForumApi().doLike(
    userStore.userInfo.data!.userId,
    post.value.postId,
    commentId || undefined
  )
}

const handleFavorite = async () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    ElMessage({ type: 'warning', message: '请先登录', plain: true })
    router.push('/login')
    return
  }

  try {
    const res = await useForumApi().doFavor(
      post.value.postId,
      userStore.userInfo.data!.userId
    )
    post.value.favorite = res.data.favorite

    ElMessage({
      type: 'success',
      message: post.value.favorite ? '收藏成功' : '已取消收藏',
      plain: true,
    })
  } catch (error) {
    ElMessage({ type: 'error', message: '操作失败，请重试', plain: true })
    console.error(error)
  }
}
</script>

<template>
  <div v-if="initialized" class="container">
    <ForumBanner
      :title="post.title"
      :sub-title="post.author.attributes.userName"
    />
    <!-- 内容区域 -->
    <div class="post-content">
      <!-- 帖子内容 -->
      <article class="main-content">
        <ForumComment
          :id="post.postId"
          :author="post.author"
          :content="post.content"
          :time="post.createdAt"
          :tags="tags"
          :likes-count="post.likesCount"
          :is-content="true"
          :is-liked="post.liked"
          @like="handleLike()"
        />
        <!-- 评论区内容 -->
        <div v-for="item of comments" :key="item.commentId">
          <ForumComment
            :id="item.commentId"
            :author="item.author"
            :content="item.content"
            :time="item.createdAt"
            :likes-count="item.likesCount"
            :replied-id="item.repliedId"
            :is-liked="item.liked"
            @like="handleLike(item.commentId)"
          />
          <hr />
        </div>
        <div ref="editorRef" class="editor">
          <MiniMarkdownEditor
            id="reply-editor"
            @before-submit="handleBeforeSubmit"
          />
        </div>
      </article>

      <!-- 功能侧边栏 -->
      <div class="side">
        <aside class="sidebar">
          <!-- position: sticky的外面还需包裹一层div才能生效 -->
          <div>
            <el-button
              type="primary"
              size="large"
              class="reply-btn"
              @click="scrollToReplyEditor"
            >
              回复
            </el-button>
          </div>
          <div>
            <el-button
              :type="post.favorite ? 'success' : 'primary'"
              size="large"
              class="other-btn"
              @click="handleFavorite"
            >
              {{ post.favorite ? '已收藏' : '收藏' }}
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
  background-color: #0060df;
  border-color: #0060df;
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

@media (max-width: 768px) {
  .post-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 1rem;
  }

  .side {
    margin: 0;
    width: 100%;
  }

  .sidebar {
    position: static;
    top: 0;
    order: 0;
    width: 100%;
    margin: 0;
  }

  .main-content {
    order: 1;
  }
}
</style>
