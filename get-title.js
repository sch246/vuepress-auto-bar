import * as fs from "fs";
const {root} = require('./index')

function mdTitle(md){
  let lines = md.split(/\r\n|\n/);
  let inMeta=lines[0].startsWith('---');
  for (let i in lines){
    let line = lines[i]
    if (parseInt(i)>0&&line.startsWith('---'))inMeta = false;
    if (inMeta || !line.trim()){ //如果在元数据内或者是空行
      continue;
    } else if (line.startsWith('# ')){
      return line.slice(2).trim();
    } else {
      break;
    }
  }
}
function stripExt(p){
  return p.split('.').slice(0,-1).join('.');
}
function fileName(p){
  return p.split('/').slice(-1)[0];
}
function getTitle(fileLink){
  // 读取文件对应的title(不管是不是md)，找不到则使用处理过的文件名
  let md = fs.readFileSync(root+fileLink,'utf-8');
  let title = mdTitle(md);
  if (title) return title;
  return stripExt(fileName(fileLink));
}

export {stripExt, getTitle};