"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../types/constants");
var Provider_1 = require("../container/Provider");
var design_1 = require("../container/builder/design");
function Injectable(options) {
    if (options === void 0) { options = { scope: Provider_1.SCOPE.Singleton }; }
    return function (constructor) {
        Reflect.defineMetadata(constants_1.INJECT_OPTIONS, options, constructor);
        Reflect.defineMetadata(design_1.Design.Constructor, Reflect.getMetadata(design_1.Design.Parameters, constructor), constructor);
    };
}
exports.Injectable = Injectable;
//# sourceMappingURL=Injectable.js.map