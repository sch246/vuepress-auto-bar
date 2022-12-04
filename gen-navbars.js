const {INDEX} = require('./const');
const {dirs} = require('./dirs');
const {getTitle, stripExt} = require('./get-title');

let navbar = [];

for (let file of dirs['/']){
    let fileLink = '/'+file;
    if (stripExt(file)==INDEX
        || !file.endsWith('.md')) continue;
    navbar.push({
        text:getTitle(fileLink),
        link:fileLink,
    });
}

module.exports = {navbar}