import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticlesLists } from '~/utils/getArticles'

export const articleStore = defineStore('article',
  () => {
    // 定义管理文章目录数据的state
    const articleList = ref([]);

    const getArticleLists = async (category) => {
      const articlesList = await getArticlesLists(category);
      
    }
  }
)