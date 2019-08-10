

export interface Guard{
    allow(...any:any[]):string|undefined|Promise<string|undefined>
}

export function Allow(...guards:Guard[]){
    return ()=>{
        
    }
}