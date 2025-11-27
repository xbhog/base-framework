const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * 深度合并两个对象
 */
function deepMerge(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key]) && isObject(target[key])) {
        target[key] = deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }

  return target;
}

/**
 * 检查值是否为对象
 */
function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 构建消息文件
 */
async function buildMessages() {
  const messagesDir = path.join(__dirname, '..', 'src', 'messages');
  const outputDir = path.join(__dirname, '..', 'public', 'messages');

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 获取所有语言目录
    const localeDirs = fs.readdirSync(messagesDir)
      .filter(dir => fs.statSync(path.join(messagesDir, dir)).isDirectory());

    for (const locale of localeDirs) {
      console.log(`正在构建 ${locale} 语言的消息文件...`);
      
      const localeDir = path.join(messagesDir, locale);
      const pattern = path.join(localeDir, '**', '*.json').replace(/\\/g, '/');
      
      const files = await glob(pattern);
      let allMessages = {};

      for (const file of files) {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          const messages = JSON.parse(content);
          
          // 构建命名空间路径
          const relativePath = path.relative(localeDir, file);
          const namespace = relativePath
            .replace(/\.json$/, '')
            .split(path.sep)
            .join('.');
          
          // 将消息嵌套到命名空间中
          const namespacedMessages = namespace.split('.').reduceRight((acc, key) => ({
            [key]: acc
          }), messages);

          allMessages = deepMerge(allMessages, namespacedMessages);
        } catch (error) {
          console.error(`处理文件 ${file} 时出错:`, error);
          if (error instanceof SyntaxError) {
            console.error(`JSON解析错误，请检查文件格式: ${file}`);
          }
        }
      }

      // 写入合并后的消息文件
      const outputPath = path.join(outputDir, `${locale}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(allMessages, null, 2));
      console.log(`✅ ${locale} 语言的消息文件已生成: ${outputPath}`);
    }

    console.log('🎉 所有消息文件构建完成！');
  } catch (error) {
    console.error('构建消息文件时出错:', error);
    process.exit(1);
  }
}

// 运行构建
buildMessages();