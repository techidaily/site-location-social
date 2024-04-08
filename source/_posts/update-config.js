/**
 * 更新所有给定的目录下的_config.yml 的内容
 **/

const fs = require('node:fs');

const rootDir = '/home/ian/workspace';

// 获得 rootDir 目录下的子目录，不包含子孙目录下的_config.yml 文件
const dirs = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

dirs.forEach(dir => {
    const configPath = `${rootDir}/${dir}/_config.yml`;
    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8');
        const findContent = [
            `# SiteMap`,
            `sitemap:`,
            `  path:`, 
            `    - sitemap.txt`,
        ].join('\n');
        
        const withContent = [
            `# SiteMap`,
            `sitemap:`,
            `  path:`,
            `    - sitemap.txt`,
            `    - sitemap.xml`,
        ].join('\n');
        const newContent = content.replaceAll(findContent, withContent);

        fs.writeFileSync(configPath, newContent);

        console.log(`更新 ${configPath} 完成`)
    }
});


