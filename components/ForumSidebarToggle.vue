<script setup>
const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

// Close sidebar when clicking outside on mobile
const closeSidebarOnOutsideClick = (event) => {
  if (window.innerWidth <= 768 && isOpen.value) {
    const sidebar = document.querySelector('.mobile-sidebar-container')
    if (sidebar && !sidebar.contains(event.target) &&
      !event.target.classList.contains('toggle-sidebar-button')) {
      isOpen.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', closeSidebarOnOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', closeSidebarOnOutsideClick)
})

defineExpose({ isOpen, toggleSidebar })
</script>

<template>
  <button class="toggle-sidebar-button" @click="toggleSidebar">
    <el-icon>
      <Menu />
    </el-icon>
    <span>菜单</span>
  </button>
</template>

<style scoped>
.toggle-sidebar-button {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.toggle-sidebar-button:hover {
  background-color: #f9fafb;
}

@media (max-width: 768px) {
  .toggle-sidebar-button {
    display: flex;
  }
}
</style>
