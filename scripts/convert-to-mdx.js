/**
 * 功能：MD文件转换为MDX文件
 * 目的：将content目录下的.md文件转换为.mdx格式
 * 作者：Yqxnice
 */
const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content');

// 读取目录中的所有文件
const files = fs.readdirSync(contentDir);

// 筛选出所有 .md 文件
const mdFiles = files.filter(file => file.endsWith('.md'));

console.log(`找到 ${mdFiles.length} 个 .md 文件，开始转换为 .mdx 格式...`);

// 遍历所有 .md 文件并转换
mdFiles.forEach(file => {
  const oldPath = path.join(contentDir, file);
  const newPath = path.join(contentDir, file.replace('.md', '.mdx'));
  
  try {
    // 重命名文件
    fs.renameSync(oldPath, newPath);
    console.log(`✓ 已转换: ${file} → ${file.replace('.md', '.mdx')}`);
  } catch (error) {
    console.error(`✗ 转换失败: ${file}`, error);
  }
});

console.log('\n转换完成！');
