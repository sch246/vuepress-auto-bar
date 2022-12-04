const fs = require('fs');
const {ROOT, SKIP} = require('./const');

// 递归遍历文件夹，对其下文件排序


// type skip = (stats:fs.Stats,n:string)=>any
// type f = (root:string,path:string,dirs:string[],files:string[])=>any

function walkDir(root, skip, f, path='/'){
  let names = fs.readdirSync(root + path);
  let dirs = [], files = [];
  for (let n of names){
    let p = root + path + n;    //目录下的文件(夹)路径
    let stats = fs.lstatSync(p);
    if (skip(stats, n)) continue;
    if (stats.isDirectory()){
      dirs.push(n);
      walkDir(root, skip, f, path+n+'/');//path必定以"/"开头和结尾
    } else {
      files.push(n);
    }
  }
  f(root, path, dirs, files);
}



var dirs = {};

walkDir(ROOT,
  (stats, n)=>SKIP.exec(n),
  (_, link, _0, files)=>{
    // 生成对象，键是所有目录，值是目录下的文件名(排序好)
    // 保存到dirs
    dirs[link] = files.sort();
  },
)
module.exports = {dirs}