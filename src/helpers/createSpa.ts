
import {History} from "history";
import urlJoin from "url-join";

import isAbsolute from "is-absolute-url";
import urlParser = require("url-parser");
export function createSpa(history:History){
    return (node:HTMLElement)=>{

        node.addEventListener("click",(e)=>{
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();


            let event:any = e;
            let target = event.target.nodeName==="A"? event.target:event.currentTarget.nodeName==="A" ? event.currentTarget:null;
            if(target){
                const link = target.getAttribute("href")
                if(link){
                    history.push(link);
                }
            }


        })
    }
}