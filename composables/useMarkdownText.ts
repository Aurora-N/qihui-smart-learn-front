import { computed } from 'vue'
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import MarkdownItAsync from 'markdown-it-async'
import { codeToHtml } from 'shiki'

export function useMarkdownText() {
  const codeColor = computed(() =>
    useColorMode().preference === 'light' ? '#F8FAFC' : '#1E293B'
  )

  const md = MarkdownItAsync()

  md.use(
    fromAsyncCodeToHtml(codeToHtml, {
      theme: 'material-theme-lighter',
    })
  )

  const renderMarkdown = async (content: string) => {
    if (!content) return ''
    const renderedContent = await md.renderAsync(content)
    return renderedContent.replace(/#FAFAFA/g, codeColor.value)
  }

  return {
    renderMarkdown,
  }
}
