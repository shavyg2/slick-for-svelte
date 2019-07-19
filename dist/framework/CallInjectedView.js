"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var is_promise_1 = __importDefault(require("is-promise"));
var constants_1 = require("../types/constants");
function CallInjectedView(target, key) {
    var method = target[key];
    var constructor = Object.getPrototypeOf(target).constructor;
    var container = Reflect.getMetadata(constants_1.MODULE, constructor);
    var inject = Reflect.getMetadata(constants_1.VIEW, constructor, key);
    var dependencies = inject.map(function (i, index) {
        if (container.isBound(i)) {
            return container.get(i);
        }
        else {
            throw new Error("Can't resolve parameter [" + index + "] of " + constructor.name + ":" + key);
        }
    });
    if (dependencies.some(is_promise_1.default)) {
        return Promise.all(dependencies).then(function (args) {
            return method.apply(target, args);
        });
    }
    else {
        return method.apply(target, dependencies);
    }
}
exports.CallInjectedView = CallInjectedView;
//# sourceMappingURL=CallInjectedView.js.map