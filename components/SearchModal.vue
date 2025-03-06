<template>
  <div class="search-container">
    <!-- Search trigger button -->
    <button class="search-trigger" @click="openSearch">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <span>搜索</span>
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
              @keyup.esc="closeSearch" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, defineEmits } from 'vue';

const emit = defineEmits(['search']);

const isSearchOpen = ref(false);
const searchQuery = ref('');
const searchInputRef = ref(null);

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
};

// Listen for escape key to close modal
watch(isSearchOpen, (newValue) => {
  if (newValue) {
    window.addEventListener('keydown', handleKeyDown);
  } else {
    window.removeEventListener('keydown', handleKeyDown);
  }
});

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    closeSearch();
  }
};
</script>

<style scoped>
.search-container {
  position: relative;
}

/* Search trigger button */
.search-trigger {
  display: flex;
  align-items: center;
  width: 16rem;
  gap: 8px;
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.search-trigger:hover {
  background-color: #f5f5f5;
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
  background-color: white;
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
  border-bottom: 1px solid #eee;
}

.search-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
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
  background-color: #f5f5f5;
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
  color: #666;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 50px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-content {
    width: 95%;
    margin-top: 60px;
  }
}
</style>