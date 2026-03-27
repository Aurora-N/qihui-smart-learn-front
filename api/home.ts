import type { ArticleLink } from './type/article'
import type { Post } from './type/forum'

export const useHomeApi = () => {
  const nuxtApp = useNuxtApp()

  return {
    // 获取推荐学习文章列表
    getRecommendedArticles: () =>
      nuxtApp.$axios.get('/api/article/recommend/list') as Promise<{
        articles: ArticleLink[]
      }>,

    // 获取热门帖子列表
    getPopularPosts: () =>
      nuxtApp.$axios.get('/api/auth/popular/posts') as Promise<{
        data: { posts: Post[] }
      }>,
  }
}
