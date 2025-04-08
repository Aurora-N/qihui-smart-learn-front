<template>
  <div class="search-container">
    <!-- Desktop search trigger button -->
    <!-- <button class="search-trigger desktop-search" @click="openSearch">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <span>搜索</span>
    </button> -->

    <!-- Mobile search icon button -->
    <button class="mobile-search-button" @click="openSearch" aria-label="Search">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </button>

    <!-- Teleport the modal to the body -->
    <Teleport to="body">
      <!-- Search modal -->
      <div class="search-modal" :class="{ 'active': isSearchOpen }">
        <!-- Overlay background (clickable to close) -->
        <div class="search-overlay" @click="closeSearch"></div>

        <!-- Search content -->
        <div class="search-content">
          <div class="search-header">
            <h2>搜索</h2>
            <button class="close-button" @click="closeSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="search-input-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="search-input-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" class="search-input" placeholder="输入关键词搜索..." v-model="searchQuery" ref="searchInputRef"
              @keyup.esc="closeSearch" @keydown="handleKeyDown" />
          </div>

          <!-- Search results -->
          <div class="search-results" v-if="searchResults.length > 0">
            <div class="results-header">
              <h3>搜索结果 ({{ searchResults.length }})</h3>
            </div>
            <div class="results-list">
              <div v-for="(result, index) in searchResults" :key="index" class="result-item"
                @click="navigateToResult(result)">
                <div class="result-title">{{ result.title || '未命名文章' }}</div>
                <div class="result-path">{{ formatPath(getPathField(result)) }}</div>
                <div class="result-excerpt" v-if="result.content">
                  {{ truncateContent(result.content, 150) }}
                </div>
              </div>
            </div>
          </div>

          <!-- No results message -->
          <div class="no-results" v-else-if="hasSearched && searchQuery.trim()">
            <p>没有找到与 "{{ searchQuery }}" 相关的内容</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, defineEmits, onMounted, onUpdated } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits(['search']);

const isSearchOpen = ref(false);
const searchQuery = ref('');
const searchInputRef = ref(null);
const searchResults = ref([]);
const hasSearched = ref(false);

// Open search modal
const openSearch = () => {
  isSearchOpen.value = true;
  document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open

  // Focus the input after the modal is open
  nextTick(() => {
    searchInputRef.value?.focus();
  });
};

// Close search modal
const closeSearch = () => {
  isSearchOpen.value = false;
  document.body.style.overflow = ''; // Restore scrolling

  // Emit search event with the current query before clearing it
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value);
  }

  searchQuery.value = ''; // Clear search query when closing
  searchResults.value = []; // Clear search results
  hasSearched.value = false; // Reset search state
};

// Listen for escape key to close modal
watch(isSearchOpen, (newValue) => {
  if (newValue) {
    window.addEventListener('keydown', handleEscapeKey);
  } else {
    window.removeEventListener('keydown', handleEscapeKey);
  }
});

// Handle escape key press
const handleEscapeKey = (e) => {
  if (e.key === 'Escape') {
    closeSearch();
  }
};

// 可搜索的片段
const searchSections = ref([]);

// 初始化可搜索的片段
const initSearchSections = async () => {
  const { data: sections } = await useAsyncData('search-sections', () => {
    return queryCollectionSearchSections('content', {
      ignoredTags: ['code']
    })
  })
  searchSections.value = sections.value;
};

// 处理搜索
const handleSearch = async (target) => {
  if (!target || !target.trim()) {
    searchResults.value = [];
    hasSearched.value = true;
    return;
  }

  if (!searchSections.value || searchSections.value.length === 0) {
    await initSearchSections();
  }

  // Additional check in case initSearchSections failed to populate searchSections
  if (!searchSections.value) {
    searchResults.value = [];
    hasSearched.value = true;
    return;
  }

  const query = target.trim().toLowerCase();
  const results = searchSections.value.filter((item) => {
    return (
      (item.content && item.content.toLowerCase().includes(query)) ||
      (item.title && item.title.toLowerCase().includes(query))
    );
  });

  searchResults.value = results;
  hasSearched.value = true;
};

// 格式化路径显示
const formatPath = (stem) => {
  if (!stem) return '';
  return stem.split('/').join(' > ');
};

// 获取路径字段（兼容 _path 和 stem）
const getPathField = (result) => {
  return result._path || result.stem || '';
};

// 截断内容
const truncateContent = (content, maxLength) => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

// 导航到搜索结果
const navigateToResult = (result) => {
  if (!result) return;

  console.log(result);

  // 尝试从不同字段获取路径
  let pathField = '';

  // 1. 首先尝试使用 _path 或 stem 字段
  if (result._path) {
    pathField = result._path;
  } else if (result.stem) {
    pathField = result.stem;
  }
  // 2. 如果没有上述字段，但有 id 字段，尝试从 id 提取路径
  else if (result.id) {
    // 移除开头的斜杠
    pathField = result.id.replace(/^\/+/, '');
  }
  // 3. 如果没有上述字段，但有 title 字段，尝试通过 title 查找对应的文章
  else if (result.title && searchSections.value && searchSections.value.length > 0) {
    // 通过标题查找匹配的文章
    const matchingArticle = searchSections.value.find(item =>
      item.title && item.title.trim() === result.title.trim()
    );

    if (matchingArticle) {
      // 从匹配的文章中获取路径字段
      if (matchingArticle._path) {
        pathField = matchingArticle._path;
      } else if (matchingArticle.stem) {
        pathField = matchingArticle.stem;
      }
    }
  }

  console.log('使用的路径字段:', pathField);

  // 如果没有可用的路径字段，则无法导航
  if (!pathField) {
    console.error('无法导航：没有找到有效的路径字段');
    return;
  }

  // 构建导航路径并导航
  const path = `/articles/${pathField}`;
  console.log('导航到:', path);
  router.push(path);
  closeSearch();
};

const debounceTimer = ref(null);

// 处理输入框键盘事件
const handleKeyDown = (e) => {
  // 清除前一个定时器
  clearTimeout(debounceTimer.value);
  // 设置新的定时器
  debounceTimer.value = setTimeout(async () => {
    await handleSearch(searchQuery.value);
  }, 500); // 500 毫秒后触发搜索
};

onMounted(async () => {
  await initSearchSections();
});
</script>

<style scoped>
.search-container {
  position: relative;
  transition: all 0.3s ease-in-out;
}

/* Desktop search trigger button */
.search-trigger {
  display: flex;
  align-items: center;
  width: 16rem;
  gap: 8px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-text);
}

.search-trigger:hover {
  background-color: var(--color-background-hover);
}

/* Mobile search button */
.mobile-search-button {
  /* display: none; */
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--color-text);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.mobile-search-button:hover {
  background-color: var(--color-background-hover);
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
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.search-modal.active {
  opacity: 1;
  visibility: visible;
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
  /* backdrop-filter: blur(4px); */
  cursor: pointer;
}

/* Search content */
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
  /* Ensure it's above the overlay */

}

.search-modal.active .search-content {
  transform: translateY(0);
}

/* Search header */
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
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
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
  background-color: var(--color-background-hover);
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

/* Responsive adjustments */
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
