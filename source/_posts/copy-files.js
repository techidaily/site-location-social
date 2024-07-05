/**
 * 拷贝当前目录下的 task.js 文件到指定目录下的子目录中
 */

const fs = require('node:fs');

const rootDir = '/home/ian/workspace';

// 获得 rootDir 目录下的子目录，不包含子孙目录下的_config.yml 文件
const dirs = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

dirs.forEach((dir, index) => {
    const taskPath = `${rootDir}/${dir}/task.js`;

    if (fs.existsSync(taskPath)) {
        // 先删除
        fs.unlinkSync(taskPath);
    }

    // 覆盖已有文件
    fs.copyFileSync('./task.js', taskPath);
    console.log(`${index + 1}.拷贝 ${taskPath} 完成`)
});        
