const fs = require('fs') 
const path = require('path') 

// 读取测试 mdx 文件 
const mdxPath = path.join(__dirname, 'content', 'blogs', 'test-features.mdx') 
const content = fs.readFileSync(mdxPath, 'utf8') 

/** 
  正则规则： 
  - 匹配 ( 内部的所有非空白、非 ) 字符 
  - 只要是链接格式，不管带不带参数，都完整提取 
  真正解决你丢失 ? & = 后面内容的问题 
 */ 
const linkRegex = /\((https?:\/\/[^\s)]+)\)/g 

let match 
const links = [] 

while ((match = linkRegex.exec(content)) !== null) { 
  const fullLink = match[1] 
  links.push(fullLink) 
} 

console.log('✅ 提取到的所有链接：\n') 
console.log(links) 
console.log(`\n总计：${links.length} 个链接`)