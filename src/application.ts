
import {
  CONTROLLER_PATH,
  VIEW_PATH,
  INJECT_OPTIONS,
  VIEW_COMPONENT,
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

export class SlickApp {
  constructor(
    private container: Container,
    private options: IModuleConfig,
    private target: HTMLElement,
    private base: any,
    private Component404: any,
    private history: History,
    private errorPage?:any
  ) {

    historyStore.update(x=>this.history)
  }

  Initialize() {



    const routeDetail = this.controllers.map(Controller => {
      return this.getControllerRouteDetail(Controller);
    });

    const RouteNavigation = this.getViewNavigation(routeDetail);

    let UrlCompass = RouteNavigation.map(navigation => {
      const search = new RouteParser(navigation.url);
      return [search, navigation] as const;
    });

    const Application = new this.base({
      target: this.target,
      props: {
        URLSTORE,
        PARAMSTORE,
        QUERYSTORE,
        viewProps: {}
      }
    });

    let match: any = -1;

    this.history.listen(async (location, action) => {
      
      const pageURL = urlJoin(
        location.pathname,
        location.search,
        location.hash
      );
      
      QUERYSTORE.update(() => queryString.parse(location.search));

      let param: any;
      match = UrlCompass.find(([route]) => {
        param = route.match(pageURL.trim() || "/");
        return param;
      });

      

      PARAMSTORE.update(() => param);
      
      if (!match) {
        Application.$set({
          URLSTORE,
          PARAMSTORE,
          viewProps: {
            NotFound: this.Component404
          }
        });
      } else if (match !== -1) {
        console.log(match)
        let [, ViewActionDetail] = match;
        const controller = ViewActionDetail.controller;
        const Controller = await CallInjectedController(controller);
        
   
        let viewProps = null;
        try{
            viewProps = Promise.resolve(CallInjectedView(Controller, ViewActionDetail.method));
        }catch(e){
            viewProps = Promise.resolve(Promise.reject(e))
        }


        let view = Reflect.getMetadata(VIEW_COMPONENT,controller,ViewActionDetail.method);

        
        this.ensureViewExist(view);

        const templateProps: any = {};

        let options = Reflect.getMetadata(
          INJECT_OPTIONS,
          ViewActionDetail.controller
        ) || {};
        if (options) {
          if ("layout" in options) {
            Object.assign(templateProps, { layout: options.layout });
        }
        
        if("loading" in options){
            Object.assign(templateProps, { loading: options.loading });
          }
        }

        if("error" in options){
            Object.assign(templateProps,{error:options.error})
        }else if(this.errorPage){
            Object.assign(templateProps,{error:this.errorPage})
        }

        Object.assign(templateProps, {
          URLSTORE,
          PARAMSTORE,
          view
        });

        Object.assign(templateProps, { viewProps });
        const backup = Object.assign({},templateProps)
        promiseAny([viewProps,new Promise(r=>setTimeout(r,options.pause||400))])
        .then(()=>{
          
            Application.$set(templateProps);
        }).catch(e=>{
            Object.assign(backup,{viewProps:Promise.resolve(Promise.reject(e))})
            Application.$set(backup)
        })

      }
    });

    const init = urlJoin(window.location.pathname, window.location.search);
    this.history.push(init);
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
          throw new Error("incorrect view settings, it should never be null");
        }
        let path = viewSettings.path;
        let method = viewSettings.method;
        return {
          controller,
          method: method,
          route: route,
          path: path,
          url: urlJoin(route, path)
        };
      });

      return routes;
    });

    const RouteNavigation = controllerNavigation.reduce(
      (a, b) => {
        return b ? [...a, ...b] : a;
      },
      [] as ViewDetails[]
    );

    return RouteNavigation;
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



  private ensureViewExist(view){
    if(!view){
      throw new Error(`New doesn't exist`)
    }
  }
}
