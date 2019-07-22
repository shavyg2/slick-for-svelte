"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var InitModule_1 = require("./decorators/InitModule");
__export(require("./decorators"));
__export(require("./stores/main"));
__export(require("./helpers/createSpa"));
var SlickForSvelteFactory = (function () {
    function SlickForSvelteFactory() {
    }
    SlickForSvelteFactory.create = function (app, options) {
        var App = InitModule_1.InitModule(app, options);
        return App;
    };
    return SlickForSvelteFactory;
}());
exports.SlickForSvelteFactory = SlickForSvelteFactory;
//# sourceMappingURL=slick-for-svelte-factory.js.map