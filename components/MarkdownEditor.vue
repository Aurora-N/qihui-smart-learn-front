<template>
  <div class="markdown-editor">
    <!-- Header with navigation and controls -->
    <div class="header">
      <div class="menu-back-btn">
        <button @click="$router.push('/')" class="back-btn" title="返回">
          <span class="icon">
            <el-icon>
              <ArrowLeft />
            </el-icon>
          </span>
        </button>
      </div>
      <div class="menu-bar">
        <div class="view-controls">
          <div class="slider-container">
            <div class="slider-track">
              <div class="slider-indicator" :style="sliderStyle"></div>
              <button 
                v-if="!isMobileView"
                @click="setViewMode('split')" 
                :class="{ active: viewMode === 'split' }" 
                ref="splitBtn"
                title="双栏同时显示编辑区和预览区">
                <span>双栏</span>
              </button>
              <button 
                @click="setViewMode('edit')" 
                :class="{ active: viewMode === 'edit' }" 
                ref="editBtn"
                title="编辑模式">
                <span>编辑</span>
              </button>
              <button 
                @click="setViewMode('preview')" 
                :class="{ active: viewMode === 'preview' }" 
                ref="previewBtn"
                title="预览模式">
                <span>预览</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu toggle button -->
        <div class="mobile-menu-toggle" v-if="isMobileView || isTabletView">
          <button @click="isMenuExpanded = !isMenuExpanded" title="格式化选项">
            <span class="icon">
              <el-icon>
                <Menu />
              </el-icon>
            </span>
          </button>
        </div>

        <div class="menu-group-left" :class="{ 'mobile-expanded': isMenuExpanded }">
          <div class="menu-group">
            <button @click="insertFormat('# ')" title="1级标题">
              <span class="icon">H1</span>
            </button>
            <button @click="insertFormat('## ')" title="2级标题">
              <span class="icon">H2</span>
            </button>
            <button @click="insertFormat('### ')" title="3级标题">
              <span class="icon">H3</span>
            </button>
          </div>

          <div class="menu-group">
            <button @click="insertFormat('**', '**')" title="加粗">
              <strong class="icon">B</strong>
            </button>
            <button @click="insertFormat('*', '*')" title="斜体">
              <i class="icon">I</i>
            </button>
            <button @click="insertFormat('~~', '~~')" title="删除线">
              <s class="icon">S</s>
            </button>
          </div>

          <div class="menu-group">
            <button @click="insertFormat('- ')" title="无序列表">
              <span class="icon">
                <IconsUnorderList />
              </span>
            </button>
            <button @click="insertFormat('1. ')" title="有序列表">
              <span class="icon">
                <IconsOrderedList />
              </span>
            </button>
            <button @click="insertFormat('- [ ] ')" title="方形勾选框">
              <span class="icon">
                <IconsChecked />
              </span>
            </button>
          </div>

          <div class="menu-group">
            <button @click="insertFormat('> ')" title="引用">
              <span class="icon">
                <IconsQuote />
              </span>
            </button>
            <button @click="insertFormat('\`\`\`\n', '\n\`\`\`')" title="代码块">
              <span class="icon">
                <IconsCode />
              </span>
            </button>
          </div>

          <div class="menu-group">
            <button @click="insertFormat('[', '](url)')" title="链接">
              <span class="icon">
                <IconsLink />
              </span>
            </button>
            <button @click="insertFormat('![alt text](', ')')" title="图片链接">
              <span class="icon"><el-icon>
                  <Picture />
                </el-icon></span>
            </button>
            <button @click="insertFormat('| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |')" title="表格">
              <span class="icon"><el-icon>
                  <Grid />
                </el-icon></span>
            </button>
          </div>
        </div>

        <div class="menu-group-right">
          <span class="char-count">共{{ markdownText.length }}个字符</span>
          <ThemeToggle class="nav-button" />

          <el-button type="primary" class="submit-btn" title="发表帖子" @click="handleSubmit">
            <span class="submit-btn-inner">
              <IconsSubmit />发表
            </span>
          </el-button>
        </div>
      </div>
    </div>

    <div class="editor-container" :class="viewMode">
      <div class="editor-pane" v-show="viewMode !== 'preview'">
        <input v-model="postTitle" placeholder="请输入标题..." />
        <hr style="margin: 0 1rem"/>
        <textarea 
          ref="editor" 
          v-model="markdownText" 
          @keydown="handleTabKey" 
          @input="autoResize"
          :style="{ height: textareaHeight + 'px' }"
          placeholder="在此处输入Markdown格式的正文..."></textarea>
      </div>
      <div class="preview-pane" v-show="viewMode !== 'edit'">
        <div class="preview-content" v-html="renderedHTML"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async';
