import {dirs} from './dirs'
import {getTitle} from './get-title'

let navbar = []

for (let file of dirs['/docs/']){
    let fileLink = '/docs/'+file
    navbar.push({
        text:getTitle(fileLink),
        link:fileLink
    })
}

export {navbar}