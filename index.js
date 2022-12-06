const fs = require('fs');

function getLink(dirs, dirLink) {
  return dirLink + dirs[dirLink].filter((f) => f.endsWith('.md'))[0].replace('.md', '.html');
}

function mdTitle(md) {
  let lines = md.split(/\r\n|\n/);
  for (let line of lines) {
    if (line.startsWith('# ')) {
      return line.slice(2).trim();
    }
  }
}
function stripExt(p) {
  return p.split('.').slice(0, -1).join('.');
}
function fileName(p) {
  return p.split('/').slice(-1)[0];
}

function getTitle(ROOT, fileLink) {
  // 读取文件对应的title(不管是不是md)，找不到则使用处理过的文件名
  let md = fs.readFileSync(ROOT + fileLink, 'utf-8');
  let title = mdTitle(md);
  if (title) return title;
  return stripExt(fileName(fileLink));
}

function getTarDir(dirLink, file) {
  //根据格式获取目标目录名
  return dirLink + stripExt(file).trim() + '/';
}

function walkDir(root, skip, f, path = '/') {
  let names = fs.readdirSync(root + path);
  let dirs = [], files = [];
  for (let n of names) {
    let p = root + path + n;  //目录下的文件(夹)路径
    let stats = fs.lstatSync(p);
    if (skip(stats, n)) continue;
    if (stats.isDirectory()) {
      dirs.push(n);
      walkDir(root, skip, f, path + n + '/');//path必定以"/"开头和结尾
    } else {
      files.push(n);
    }
  }
  f(root, path, dirs, files);
}



class AutoBar {
  constructor(config={}) {
    let {root,skip,index}={root:'docs', skip:/^[._]/, index:'index',...config}
    this.ROOT = root;//根目录
    this.SKIP = skip;//跳过以_或者.开头的文件和文件夹
    this.INDEX = index;//将不会把根目录下的index.md添加到导航栏和侧边栏
    this.dirs = this.getDirs();
  }
  getDirs() {
    let dirs = {};
    walkDir(this.ROOT,
      (stats, n) => this.SKIP.exec(n),
      (_, link, _0, files) => {
        // 生成对象，键是所有目录，值是目录下的文件名(排序好)
        // 保存到dirs
        dirs[link] = files.sort();
      },
    )
    return dirs
  }
  getNavbar() {
    let navbar = [];
    for (let file of this.dirs['/']) {
      let fileLink = '/' + file;
      if (stripExt(file) == this.INDEX
        || !file.endsWith('.md')) continue;
      navbar.push({
        text: getTitle(this.ROOT, fileLink),
        link: fileLink,
      });
    }
    return navbar
  }
  getSidebar() {
    let sidebar = {};
    let later = []
    for (let dirLink in this.dirs) {
      if (dirLink == '/') {
        // 对根目录的特殊处理
        continue;
      }
      if (!sidebar[dirLink]) {
        sidebar[dirLink] = [];
      }
      let files = this.dirs[dirLink];
      for (let file of files) {
        let fileLink = dirLink + file;

        let tarDir = getTarDir(dirLink, file);
        let tarFiles = this.dirs[tarDir];
        if (tarFiles) {
          // 如果有同名的文件夹，认为指向它，创建目录
          sidebar[dirLink].push({
            text: getTitle(this.ROOT, fileLink),//当做md文件获取文本，失败则获取文件名
            collapsible: file.endsWith('_'),// 如果以_结尾，则认为它需要折叠
            children: tarFiles.map((f) => {
              let fLink = tarDir + f;
              if (f.endsWith('.md')) return fLink;// 若是md文件，返回链接
              if (!f.endsWith('_')) return { text: getTitle(this.ROOT, fLink) };//若不可折叠
              return {//若可折叠
                text: getTitle(this.ROOT, fLink),
                collapsible: true,
                children: (() => {
                  let ret = [];
                  later.push(() => ret.splice(0, 0, ...sidebar[stripExt(fLink) + '/'].slice(1)))
                  return ret
                })(),
              };
            }),
            ...file.endsWith('.md') ? { link: fileLink } : {},//若是md文件，则增加link
          });
          // 并且往里面塞去上一级(本目录)的链接
          if (file.endsWith('.md')) {
            if (!sidebar[tarDir]) {
              sidebar[tarDir] = [];
            }
            sidebar[tarDir].splice(0, 0, {
              text: '../' + getTitle(this.ROOT, fileLink),
              link: fileLink
            });
          } else {
            sidebar[tarDir].splice(0, 0, {
              text: '../',
              link: getLink(this.dirs, dirLink),
            });
          }
        } else if (file.endsWith('.md')) {
          sidebar[dirLink].push(fileLink);
        }
      }
    }

    later.forEach(func => func());


    // 处理根目录
    for (let file of this.dirs['/']) {
      let baseDir = getTarDir('/', file);
      if (sidebar[baseDir]) {
        if (stripExt(file) === this.INDEX) continue;
        // 复制
        let bar = ['/' + file.replace('.md', '.html'), ...sidebar[baseDir]];
        sidebar[baseDir] = bar;
        sidebar['/' + stripExt(file) + '.html'] = bar;
      }
    }
    return sidebar
  }
}

module.exports = {AutoBar}