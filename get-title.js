const fs = require('fs')
const {ROOT} = require('./const');


function mdTitle(md){
  let lines = md.split(/\r\n|\n/);
  for (let line of lines){
    if (line.startsWith('# ')){
      return line.slice(2).trim();
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
  let md = fs.readFileSync(ROOT+fileLink,'utf-8');
  let title = mdTitle(md);
  if (title) return title;
  return stripExt(fileName(fileLink));
}

function getTarDir(dirLink, file){
  //根据格式获取目标目录名
  return dirLink + stripExt(file).trim()+'/';
}

module.exports = {stripExt, getTitle, getTarDir}