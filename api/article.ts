import type { ArticleLink, ArticleWithGraph } from './type/article'

export const useArticleApi = () => {
  const nuxtApp = useNuxtApp()
  const BASE_API = '/api/article'

  return {
    // 获取文章内容
    getArticleDetail: (articleQuery: ArticleLink) =>
      nuxtApp.$axios.get(`${BASE_API}/detail`, {
        params: {
          ...articleQuery,
        },
      }) as Promise<{
        data: ArticleWithGraph
      }>,

    // 获取文章概要信息列表(构造文章目录)
    getArticleList: () =>
      nuxtApp.$axios.get(`${BASE_API}/profile/list`) as Promise<{
        data: ArticleLink[]
      }>,
  }
}
