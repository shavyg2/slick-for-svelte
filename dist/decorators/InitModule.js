"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var application_1 = require("../application");
var history_1 = __importDefault(require("history"));
var constants_1 = require("../types/constants");
function InitModule(ModuleClass, options) {
    var container = Reflect.getMetadata(constants_1.MODULE, ModuleClass);
    var moduleConfig = Reflect.getMetadata(constants_1.MODULE_OPTIONS, ModuleClass);
    var h = options.history || history_1.default.createBrowserHistory();
    var framework = new application_1.SlickApp(container, moduleConfig, options.target || document.body, options.base, options.component404, h);
    return framework;
}
exports.InitModule = InitModule;
//# sourceMappingURL=InitModule.js.map