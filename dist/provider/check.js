"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var isobject_1 = __importDefault(require("isobject"));
function IsProvider(provider) {
    return (isobject_1.default(provider) && isObjectProvider(provider)) || IsConstructor(provider);
}
exports.IsProvider = IsProvider;
function IsConstructor(provider) {
    return isConstructor(provider);
}
exports.IsConstructor = IsConstructor;
function isObjectProvider(provider) {
    return [IsUseValue, IsUseFactory, IsUseClass].reduce(function (f, g) {
        return f || g(provider);
    }, false) && 'provide' in provider;
}
exports.isObjectProvider = isObjectProvider;
function IsUseValue(provider) {
    return 'useValue' in provider;
}
exports.IsUseValue = IsUseValue;
function IsUseFactory(provider) {
    return 'useFactory' in provider;
}
exports.IsUseFactory = IsUseFactory;
function IsUseClass(provider) {
    return 'useClass' in provider;
}
exports.IsUseClass = IsUseClass;
function IsDefined(value) {
    return value !== undefined || value !== null || value !== void 0;
}
exports.IsDefined = IsDefined;
function isConstructor(symbol) {
    return notUndefined(symbol) &&
        symbol instanceof Function &&
        symbol.constructor &&
        symbol.constructor instanceof Function &&
        notUndefined(new symbol) &&
        Object.getPrototypeOf(symbol) !== Object.prototype &&
        symbol.constructor !== Object &&
        symbol.prototype.hasOwnProperty('constructor');
}
exports.isConstructor = isConstructor;
function notUndefined(item) {
    return item != undefined && item != 'undefined';
}
exports.notUndefined = notUndefined;
//# sourceMappingURL=check.js.map