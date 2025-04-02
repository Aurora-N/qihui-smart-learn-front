import { strict as assert } from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('开始运行DOM测试...');

// 读取index.vue文件内容
const indexVuePath = path.join(__dirname, '../pages/forum/index.vue');
const indexVueContent = fs.readFileSync(indexVuePath, 'utf8');

// 输出文件的完整内容以便调试
console.log('文件完整内容:');
console.log(indexVueContent);

// 提取模板部分
const templateMatch = indexVueContent.match(/<template>([\s\S]*?)<\/template>/);
const template = templateMatch ? templateMatch[1] : '';

console.log('\n\n提取的模板内容:');
console.log(template);

// 仅执行主要测试
try {
  // 从script部分提取话题数据
  const scriptMatch = indexVueContent.match(/<script.*?>([\s\S]*?)<\/script>/);
  const script = scriptMatch ? scriptMatch[1] : '';
  
  // 检查topics数组定义
  const topicsMatch = script.match(/topics\s*=\s*ref\(\[([\s\S]*?)\]\)/);
  const topicsData = topicsMatch ? topicsMatch[1] : '';
  
  // 简单检查是否包含关键话题标题
  assert.strictEqual(topicsData.includes('如何成为全栈高手'), true, '应该包含第一个话题标题');
  assert.strictEqual(topicsData.includes('寻找Rust学习伙伴'), true, '应该包含第二个话题标题');
  
  console.log('✅ 测试通过: 话题数据正确');
} catch (err) {
  console.error('❌ 测试失败:', err.message);
}

console.log('测试完成!'); 