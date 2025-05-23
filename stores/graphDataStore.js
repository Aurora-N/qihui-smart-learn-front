import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGraphApi } from '~/api/graph'

export const useGraphDataStore = defineStore(
  'graph-data',
  () => {
    const graphApi = useGraphApi()

    const graphResourcesCache = ref({})

    const getResources = async nodeId => {
      if (graphResourcesCache.value[nodeId]) {
        return graphResourcesCache.value[nodeId]
      } else {
        // 本地未缓存数据，从后端获取
        const res = await graphApi.getNodeResources('Course', nodeId)
        if (res.status === 'success')
          graphResourcesCache.value[nodeId] = res.resources
        ElMessage({ type: 'success', message: '资源获取成功', plain: true })
        return res.resources
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
