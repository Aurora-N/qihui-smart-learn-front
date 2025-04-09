<script setup>
const res = {
  "status": "success",
  "data": {
    "posts": {
      "postId": "90",
      "title": "如何成为全栈高手",
      "author": {
        "id": "PGM_CJ_T-n8sYC3RtAhpx",
        "attributes": {
          "avatarUrl": "https://avatars.githubusercontent.com/u/35548919",
          "userName": "Uika",
          "email": "lmfmhh_oe812@sina.com"
        }
      },
      "categories": [
        {
          "categoryId": "1",
          "categoryName": "博客"
        },
        {
          "categoryId": "2",
          "categoryName": "资源推荐"
        }
      ],
      "createdAt": "2025-02-21 03:37:51",
      "lastCommentedAt": "2025-02-19 18:02:15",
      "commentsCount": 3,
      "likesCount": 16,
      "content": `# 如何成为全栈高手：从入门到精通的系统性指南

![全栈开发概念图](https://ts1.tc.mm.bing.net/th/id/R-C.b98e1c67d222c8ff82eb8e8048b9e014?rik=FlVhN5d51r0O%2fA&riu=http%3a%2f%2fp0.ifengimg.com%2fpmop%2f2018%2f1108%2f087ED8FD28D779B2CE229A211B936279D71F5352_size119_w554_h369.png&ehk=czJeERxYtQ9zn62TVzk%2fiYlBxmdmxtOHFazX59aWnd0%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1)  
*全栈开发者需掌握从前端到后端的完整技术栈*

在2023年StackOverflow开发者调查中，**全栈工程师**以55.2%的占比蝉联最受欢迎开发角色。这种既能画界面又能写API的全能选手，正在成为数字化转型浪潮中的核心人才。本文将揭示成为全栈高手的进阶密码。

---

## 一、构建全栈技能树的三个维度

### 1. 技术栈的黄金组合
- **前端三件套**：HTML5/CSS3(掌握Flex/Grid布局) + ES2022+
- **框架生态**：React/Vue/Angular任选其一深入，搭配TypeScript
- **服务端核心**：Node.js(Python/Go备选) + RESTful API设计原则
- **数据库双引擎**：关系型(MySQL/PostgreSQL) + NoSQL(MongoDB/Redis)
- **DevOps基础**：Docker容器化 + CI/CD流水线配置

### 2. 架构思维培养
- 理解MVC/MVVM设计模式差异
- 掌握微服务与单体架构的取舍之道
- 学习领域驱动设计(DDD)基础概念
- 构建可扩展的API网关设计

### 3. 工具链掌控力
\`\`\`bash
# 现代全栈开发典型工具链
VS Code → Git → Webpack → Jest → Postman → Kubernetes
\`\`\`


`,
      "comments": [
        {
          "commentId": "3139334224466784",
          "author": {
            "id": "644e609b-9c71-430d-b6f1-73e0cb1f8d18",
            "attributes": {
              "avatarUrl": "",
              "userName": "Aurorallz",
              "email": "v9bmdm.k7f@163.com"
            }
          },
          "content": "推荐一个很好的全栈学习网站，来自赫尔辛基大学：[Full Stack open](https://fullstackopen.com/en/)",
          "createdAt": "2025-03-13 23:31:13",
          "likesCount": 6,
          "repliedID": null
        },
        {
          "commentId": "1544851306751334",
          "author": {
            "id": "6ddbb6b0-93d2-4452-9008-589152dc405e",
            "attributes": {
              "avatarUrl": "",
              "userName": "muko",
              "email": "mawtue_too89@foxmail.com"
            }
          },
          "content": "感觉还是得先打好计算机基础，基础不牢地动山摇😀",
          "createdAt": "2025-03-14 18:16:49",
          "likesCount": 5,
          "repliedID": "3139334224466784"
        },
        {
          "commentId": "7864170224243326",
          "author": {
            "id": "893fcab4-500a-41c4-922d-44ba3a6bc164",
            "attributes": {
              "avatarUrl": "https://avatars.githubusercontent.com/u/22179789",
              "userName": "Ruster",
              "email": "k8qscp14@yeah.net"
            }
          },
          "content": "博主还没写完吗，期待继续更新！",
          "createdAt": "2025-03-19 18:02:15",
          "likesCount": 1,
          "repliedID": null
        }
      ]
    }
  }
}

