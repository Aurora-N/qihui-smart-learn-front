export const useHomeApi = () => {
  const nuxtApp = useNuxtApp();

  return {
        // 获取热门文章列表
        getPopularArticles: () => nuxtApp.$axios.get('/popular/articles'),
        
        // 获取热门帖子列表
        getPopularPosts: () => nuxtApp.$axios.get('/popular/posts'),
  }
}