import { VIEW, VIEW_PATH } from "../types/constants";
export function View(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        let inject = Reflect.getMetadata("design:paramtypes", target, key);
        Reflect.defineMetadata(VIEW, inject, target.constructor, key);
        Reflect.defineMetadata(VIEW_PATH, path, target.constructor, key);
        return descriptor;
    };
}
