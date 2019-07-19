import { Class } from "utility-types";
import { injectable } from "inversify";
import { INJECT_CONSTRUCT, CONTROLLER_PATH } from "../types/constants";
export function Controller(path: string = "/") {
    return (constructor: Class<any>) => {
        let inject = Reflect.getMetadata("design:paramtypes", constructor);
        Reflect.defineMetadata(INJECT_CONSTRUCT, inject, constructor);
        Reflect.defineMetadata(CONTROLLER_PATH, path, constructor);
        constructor = injectable()(constructor);
        Reflect.defineMetadata(INJECT_CONSTRUCT, inject, constructor);
        Reflect.defineMetadata(CONTROLLER_PATH, path, constructor);
        return constructor;
    };
}
