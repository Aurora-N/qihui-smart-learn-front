# PNPM 迁移指南

## 迁移概述

已成功将项目从 npm 迁移到 pnpm。

## 迁移步骤

### 1. 检查 pnpm 安装

```bash
which pnpm || npm install -g pnpm
```

### 2. 删除 npm 相关文件

```bash
rm -rf package-lock.json node_modules
```

### 3. 使用 pnpm 安装依赖

```bash
pnpm install
```

### 4. 批准构建脚本

由于 pnpm 的安全机制，需要手动批准构建脚本，特别是原生模块：

```bash
pnpm approve-builds
```

选择需要构建的包（如 `better-sqlite3`）。

### 5. 创建 .npmrc 配置文件

创建了 `.npmrc` 文件优化 pnpm 配置：

- 启用 shamefully-hoist 提高兼容性
- 自动安装对等依赖项
- 启用 dedupe 减少磁盘空间使用
- 配置存储目录

### 6. 更新 .gitignore

添加了对其他包管理器 lock 文件的忽略：

- `package-lock.json`
- `yarn.lock`

## 迁移结果

✅ **成功项目**：

- 开发服务器正常启动（`pnpm dev`）
- 依赖安装正常
- 原生模块（better-sqlite3）编译成功
- 生成了 `pnpm-lock.yaml` 文件

⚠️ **注意事项**：

- 构建命令（`pnpm build`）存在代码语法错误，这与迁移无关，是原有代码问题
- 错误位于 `layouts/forum.vue` 第89行，Vue模板中的事件处理器语法问题

## pnpm 优势

1. **更快的安装速度**：使用符号链接和硬链接
2. **更少的磁盘空间**：全局存储，避免重复下载
3. **更严格的依赖管理**：防止幽灵依赖
4. **更好的monorepo支持**

## 常用 pnpm 命令

```bash
# 安装依赖
pnpm install

# 添加依赖
pnpm add <package>
pnpm add -D <package>

# 运行脚本
pnpm dev
pnpm build
pnpm test

# 更新依赖
pnpm update

# 清理缓存
pnpm store prune
```

## 迁移完成

项目已成功迁移到 pnpm，开发环境正常工作。构建问题需要修复代码中的语法错误，这与包管理器迁移无关。
