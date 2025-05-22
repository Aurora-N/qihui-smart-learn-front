<script setup>
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import MarkdownItAsync from 'markdown-it-async'
import { codeToHtml } from 'shiki'
import '~/assets/css/post.scss'

const props = defineProps({
  id: { type: String, required: true }, // 评论的ID CommitId
  author: {
    type: Object, required: true, default: () => ({
      attributes: {
        avatarUrl: '',
        userName: ''
      }
    })
  }, // 评论的作者
  content: { type: String, required: true }, // 评论内容
  tags: { type: Array }, // 标签
  time: { type: String, required: true }, // 评论创建的时间
  likesCount: { type: Number, required: true }, // 点赞数量
  repliedId: { type: String, required: true }, // 被回复用户的ID
  isContent: { type: Boolean, default: false }, // 是否为帖子主体内容
  isLiked: { type: Boolean, default: false }, // 用户是否点赞此帖子
})

const emit = defineEmits(['like'])

const authors = ref({
  attributes: {
    avatarUrl: '',
    userName: ''
  }
})

const isLiked = ref(props.isLiked)
const localLikesCount = ref(props.likesCount)

const toggleLike = () => {
  isLiked.value = !isLiked.value
  localLikesCount.value = isLiked.value 
    ? localLikesCount.value + 1 
    : localLikesCount.value - 1
  
  emit('like', {
    commentId: props.id,
    isLiked: isLiked.value
  })
}

onMounted(() => {
  authors.value = props.author
  if (props.tags) console.log(props.tags);
})

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

const renderedContent = await md.renderAsync(props.content)

const codeColor = computed(() => useColorMode().preference === 'light' ? '#F8FAFC' : '#1E293B')

const finalContent = renderedContent.replace(/#FAFAFA/g, codeColor); // 替换代码区背景色
</script>

<template>
  <div class="comment-container" :class="{ 'is-content': props.isContent }">
    <div class="comment-left">
      <img :src="authors.attributes.avatarUrl" class="avatar" alt="">
    </div>
    <div class="comment-right">
      <div class="comment-info">
        <div class="author-name">{{ authors.attributes.userName }}</div>
        <div class="comment-date">
          <span>{{ props.time }}</span>
        </div>
        <div class="tag-container">
          <div class="tag-title" v-for="tag in props.tags" :index="tag.tagId" :style="{'--hue': tag.hueColor}">
            <span class="tag-name">{{ tag.title }}</span>
          </div>
        </div>
      </div>
      <div class="comment-content" v-html="finalContent">
      </div>
      <div class="comment-meta">
        <button class="like-button" @click="toggleLike" :class="{ 'liked': isLiked }">
          <IconsLike />
        </button>
        <span>{{ localLikesCount }} 人赞了</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url(~/assets/css/tag_color.scss);

.comment-container {
  display: flex;
  margin: 1rem 0;
}

.is-content {
  border: 1px solid var(--color-devider);
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
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
  align-items: center;
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

.like-button {
  background: none;
  color: var(--text-color);
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  font-size: 1rem;
  transform: scale(1.2);
}

.like-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.like-button.liked {
  color: var(--main-color);
}

/* 标签样式 */
.tag-container {
  margin-left: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.tag-title {
  display: flex;
  align-items: center;
  background-color: var(--btn-regular-bg);
  padding: 0.1rem 0.3rem;
  border-radius: 5px;
}

.tag-name {
  color: var(--primary);
  text-align: center;
  margin: 0;
}
</style>