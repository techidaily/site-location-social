/**
 * 顺序执行指定目录下的子目录中的task.js文件，忽略每个文件执行的错误
 */

const fs = require('node:fs');

const rootDir = '/home/ian/workspace';

// 获得 rootDir 目录下的子目录，不包含子孙目录下的_config.yml 文件
const dirs = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

dirs.forEach((dir,index) => {
    const taskPath = `${rootDir}/${dir}/task.js`;

    const taskNo = index + 1;
    const loseTasksInfo = `还剩余 ${dirs.length - index - 1} 个任务`;

    try {
        require(taskPath);
        console.log(`执行 ${taskNo}.${taskPath} 完成, ${loseTasksInfo}`)
    } catch (e) {
        console.error(`执行 ${taskNo}.${taskPath} 失败, ${loseTasksInfo}`)
        console.error(e);
    }
});    
