# 多模态知识图谱展示学习网站

## 项目简介
一个知识图谱学习平台，整合文章、视频等多模态学习资源，提供用户注册、论坛互动、知识图谱可视化学习等功能，帮助用户提升学习的系统性和交互性。

### 技术栈
- 框架层: `Nuxt 3`、`Vue 3`
- 状态管理: `Pinia`
- 本地文章渲染: `Nuxt Content`
- 知识图谱结点展示: `D3.js`
- 网络请求: `Axios`
- 组件库: `Element Plus`
- XSS sanitizer: `DOMPurify`
- 代码高亮: `shiki`
- Markdown解析: `markdown-it`
- RSA加密: `JSEncrypt`
- 代码质量: `ESLint` + `Prettier`

### 项目功能
- 知识图谱展示
- 用户注册登陆
- 论坛互动：发帖、回帖、点赞、收藏
- Markdown文章渲染（放入`/content`文件夹）
- Markdown格式发帖编辑器
- 响应式设计
- 夜间模式

### 未来计划
**技术方面**
- [ ] 自动生成文章列表，替代目前的手工维护
- [ ] 优化文章索引功能
- [ ] 拆分大组件成为独立composable
- [ ] 逐步引入`TypeScript`支持，在此过程中提高代码的规范性与质量
- [ ] 重新规划数据流
- [ ] 重构`Sass`样式代码
- [ ] 优化接口的请求与缓存机制
- [ ] 修复偶发的异常水合问题
- [ ] 引入`cypress` E2E测试

**产品功能方面**
- 文章相关
  - [ ] 文章内部也引入知识图谱
  - [ ] 实现推荐文章功能
  - [ ] 优化目录的显示
  - [ ] 用户笔记功能
- 论坛与用户相关
  - [ ] 登录注册校验
  - [ ] 支持用户上传图片，而不是使用链接
  - [ ] 引入关注与粉丝系统
  - [ ] 个性化相关
- 知识评测相关
  - [ ] 保留用户做题进度
  - [ ] 支持回看答题内容

---
# 项目启动文档

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install
pnpm approve-builds
  - choose better-sqlite3

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
