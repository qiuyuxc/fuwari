import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { glob } from "glob";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置：Python 上传脚本的绝对路径
const UPLOADER_SCRIPT = "C:\\Users\\af\\Documents\\GitHub\\bilibili-img-uploader\\bili_img_uploader.py";
const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

// 检查上传脚本是否存在
if (!fs.existsSync(UPLOADER_SCRIPT)) {
    console.error(`❌ 找不到上传脚本: ${UPLOADER_SCRIPT}`);
    process.exit(1);
}

/**
 * 获取所有 markdown 文件
 */
async function getAllMarkdownFiles() {
    const pattern = path.join(POSTS_DIR, "**/*.md").replace(/\\/g, "/");
    return await glob(pattern);
}

/**
 * 执行上传
 * @param {string} imagePath 图片绝对路径
 * @returns {string|null} 上传后的 URL 或 null
 */
function uploadImage(imagePath) {
    try {
        console.log(`  🚀 正在上传: ${path.basename(imagePath)}`);
        // 构建命令
        const command = `python "${UPLOADER_SCRIPT}" "${imagePath}"`;
        // 执行并获取输出
        const output = execSync(command, { encoding: 'utf-8' });
        
        // 解析输出
        // 假设输出中最后一行是 URL，或者包含 http 的行
        const lines = output.trim().split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
                return trimmed;
            }
        }
        
        console.warn(`  ⚠️  无法从输出中解析 URL: ${output}`);
        return null;
    } catch (error) {
        console.error(`  ❌ 上传失败: ${error.message}`);
        return null;
    }
}

/**
 * 处理单个 Markdown 文件
 */
async function processMarkdownFile(filePath) {
    let content = fs.readFileSync(filePath, "utf-8");
    let hasChanges = false;
    let changedCount = 0;
    
    // 存储需要替换的映射: { originalPath: newUrl }
    const replacements = new Map();

    // 辅助函数：处理发现的图片路径
    const handlePath = (rawPath) => {
        // 忽略网络图片
        if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
            return;
        }
        // 忽略绝对路径（除非它指向项目内，暂不支持）
        if (rawPath.startsWith('/')) {
            return;
        }

        // 解析绝对路径
        const markdownDir = path.dirname(filePath);
        let absolutePath;
        try {
            // 解码 URL (处理 %20)
            const decodedPath = decodeURIComponent(rawPath);
            absolutePath = path.resolve(markdownDir, decodedPath);
        } catch (e) {
            return;
        }

        // 检查文件是否存在
        if (fs.existsSync(absolutePath)) {
            // 避免重复上传
            if (!replacements.has(rawPath)) {
                const newUrl = uploadImage(absolutePath);
                if (newUrl) {
                    replacements.set(rawPath, newUrl);
                    console.log(`  ✅ 上传成功: ${newUrl}`);
                }
            }
        } else {
            console.warn(`  ⚠️  本地文件不存在: ${absolutePath}`);
        }
    };

    // 1. 处理 YAML frontmatter 中的 image 字段
    const yamlImageRegex = /^image:\s*(?:['"]([^'"]+)['"]|([^\s\n]+))/m;
    const yamlMatch = yamlImageRegex.exec(content);
    if (yamlMatch) {
        const imagePath = yamlMatch[1] || yamlMatch[2];
        if (imagePath) handlePath(imagePath);
    }

    // 2. 处理 Markdown 图片语法 ![alt](url)
    const markdownImageRegex = /!\[.*?\]\(((?:[^()]+|\([^()]*\))+)\)/g;
    let match;
    while ((match = markdownImageRegex.exec(content)) !== null) {
        const url = match[1];
        // 去除可能的 title 部分
        const titleMatch = url.match(/^(\S+)\s+["'].*["']$/);
        const cleanUrl = titleMatch ? titleMatch[1] : url;
        handlePath(cleanUrl);
    }

    // 3. 处理 HTML img 标签
    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((match = htmlImageRegex.exec(content)) !== null) {
        handlePath(match[1]);
    }

    // 执行替换
    if (replacements.size > 0) {
        for (const [original, newUrl] of replacements) {
            // 全局替换
            // 注意：要转义正则特殊字符
            const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedOriginal, 'g');
            
            if (content.match(regex)) {
                content = content.replace(regex, newUrl);
                hasChanges = true;
                changedCount++;
            }
        }
    }

    if (hasChanges) {
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`💾 已更新文件: ${path.relative(process.cwd(), filePath)} (替换了 ${changedCount} 张图片)`);
    }
}

async function main() {
    console.log("🔍 开始扫描 Markdown 文件并上传本地图片到 Bilibili...");
    
    const files = await getAllMarkdownFiles();
    console.log(`📄 找到 ${files.length} 个 Markdown 文件`);

    for (const file of files) {
        // console.log(`检查: ${path.relative(process.cwd(), file)}`);
        await processMarkdownFile(file);
    }
    
    console.log("✅ 全部处理完成！");
}

main().catch(err => {
    console.error("❌ 发生错误:", err);
    process.exit(1);
});
