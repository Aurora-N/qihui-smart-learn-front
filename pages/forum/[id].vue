<script setup>
const res = {
  "status": "success",
  "data": {
    "posts": {
      "postId": "90",
      "title": "有什么值得一看的博客推荐？",
      "author": {
        "id": "PGM_CJ_T-n8sYC3RtAhpx",
        "attributes": {
          "avatarUrl": "https://avatars.githubusercontent.com/u/35548919",
          "userName": "崇家明",
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
      "createdAt": "2023-08-21 03:37:51",
      "lastCommentedAt": "2025-02-19 18:02:15",
      "commentsCount": 3,
      "likesCount": 16,
      "content": `# Markdown Editor

## Features
- Real-time rendering
- Code syntax highlighting
- Easy to use

## Code Example

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Table Example

| Name | Age | Occupation |
|------|-----|------------|
| John | 30  | Developer  |
| Jane | 25  | Designer   |


\`\`\`java
// We will receive an error from the Java compiler, before we run the program.
int a = 5;
int b;
if (a > 10) {
    b = 2;
} else {
    // b = 4;
}
b *= 3;
\`\`\`

`,
      "comments": [
        {
          "commentId": "3139334224466784",
          "author": {
            "id": "644e609b-9c71-430d-b6f1-73e0cb1f8d18",
            "attributes": {
              "avatarUrl": "https://avatars.githubusercontent.com/u/58953899",
              "userName": "fmnlj1.tml",
              "email": "v9bmdm.k7f@163.com"
            }
          },
          "content": "为了避免尴尬，楼主先来推荐几个`114514`",
          "createdAt": "2024-03-13 23:31:13",
          "likesCount": 3,
          "repliedID": null
        },
        {
          "commentId": "1544851306751334",
          "author": {
            "id": "6ddbb6b0-93d2-4452-9008-589152dc405e",
            "attributes": {
              "avatarUrl": "https://avatars.githubusercontent.com/u/90084971",
              "userName": "i1cuji.ju1",
              "email": "mawtue_too89@foxmail.com"
            }
          },
          "content": "当然是左耳朵耗子大叔的博客啦",
          "createdAt": "2025-02-10 18:16:49",
          "likesCount": 5,
          "repliedID": "3139334224466784"
        },
        {
          "commentId": "7864170224243326",
          "author": {
            "id": "893fcab4-500a-41c4-922d-44ba3a6bc164",
            "attributes": {
              "avatarUrl": "https://avatars.githubusercontent.com/u/22179789",
              "userName": "ixjlj1.glk",
              "email": "k8qscp14@yeah.net"
            }
          },
          "content": "做好这个决定以后，我就开始彻底躺平，把手里的几个项目草草收尾，赔了大几十万。等于这一年白忙活。好在还有一份工作收入。同时也拒掉了2个新的Offer。在疫情最困难的时候，还能拿到两个涨薪offer。我还是蛮佩服我自己的。但是为了不影响我的额外收入，加上现在工作不是很喜欢，也就一直犹豫不决。但是这次生病彻底让我下定了决定 ---- 算了。\n其实，经历这么多年，什么都看的很清楚，但是我的性格并不适合这个行业，我这个人最大的特点就是腰杆子硬，不喜欢向上管理，经常有人说我那么圆滑，肯定是老油条，而实际上，我整整18年的工作经历，只对领导说过一次违心的话，变相的夸了老板定制的开发模式，老板看着我笑了笑，也不知道他是不是听出来我这话是讽刺还是撒谎。\n而其余都是和老板对着干，只有2任老板是我比较钦佩的，也是配合最舒服的。而且共同特点都是百度出身，我特别喜欢百度系的老板。特别务实，认认真真做业务。不搞虚头巴脑的事情，更不在工作中弄虚作假。一个是滴滴的梁老板，另一个就是在途家时候的黄老板。\n",
          "createdAt": "2025-02-19 18:02:15",
          "likesCount": 1,
          "repliedID": null
        }
      ]
    }
  }
}

const post = ref({})
const comments = ref([])
post.value = res.data.posts;
comments.value = res.data.posts.comments

const editorRef = ref(null);

const scrollToEditor = () => {
  editorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  const editorElement = editorRef.value?.querySelector('#reply-editor .ProseMirror');
  if (editorElement) {
    editorElement.focus();
  }
}

const editorContent = ref('');
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
            <TiptapEditor id="reply-editor" v-model="editorContent" />
          </ClientOnly>
        </div>
      </article>

      <!-- 功能侧边栏 -->
      <div>
        <aside class="sidebar">
          <!-- position: sticky的外面还需包裹一层div才能生效 -->
          <div>
            <el-button type="primary" size="large" class="reply-btn" @click="scrollToEditor">
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

</template>

<style scoped>
html {
  scroll-behavior: smooth;
}

.container {
  min-height: 100vh;
  background-color: while;
  margin-top: 55px;
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
  background-color: #0250BB;
  border-color: #0250BB;
}

.sidebar .other-btn {
  width: 100%;
  margin-top: 1rem;
  height: 48px;
  font-size: 1rem;
  color: #666;
  background-color: white;
  border-color: #e5e7eb;
}

.sidebar .other-btn:hover {
  background-color: #f9fafb;
}
</style>