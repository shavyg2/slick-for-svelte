
import {History} from "history";
import {get} from "svelte/store";

import { historyStore } from "../stores/history";

export function spa(node:HTMLElement){
    node.addEventListener("click",(e)=>{
        let history = get(historyStore)
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