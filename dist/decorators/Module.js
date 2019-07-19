"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var is_promise_1 = __importDefault(require("is-promise"));
var constants_1 = require("../types/constants");
var check = __importStar(require("../provider/check"));
function Module(config) {
    return function (constructor) {
        var container = new inversify_1.Container({ defaultScope: 'Singleton' });
        Reflect.defineMetadata(constants_1.MODULE_OPTIONS, config, constructor);
        Reflect.defineMetadata(constants_1.MODULE, container, constructor);
        if (config.controllers) {
            config.controllers.forEach(function (controller) {
                Reflect.defineMetadata(constants_1.MODULE, container, controller);
                container.bind(controller).toSelf();
            });
        }
        if (config.provider) {
            config.provider.forEach(function (provider) {
                if (check.IsProvider(provider)) {
                    if (check.isObjectProvider(provider)) {
                        if (check.IsUseClass(provider)) {
                            container.bind(provider.provide).to(provider.useClass);
                        }
                        else if (check.IsUseValue(provider)) {
                            container.bind(provider.provide).toConstantValue(provider.useValue);
                        }
                        else if (check.IsUseFactory(provider)) {
                            var factory_1 = provider.useFactory;
                            var inject_1 = provider.inject || [];
                            container.bind(provider.provide).toFactory(function (context) {
                                return function () {
                                    var container = context.container;
                                    var dependencies = inject_1.map(function (key, index) {
                                        if (!container.isBound(key)) {
                                            throw new Error("container does not know how to create " + factory_1.name + " at index [" + index + "]");
                                        }
                                        else {
                                            return container.get(key);
                                        }
                                    });
                                    if (dependencies.some(is_promise_1.default)) {
                                        return Promise.all(dependencies.map(function (x) { return Promise.resolve(x); })).then(function (args) {
                                            return factory_1.apply(void 0, args);
                                        });
                                    }
                                    else {
                                        return factory_1.apply(void 0, dependencies);
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
exports.Module = Module;
//# sourceMappingURL=Module.js.map