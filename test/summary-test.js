import { strict as assert } from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 控制台颜色
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.blue}==========================================${colors.reset}`);
console.log(`${colors.magenta}      论坛页面 (Forum Index) 测试套件      ${colors.reset}`);
console.log(`${colors.blue}==========================================${colors.reset}\n`);

// 读取index.vue文件内容
const indexVuePath = path.join(__dirname, '../pages/forum/index.vue');
const indexVueContent = fs.readFileSync(indexVuePath, 'utf8');

// 进行测试的工具函数
function runTest(name, testFn) {
  try {
    testFn();
    console.log(`${colors.green}✓ 通过: ${name}${colors.reset}`);
    return true;
  } catch (err) {
    console.log(`${colors.red}✗ 失败: ${name}${colors.reset}`);
    console.log(`  ${colors.yellow}错误: ${err.message}${colors.reset}`);
    return false;
  }
}

// 测试组：文件结构检查
console.log(`\n${colors.blue}[测试组] 文件结构检查${colors.reset}`);

let passed = 0;
let total = 0;

// 测试1: 检查文件是否存在
total++;
passed += runTest('文件存在检查', () => {
  assert.strictEqual(fs.existsSync(indexVuePath), true);
});

// 测试2: 检查基本文件结构
total++;
passed += runTest('基本文件结构', () => {
  assert.strictEqual(indexVueContent.includes('<script setup>'), true);
  assert.strictEqual(indexVueContent.includes('<template>'), true);
  assert.strictEqual(indexVueContent.includes('<style scoped>'), true);
});

// 测试组：脚本检查
console.log(`\n${colors.blue}[测试组] 脚本功能检查${colors.reset}`);

// 测试3: 检查导入语句
total++;
passed += runTest('导入语句检查', () => {
  assert.strictEqual(indexVueContent.includes('import { ChevronDown'), true);
});

// 测试4: 检查状态管理
total++;
passed += runTest('状态管理检查', () => {
  assert.strictEqual(indexVueContent.includes('dropdowns = ref({'), true);
  assert.strictEqual(indexVueContent.includes('const toggleDropdown = (name)'), true);
});

// 测试5: 检查topics数据结构
total++;
passed += runTest('话题数据结构检查', () => {
  const scriptPart = indexVueContent.split('<script setup>')[1].split('</script>')[0];
  
  // 验证topics是一个ref对象
  assert.strictEqual(scriptPart.includes('topics = ref(['), true);
  
  // 验证话题的属性
  assert.strictEqual(scriptPart.includes('id:'), true);
  assert.strictEqual(scriptPart.includes('title:'), true);
  assert.strictEqual(scriptPart.includes('author:'), true);
  assert.strictEqual(scriptPart.includes('replyTime:'), true);
  assert.strictEqual(scriptPart.includes('avatar:'), true);
  assert.strictEqual(scriptPart.includes('tags:'), true);
  assert.strictEqual(scriptPart.includes('replyCount:'), true);
  
  // 验证有4个话题
  const topicEntries = scriptPart.match(/id: \d+/g);
  assert.strictEqual(topicEntries.length, 4);
  
  // 验证话题标题
  assert.strictEqual(scriptPart.includes('如何成为全栈高手'), true);
  assert.strictEqual(scriptPart.includes('寻找Rust学习伙伴'), true);
  assert.strictEqual(scriptPart.includes('我的 2024 - 稳中求进、热爱生活'), true);
  assert.strictEqual(scriptPart.includes('如何拥抱AI'), true);
});

// 测试6: 检查页面元数据
total++;
passed += runTest('页面元数据检查', () => {
  assert.strictEqual(indexVueContent.includes('definePageMeta'), true);
  assert.strictEqual(indexVueContent.includes('layout: \'forum\''), true);
});

// 测试7: 检查挂载生命周期
total++;
passed += runTest('生命周期函数检查', () => {
  assert.strictEqual(indexVueContent.includes('onMounted'), true);
  assert.strictEqual(indexVueContent.includes('bannerConfig.value ='), true);
});

// 测试组：模板检查
console.log(`\n${colors.blue}[测试组] 模板结构检查${colors.reset}`);

// 提取模板部分，先打印整个文件内容的一部分
console.log(`\n${colors.yellow}完整文件的一部分:${colors.reset}`);
console.log(indexVueContent.substring(0, 200) + '...');

// 尝试使用正则表达式提取模板内容
const templateMatch = indexVueContent.match(/<template>([\s\S]*?)<\/template>/);
const templatePart = templateMatch ? templateMatch[1] : '';

console.log(`\n${colors.yellow}提取的模板部分（正则匹配结果）:${colors.reset}`);
console.log(templatePart.substring(0, 300) + '...');

// 使用简单的字符串提取尝试获取模板部分
let simpleTemplatePart = '';
if (indexVueContent.includes('<template>') && indexVueContent.includes('</template>')) {
  const startIndex = indexVueContent.indexOf('<template>') + '<template>'.length;
  const endIndex = indexVueContent.indexOf('</template>');
  if (startIndex < endIndex) {
    simpleTemplatePart = indexVueContent.substring(startIndex, endIndex);
    console.log(`\n${colors.yellow}简单字符串提取结果:${colors.reset}`);
    console.log(simpleTemplatePart.substring(0, 300) + '...');
  }
}

// 使用简单的测试方法，直接检查原始文件中是否包含所需内容
// 测试8: 检查主要布局结构
total++;
passed += runTest('主要布局结构检查 (使用完整文件内容)', () => {
  assert.strictEqual(indexVueContent.includes('class="main-content"'), true, '应包含main-content类');
  assert.strictEqual(indexVueContent.includes('class="content-header"'), true, '应包含content-header类');
  assert.strictEqual(indexVueContent.includes('class="topics-list"'), true, '应包含topics-list类');
});

// 测试9: 检查组件和指令
total++;
passed += runTest('组件和指令检查 (使用完整文件内容)', () => {
  // 检查组件使用
  assert.strictEqual(indexVueContent.includes('NuxtLink'), true, '应包含NuxtLink组件');
  assert.strictEqual(indexVueContent.includes('Dropdown'), true, '应包含Dropdown组件');
  
  // 检查指令使用
  assert.strictEqual(indexVueContent.includes('v-for="topic in topics"'), true, '应包含topics循环');
  assert.strictEqual(indexVueContent.includes(':key="topic.id"'), true, '应包含key绑定');
  assert.strictEqual(indexVueContent.includes('@click="toggleDropdown'), true, '应包含click事件绑定');
});

// 测试10: 检查样式引入
total++;
passed += runTest('样式引入检查', () => {
  const stylePart = indexVueContent.split('<style scoped>')[1].split('</style>')[0];
  
  assert.strictEqual(stylePart.includes('@import url('), true);
  assert.strictEqual(stylePart.includes('forum_interface.css'), true);
});

// 打印测试摘要
console.log(`\n${colors.blue}==========================================${colors.reset}`);
console.log(`${colors.magenta}              测试摘要                  ${colors.reset}`);
console.log(`${colors.blue}==========================================${colors.reset}`);
console.log(`${colors.magenta}总测试数: ${total}${colors.reset}`);
console.log(`${colors.green}通过数: ${passed}${colors.reset}`);

if (passed < total) {
  console.log(`${colors.red}失败数: ${total - passed}${colors.reset}`);
} else {
  console.log(`${colors.green}所有测试通过！🎉${colors.reset}`);
}

// 返回测试状态码
process.exit(passed === total ? 0 : 1); 