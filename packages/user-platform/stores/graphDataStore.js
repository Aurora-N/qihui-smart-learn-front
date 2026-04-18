import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getNodeLearningResources } from '~/api/learn'

export const useGraphDataStore = defineStore(
  'graph-data',
  () => {
    const graphResourcesCache = ref({})

    const getResources = async nodeName => {
      if (graphResourcesCache.value[nodeName]) {
        return graphResourcesCache.value[nodeName]
      } else {
        // 本地未缓存数据，从后端获取
        const res = await getNodeLearningResources(nodeName)
        if (res) {
          graphResourcesCache.value[nodeName] = res
          ElMessage({ type: 'success', message: '资源获取成功', plain: true })
          return res
        }
      }
    }

    return { graphResourcesCache, getResources }
  },
  {
    persist: true,
    key: 'graph-data',
    storage: piniaPluginPersistedstate.localStorage(),
  }
)
