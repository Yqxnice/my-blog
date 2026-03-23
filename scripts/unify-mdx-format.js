/**
 * 功能：统一MDX文件格式
 * 目的：统一所有.mdx文件的排版格式，确保一致的样式
 * 作者：Yqxnice
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, '../content');

// 读取目录中的所有文件
const files = fs.readdirSync(contentDir);

// 筛选出所有 .mdx 文件
const mdxFiles = files.filter(file => file.endsWith('.mdx'));

console.log(`找到 ${mdxFiles.length} 个 .mdx 文件，开始统一排版格式...`);

// 遍历所有 .mdx 文件并统一格式
mdxFiles.forEach(file => {
  const filePath = path.join(contentDir, file);
  
  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 解析 frontmatter
    const { data, content } = matter(fileContent);
    
    // 确保 frontmatter 字段完整
    const requiredFields = ['title', 'date', 'excerpt', 'tags', 'readTime'];
    requiredFields.forEach(field => {
      if (!data[field]) {
        console.warn(`警告: 文件 ${file} 缺少 ${field} 字段`);
      }
    });
    
    // 统一内容格式
    let unifiedContent = content
      // 确保标题后有空行
      .replace(/(#+\s+[^\n]+)(\n[^\n])/g, '$1\n\n$2')
      // 确保段落间有一个空行
      .replace(/\n{3,}/g, '\n\n')
      // 确保列表前有空行
      .replace(/(\n[^-*\s])(\n[-*])/g, '$1\n\n$2')
      // 确保代码块前后有空行
      .replace(/(\n[^`])(\n```)/g, '$1\n\n$2')
      .replace(/(```\n)([^`])/g, '$1\n$2');
    
    // 重新组合文件内容
    const newContent = matter.stringify(unifiedContent, data);
    
    // 写回文件
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ 已统一格式: ${file}`);
  } catch (error) {
    console.error(`✗ 统一格式失败: ${file}`, error);
  }
});

console.log('\n格式统一完成！');
