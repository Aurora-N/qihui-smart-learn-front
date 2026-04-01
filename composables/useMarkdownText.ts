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

  const renderMarkdown = async (content: string, keywords: string[] = []) => {
    if (!content) return ''
    let renderedContent = await md.renderAsync(content)
    renderedContent = renderedContent.replace(/#FAFAFA/g, codeColor.value)

    if (keywords && keywords.length > 0) {
      // 过滤空字符串并去除重复项，然后转义正则特殊字符
      const uniqueKeywords = [...new Set(keywords.filter(Boolean))]
      // 按照长度降序排序，优先匹配长的关键词，防止短词破坏长词
      uniqueKeywords.sort((a, b) => b.length - a.length)
      const escapedKeywords = uniqueKeywords.map(k =>
        k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      )

      if (escapedKeywords.length > 0) {
        // 匹配这些关键字，但排除 <pre> 内部的文本，以及 HTML 标签 (<...>)
        const regex = new RegExp(
          `(<pre>[\\s\\S]*?<\\/pre>|<[^>]+>)|(${escapedKeywords.join('|')})`,
          'g'
        )
        renderedContent = renderedContent.replace(
          regex,
          (match, ignoreGroup, keyword) => {
            if (ignoreGroup) return ignoreGroup // 如果是无需替换的内容，则原样返回
            return `<span class="keyword-underline markdown-keyword-trigger" data-keyword="${keyword}" style="border-bottom: 1px dashed #909399; cursor: pointer; color: inherit; position: relative; transition: all 0.2s;" onmouseenter="this.style.color='var(--primary-color)'; this.style.borderBottomColor='var(--primary-color)'" onmouseleave="this.style.color='inherit'; this.style.borderBottomColor='#909399'">${keyword}</span>`
          }
        )
      }
    }

    return renderedContent
  }

  return {
    renderMarkdown,
  }
}
