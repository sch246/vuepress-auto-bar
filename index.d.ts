import {SidebarConfigObject, NavbarConfig} from 'vuepress'
// declare var sidebar:SidebarConfigObject
// declare var navbar:NavbarConfig
// declare var init:(root:string, skip:RegExp, index:string)=>void

// declare class AutoBar:(root:string, skip:RegExp, index:string)=>{getNavbar:()=>NavbarConfig, getSidebar:()=>SidebarConfigObject}

declare class AutoBar{
    constructor ({root='docs', skip=/^[._]/, index='index'}?)
    getNavbar:()=>NavbarConfig
    getSidebar:()=>SidebarConfigObject
}

export {AutoBar}
