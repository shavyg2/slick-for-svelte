import { Class } from "utility-types";
import { injectable } from "inversify";
import { SERVICE } from "../types/constants";
export function Injectable() {
    return (constructor: Class<any>) => {
        constructor = injectable()(constructor) || constructor;
        Reflect.defineMetadata(SERVICE, true, constructor);
        return constructor;
    };
}
