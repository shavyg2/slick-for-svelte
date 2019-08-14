import {
  CONTROLLER_PATH,
  VIEW_PATH,
  INJECT_OPTIONS,
  VIEW_COMPONENT
} from "./types/constants";
import { IModuleConfig } from "./types/IModuleConfig";
import { History } from "history";
import { URLSTORE, PARAMSTORE, QUERYSTORE } from "./stores/main";
import RouteParser from "route-parser";
import urlJoin from "url-join";
import { RouteDetails } from "./types/RouteDetails";
import { ViewDetails } from "./types/ViewDetails";
import { CallInjectedView } from "./framework/CallInjectedView";
import { CallInjectedController } from "./framework/CallInjectedController";
import queryString from "query-string";
import promiseAny from "promise-any";
import { Container } from "./container/builder/Container";
import { historyStore } from "./stores/history";
import { StoreUpdater } from "./stores/storeupdator";

type UrlPathReference = (readonly [
  RouteParser<{
    [i: string]: any;
  }>,
  {
    controller: any;
    method: string;
    route: string;
    path: string;
    url: string;
  }
])[];

const getMetaData = Reflect.getMetadata.bind(Reflect);
export class SlickApp {
  constructor(
    private container: Container,
    private options: IModuleConfig,
    private target: HTMLElement,
    private base: any,
    private Component404: any,
    private history: History,
    private errorPage?: any
  ) {
    historyStore.update(x => this.history);
  }

  Initialize() {
    this.compile();
    this.start();
  }
  compile() {
    let UrlConfiguration = this.GetAppConfiguration();
    this.boot(UrlConfiguration);
    return this.container;
  }

  private start() {
    const init = urlJoin(window.location.pathname, window.location.search);
    this.history.push(init);
  }

  private GetAppConfiguration() {
    const routeDetail = this.controllers.map(Controller => {
      return this.getControllerRouteDetail(Controller);
    });
    const RouteNavigation = this.getViewNavigation(routeDetail);

    let UrlCompass = RouteNavigation.map(navigation => {
      const search = new RouteParser(navigation.url);
      return [search, navigation] as const;
    });
    return UrlCompass;
  }

  private boot(urlPathReference: UrlPathReference) {
    const  CreateApplication = (viewProps:any = {})=>{
      let view =  new this.base({
        target: this.target,
        props: {
          URLSTORE,
          PARAMSTORE,
          QUERYSTORE,
          viewProps
        }
      });
      view.$on((event,data)=>{
        console.log(event,data);
      })
      return view;
    }

    let Application = CreateApplication()

    this.history.listen(async (location, action) => {

      //create page routes
      const pageRoute = urlJoin("/", location.pathname, location.search);

      const pageURL = urlJoin(
        "/",
        location.pathname,
        location.search,
        location.hash
      );


      let param: any;
      const match = urlPathReference.find(([route]) => {
        param = route.match(pageRoute.trim() || "/");
        return param;
      });


      StoreUpdater.set().all({
        url:pageURL,
        param,
        query:queryString.parse(location.search)
      })


      if (!match) {
        Application.$set({
          URLSTORE,
          PARAMSTORE,
          viewProps: {
            NotFound: this.Component404
          }
        });
      } else {
        let [, viewInfo] = match;

        const ControllerConstructor = viewInfo.controller;
        const controllerInstance = await CallInjectedController(
          ControllerConstructor
        );

        const viewProps = this.getViewProps(controllerInstance, viewInfo);
        const view = this.getView(ControllerConstructor, viewInfo);

        const templateProps: any = {};
        const viewOptions = this.getViewOptions(viewInfo);

        if (viewOptions) {
          if ("layout" in viewOptions) {
            Object.assign(templateProps, { layout: viewOptions.layout });
          }
          if ("loading" in viewOptions) {
            Object.assign(templateProps, { loading: viewOptions.loading });
          }
        }

        if ("error" in viewOptions) {
          Object.assign(templateProps, { error: viewOptions.error });
        } else if (this.errorPage) {
          Object.assign(templateProps, { error: this.errorPage });
        }

        Object.assign(templateProps, {
          URLSTORE,
          PARAMSTORE,
          view
        });

        Object.assign(templateProps, { viewProps });
        const backup = Object.assign({}, templateProps);
        promiseAny([
          viewProps,
          new Promise(r =>
            setTimeout(r, viewOptions.pause != void 0 ? viewOptions.pause : 400)
          )
        ])
          .then(async () => {
            
            try{
              Application.$destroy();
              Application = CreateApplication()
              Application.$set(templateProps);
            }catch(e){
            }
          })
          .catch(e => {
            Object.assign(backup, {
              viewProps: Promise.resolve(Promise.reject(e))
            });
            Application.$set(backup);
          });
      }
    });
  }

  private getViewOptions(ViewActionDetail: {
    controller: any;
    method: string;
    route: string;
    path: string;
    url: string;
  }) {
    return getMetaData(INJECT_OPTIONS, ViewActionDetail.controller) || {};
  }

  private getView(
    controller: any,
    ViewActionDetail: {
      controller: any;
      method: string;
      route: string;
      path: string;
      url: string;
    }
  ) {
    let view = Reflect.getMetadata(
      VIEW_COMPONENT,
      controller,
      ViewActionDetail.method
    );
    this.ensureViewExist(view);
    return view;
  }

  private getViewProps(
    Controller: any,
    ViewActionDetail: {
      controller: any;
      method: string;
      route: string;
      path: string;
      url: string;
    }
  ) {
    try {
      return Promise.resolve(
        CallInjectedView(Controller, ViewActionDetail.method)
      );
    } catch (e) {
      return Promise.resolve(Promise.reject(e));
    }
  }

  protected get controllers() {
    return (this.options.controllers || []).map(x => x);
  }

  private getViewNavigation(routeDetail: RouteDetails[]) {
    const controllerNavigation = routeDetail.map(controllerSettings => {
      let controller = controllerSettings.controller;
      let route = controllerSettings.controller_path;

      let routes = controllerSettings.view_detail.map(viewSettings => {
        if (!viewSettings) {
          throw new Error(`Invalid view settings on ${controller}`);
        }

        const path = viewSettings.path;
        const method = viewSettings.method;
        const fullUrl = urlJoin(route, path).replace(/\/$/, "") || "/";

        return {
          controller,
          method: method,
          route: route,
          path: path,
          url: fullUrl
        };
      });

      return routes;
    });

    const RouteNavigation = this.flattenRoutes(controllerNavigation);

    return RouteNavigation;
  }
  private flattenRoutes(
    controllerNavigation: {
      controller: any;
      method: string;
      route: string;
      path: string;
      url: string;
    }[][]
  ) {
    return controllerNavigation.reduce(
      (a, b) => {
        return b ? [...a, ...b] : a;
      },
      [] as ViewDetails[]
    );
  }

  private getControllerRouteDetail(controller: any) {
    let controller_path = Reflect.getMetadata(CONTROLLER_PATH, controller);

    let view_detail = Object.entries(controller.prototype)
      .map(([method, value]) => {
        if (Reflect.hasMetadata(VIEW_PATH, controller, method)) {
          let path: string = Reflect.getMetadata(VIEW_PATH, controller, method);
          return {
            path,
            method: method as string
          } as ViewDetails;
        } else {
          return (null as any) as ViewDetails;
        }
      })
      .filter(x => !!x);

    const routeDetail: RouteDetails = {
      controller,
      controller_path,
      view_detail
    };

    return routeDetail;
  }

  private ensureViewExist(view) {
    if (!view) {
      throw new Error(`View doesn't exist`);
    }
  }
}
