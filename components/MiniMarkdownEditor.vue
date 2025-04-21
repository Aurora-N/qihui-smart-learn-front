<template>
  <div class="comment-editor">
    <textarea 
      v-model="markdownText" 
      placeholder="在此回复，支持Markdown格式"
      ref="textarea"
      @input="adjustHeight"
    ></textarea>
    <el-button v-if="btnShow" type="primary" class="submit-btn">
      <span class="submit-btn-inner" @click="handleSubmit">
        <IconsSubmit />提交
      </span>
    </el-button>
  </div>
</template>

<script setup>
// 定义beforeSubmit事件，把数据传递给父组件
const emit = defineEmits(["beforeSubmit"]);

// 控制提交按钮显示与否
const btnShow = computed(() => markdownText.value.length > 0);

const markdownText = ref('');

const textarea = ref(null);

// 调整textarea高度
const adjustHeight = () => {
  console.log(textarea.value)
  textarea.value.style.height = 'auto';  // 先重置为自动高度
  textarea.value.style.height = `${textarea.value.scrollHeight}px`; // 设置为内容的高度
  console.log(textarea.value.style.height.slice(0, -2));
  if (textarea.value.style.height.slice(0, -2) > 300) {
    textarea.value.style.overflow = 'auto';
  } else {
    textarea.value.style.overflow = 'hidden';
  }
};

const handleSubmit = async () => {
  emit("beforeSubmit", markdownText.value);
  markdownText.value = ''; // 清空内容
}
</script>

<style scoped>
.comment-editor {
  transition: border-color 0.2s ease-in-out;
  position: relative;
}

textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 1rem;
  outline: none;
  background-color: var(--color-background-layer);
  color: var(--color-text);
  resize: none; /* 禁止用户手动调整 */
  overflow: hidden; /* 隐藏滚动条 */
  max-height: 300px;
}

/* 悬停时 */
.comment-editor textarea:hover {
  border: 1px solid #409eff;
}

/* 获取焦点时 */
.comment-editor textarea:focus {
  border: 1px solid white;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
}

/* 提交按钮 */
.comment-editor .submit-btn {
  position: absolute;
  bottom: 18px;
  right: 12px;
  padding: 0.5rem;
  background-color: #0060DF;
  border-color: #0060DF;
}

.comment-editor .submit-btn:hover {
  background-color: #0250BB;
  border-color: #0250BB;
}

.submit-btn .submit-btn-inner {
  display: flex;
  align-content: center;
  gap: 0.3rem;
}
</style>
