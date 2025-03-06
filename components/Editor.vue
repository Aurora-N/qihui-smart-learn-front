<template>
  <div class="editor-container">
    <div class="header">
      <div class="menu-back-btn">
        <button @click="$router.push('/forum')" class="back-btn">
          <span class="icon">
            <el-icon>
              <ArrowLeft />
            </el-icon>
          </span>
        </button>
      </div>
      <div class="menu-bar">
        <div class="menu-group-left">
          <div class="menu-group">
            <button @click="toggleHeading(1)" :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }">
              <span class="icon">H1</span>
            </button>
            <button @click="toggleHeading(2)" :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }">
              <span class="icon">H2</span>
            </button>
            <button @click="toggleHeading(3)" :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }">
              <span class="icon">H3</span>
            </button>
          </div>

          <div class="menu-group">
            <button @click="editor.chain().focus().toggleBold().run()"
              :class="{ 'is-active': editor?.isActive('bold') }">
              <span class="icon">B</span>
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()"
              :class="{ 'is-active': editor?.isActive('italic') }">
              <span class="icon">I</span>
            </button>
            <button @click="editor.chain().focus().toggleStrike().run()"
              :class="{ 'is-active': editor?.isActive('strike') }">
              <span class="icon">S</span>
            </button>
          </div>

          <div class="menu-group">
            <button @click="editor.chain().focus().toggleBulletList().run()"
              :class="{ 'is-active': editor?.isActive('bulletList') }">
              <span class="icon">•</span>
            </button>
            <button @click="editor.chain().focus().toggleOrderedList().run()"
              :class="{ 'is-active': editor?.isActive('orderedList') }">
              <span class="icon">1.</span>
            </button>
            <button @click="editor.chain().focus().toggleTaskList().run()"
              :class="{ 'is-active': editor?.isActive('taskList') }">
              <span class="icon">☑</span>
            </button>
          </div>

          <div class="menu-group">
            <button @click="editor.chain().focus().toggleBlockquote().run()"
              :class="{ 'is-active': editor?.isActive('blockquote') }">
              <span class="icon">❝</span>
            </button>
            <button @click="editor.chain().focus().toggleCodeBlock().run()"
              :class="{ 'is-active': editor?.isActive('codeBlock') }">
              <span class="icon">{}</span>
            </button>
          </div>

          <div class="menu-group">
            <button @click="setLink">
              <span class="icon">
                <el-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path fill="currentColor"
                      d="M715.648 625.152 670.4 579.904l90.496-90.56c75.008-74.944 85.12-186.368 22.656-248.896-62.528-62.464-173.952-52.352-248.96 22.656L444.16 353.6l-45.248-45.248 90.496-90.496c100.032-99.968 251.968-110.08 339.456-22.656 87.488 87.488 77.312 239.424-22.656 339.456l-90.496 90.496zm-90.496 90.496-90.496 90.496C434.624 906.112 282.688 916.224 195.2 828.8c-87.488-87.488-77.312-239.424 22.656-339.456l90.496-90.496 45.248 45.248-90.496 90.56c-75.008 74.944-85.12 186.368-22.656 248.896 62.528 62.464 173.952 52.352 248.96-22.656l90.496-90.496zm0-362.048 45.248 45.248L398.848 670.4 353.6 625.152z">
                    </path>
                  </svg>
                </el-icon>
              </span>
            </button>
            <button @click="addImage">
              <span class="icon"><el-icon>
                  <Picture />
                </el-icon></span>
            </button>
            <button @click="insertTable">
              <span class="icon"><el-icon>
                  <Grid />
                </el-icon></span>
            </button>
          </div>
        </div>

        <div class="menu-group-right">
          共{{ editor?.storage.characterCount.characters() }}个字符
          <el-button type="primary" class="submit-btn">
            <span class="submit-btn-inner">
              <IconsSubmit />提交
            </span>
          </el-button>
        </div>
      </div>
    </div>

    <editor-content :editor="editor" class="editor-content" />
    <br>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'

// 接收 `modelValue` 作为 v-model 绑定值
const props = defineProps({
  modelValue: String, // 父组件传入的 HTML 内容
});

// 定义 `update:modelValue` 事件，用于父组件双向绑定
const emit = defineEmits(["update:modelValue"]);

// 创建 editor
const editor = ref(null)

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        autolink: true,
      }),
      Image,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading' && node.attrs.level === 1) {
            return '请输入标题……'
          } else if (node.type.name === 'paragraph') {
            return '请输入正文……'
          }
          return ''
        },
        showOnlyWhenEditable: false,
        showOnlyCurrent: false,
        includeChildren: true,
      }),
      CharacterCount,
    ],
    content: props.modelValue, // 初始内容
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
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
});

