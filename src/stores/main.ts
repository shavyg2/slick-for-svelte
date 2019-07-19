import {writable} from "svelte/store"


export const PARAMSTORE = writable({} as any);
export const URLSTORE = writable("");
export const QUERYSTORE = writable({} as any);


export const CurrentParameter = {
    value:null as any
}


PARAMSTORE.subscribe(value=>{
    CurrentParameter.value=value;
})


export const CurrentURL = {
    value:""
}

URLSTORE.subscribe(value=>{
    CurrentURL.value=value;
})

export const CurrentQuery = {
    value:{} as any
}


QUERYSTORE.subscribe(value=>{
    CurrentQuery.value=value;
})