<template>
  <div class="avatar-upload">
    <div
      class="avatar-container"
      :style="{ backgroundImage: previewUrl ? `url(${previewUrl})` : 'none' }"
      @click="triggerFileInput"
    >
      <div v-if="!previewUrl" class="avatar-placeholder">
        <span>{{ initials }}</span>
      </div>
      <div class="avatar-overlay">
        <el-icon class="plus-icon">
          <Plus />
        </el-icon>
      </div>
      <div v-if="uploading" class="loading-overlay">
        <div class="loading-spinner" />
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="file-input"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: 'User',
  },
  size: {
    type: Number,
    default: 100,
  },
  avatarurl: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:avatar', 'upload-success', 'upload-error'])

const fileInput = ref(null)
const previewUrl = ref('')
const uploading = ref(false)

onBeforeMount(() => {
  previewUrl.value = props.avatarurl
})

const initials = computed(() => {
  if (!props.name) return 'U'
  return props.name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = event => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = e => {
    previewUrl.value = e.target.result
    uploadAvatar(file)
  }
  reader.readAsDataURL(file)
}

const uploadAvatar = async file => {
  try {
    uploading.value = true

    await new Promise(resolve => setTimeout(resolve, 1500))

    emit('update:avatar', file)
    emit('upload-success', { file, url: previewUrl.value })
  } catch (error) {
    console.error('Upload failed:', error)
    emit('upload-error', error)
  } finally {
    uploading.value = false
  }
}

definePageMeta({
  layout: false,
})
</script>

<style scoped>
.avatar-upload {
  display: inline-block;
}

.avatar-container {
  width: v-bind('props.size + "px"');
  height: v-bind('props.size + "px"');
  border-radius: 50%;
  background-color: #f0f0f0;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: calc(v-bind('props.size') / 3);
  color: #666;
  background-color: #e0e0e0;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.plus-icon {
  color: white;
  height: 2rem;
}

.file-input {
  display: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
