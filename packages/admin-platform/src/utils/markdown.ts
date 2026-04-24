import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import MarkdownItAsync from 'markdown-it-async'
import { codeToHtml } from 'shiki'

const md = MarkdownItAsync()

md.use(
  fromAsyncCodeToHtml(codeToHtml, {
    theme: 'material-theme-lighter',
  })
)

export async function renderMarkdown(content: string, keywords: string[] = []): Promise<string> {
  if (!content) return ''
  
  // 简单的自适应判断
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const codeColor = isDark ? '#1E293B' : '#F8FAFC'

  let renderedContent = await md.renderAsync(content)
  renderedContent = renderedContent.replace(/#FAFAFA/g, codeColor)

  if (keywords && keywords.length > 0) {
    const uniqueKeywords = [...new Set(keywords.filter(Boolean))]
    uniqueKeywords.sort((a, b) => b.length - a.length)
    const escapedKeywords = uniqueKeywords.map(k =>
      k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )

    if (escapedKeywords.length > 0) {
      const regex = new RegExp(
        `(<pre>[\\s\\S]*?<\\/pre>|<[^>]+>)|(${escapedKeywords.join('|')})`,
        'g'
      )
      renderedContent = renderedContent.replace(
        regex,
        (_match, ignoreGroup, keyword) => {
          if (ignoreGroup) return ignoreGroup
          return `<span class="keyword-underline markdown-keyword-trigger" data-keyword="${keyword}" style="border-bottom: 1px dashed #909399; cursor: pointer; color: inherit; position: relative; transition: all 0.2s;" onmouseenter="this.style.color='var(--primary-color)'; this.style.borderBottomColor='var(--primary-color)'" onmouseleave="this.style.color='inherit'; this.style.borderBottomColor='#909399'">${keyword}</span>`
        }
      )
    }
  }

  return renderedContent
}