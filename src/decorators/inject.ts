import { PARAMETER } from "../types/constants";




export function Inject(identifier:any){
    return (target,method,parameterIndex)=>{
       
        target = method? target.constructor: target;
        let params = Reflect.getMetadata(PARAMETER,target,method) || []
        params.push({
            index:parameterIndex,
            identifier
        })
        Reflect.defineMetadata(PARAMETER,params,target,method);
    }
}