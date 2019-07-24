import isPromise from "is-promise";
import { MODULE, VIEW, PARAMETER } from "../types/constants";


export function CallInjectedView(target: any, key: string) {
    
    let method = target[key];
    let constructor = Object.getPrototypeOf(target).constructor;

    let container = Reflect.getMetadata(MODULE, constructor);
    let inject: any[] = Reflect.getMetadata(VIEW, constructor, key);

    const params = Reflect.getMetadata(PARAMETER,constructor,key);
    if(params){
        params.forEach(({index,identifier})=>{
            inject.splice(index,1,identifier)
        })
    }


    let dependencies = inject.map((i, index) => {
        if (container.isBound(i)) {
            return container.get(i);
        }
        else {
            throw new Error(`Can't resolve parameter [${index}] of ${constructor.name}:${key}`);
        }
    });
    if (dependencies.some(isPromise)) {
        return Promise.all(dependencies).then(args => {
            
            return method.apply(target, PerformParameterAction(args,params));
        });
    }
    else {
        
        return method.apply(target, PerformParameterAction(dependencies,params));
    }
}



export function PerformParameterAction(args:any[],actions:any[]){
    if(!actions){
        return args;
    }
    actions.forEach((transform)=>{
        let action = transform.action
        args.splice(transform.index,1,action(args[transform.index]))
    })

    return args;
}