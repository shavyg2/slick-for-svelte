import { Class } from "utility-types";
import { injectable } from "inversify";
import { INJECT_CONSTRUCT, CONTROLLER_PATH, INJECT_OPTIONS } from "../types/constants";
import { ControllerOptions } from "../types/ControllerOptions";


export function Controller(path: string = "/",options?:ControllerOptions) {
    path = path === ""? "/":path
    return (constructor: Class<any>) => {
        Reflect.defineMetadata(CONTROLLER_PATH, path, constructor);
        if(options){
            Reflect.defineMetadata(INJECT_OPTIONS,options,constructor);
        }
        return constructor;
    };
}


