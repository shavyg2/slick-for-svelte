"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./types/constants");
var main_1 = require("./stores/main");
var route_parser_1 = __importDefault(require("route-parser"));
var url_join_1 = __importDefault(require("url-join"));
var CallInjectedView_1 = require("./framework/CallInjectedView");
var CallInjectedController_1 = require("./framework/CallInjectedController");
var query_string_1 = __importDefault(require("query-string"));
var promise_any_1 = __importDefault(require("promise-any"));
var SlickApp = (function () {
    function SlickApp(container, options, target, base, Component404, history) {
        this.container = container;
        this.options = options;
        this.target = target;
        this.base = base;
        this.Component404 = Component404;
        this.history = history;
    }
    SlickApp.prototype.Initialize = function () {
        var _this = this;
        var routeDetail = this.controllers.map(function (Controller) {
            return _this.getControllerRouteDetail(Controller);
        });
        var RouteNavigation = this.getViewNavigation(routeDetail);
        var UrlCompass = RouteNavigation.map(function (navigation) {
            var search = new route_parser_1.default(navigation.url);
            return [search, navigation];
        });
        var Application = new this.base({
            target: this.target,
            props: {
                URLSTORE: main_1.URLSTORE,
                PARAMSTORE: main_1.PARAMSTORE,
                QUERYSTORE: main_1.QUERYSTORE,
                viewProps: {}
            }
        });
        var match = -1;
        main_1.URLSTORE.subscribe(function (pageURL) { return __awaiter(_this, void 0, void 0, function () {
            var ViewActionDetail, controller, Controller, viewProps, templateProps_1, options_1, backup_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!match) return [3, 1];
                        Application.$set({
                            URLSTORE: main_1.URLSTORE,
                            PARAMSTORE: main_1.PARAMSTORE,
                            viewProps: {
                                NotFound: this.Component404
                            }
                        });
                        return [3, 3];
                    case 1:
                        if (!(match !== -1)) return [3, 3];
                        ViewActionDetail = match[1];
                        controller = ViewActionDetail.controller;
                        return [4, CallInjectedController_1.CallInjectedController(controller)];
                    case 2:
                        Controller = _a.sent();
                        viewProps = null;
                        try {
                            viewProps = Promise.resolve(CallInjectedView_1.CallInjectedView(Controller, ViewActionDetail.method));
                        }
                        catch (e) {
                            viewProps = Promise.resolve(Promise.reject(e));
                        }
                        templateProps_1 = {};
                        options_1 = Reflect.getMetadata(constants_1.INJECT_OPTIONS, ViewActionDetail.controller) || {};
                        if (options_1) {
                            if ("layout" in options_1) {
                                Object.assign(templateProps_1, { layout: options_1.layout });
                            }
                            if ("loading" in options_1) {
                                Object.assign(templateProps_1, { loading: options_1.loading });
                            }
                        }
                        if ("error" in options_1) {
                            Object.assign(templateProps_1, { error: options_1.error });
                        }
                        Object.assign(templateProps_1, {
                            URLSTORE: main_1.URLSTORE,
                            PARAMSTORE: main_1.PARAMSTORE
                        });
                        Object.assign(templateProps_1, { viewProps: viewProps });
                        backup_1 = Object.assign({}, templateProps_1);
                        promise_any_1.default([viewProps, new Promise(function (r) { return setTimeout(r, options_1.pause || 400); })])
                            .then(function () {
                            Application.$set(templateProps_1);
                        }).catch(function (e) {
                            Object.assign(backup_1, { viewProps: Promise.resolve(Promise.reject(e)) });
                            Application.$set(backup_1);
                        });
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        }); });
        this.history.listen(function (location, action) { return __awaiter(_this, void 0, void 0, function () {
            var pageURL, param;
            return __generator(this, function (_a) {
                pageURL = url_join_1.default(location.pathname, location.search, location.hash);
                main_1.QUERYSTORE.update(function () { return query_string_1.default.parse(location.search); });
                match = UrlCompass.find(function (_a) {
                    var route = _a[0];
                    param = route.match(pageURL);
                    return param;
                });
                main_1.PARAMSTORE.update(function () { return param; });
                main_1.URLSTORE.update(function () { return pageURL; });
                return [2];
            });
        }); });
        var init = url_join_1.default(window.location.pathname, window.location.search);
        this.history.push(init);
    };
    Object.defineProperty(SlickApp.prototype, "controllers", {
        get: function () {
            return (this.options.controllers || []).map(function (x) { return x; });
        },
        enumerable: true,
        configurable: true
    });
    SlickApp.prototype.getViewNavigation = function (routeDetail) {
        var controllerNavigation = routeDetail.map(function (controllerSettings) {
            var controller = controllerSettings.controller;
            var route = controllerSettings.controller_path;
            var routes = controllerSettings.view_detail.map(function (viewSettings) {
                if (!viewSettings) {
                    throw new Error("incorrect view settings, it should never be null");
                }
                var path = viewSettings.path;
                var method = viewSettings.method;
                return {
                    controller: controller,
                    method: method,
                    route: route,
                    path: path,
                    url: url_join_1.default(route, path)
                };
            });
            return routes;
        });
        var RouteNavigation = controllerNavigation.reduce(function (a, b) {
            return b ? a.concat(b) : a;
        }, []);
        return RouteNavigation;
    };
    SlickApp.prototype.getControllerRouteDetail = function (controller) {
        var controller_path = Reflect.getMetadata(constants_1.CONTROLLER_PATH, controller);
        var view_detail = Object.entries(controller.prototype)
            .map(function (_a) {
            var method = _a[0], value = _a[1];
            if (Reflect.hasMetadata(constants_1.VIEW_PATH, controller, method)) {
                var path = Reflect.getMetadata(constants_1.VIEW_PATH, controller, method);
                return {
                    path: path,
                    method: method
                };
            }
            else {
                return null;
            }
        })
            .filter(function (x) { return !!x; });
        var routeDetail = {
            controller: controller,
            controller_path: controller_path,
            view_detail: view_detail
        };
        return routeDetail;
    };
    return SlickApp;
}());
exports.SlickApp = SlickApp;
//# sourceMappingURL=application.js.map