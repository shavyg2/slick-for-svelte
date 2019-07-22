"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../types/constants");
var check = __importStar(require("../provider/check"));
var ContainerBuilder_1 = require("../container/config/ContainerBuilder");
function Module(config) {
    return function (constructor) {
        var builder = new ContainerBuilder_1.ContainerBuilder();
        var container = ContainerBuilder_1.ContainerBuilder.getContainer(builder);
        Reflect.defineMetadata(constants_1.MODULE_OPTIONS, config, constructor);
        Reflect.defineMetadata(constants_1.MODULE, container, constructor);
        if (config.controllers) {
            config.controllers.forEach(function (controller) {
                Reflect.defineMetadata(constants_1.MODULE, container, controller);
                builder.add(controller);
            });
        }
        if (config.provider) {
            config.provider.forEach(function (provider) {
                if (check.IsProvider(provider)) {
                    if (check.isObjectProvider(provider)) {
                        if (check.IsUseClass(provider)) {
                            builder.bind(provider.provide);
                        }
                        else if (check.IsUseValue(provider)) {
                            builder.bind(provider.provide);
                        }
                        else if (check.IsUseFactory(provider)) {
                            builder.bind(provider.provide);
                        }
                    }
                    else if (check.IsConstructor(provider)) {
                        builder.bind(provider);
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