/**
 * 更新所有子目录中的robots.txt文件，变更 sitemap.txt 为 sitemap.xml
 */

const fs = require('node:fs');

const rootDir = '/home/ian/workspace';

// 获得 rootDir 目录下的子目录，不包含子孙目录
const dirs = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

dirs.forEach((dir, index) => {
    const robotsFile = `${rootDir}/${dir}/source/robots.txt`;

    if (fs.existsSync(robotsFile)) {
        let content = fs.readFileSync(robotsFile, 'utf-8');
        content = content.replace('sitemap.txt', 'sitemap.xml');
        fs.writeFileSync(robotsFile, content);
        console.log(`${index + 1}.更新 ${robotsFile} 完成`);
    }
});     