// 组件销毁时清理 editor
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
})

const toggleHeading = (level) => {
  editor.value.chain().focus().toggleHeading({ level }).run()
}

const setLink = () => {
  const url = window.prompt('请在此输入URL地址')

  console.log(url)
  if (url === null) {
    return
  }

  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const addImage = () => {
  const url = window.prompt('请在此输入图片的URL地址')

  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const insertTable = () => {
  editor.value.chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run()
}
</script>

<style>
.editor-container {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow: visible;
}

.header {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1rem;
  padding: 5px;
  position: sticky;
  top: 1rem;
  z-index: 50;
}

.header .menu-back-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header .back-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50rem;
  width: 40px;
  height: 40px;
  border: none;
  box-shadow: 0 0 5px #8f8f8f7d;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(64px);
  -webkit-backdrop-filter: blur(64px);
}

.header .back-btn:hover {
  background-color: #f0f0f0;
}

.editor-container .menu-bar {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
  margin: 10px 0;
  border-radius: 50rem;
  box-shadow: 0 0 5px #8f8f8f7d;

  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(64px);
  -webkit-backdrop-filter: blur(64px);
}

.editor-container .menu-group {
  display: flex;
  margin-right: 10px;
}

.editor-container .menu-bar .menu-group:not(:last-child) {
  border-right: 1px solid #ddd;
  padding-right: 10px;
}

.menu-group button {
  background-color: transparent;
  border: none;
  border-radius: 50%;
  padding: 1rem;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  transition: background-color 0.2s;
}

.menu-group button:hover {
  background-color: #f0f0f0;
}

.menu-group button.is-active {
  background-color: #f0f0f0;
  font-weight: bold;
}

.header .icon {
  font-size: 16px;
  line-height: 1;
  color: #666;
}

.menu-bar .menu-group-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.menu-bar .menu-group-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-right: 2px;
}

.menu-bar .submit-btn {
  padding: 0.5rem 1rem;
  border-radius: 50rem;
  background-color: #0060DF;
  border-color: #0060DF;
}

.menu-bar .submit-btn:hover {
  background-color: #1576ff;
  box-shadow: 0 0 5px rgba(0, 96, 223, 0.5);
}

.menu-bar .submit-btn-inner {
  display: flex;
  align-content: center;
  gap: 0.3rem
}


.editor-container .editor-content {
  padding: 15px;
  min-height: 300px;
  overflow-y: auto;
}

.editor-content .ProseMirror {
  outline: none;
  border: 0;
}

.editor-content .ProseMirror p {
  margin: 0.8em 0;
}

/* Placeholder (at the top) */
.editor-content p.is-empty:first-of-type::before {
  color: #ddd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Placeholder Title (at the top) */
.editor-content h1.is-editor-empty:first-child::before {
  color: #ddd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}


/* .ProseMirror h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

.ProseMirror h2 {
  font-size: 1.5em;
  margin: 0.75em 0;
}

.ProseMirror h3 {
  font-size: 1.17em;
  margin: 0.83em 0;
}

.ProseMirror blockquote {
  border-left: 3px solid #ddd;
  margin-left: 0;
  padding-left: 1em;
  color: #666;
}

.ProseMirror pre {
  background-color: #f5f5f5;
  border-radius: 3px;
  padding: 10px;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.ProseMirror code {
  background-color: #f5f5f5;
  border-radius: 3px;
  padding: 2px 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.ProseMirror ul,
.ProseMirror ol {
  padding-left: 2em;
}*/


.ProseMirror ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

.ProseMirror ul[data-type="taskList"] li {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.ProseMirror ul[data-type="taskList"] li>label {
  margin-right: 0.5em;
  user-select: none;
}

.ProseMirror ul[data-type="taskList"] li>div {
  flex: 1;
}

/*
.ProseMirror table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 1em 0;
  overflow: hidden;
}

.ProseMirror table td,
.ProseMirror table th {
  border: 1px solid #ddd;
  padding: 8px;
  position: relative;
}

.ProseMirror table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.ProseMirror a {
  color: #0366d6;
  text-decoration: none;
}

.ProseMirror a:hover {
  text-decoration: underline;
}

.ProseMirror img {
  max-width: 100%;
  height: auto;
}

.ProseMirror strong {
  font-weight: bold;
} */

@media (max-width: 600px) {
  .menu-bar {
    flex-direction: column;
  }

  .menu-group {
    margin-bottom: 5px;
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }
}
</style>