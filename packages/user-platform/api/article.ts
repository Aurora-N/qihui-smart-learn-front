import type { ArticleLink, ArticleWithGraph } from './type/article'
import { get } from '~/utils/apiClient'

export const useArticleApi = () => {
  const BASE_API = '/api/article'
  const CACHE_48H = 48 * 60 * 60 * 1000 // 48 hours in milliseconds

  return {
    // 获取文章内容
    getArticleDetail: (articleQuery: ArticleLink) =>
      get<ArticleWithGraph>(
        `${BASE_API}/details`,
        { ...articleQuery } as unknown as Record<string, unknown>,
        { cache: CACHE_48H }
      ),

    // 获取文章概要信息列表(构造文章目录)
    getArticleList: () =>
      get<ArticleLink>(`${BASE_API}/profile/list`, undefined, {
        cache: CACHE_48H,
      }),

    // 根据ID获取文章概要信息
    getArticleLinkById: (documentId: number) =>
      get<ArticleLink>(`${BASE_API}/profile/${documentId}`, undefined, {
        cache: CACHE_48H,
      }),
  }
}
