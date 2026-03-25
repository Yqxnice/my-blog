/**
 * 功能：预计算博客字数并写入文件
 * 目的：为所有博客文章计算字数和阅读时间，并更新到frontmatter中
 * 作者：Yqxnice
 */
// 预计算博客字数并写入文件
const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content', 'blogs');

/**
 * 统计字数（去除markdown标记）
 */
function countWords(content) {
  // 去除markdown标记
  const plainText = content
    .replace(/[#*`\[\]()]/g, '')
    .replace(/\n/g, ' ')
    .trim();
  
  // 统计英文单词（通过空格分割）
  const englishWords = plainText
    .split(/\s+/)  
    .filter(word => /^[a-zA-Z]+$/.test(word))
    .length;
  
  // 统计中文字符（包括中文、日文、韩文等）
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
  
  // 统计数字
  const numbers = (plainText.match(/\b\d+\b/g) || []).length;
  
  // 总字数 = 英文单词数 + 中文字符数 + 数字数
  return englishWords + chineseChars + numbers;
}

/**
 * 计算阅读时间（分钟）
 * @param {number} wordCount - 字数
 * @returns {string} 阅读时间，格式为 "X min"
 */
function calculateReadTime(wordCount) {
  // 平均阅读速度：300字/分钟（中英文混合）
  const wordsPerMinute = 300;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

/**
 * 从内容中提取frontmatter和正文
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    return {
      frontmatter: match[1],
      content: match[2]
    };
  }
  return {
    frontmatter: '',
    content: content
  };
}

/**
 * 更新或添加wordCount和readTime到frontmatter
 */
function updateFrontmatter(frontmatter, wordCount) {
  const lines = frontmatter.split('\n');
  let hasWordCount = false;
  let hasReadTime = false;
  const readTime = calculateReadTime(wordCount);
  
  const updatedLines = lines.map(line => {
    if (line.startsWith('wordCount:')) {
      hasWordCount = true;
      return `wordCount: ${wordCount}`;
    }
    if (line.startsWith('readTime:')) {
      hasReadTime = true;
      return `readTime: ${readTime}`;
    }
    return line;
  });
  
  if (!hasWordCount) {
    updatedLines.push(`wordCount: ${wordCount}`);
  }
  
  if (!hasReadTime) {
    updatedLines.push(`readTime: ${readTime}`);
  }
  
  return updatedLines.join('\n');
}

/**
 * 处理单个博客文件
 */
function processBlogFile(file) {
  try {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const { frontmatter, content } = parseFrontmatter(fileContent);
    const wordCount = countWords(content);
    const readTime = calculateReadTime(wordCount);
    
    const updatedFrontmatter = updateFrontmatter(frontmatter, wordCount);
    const updatedContent = `---\n${updatedFrontmatter}\n---\n${content}`;
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✓ Updated word count and read time for ${file}: ${wordCount} words, ${readTime}`);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error);
  }
}

/**
 * 主函数
 */
function main() {
  console.log('Precomputing word counts for all blog posts...');
  console.log('============================================');
  
  try {
    const files = fs.readdirSync(contentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    console.log(`Found ${markdownFiles.length} blog files to process`);
    console.log('--------------------------------------------');
    
    markdownFiles.forEach(processBlogFile);
    
    console.log('--------------------------------------------');
    console.log('✓ All blog posts have been updated with word counts');
  } catch (error) {
    console.error('✗ Error processing blog files:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
