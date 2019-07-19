"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var constants_1 = require("../types/constants");
function Controller(path) {
    if (path === void 0) { path = "/"; }
    return function (constructor) {
        var inject = Reflect.getMetadata("design:paramtypes", constructor);
        Reflect.defineMetadata(constants_1.INJECT_CONSTRUCT, inject, constructor);
        Reflect.defineMetadata(constants_1.CONTROLLER_PATH, path, constructor);
        constructor = inversify_1.injectable()(constructor);
        Reflect.defineMetadata(constants_1.INJECT_CONSTRUCT, inject, constructor);
        Reflect.defineMetadata(constants_1.CONTROLLER_PATH, path, constructor);
        return constructor;
    };
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map