"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../types/constants");
function Controller(path, options) {
    if (path === void 0) { path = "/"; }
    return function (constructor) {
        Reflect.defineMetadata(constants_1.CONTROLLER_PATH, path, constructor);
        if (options) {
            Reflect.defineMetadata(constants_1.INJECT_OPTIONS, options, constructor);
        }
        return constructor;
    };
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map