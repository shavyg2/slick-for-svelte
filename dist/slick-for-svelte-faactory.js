"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InitModule_1 = require("./decorators/InitModule");
var SlickForSvelteFactory = /** @class */ (function () {
    function SlickForSvelteFactory() {
    }
    SlickForSvelteFactory.create = function (app, options) {
        var App = InitModule_1.InitModule(app, options);
        return App;
    };
    return SlickForSvelteFactory;
}());
exports.SlickForSvelteFactory = SlickForSvelteFactory;
