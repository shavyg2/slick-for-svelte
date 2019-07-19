"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../types/constants");
function View(path) {
    return function (target, key, descriptor) {
        var inject = Reflect.getMetadata("design:paramtypes", target, key);
        Reflect.defineMetadata(constants_1.VIEW, inject, target.constructor, key);
        Reflect.defineMetadata(constants_1.VIEW_PATH, path, target.constructor, key);
        return descriptor;
    };
}
exports.View = View;
//# sourceMappingURL=View.js.map