"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("svelte/store");
exports.PARAMSTORE = store_1.writable({});
exports.URLSTORE = store_1.writable("");
exports.QUERYSTORE = store_1.writable({});
exports.CurrentParameter = {
    value: null
};
exports.PARAMSTORE.subscribe(function (value) {
    exports.CurrentParameter.value = value;
});
exports.CurrentURL = {
    value: ""
};
exports.URLSTORE.subscribe(function (value) {
    exports.CurrentURL.value = value;
});
exports.CurrentQuery = {
    value: {}
};
exports.QUERYSTORE.subscribe(function (value) {
    exports.CurrentQuery.value = value;
});
//# sourceMappingURL=main.js.map