import MarkdownItAsync from 'markdown-it-async';
import { codeToHtml } from 'shiki';
import '~/assets/css/post.css';
import DOMPurify from 'dompurify';
import markdownItSanitizer from 'markdown-it-sanitizer';
import { useForumApi } from '~/api/forum';

const postTitle = ref('');
const markdownText = ref('');
const viewMode = ref('split'); // 'edit', 'preview', or 'split'
const editor = ref(null);
const textareaHeight = ref(500); // 初始高度
const isMenuExpanded = ref(false);

// 响应式设计相关状态
const windowWidth = ref(window.innerWidth);
const isMobileView = computed(() => windowWidth.value < 768);
const isTabletView = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024);

// 滑块相关引用和状态
const editBtn = ref(null);
const previewBtn = ref(null);
const splitBtn = ref(null);
const sliderStyle = reactive({
  width: '33.33%',
  left: '0%',
});

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
  updateSliderPosition();
  
  // 在移动视图下自动切换到编辑模式
  if (isMobileView.value && viewMode.value === 'split') {
    setViewMode('edit');
  }
};

// 设置视图模式并更新滑块位置
const setViewMode = (mode) => {
  // 在移动视图下，禁用双栏模式
  if (isMobileView.value && mode === 'split') {
    return;
  }
  
  viewMode.value = mode;
  updateSliderPosition();
};

// 更新滑块位置
const updateSliderPosition = () => {
  nextTick(() => {
    if (isMobileView.value) {
      // 移动设备只有两个按钮，调整滑块
      if (viewMode.value === 'edit' && editBtn.value) {
        const width = editBtn.value.offsetWidth;
        sliderStyle.width = `${width}px`;
        sliderStyle.left = '2px';
      } else if (viewMode.value === 'preview' && previewBtn.value) {
        const width = previewBtn.value.offsetWidth;
        const left = editBtn.value ? editBtn.value.offsetWidth : 0;
        sliderStyle.width = `${width}px`;
        sliderStyle.left = `${left-2}px`;
      }
    } else {
      // 桌面视图有三个按钮
      if (viewMode.value === 'split' && splitBtn.value) {
        const width = splitBtn.value.offsetWidth;
        sliderStyle.width = `${width}px`;
        sliderStyle.left = '2px';
      } else if (viewMode.value === 'edit' && editBtn.value) {
        const width = editBtn.value.offsetWidth;
        const left = splitBtn.value ? splitBtn.value.offsetWidth : 0;
        sliderStyle.width = `${width}px`;
        sliderStyle.left = `${left}px`;
      } else if (viewMode.value === 'preview' && previewBtn.value) {
        const width = previewBtn.value.offsetWidth;
        const left = (splitBtn.value ? splitBtn.value.offsetWidth : 0) + 
                    (editBtn.value ? editBtn.value.offsetWidth : 0);
        sliderStyle.width = `${width}px`;
        sliderStyle.left = `${left-2}px`;
      }
    }
  });
};

// 自动调整textarea高度
const autoResize = () => {
  const textarea = editor.value;
  if (!textarea) return;
  
  // 保存当前滚动位置
  const scrollPos = window.scrollY;
  
  // 重置高度以获取正确的scrollHeight
  textarea.style.height = 'auto';
  
  // 设置新的高度
  const newHeight = Math.max(500, textarea.scrollHeight);
  textareaHeight.value = newHeight;
  
  // 恢复滚动位置
  window.scrollTo(0, scrollPos);
};

// Computed property for rendered HTML
const md = MarkdownItAsync();

md.use(
  fromAsyncCodeToHtml(
    // Pass the codeToHtml function
    codeToHtml,
    {
      theme: 'material-theme-lighter'
    }
  ),
  markdownItSanitizer
);

const codeColor = computed(() => useColorMode().preference === 'light' ? '#F8FAFC' : '#1E293B');

const renderedHTML = ref(null);

