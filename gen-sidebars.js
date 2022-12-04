import {dirs} from './dirs'
import {stripExt, getTitle} from './get-title'


var sidebar = {}


function getTarDir(dirLink, file){
  //根据格式获取目标目录名
  return dirLink + stripExt(file).trim()+'/';
}
function getLink(dirs, dirLink){
  return dirLink+dirs[dirLink].filter((f)=>f.endsWith('.md'))[0].replace('.md','.html')
}


for (let dirLink in dirs){
  if (dirLink=='/'){
    // 对根目录的特殊处理
    continue
  }
  if (!sidebar[dirLink]){
    sidebar[dirLink]=[]
  }
  let files = dirs[dirLink]
  for (let i in files){
    let file = files[i]
    let fileLink = dirLink+file

    let tarDir = getTarDir(dirLink,file)
    let tarFiles = dirs[tarDir]
    if (tarFiles){
      // 如果有同名的文件夹，认为指向它，创建目录
      sidebar[dirLink].push({
        text: getTitle(fileLink),//当做md文件获取文本，失败则获取文件名
        collapsible:file.endsWith('_'),// 如果以_结尾，则认为它需要折叠
        children:tarFiles.map((f)=>(tarDir+f)),
        ...file.endsWith('.md')?{link:fileLink}:{},//若是md文件，则增加link
      })
      // 并且往里面塞去上一级(本目录)的链接
      if (file.endsWith('.md')){
        if (!sidebar[tarDir]){
          sidebar[tarDir]=[]
        }
        sidebar[tarDir].splice(0,0,{
          text: '../'+getTitle(fileLink),
          link:fileLink
        })
      } else {
        sidebar[tarDir].splice(0,0,{
          text: '../',
          link: getLink(dirs, dirLink)
        })
      }
    } else if (file.endsWith('.md')){
      sidebar[dirLink].push(fileLink)
    }
  }
}

// 处理根目录
sidebar['/']=[
  '/',
  ...sidebar['/index/']
]
delete sidebar['/index/']

export {sidebar, dirs, getTitle}
