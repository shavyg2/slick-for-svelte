import "reflect-metadata";
import {JSDOM} from "jsdom"




const {window} = new JSDOM(`
    <html>
        <body/>
    </html>
`,{
    url:"http://localhost/"
})


export const document = window.document

global["window"] = window;

let {setTimeout,...browserApi} = window;
Object.assign(global,browserApi);


export function select(querySelector:string,element:any=document){
    const root:typeof document = element as any;
    return root.querySelector(querySelector)
}