watch([markdownText, postTitle], async (newText) => {
  const html = await md.renderAsync(`# ${newText[1]}\n${newText[0]}`);
  renderedHTML.value = html.replace(/#FAFAFA/g, codeColor.value); // 替换代码区背景色
  
  // 内容变化时调整高度
  nextTick(() => {
    autoResize();
  });
});

// 监听视图模式变化，在切换时调整高度
watch(viewMode, () => {
  nextTick(() => {
    autoResize();
  });
});

// Methods
const insertFormat = (prefix, suffix = '') => {
  const textarea = editor.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = markdownText.value.substring(start, end);

  // Insert the formatting
  const replacement = prefix + selectedText + suffix;
  markdownText.value =
    markdownText.value.substring(0, start) +
    replacement +
    markdownText.value.substring(end);

  // Set cursor position
  setTimeout(() => {
    textarea.focus();
    if (selectedText.length > 0) {
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selectedText.length;
    } else {
      const newCursorPos = start + prefix.length;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }
    
    // 调整高度
    autoResize();
  }, 0);
  
  // 在移动视图下，点击格式按钮后关闭菜单
  if (isMobileView.value || isTabletView.value) {
    isMenuExpanded.value = false;
  }
};

const handleTabKey = (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();

    const textarea = editor.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert tab
    markdownText.value =
      markdownText.value.substring(0, start) +
      '  ' +
      markdownText.value.substring(end);

    // Set cursor position after the tab
    setTimeout(() => {
      textarea.selectionStart = start + 2;
      textarea.selectionEnd = start + 2;
      
      // 调整高度
      autoResize();
    }, 0);
  }
};

const router = useRouter();

// 发表文章
const handleSubmit = async () => {
  if (postTitle.value.length <= 0) {
    ElMessage({type: 'error', message: '请输入标题！', plain: true});
    return;
  }
  if (markdownText.value.length <= 0) {
    ElMessage({type: 'error', message: '请输入正文！', plain: true});
    return;
  }
  const res = await useForumApi().createNewPost(postTitle.value, markdownText.value, []);
  if (res.status === "success") router.push(`/forum/${res.postMeta.postId}`);
}

// Lifecycle hooks
onMounted(() => {
  if (editor.value) {
    editor.value.focus();
  }
  
  // 初始化滑块位置
  updateSliderPosition();
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
  
  // 初始化自动高度调整
  autoResize();
  
  // 如果是移动设备，默认设置为编辑模式
  if (isMobileView.value) {
    setViewMode('edit');
  }
});

// 在组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  max-width: 1280px;
  width: 90%;
  margin: auto;
  overflow: visible; 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: relative;
}

/* 从 Editor.vue 移植的样式 */
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
  width: 35px;
  height: 35px;
  border: none;
  box-shadow: 0 0 5px var(--color-border-shadow, rgba(0, 0, 0, 0.1));
  background: var(--color-background-blur, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(64px);
  -webkit-backdrop-filter: blur(64px);
}

