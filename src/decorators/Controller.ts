
import {  CONTROLLER_PATH, INJECT_OPTIONS, PARAMETER } from "../types/constants";
import { ControllerOptions } from "../types/ControllerOptions";
import { Design } from "../container/builder/design";


export function Controller(path: string = "/",options:ControllerOptions={}) {
    path = path === ""? "/":path
    return (constructor: any) => {
        Reflect.defineMetadata(CONTROLLER_PATH, path, constructor);
        if(options){
            Reflect.defineMetadata(INJECT_OPTIONS,options,constructor);
        }

        let inject = Reflect.getMetadata(Design.Parameters,constructor) || [];


        inject = inject.map((x,index)=>{
            return {
                index,
                identifier:x
            }
        })

        //Reflect.defineMetadata(PARAMETER,inject,constructor);
        return constructor;
    };
}


