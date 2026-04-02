<script setup lang="ts">
import type { BasePost } from '~/api/type/forum'

defineProps<{
  topic: BasePost
}>()
</script>

<template>
  <NuxtLink :to="`/forum/${topic.postId}`" class="topic-card">
    <div class="topic-left">
      <img
        :src="formatAvatarUrl(topic.author.attributes.avatarUrl)"
        class="avatar"
        :alt="topic.author.attributes.userName + '的头像'"
      />
      <div class="topic-info">
        <h3 class="topic-title">{{ topic.title }}</h3>
        <div class="topic-meta">
          <template v-if="topic.lastCommentedUser">
            <User style="width: 1em; height: 1em" />
            <span> {{ topic.lastCommentedUser.userName }} </span>
          </template>
          <div v-if="topic.lastCommentedAt" class="last-commented-time">
            <TopRight style="width: 1em; height: 1em" />
            <span> 最新回复于 {{ topic.lastCommentedAt }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="topic-right">
      <div class="tags">
        <span
          v-for="tag in topic.tags"
          :key="tag.tagId"
          class="tag"
          :class="'tag' + tag.tagId"
        >
          {{ tag.tagName }}
        </span>
      </div>
      <div class="reply-count">
        <ChatSquare style="width: 1em; height: 1em; margin-right: 8px" />
        <span>{{ topic.commentsCount }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
@import url(~/assets/style/forum_interface.scss);
</style>
