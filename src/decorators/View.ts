import { VIEW, VIEW_PATH, VIEW_COMPONENT } from "../types/constants";
export function View<T extends Function>(path: string,component:T) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        let inject = Reflect.getMetadata("design:paramtypes", target, key);
        Reflect.defineMetadata(VIEW, inject, target.constructor, key);
        Reflect.defineMetadata(VIEW_PATH, path, target.constructor, key);
        Reflect.defineMetadata(VIEW_COMPONENT, component, target.constructor, key);
        return descriptor;
    };
}
