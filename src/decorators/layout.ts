import { VIEW_LAYOUT } from "../types/constants";
export function layout<T extends Function>(layout: T) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(VIEW_LAYOUT, layout, target, key);
    };
}
