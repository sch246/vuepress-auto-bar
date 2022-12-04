const {INDEX} = require('./const');
const {dirs} = require('./dirs');
const {stripExt, getTitle, getTarDir} = require('./get-title');




function getLink(dirs, dirLink){
  return dirLink+dirs[dirLink].filter((f)=>f.endsWith('.md'))[0].replace('.md','.html');
}

var sidebar = {};

let later = []

for (let dirLink in dirs){
  if (dirLink=='/'){
    // 对根目录的特殊处理
    continue;
  }
  if (!sidebar[dirLink]){
    sidebar[dirLink]=[];
  }
  let files = dirs[dirLink];
  for (let file of files){
    let fileLink = dirLink+file;

    let tarDir = getTarDir(dirLink,file);
    let tarFiles = dirs[tarDir];
    if (tarFiles){
      // 如果有同名的文件夹，认为指向它，创建目录
      sidebar[dirLink].push({
        text: getTitle(fileLink),//当做md文件获取文本，失败则获取文件名
        collapsible:file.endsWith('_'),// 如果以_结尾，则认为它需要折叠
        children:tarFiles.map((f)=>{
          let fLink = tarDir+f;
          if (f.endsWith('.md')) return fLink;// 若是md文件，返回链接
          if (!f.endsWith('_')) return {text:getTitle(fLink)};//若不可折叠
          return {//若可折叠
            text: getTitle(fLink),
            collapsible:true,
            children:(()=>{
              let ret = [];
              later.push(()=>ret.splice(0,0,...sidebar[stripExt(fLink)+'/'].slice(1)))
              return ret
            })(),
          };
        }),
        ...file.endsWith('.md')?{link:fileLink}:{},//若是md文件，则增加link
      });
      // 并且往里面塞去上一级(本目录)的链接
      if (file.endsWith('.md')){
        if (!sidebar[tarDir]){
          sidebar[tarDir]=[];
        }
        sidebar[tarDir].splice(0,0,{
          text: '../'+getTitle(fileLink),
          link:fileLink
        });
      } else {
        sidebar[tarDir].splice(0,0,{
          text: '../',
          link: getLink(dirs, dirLink),
        });
      }
    } else if (file.endsWith('.md')){
      sidebar[dirLink].push(fileLink);
    }
  }
}

later.forEach(func => func());


// 处理根目录
for (let file of dirs['/']){
  let baseDir = getTarDir('/', file);
  if (sidebar[baseDir]){
    if (stripExt(file)===INDEX){
      sidebar['/'] = ['/',...sidebar['/'+INDEX+'/']];
      delete sidebar['/'+INDEX+'/'];
    } else{
      let baseLink = baseDir.slice(0,-1);// 保证它自身也能被包括进去
      sidebar[baseLink] = ['/'+file.replace('.md','.html'), ...sidebar[baseDir]];
      delete sidebar[baseDir];
    }
  }
}

module.exports = {sidebar}