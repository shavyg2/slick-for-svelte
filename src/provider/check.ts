
import isObject from "isobject";

export function IsProvider(provider:any){
    return (isObject(provider) && isObjectProvider(provider)) || IsConstructor(provider);
}

export function IsConstructor(provider:any){
    return isConstructor(provider);
}
export function isObjectProvider(provider:any){
    return [IsUseValue,IsUseFactory,IsUseClass].reduce((f,g)=>{
        return f || g(provider)
    },false) && 'provide' in provider;
}

export function IsUseValue(provider:any){
    return 'useValue' in provider;
}


export function IsUseFactory(provider:any){
    return 'useFactory' in provider;
}


export function IsUseClass(provider:any){
    return 'useClass' in provider;
}


export function IsDefined(value:any){
    return value!==undefined || value!==null || value!==void 0;
}


export function isConstructor(symbol:any) {
    return notUndefined(symbol) &&
        symbol instanceof Function &&
        symbol.constructor &&
        symbol.constructor instanceof Function &&
        notUndefined(new symbol) &&
        Object.getPrototypeOf(symbol) !== Object.prototype &&
        symbol.constructor !== Object &&
        symbol.prototype.hasOwnProperty('constructor');
}
export function notUndefined(item:any) {
    return item != undefined && item != 'undefined';
}