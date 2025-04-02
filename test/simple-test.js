// 简单的测试文件，用于测试基本功能
import { strict as assert } from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('开始运行简单测试...');

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试1: 检查forum文件夹是否存在
try {
  const forumDirExists = fs.existsSync(path.join(__dirname, '../pages/forum'));
  assert.strictEqual(forumDirExists, true, 'pages/forum目录应该存在');
  console.log('✅ 测试通过: forum目录存在');
} catch (err) {
  console.error('❌ 测试失败:', err.message);
}

// 测试2: 检查forum/index.vue文件是否存在
try {
  const indexFileExists = fs.existsSync(path.join(__dirname, '../pages/forum/index.vue'));
  assert.strictEqual(indexFileExists, true, 'pages/forum/index.vue文件应该存在');
  console.log('✅ 测试通过: forum/index.vue文件存在');
} catch (err) {
  console.error('❌ 测试失败:', err.message);
}

// 测试3: 检查文件内容是否包含关键组件
try {
  const fileContent = fs.readFileSync(path.join(__dirname, '../pages/forum/index.vue'), 'utf8');
  assert.strictEqual(fileContent.includes('<main class="main-content">'), true, '文件应该包含main-content类');
  assert.strictEqual(fileContent.includes('<div class="topics-list">'), true, '文件应该包含topics-list类');
  assert.strictEqual(fileContent.includes('topics = ref('), true, '文件应该包含topics数据定义');
  console.log('✅ 测试通过: forum/index.vue文件内容包含必要组件');
} catch (err) {
  console.error('❌ 测试失败:', err.message);
}

// 测试4: 检查文件内容中是否有4个话题定义
try {
  const fileContent = fs.readFileSync(path.join(__dirname, '../pages/forum/index.vue'), 'utf8');
  const matches = fileContent.match(/id: \d+/g);
  assert.strictEqual(matches && matches.length, 4, '应该定义了4个话题');
  console.log('✅ 测试通过: forum/index.vue文件包含4个话题定义');
} catch (err) {
  console.error('❌ 测试失败:', err.message);
}

console.log('简单测试完成!'); 