const userStore = useUserStore();
const userInfo = ref({})
const post = ref({})
const comments = ref([])
post.value = res.data.posts;
comments.value = res.data.posts.comments

const editorRef = ref(null);

const router = useRouter();

const scrollToReplyEditor = () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    ElMessage({type: 'warning', message: '请先登录', plain: true});
    router.push('/login');
  }
  editorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  const editorElement = editorRef.value?.querySelector('#reply-editor .ProseMirror');
  if (editorElement) {
    editorElement.focus();
  }
}

const editorContent = ref('');

// 父组件接收清空前的内容
const handleBeforeSubmit = (content) => {
  console.log('提交前的内容:', content);
  console.log(userInfo.value.data);
  comments.value.push(
    {
      "commentId": "",
      "author": {
        "id": userInfo.value.id,
        "attributes": {
          "avatarUrl": userInfo.value.avatarUrl,
          "userName": userInfo.value.userName,
          "email": userInfo.value.email
        }
      },
      "content": content.slice(3, -4),
      "createdAt": "刚刚",
      "likesCount": 0,
      "repliedID": null
    });
  // 可以将内容保存或做进一步处理
};

onMounted(async ()=>{
  userInfo.value = userStore.userInfo.data;
})
</script>

<template>
  <div class="container">
    <ForumBanner :title="post.title" :sub-title="post.author.attributes.userName"></ForumBanner>
    <!-- 内容区域 -->
    <div class="post-content">
      <!-- 帖子内容 -->
      <article class="main-content">
        <ForumComment :id="post.postId" :author="post.author" :content="post.content" :time="post.createdAt"
          :likes-count="post.likesCount" />
        <hr>
        <!-- 评论区内容 -->
        <div v-for="item of comments" :key="item.commentId">
          <ForumComment :id="item.commentId" :author="item.author" :content="item.content" :time="item.createdAt"
            :likes-count="item.likesCount" :replied-id="item.repliedID" />
          <hr>
        </div>
        <div ref="editorRef" class="editor">
          <ClientOnly>
            <TiptapEditor id="reply-editor" v-model="editorContent" @beforeSubmit="handleBeforeSubmit" />
          </ClientOnly>
        </div>
      </article>

      <!-- 功能侧边栏 -->
      <div>
        <aside class="sidebar">
          <!-- position: sticky的外面还需包裹一层div才能生效 -->
          <div>
            <el-button type="primary" size="large" class="reply-btn" @click="scrollToReplyEditor">
              回复
            </el-button>
          </div>
          <div>
            <el-button type="primary" size="large" class="other-btn">
              收藏
            </el-button>
          </div>
        </aside>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}

.container {
  min-height: 100vh;
  background-color: while;
  padding-top: 55px;
}

.post-content {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 1rem 0 2rem 0;
}

.main-content {
  width: 100%;
  max-width: 64rem;
}

.main-content .editor {
  padding-bottom: 1rem;
}

.sidebar {
  width: 10rem;
  margin-left: 2rem;
  position: sticky;
  top: 80px;
}

.sidebar .reply-btn {
  width: 100%;
  margin-top: 1rem;
  height: 48px;
  font-size: 1rem;
  background-color: #0060DF;
  border-color: #0060DF;
}

.sidebar .reply-btn:hover {
  background-color: var(--main-color-hover-lighter);
  border-color: var(--main-color-hover-lighter);
  box-shadow: 0 0 5px var(--main-color-hover-shadow);
}

.sidebar .other-btn {
  width: 100%;
  margin-top: 1rem;
  height: 48px;
  font-size: 1rem;
  color: var(--color-text);
  background-color: var(--color-background);
  border-color: var(--color-border);
}

.sidebar .other-btn:hover {
  background-color: var(--color-background-hover);
}
</style>