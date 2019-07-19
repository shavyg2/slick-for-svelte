"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var constants_1 = require("../types/constants");
function Injectable() {
    return function (constructor) {
        constructor = inversify_1.injectable()(constructor) || constructor;
        Reflect.defineMetadata(constants_1.SERVICE, true, constructor);
        return constructor;
    };
}
exports.Injectable = Injectable;
//# sourceMappingURL=Injectable.js.map