import { INJECT_OPTIONS } from "../types/constants";
import { ScopeOptions } from "../types/ControllerOptions";
import { SCOPE } from "../container/Provider";
import { Design } from "../container/builder/design";

export function Injectable(options:ScopeOptions = {scope:SCOPE.Singleton}){
    return constructor=>{
        Reflect.defineMetadata(INJECT_OPTIONS,options,constructor);
        Reflect.defineMetadata(Design.Constructor,Reflect.getMetadata(Design.Parameters,constructor),constructor);
    }
}