.header .back-btn:hover {
  background-color: var(--color-background-hover, #f5f5f5);
}

.menu-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2px 5px;
  margin: 10px 0;
  border-radius: 50rem;
  box-shadow: 0 0 5px var(--color-border-shadow, rgba(0, 0, 0, 0.1));
  background: var(--color-background-blur, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(64px);
  -webkit-backdrop-filter: blur(64px);
}

.menu-group {
  display: flex;
  margin-right: 10px;
}

.menu-bar .menu-group:not(:last-child) {
  border-right: 1px solid var(--color-border, #e5e7eb);
  padding-right: 10px;
  gap: 0.2rem;
}

.menu-group button {
  background-color: transparent;
  border: none;
  border-radius: 50%;
  padding: 0.5rem;
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
  background-color: var(--color-background-hover, #f5f5f5);
}

.menu-group button.is-active,
.menu-group button.active {
  background-color: var(--color-background-mute, #e5e7eb);
  font-weight: bold;
}

.icon {
  font-size: 16px;
  line-height: 1;
  color: var(--color-meta-text, #6b7280);
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

.mobile-menu-toggle {
  display: none;
}

.menu-bar .submit-btn {
  padding: 0.5rem 1rem;
  border-radius: 50rem;
  background-color: var(--main-color, #2563eb);
  border-color: var(--main-color, #2563eb);
  color: white;
}

.menu-bar .submit-btn:hover {
  background-color: var(--main-color-hover-lighter, #3b82f6);
  box-shadow: 0 0 5px var(--main-color-hover-shadow, rgba(37, 99, 235, 0.5));
}

.menu-bar .submit-btn-inner {
  display: flex;
  align-content: center;
  gap: 0.3rem
}

/* 滑动按钮样式 */
.view-controls {
  display: flex;
  align-items: center;
}

.slider-container {
  position: relative;
  height: 32px;
}

.slider-track {
  display: flex;
  position: relative;
  background-color: var(--color-background, #ffffff);
  border-radius: 50rem;
  overflow: hidden;
  border: 1px solid var(--color-border, #e5e7eb);
  height: 100%;
}

.slider-indicator {
  position: absolute;
  height: calc(100% - 4px);
  top: 2px;
  background-color: var(--main-color, #1a1e27);
  border-radius: 50rem;
  transition: all 0.3s ease;
  z-index: 1;
}

.slider-track button {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.4rem 0.8rem;
  background-color: transparent;
  border: none;
  font-size: 0.85rem;
  height: 100%;
  transition: color 0.3s ease;
  white-space: nowrap;
  color: var(--color-text, #374151);
}

.slider-track button .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.slider-track button.active {
  color: white;
}

.slider-track button.active .icon {
  color: white;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--color-text, #374151);
  text-decoration: none;
  transition: all 0.3s ease-in-out;
}

.nav-button:hover {
  background-color: var(--color-background-hover, #f5f5f5);
  border-radius: 50rem;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow-x: hidden;
  padding-top: 10px;
}

.editor-container.edit .editor-pane,
.editor-container.preview .preview-pane {
  width: 100%;
  height: 100%;
}

.editor-container.split .editor-pane,
.editor-container.split .preview-pane {
  width: 50%;
}

.editor-pane {
  overflow-x: hidden;
}

.preview-pane {
  border-radius: 10px;
  border: 1px solid var(--color-border);
  min-height: 80vh;
  overflow-wrap: break-word;
}

textarea {
  width: 100%;
  padding: 16px;
  border: none;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 1rem;
  outline: none;
  background-color: var(--color-background-layer);
  color: var(--color-text);
  min-height: 80vh;
  height: auto;
  overflow-x: hidden;
  resize: none;
}

input {
  width: 100%;
  padding: 16px;
  border: none;
  font-size: 2rem;
  margin-bottom: 0;
  outline: none;
  color: var(--color-text);
  background-color: var(--color-background-layer);
  margin-right: 1rem;
}

.preview-content {
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .mobile-menu-toggle {
    display: flex;
    align-items: center;
    order: 1;
  }
 
  .view-controls {
    flex: 1;
  }

  .mobile-menu-toggle button {
    background-color: transparent;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .mobile-menu-toggle button:hover {
    background-color: var(--color-background-hover, #f5f5f5);
  }
  
  .menu-bar .menu-group-left {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-background-blur, rgba(255, 255, 255, 0.95));
    backdrop-filter: blur(64px);
    -webkit-backdrop-filter: blur(64px);
    flex-direction: column;
    padding: 10px;
    border-radius: 10px;
    margin-top: 5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    border: 1px solid var(--color-border, #e5e7eb);
  }
  
  .menu-bar .menu-group-left.mobile-expanded {
    display: flex;
  }
  
  .menu-bar .menu-group-left .menu-group {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    margin-right: 0;
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid var(--color-border, #e5e7eb);
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
  
  .menu-bar .menu-group-left .menu-group:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  
  .view-controls {
    order: 0;
  }
  
  .menu-bar .menu-group-right {
    order: 2;
  }
  
  .menu-bar {
    position: relative;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .markdown-editor {
    width: 95%;
  }
  
  .view-controls {
    flex: 1;
  }

  .menu-bar {
    border-radius: 20px;
    padding: 5px 10px;
  }
  
  .menu-bar .menu-group-right {
    width: auto;
    justify-content: flex-end;
    flex-wrap: nowrap;
  }
  
  .char-count {
    display: none;
  }
  
  .submit-btn {
    padding: 0.4rem 0.8rem !important;
  }
  
  .submit-btn-inner {
    font-size: 0.9rem;
  }
  
  .editor-container {
    flex-direction: column;
  }
  
  .editor-container.split .editor-pane,
  .editor-container.split .preview-pane {
    width: 100%;
  }
  
  /* textarea, .preview-pane {
    min-height: 60vh;
  } */
}

@media (max-width: 480px) {
  .menu-back-btn {
    margin-bottom: 5px;
  }
  
  .view-controls {
    flex: 1;
  }
  
  .slider-track button {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .menu-bar .submit-btn-inner span {
    display: none;
  }
}
</style>
