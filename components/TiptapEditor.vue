<template>
  <div class="tiptap-editor">
    <editor-content :editor="editor" />
    <el-button v-if="btnShow" type="primary" class="submit-btn">
      <span class="submit-btn-inner">
        <IconsSubmit />提交
      </span>
    </el-button>
  </div>
</template>

<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

// 接收 `modelValue` 作为 v-model 绑定值
const props = defineProps({
  modelValue: String, // 父组件传入的 HTML 内容
});

// 定义 `update:modelValue` 事件，用于父组件双向绑定
const emit = defineEmits(["update:modelValue"]);

// 创建 editor
const editor = ref(null);

// 控制提交按钮显示与否
const btnShow = ref(false);

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit, Placeholder.configure({
      // Use a placeholder:
      placeholder: '说些什么吧……',
    })],
    content: props.modelValue, // 初始内容
    onUpdate: ({ editor }) => {
      // 当编辑器内容变化时，触发 `update:modelValue` 更新父组件数据
      emit("update:modelValue", editor.getHTML());
    },
  });
});

// 监听 modelValue 的变化，使得外部修改也能同步到编辑器
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue, false);
  }
  btnShow.value = props.modelValue.length > 7; // '<p></p>'.length === 7
});

// 组件销毁时清理 editor
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

</script>

<style>
/* 默认样式 */
.tiptap-editor .ProseMirror {
  border: 1px solid rgb(231, 236, 243);
  border-radius: 6px;
  padding: 0 1rem 0 1rem;
  outline: none;
  transition: border-color 0.2s ease-in-out;
}

/* 悬停时 */
.tiptap-editor .ProseMirror:hover {
  border: 1px solid #409eff;
}

/* 获取焦点时 */
.tiptap-editor .ProseMirror-focused {
  border: 1px solid while;
  /* 变成蓝色，类似 element-ui 的 focus */
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
}

/* Placeholder (at the top) */
.tiptap-editor p.is-editor-empty:first-child::before {
  color: var(--gray-4);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap-editor {
  position: relative;
  /* 让子元素（按钮）相对于此元素定位 */
}

/* 提交按钮 */
.tiptap-editor .submit-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;

  padding: 0.5rem;
  background-color: #0060DF;
  border-color: #0060DF;
}

.tiptap-editor .submit-btn:hover {
  background-color: #0250BB;
  border-color: #0250BB;
}

.submit-btn .submit-btn-inner {
  display: flex;
  align-content: center;
  gap: 0.3rem
}
</style>