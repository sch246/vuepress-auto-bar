const root = 'docs';
const SKIP_MATCH = /^[._]/;  //跳过以_或者.开头的文件和文件夹

const {sidebar} = require('./gen-sidebars');
const {navbar} = require('./gen-navbars');

export {root, SKIP_MATCH, sidebar, navbar};
