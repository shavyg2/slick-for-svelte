import { PARAMETER } from "../types/constants";
import { ParamService, QueryService, HistoryService } from "../provider/providerName";

export function Inject(identifier:any,action=x=>x){
    return (target,method,parameterIndex)=>{
        target = method? target.constructor: target;
        let params = (method ? Reflect.getMetadata(PARAMETER,target,method):Reflect.getMetadata(PARAMETER,target)) || []
        params.push({
            index:parameterIndex,
            identifier,
            action
        })
        if(method){
            Reflect.defineMetadata(PARAMETER,params,target,method);
        }else{
            Reflect.defineMetadata(PARAMETER,params,target);
        }
    }
}

export function Param(name?:string){
    return Inject(ParamService,(x)=>name?x[name]:x)
}


export function Query(name?:string){
    return Inject(QueryService,(x)=>name?x[name]:x)
}


export function History(name?:string){
    return Inject(HistoryService)
}
