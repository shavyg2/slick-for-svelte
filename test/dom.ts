import "reflect-metadata";
import {JSDOM} from "jsdom"


const {window} = new JSDOM(`
    <html>
        <body/>
    </html>
`,{
    url:"http://localhost"
})


export const document = window.document

global["document"] = document
global["window"] = window;

//Object.assign(global,window);