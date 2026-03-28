import { ref, computed, type Ref } from 'vue'

interface ArticleNode {
  title?: string
  category?: string
  link?: string
  links?: ArticleNode[]
  [key: string]: unknown
}

export const useArticleSearch = (activeArticles: Ref<ArticleNode[]>) => {
  const searchQuery = ref('')

  const filteredArticles = computed(() => {
    const articles = activeArticles.value
    if (!searchQuery.value.trim()) return articles

    const query = searchQuery.value.trim().toLowerCase()

    const filterTree = (nodes: ArticleNode[]): ArticleNode[] => {
      return nodes.reduce((acc: ArticleNode[], node: ArticleNode) => {
        // 如果是类目节点
        if (node.links && Array.isArray(node.links)) {
          const isCategoryMatch =
            node.category && node.category.toLowerCase().includes(query)

          if (isCategoryMatch) {
            // 如果类名匹配，直接保留整个类目及其全部子内容
            acc.push(node)
          } else {
            const filteredChildLinks = filterTree(node.links)

            // 如果子节点有匹配项，则保留该类目及其匹配的子节点
            if (filteredChildLinks.length > 0) {
              acc.push({ ...node, links: filteredChildLinks })
            }
          }
        }
        // 如果是文章节点
        else {
          if (node.title && node.title.toLowerCase().includes(query)) {
            acc.push(node)
          }
        }
        return acc
      }, [])
    }

    return filterTree(articles)
  })

  return {
    searchQuery,
    filteredArticles,
  }
}
