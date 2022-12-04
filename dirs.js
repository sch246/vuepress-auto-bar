// var fs = require("fs");
import * as fs from "fs";
const {root, SKIP_MATCH} = require('./index')

// 递归遍历文件夹，对其下文件排序


// type skip = (stats:fs.Stats,n:string)=>any
// type f = (root:string,path:string,dirs:string[],files:string[])=>any

function walkDir(root, skip, f, path='/'){
  let names = fs.readdirSync(root + path);
  let dirs = [], files = [];
  for (let i in names){let n = names[i];
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

walkDir(root,
  (stats, n)=>SKIP_MATCH.exec(n),
  (_, link, _0, files)=>{
    // 生成对象，键是所有目录，值是目录下的文件名(排序好)
    // 保存到dirs
    dirs[link] = files.sort();
  },
)


export {dirs, walkDir};

