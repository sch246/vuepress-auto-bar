# Vuepress Auto Bar

## 注意

这并不是一个完整的 VuePress 插件

需要配合 VuePress 的默认主题插件使用

## 安装

大概就是一般的安装方法

```
yarn add vuepress-auto-bar
```

## 使用方式

在`.vuepress/config.ts`写下如下内容

```ts
//...
import {AutoBar} from "vuepress-auto-bar";
let bar = new AutoBar()
//...
export default defineUserConfig({
  //...
  theme: defaultTheme({
    //...
    navbar: bar.getNavbar(),
    sidebar: bar.getSidebar(),
    //...
  }),
});
```

这已经可以使用了

在启动 Vuepress 时，它会检测`docs`下的目录并且生成对应的导航栏和侧边栏

如有需要，可以指定一些基本值，以下是默认值

```ts
//...
import AutoBar from 'vuepress-auto-bar';
let bar = new AutoBar({
  root:'docs',//根目录
  skip:/^[._]/,//跳过以_或者.开头的文件和文件夹
  index:'index',//将不会把根目录下的index.md添加到导航栏和侧边栏
})
//...
export default defineUserConfig({
  //...
});
```

没有任何其它设置，但是需要你保持一定的目录结构

基本规则:

- 记`docs`为根目录
- 按照字符串顺序排序(使用默认的sort方法)
  - 这意味着编辑器内是什么顺序侧边栏就是什么顺序
  - 为了贯彻这一点，侧边栏内每一项都对应文件而非目录
    - 其显示文字默认读取标题(`# 这样`)，后缀不是`.md`也无所谓
    - 若读不到，取文件名
- 如果想在侧边栏显示子目录内容，需设置一个同名文件，后缀随便
  - 目录内容会缩进显示在原文件位置下方
  - 当文件后缀不是`.md`时，文件仅作为文字显示，不能点击
  - 当文件后缀为`._`时，目录将折叠
  - 若不对应目录且不是 md，文件不会显示
    - 若想仅显示字样，可以对应空目录
- `.`或`_`开头以隐藏文件或目录
- 侧边栏只显示本目录和子目录的文件
  - 除非它是折叠的，那么展开后可以显示更多级
  - 若上级有目录同名文件，会显示在侧边栏首项用于返回上一级
    - 若上级没有目录同名文件则不会显示
    - 根目录的文件会复制同名目录的侧边栏，所以看上去不会跳转
- 补充：`index.md`不例外，它会定位到同级的`index`目录
- 对于根目录
  - 默认不会生成侧边栏
  - 除`docs/index.md`外，若存在同名目录，则会添加到导航栏并复制侧边栏

```
└─ docs
   ├─ name1
   │  ├─name11
   │  │  ├─name111
   │  │  │  └─name1111.md
   │  │  └─name111.md
   │  ├─name12
   │  │  └─name121.md
   │  ├─name11.md
   │  └─name12.md
   ├─ name2
   │  ├─name22
   │  │  └─name211.md
   │  ├─name21.md
   │  ├─name22.md
   │  └─name23.md
   ├─ index
   │  └─www.md
   ├─ name1.md
   ├─ name2.md
   └─ index.md
```

以上是一个例子，它有2个导航栏

实际显示会取其中的标题，为了方便，这里都用名字本身来指代

name1 和 name2 会出现在导航栏，若点击 name1，侧边栏会显示如下

```
name1
name11
    name111
name12
    name121
```

每一项都是可以点击的，若点击 name11，会打开 name11，侧边栏并不会切换

若点击 name111，会打开 name111 并切换到对应的侧边栏

```
../name11
name111
    name1111
```

再点击 ../name11 会打开 name11 并返回到原来的侧边栏

同理，如果点击导航栏中的 name2

```
name2
name21
name22
    name211
name23
```

## 使用例

### 设置根目录是`/`而非`/docs/`

```ts
//...
import AutoBar from 'vuepress-auto-bar';
let bar = new AutoBar({
  root:'.',
  skip:/^([._])|(node_modules)/,//跳过node_modules
  index:'README',//主页为README.md
})
//...
export default defineUserConfig({
  //...
});
```

### 反转blog的侧边栏

假设`/docs/blogs/`目录用于存放博客

且`/docs/blogs.md`作为导航栏的项指向了它

由于用了日期命名所以希望倒序

```ts
//...
import {AutoBar} from "vuepress-auto-bar";
let bar = new AutoBar()

let sidebars = bar.getSidebar()
let blogs = sidebars['/blogs/']
blogs.unshift(blogs.reverse().pop()??'')
//...
export default defineUserConfig({
  //...
  theme: defaultTheme({
    //...
    navbar: bar.getNavbar(),
    sidebar: sidebars,
    //...
  }),
});
```