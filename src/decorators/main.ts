
import "reflect-metadata";
import {Class} from "utility-types";
import {injectable,Container} from "inversify";
import * as check from "../provider/check";
import isPromise from "is-promise";
import { FrontEndSvelte } from "../application";
import history from "history";

export const SERVICE = Symbol.for("service");

export const CONTROLLER = Symbol.for("controller");
export const CONTROLLER_PATH = Symbol.for("controller_path");


export const VIEW = Symbol.for("view");
export const VIEW_PATH = Symbol.for("view_path");

export const INJECT_CONSTRUCT = Symbol.for("inject");


export const MODULE_OPTIONS = Symbol.for("module-options");

export const MODULE = Symbol.for("module");

export const PARENT_MODULE = Symbol.for("parent_module");


export function Injectable(){
    return (constructor:Class<any>)=>{
        constructor = injectable()(constructor) || constructor;
        Reflect.defineMetadata(SERVICE,true,constructor);
        return constructor;
    }
}


export interface IModuleConfig {
    import?:any[];
    provider?:any[];
    controllers?:any[];
}


export function Module(config:IModuleConfig){
    return (constructor:Class<any>)=>{
        var container = new Container({defaultScope:'Singleton'});

        //TODO add module to children


        Reflect.defineMetadata(MODULE_OPTIONS,config,constructor)
        Reflect.defineMetadata(MODULE,container,constructor);
        if(config.controllers){
            config.controllers.forEach(controller=>{
                Reflect.defineMetadata(MODULE,container,controller);
                container.bind(controller).toSelf();
            })
        }

        if(config.provider){
            config.provider.forEach(provider=>{
                if(check.IsProvider(provider)){
                    if(check.isObjectProvider(provider)){
                        if(check.IsUseClass(provider)){
                            container.bind(provider.provide).to(provider.useClass)
                        }else if(check.IsUseValue(provider)){
                            container.bind(provider.provide).toConstantValue(provider.useValue)
                        }else if (check.IsUseFactory(provider)){
                            let factory = provider.useFactory;
                            let inject:any[] = provider.inject || [];

                            container.bind(provider.provide).toFactory(context=>{
                                return ()=>{
                                    const container = context.container;
                                    let dependencies = inject.map((key,index)=>{
                                        if(!container.isBound(key)){
                                            throw new Error(`container does not know how to create ${factory.name} at index [${index}]`)
                                        }else{
                                            return container.get(key)
                                        }
                                    })


                                    if(dependencies.some(isPromise)){
                                        return Promise.all(dependencies.map(x=>Promise.resolve(x))).then(args=>{
                                            return factory(...args);
                                        })
                                    }else{
                                        return factory(...dependencies)
                                    }
                                }
                            })
                        }
                    }else if(check.IsConstructor(provider)){    
                        container.bind(provider).toSelf();
                    }else{
                        throw new Error("incorrectly provided provider");
                    }
                }
            })
        }
        return constructor;
    }
}


export function Controller(path:string="/"){
    return (constructor:Class<any>)=>{
        
        let inject = Reflect.getMetadata("design:paramtypes",constructor);
        
        Reflect.defineMetadata(INJECT_CONSTRUCT,inject,constructor);
        Reflect.defineMetadata(CONTROLLER_PATH,path,constructor);
        
        constructor = injectable()(constructor);
        
        Reflect.defineMetadata(INJECT_CONSTRUCT,inject,constructor);
        Reflect.defineMetadata(CONTROLLER_PATH,path,constructor);
        
        return constructor;
    }
}


export function View(path:string){
    return (target:any,key:string,descriptor:PropertyDescriptor)=>{

        let inject = Reflect.getMetadata("design:paramtypes",target,key);
    
        Reflect.defineMetadata(VIEW,inject,target,key);
        Reflect.defineMetadata(VIEW_PATH,path,target,key);     
        
        return descriptor;
    }
}



export interface ModuleInitOptions {
    target?:HTMLElement;
    component:any;
    history:history.History;
}

export function InitModule(ModuleClass:any,options:ModuleInitOptions){
    const container =  Reflect.getMetadata(MODULE,ModuleClass)
    const moduleConfig =  Reflect.getMetadata(MODULE_OPTIONS,ModuleClass);
    const h = options.history || history.createBrowserHistory();

    new FrontEndSvelte(container,moduleConfig,h)
}


export function CallInjectedView(target:any,key:string){
        let method = target[key];

        let constructor = Object.getPrototypeOf(target).constructor
        let container = Reflect.getMetadata(MODULE,constructor);
        let inject:any[] = Reflect.getMetadata(VIEW,target,key);

        let dependencies = inject.map((i,index)=>{
            if(container.isBound(i)){
                container.get(i)
            }else{
                throw new Error(`Can't resolve parameter [${index}] of ${constructor.name}:${key}`)
            }
        })

        if(dependencies.some(isPromise)){
            return Promise.all(dependencies).then(args=>{
                return method.apply(target,args)
            })
        }else{
            return method.apply(target,dependencies)
        }
}


