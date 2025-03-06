<script setup>
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import MarkdownItAsync from 'markdown-it-async'
import { codeToHtml } from 'shiki' // Or your custom shorthand bundle
import '~/assets/css/post.css'

const props = defineProps({
  id: { type: String, required: true }, // 评论的ID CommitId
  author: {
    type: Object, required: true, default: () => ({
      attributes: {
        avatarUrl: '/soyo.png',
        userName: ''
      }
    })
  }, // 评论的作者
  content: { type: String, required: true }, // 评论内容
  time: { type: String, required: true }, // 评论创建的时间
  likesCount: { type: Number, required: true }, // 点赞数量
  repliedId: { type: String, required: true }, // 被回复用户的ID
})

const authors = ref({
  attributes: {
    avatarUrl: '/soyo.png',
    userName: ''
  }
})

onMounted(() => {
  authors.value = props.author
})

// Initialize MarkdownIt instance with markdown-it-async
const md = MarkdownItAsync()

md.use(
  fromAsyncCodeToHtml(
    // Pass the codeToHtml function
    codeToHtml,
    {
      theme: 'material-theme-lighter'
    }
  )
)

// Use `md.renderAsync` instead of `md.render`
const renderedContent = await md.renderAsync(props.content)
const finalContent = renderedContent.replace(/#FAFAFA/g, '#F8FAFC'); // 替换代码区背景色
</script>

<template>
  <div class="comment-container">
    <div class="comment-left">
      <img :src="authors.attributes.avatarUrl" class="avatar" alt="">
    </div>
    <div class="comment-right">
      <div class="comment-info">
        <div class="author-name">{{ authors.attributes.userName }}</div>
        <div class="comment-date">
          <span>{{ props.time }}</span>
        </div>
      </div>
      <div class="comment-content" v-html="finalContent">
      </div>
      <div class="comment-meta">
        <IconsLike />
        <span>{{ props.likesCount }} 人赞了</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-container {
  display: flex;
  padding: 0;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.comment-left {
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-right: 2rem;
}

.avatar {
  min-width: 4rem;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.comment-info {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.author-name {
  font-weight: bold;
}

.comment-date {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 1rem;
}

.comment-content {
  margin-bottom: 1rem;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-right {
  gap: 0.5rem;
}
</style>