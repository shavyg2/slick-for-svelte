import { Class } from "utility-types";
import { Container } from "inversify";
import isPromise from "is-promise";
import { IModuleConfig } from "../types/IModuleConfig";
import { MODULE_OPTIONS, MODULE } from "../types/constants";
import * as check from "../provider/check";
export function Module(config: IModuleConfig) {
    return (constructor: Class<any>) => {
        var container = new Container({ defaultScope: 'Singleton' });
        //TODO add module to children
        Reflect.defineMetadata(MODULE_OPTIONS, config, constructor);
        Reflect.defineMetadata(MODULE, container, constructor);
        if (config.controllers) {
            config.controllers.forEach(controller => {
                Reflect.defineMetadata(MODULE, container, controller);
                container.bind(controller).toSelf();
            });
        }
        if (config.provider) {
            config.provider.forEach(provider => {
                if (check.IsProvider(provider)) {
                    if (check.isObjectProvider(provider)) {
                        if (check.IsUseClass(provider)) {
                            container.bind(provider.provide).to(provider.useClass);
                        }
                        else if (check.IsUseValue(provider)) {
                            container.bind(provider.provide).toConstantValue(provider.useValue);
                        }
                        else if (check.IsUseFactory(provider)) {
                            let factory = provider.useFactory;
                            let inject: any[] = provider.inject || [];
                            container.bind(provider.provide).toFactory(context => {
                                return () => {
                                    const container = context.container;
                                    let dependencies = inject.map((key, index) => {
                                        if (!container.isBound(key)) {
                                            throw new Error(`container does not know how to create ${factory.name} at index [${index}]`);
                                        }
                                        else {
                                            return container.get(key);
                                        }
                                    });
                                    if (dependencies.some(isPromise)) {
                                        return Promise.all(dependencies.map(x => Promise.resolve(x))).then(args => {
                                            return factory(...args);
                                        });
                                    }
                                    else {
                                        return factory(...dependencies);
                                    }
                                };
                            });
                        }
                    }
                    else if (check.IsConstructor(provider)) {
                        container.bind(provider).toSelf();
                    }
                    else {
                        throw new Error("incorrectly provided provider");
                    }
                }
            });
        }
        return constructor;
    };
}
