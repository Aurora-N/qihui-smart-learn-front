<template>
  <div class="search-container">
    <button
      class="mobile-search-button"
      aria-label="Search"
      @click="openSearch"
    >
      <IconsSearch class="search-icon" />
    </button>

    <Teleport to="body">
      <div class="search-modal" :class="{ active: isSearchOpen }">
        <div class="search-overlay" @click="closeSearch" />
        <div class="search-content">
          <div class="search-header">
            <h2>搜索</h2>
            <button class="close-button" @click="closeSearch">
              <IconsClose style="width: 1.5rem; height: 1.5rem" />
            </button>
          </div>

          <div class="search-input-container">
            <IconsSearch class="search-input-icon" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="输入关键词搜索..."
              @keyup.esc="closeSearch"
              @keydown="handleKeyDown"
            />
          </div>

          <div v-if="searchResults.length > 0" class="search-results">
            <div class="results-header">
              <h3>搜索结果 ({{ searchResults.length }})</h3>
            </div>
            <div class="results-list">
              <div
                v-for="(result, index) in searchResults"
                :key="index"
                class="result-item"
                @click="navigateToResult(result)"
              >
                <div class="result-title">
                  {{ result.title || '未命名文章' }}
                </div>
                <div v-if="result.content" class="result-excerpt">
                  {{ truncateContent(result.content, 150) }}
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="hasSearched && searchQuery.trim()" class="no-results">
            <p>没有找到与 "{{ searchQuery }}" 相关的内容</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const router = useRouter()
const emit = defineEmits(['search'])

const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref(null)
const searchResults = ref([])
const hasSearched = ref(false)

const openSearch = () => {
  isSearchOpen.value = true
  document.body.style.overflow = 'hidden'

  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const closeSearch = () => {
  isSearchOpen.value = false
  document.body.style.overflow = ''

  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value)
  }

  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
}

// 如果按下esc键，关闭
watch(isSearchOpen, newValue => {
  if (newValue) {
    window.addEventListener('keydown', handleEscapeKey)
  } else {
    window.removeEventListener('keydown', handleEscapeKey)
  }
})

const handleEscapeKey = e => {
  if (e.key === 'Escape') {
    closeSearch()
  }
}

// 可搜索的片段
const searchSections = ref([])

// 初始化可搜索的片段
const initSearchSections = async () => {
  const { data: sections } = await useAsyncData('search-sections', () => {
    return queryCollectionSearchSections('content', {
      ignoredTags: ['code'],
    })
  })
  searchSections.value = sections.value
}

// 处理搜索
const handleSearch = async target => {
  if (!target || !target.trim()) {
    searchResults.value = []
    hasSearched.value = true
    return
  }

  if (!searchSections.value || searchSections.value.length === 0) {
    await initSearchSections()
  }

  if (!searchSections.value) {
    searchResults.value = []
    hasSearched.value = true
    return
  }

  const query = target.trim().toLowerCase()
  const results = searchSections.value.filter(item => {
    return (
      item.level === 1 &&
      ((item.content && item.content.toLowerCase().includes(query)) ||
        (item.title && item.title.toLowerCase().includes(query)))
    )
  })

  searchResults.value = results
  hasSearched.value = true
}

// 截断内容
const truncateContent = (content, maxLength) => {
  if (!content) return ''
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

// 导航到搜索结果页面
const navigateToResult = async result => {
  if (!result) return
  const targetTitle = result.title
  const { data: foundItemByTitle, error: errorSpecific } = await useAsyncData(
    `content-by-title-${targetTitle}`,
    () => queryCollection('content').where('title', '=', targetTitle).first()
  )
  if (errorSpecific.value) {
    ElMessage({ type: 'error', message: errorSpecific.value, plain: true })
    return
  }
  router.push(`/articles/${foundItemByTitle.value.stem}`)
  closeSearch()
}

const debounceTimer = ref(null)

// 处理输入框键盘事件
const handleKeyDown = e => {
  // 清除前一个定时器
  clearTimeout(debounceTimer.value)
  // 设置新的定时器
  debounceTimer.value = setTimeout(async () => {
    await handleSearch(searchQuery.value)
  }, 500) // 500 毫秒后触发搜索
}

onMounted(async () => {
  await initSearchSections()
})
</script>

<style scoped>
.search-container {
  position: relative;
  transition: all 0.3s ease-in-out;
}

.mobile-search-button {
  padding: 0;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.3s ease;
}

.search-icon {
  width: 18px;
  height: 18px;
}

/* Search modal */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  /* Ensure it's above all other content */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transform: scale(0);
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.search-modal.active {
  transform: scale(1);
}

/* Overlay background */
.search-overlay {
  position: fixed;
  /* Changed from absolute to fixed */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.search-content {
  position: relative;
  width: 90%;
  max-width: 600px;
  background-color: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: 80px;
  transform: translateY(-20px);
  transition: transform 0.3s ease;
  overflow: hidden;
  z-index: 10000;
}

.search-modal.active .search-content {
  transform: translateY(0);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.search-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: var(--color-background-hover);
}

/* Search input */
.search-input-container {
  position: relative;
  padding: 20px;
}

.search-input-icon {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-2);
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 50px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  background: var(--color-background);
}

.search-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  color: var(--color-text);
}

/* Search results */
.search-results {
  padding: 0 20px 20px;
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.results-header {
  margin-bottom: 10px;
}

.results-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-item {
  padding: 15px;
  border-radius: 8px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-item:hover {
  border-color: #4a90e2;
}

.result-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 5px;
  color: var(--color-text);
}

.result-path {
  font-size: 12px;
  color: var(--color-text-2);
  margin-bottom: 8px;
}

.result-excerpt {
  font-size: 14px;
  color: var(--color-text-2);
  line-height: 1.5;
}

/* No results message */
.no-results {
  padding: 20px;
  text-align: center;
  color: var(--color-text-2);
}

@media (max-width: 1024px) {
  .desktop-search {
    display: none;
  }

  .search-container:hover {
    background-color: var(--color-background-hover);
    border-radius: 0.375rem;
  }

  .mobile-search-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-content {
    width: 95%;
    margin-top: 60px;
  }
}
</style>
