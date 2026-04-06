<script setup>
import { ref, onMounted } from 'vue'
import { useMarkdownText } from '~/composables/useMarkdownText'

const props = defineProps({
  id: { type: String, required: true }, // 评论的ID CommitId
  author: {
    type: Object,
    required: true,
    default: () => ({
      attributes: {
        avatarUrl: '',
        userName: '',
      },
    }),
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
    userName: '',
  },
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
    isLiked: isLiked.value,
  })
}

onMounted(async () => {
  authors.value = props.author
  if (props.tags) console.log(props.tags)
  finalContent.value = await renderMarkdown(props.content || '')
})

const { renderMarkdown } = useMarkdownText()

const finalContent = ref('')

const scrollToComment = id => {
  const el = document.getElementById(`comment-${id}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.style.transition = 'background-color 0.5s'
    const originalBg = el.style.backgroundColor
    el.style.backgroundColor = 'var(--bg-hover, rgba(0, 0, 0, 0.05))'
    setTimeout(() => {
      el.style.backgroundColor = originalBg
      el.style.transition = ''
    }, 2000)
  }
}
</script>

<template>
  <div
    :id="`comment-${props.id}`"
    class="comment-container"
    :class="{ 'is-content': props.isContent }"
  >
    <div class="comment-left">
      <img
        :src="formatAvatarUrl(authors.attributes.avatarUrl)"
        class="avatar"
        alt=""
      />
    </div>
    <div class="comment-right">
      <div class="comment-info">
        <img
          :src="formatAvatarUrl(authors.attributes.avatarUrl)"
          class="avatar-mobile"
          alt=""
        />
        <div class="head-meta">
          <div class="author-name">
            {{ authors.attributes.userName }}
          </div>
          <div
            v-if="
              props.repliedId && props.repliedId !== 0 && props.repliedId !== -1
            "
            class="replied-to"
            @click="scrollToComment(props.repliedId)"
          >
            ▸ 回复评论
          </div>
          <div class="comment-date">
            <span>{{ props.time }}</span>
          </div>
        </div>
        <div class="tag-container">
          <div
            v-for="tag in props.tags"
            :key="tag.tagId"
            class="tag-title"
            :index="tag.tagId"
            :style="{ '--hue': tag.hueColor }"
          >
            <span class="tag-name">{{ tag.tagName }}</span>
          </div>
        </div>
      </div>
      <div class="comment-content" v-html="finalContent" />
      <div class="comment-meta">
        <button
          class="like-button"
          :class="{ liked: isLiked }"
          @click="toggleLike"
        >
          <IconsLike />
        </button>
        <span>{{ localLikesCount }} 人赞了</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url(~/assets/style/tag_color.scss);
@import url(~/assets/style/post.scss);

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
  object-fit: cover;
}

.comment-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
}

.head-meta {
  display: flex;
  margin-right: 1rem;
}

.author-name {
  font-weight: bold;
}

.replied-to {
  font-size: 0.875rem;
  color: var(--primary, #007bff);
  margin-left: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.replied-to:hover {
  text-decoration: underline;
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
  width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-right {
  width: 100%;
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

.avatar-mobile {
  display: none;
}

@media (max-width: 480px) {
  .comment-container {
    display: flex;
    margin: 0.5rem 0;
    padding: 0 0.5rem;
    width: 100%;
  }

  .comment-left,
  .avatar {
    display: none;
    margin-right: 0;
  }

  .avatar-mobile {
    display: block;
    min-width: 2.5rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.5rem;
  }

  .head-meta {
    display: block;
  }

  .comment-date {
    white-space: nowrap;
    margin-left: 0;
  }

  .tag-container {
    margin-left: 0.5rem;
    display: flex;
    overflow-x: auto; /* 启用横向滚动 */
    white-space: nowrap; /* 保证 tag 不换行 */
    gap: 0.5rem;
  }

  .comment-container {
    margin: 0.5rem 0;
    padding: 0 0.5rem;
  }

  .is-content {
    border: 1px solid var(--color-devider);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    max-width: 2.5rem;
    min-width: 2.5rem;
  }
}
</style>
