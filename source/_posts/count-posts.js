
/**
 * 统计每个目录下面的文件数量
 **/ 

const fs = require('node:fs');
const { execSync } = require('child_process');

const rootDir = '/home/ian/workspace';

// 获得 rootDir 目录下的子目录，不包含子孙目录
const dirs = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

let total = 0;
    
dirs.forEach((dir, index) => {
    const postsDir = `${rootDir}/${dir}/source/_posts`;

    if (fs.existsSync(postsDir)) {
        const out = execSync(`ls -l | grep "^-" | wc -l`, {cwd: postsDir})
        console.log(`${index + 1}. ${dir} 目录下的文件数量为: ${out.toString().trim()}`);

        try {
            total += parseInt(out.toString().trim());
        }catch(e){}
    }
});   

console.log(`共计: ${total} 个文章`)