import { LAYOUT_PROP } from "../types/constants";
import is from "@sindresorhus/is";


export function LayoutProps(target, method:string, decorator){
    if(!method){
        throw new Error("LayoutProps can only be used on a method")
    }
    target = method ? target.constructor: target;

    const method_name:string = Reflect.getMetadata(LAYOUT_PROP,target)
    if(!is.nullOrUndefined(method_name)){
        throw new Error("LayoutProps can only be used once per a class")
    }

    Reflect.defineMetadata(LAYOUT_PROP,method,target)
}