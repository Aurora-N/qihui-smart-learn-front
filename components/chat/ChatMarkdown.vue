<template>
  <div class="chat-markdown" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useMarkdownText } from '~/composables/useMarkdownText'

const props = defineProps<{
  content: string
  isGenerating?: boolean
}>()

const renderedHtml = ref('')
const { renderMarkdown } = useMarkdownText()

// 避免每次字符追加时都重渲染造成性能问题，使用简单的节流或防抖，
// 甚至可以直接在 watch 时 render，因为用的是 markdown-it。
let isRendering = false
let pendingContent = ''

const updateMarkdown = async (val: string) => {
  if (isRendering) {
    pendingContent = val
    return
  }
  isRendering = true
  try {
    renderedHtml.value = await renderMarkdown(val)
  } catch (error) {
    console.error('Markdown render error', error)
  }
  isRendering = false

  if (pendingContent && pendingContent !== val) {
    const nextContent = pendingContent
    pendingContent = ''
    updateMarkdown(nextContent)
  }
}

watch(
  () => props.content,
  newVal => {
    updateMarkdown(newVal)
  },
  { immediate: true }
)
</script>

<style lang="scss">
@use '~/assets/style/abstracts/variables' as *;

.chat-markdown {
  p {
    margin-bottom: $spacing-sm;
    &:last-child {
      margin-bottom: 0;
    }
  }

  pre {
    background-color: var(--color-background-soft);
    padding: $spacing-md;
    border-radius: 10px;
    overflow-x: auto;
    margin: $spacing-sm 0;
  }

  code {
    font-family: var(--font-family-mono);
    background-color: var(--color-background-soft);
    padding: 0.125rem 0.25rem;
    border-radius: $border-radius-sm;
    font-size: 0.875em;
  }

  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: 1em;
  }

  ul,
  ol {
    margin: $spacing-sm 0 $spacing-sm $spacing-md;
    padding-left: $spacing-md;
  }

  blockquote {
    border-left: 4px solid var(--color-border);
    padding-left: $spacing-md;
    margin: $spacing-sm 0;
    color: var(--color-text-mute);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: $spacing-sm 0;
    th,
    td {
      border: 1px solid var(--color-border);
      padding: $spacing-xs $spacing-sm;
    }
    th {
      background-color: var(--color-background-soft);
    }
  }

  a {
    color: var(--link-color);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
