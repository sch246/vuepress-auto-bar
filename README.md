# Vuepress Auto Bar

## 注意

这并不是一个完整的 VuePress 插件

需要配合 VuePress 的默认主题插件使用

## 使用方式



在`.vuepress/config.ts`写下如下内容

```ts
//...
import {navbar, sidebar} from 'vuepress-auto-bar'
//...
export default defineUserConfig({
  //...
  theme: defaultTheme({
    //...
    navbar: navbar,
    sidebar: sidebar,
    //...
  }),
});
```