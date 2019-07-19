import { Container } from "inversify";
import { CONTROLLER_PATH, VIEW_PATH } from "./types/constants";
import { IModuleConfig } from "./types/IModuleConfig";
import {History} from "history";
import { URLSTORE,PARAMSTORE,QUERYSTORE } from "./stores/main";
import RouteParser from "route-parser";
import urlJoin from "url-join";
import { RouteDetails } from "./types/RouteDetails";
import { ViewDetails } from "./types/ViewDetails";
import { CallInjectedView } from "./framework/CallInjectedView";
import queryString from "query-string";

export class SlickApp{

    constructor(
        private container:Container,
        private options:IModuleConfig,
        private target:HTMLElement,
        private base:any,
        private Component404:any,
        private history:History
    ){

    }


    Initialize(){
        const routeDetail = this.controllers.map(Controller=>{
            return this.getControllerRouteDetail(Controller);
        })

        const RouteNavigation = this.getViewNavigation(routeDetail);


        let UrlCompass = 
        RouteNavigation.map(navigation=>{
            const search = new RouteParser(navigation.url)
            return [search,navigation] as const;
        })

        const Application =  new this.base({
            target:this.target,
            props:{
                URLSTORE,
                PARAMSTORE,
                QUERYSTORE,
                Direction:"PUSH",
            }
        })

        let match:any =-1;
        URLSTORE.subscribe(async (pageURL)=>{

            
            if(!match){
                Application.$set({
                    URLSTORE,
                    PARAMSTORE,
                    NotFound:this.Component404
                })
            }else if(match!==-1){
                let [route,ViewActionDetail] = match;
                const Controller = await this.container.get(ViewActionDetail.controller)
           
                const detail = await CallInjectedView(Controller,ViewActionDetail.method)
                const props = Object.assign({
                    URLSTORE,
                    PARAMSTORE,
                },detail);

                Application.$set(props);
            }
        });

        this.history.listen(async (location,action)=>{
            const pageURL = urlJoin(location.pathname, location.search,location.hash);
            QUERYSTORE.update(()=>queryString.parse(location.search));
            
            let param:any;
            match = UrlCompass.find(([route])=>{
                param = route.match(pageURL)
                return param;
            })

            PARAMSTORE.update(()=>param);
            URLSTORE.update(()=>pageURL)
        })

        

        const init = urlJoin(window.location.pathname,window.location.search)
        this.history.push(init);
    }

    protected get controllers(){
        return (this.options.controllers||[]).map(x=>x);
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

        const RouteNavigation = controllerNavigation.reduce((a, b) => {
            return b ? [...a, ...b] : a;
        }, [] as ViewDetails[]);

        return RouteNavigation
    }
    private getControllerRouteDetail(controller:any){
        let controller_path = Reflect.getMetadata(CONTROLLER_PATH,controller);


        let view_detail = Object.entries(controller.prototype).map(([method,value])=>{
            if(Reflect.hasMetadata(VIEW_PATH,controller,method)){
                let path:string = Reflect.getMetadata(VIEW_PATH,controller,method)
                return {
                    path,
                    method:method as string
                } as ViewDetails;
            }else{
                return null as any as ViewDetails;
            }
        }).filter(x=>!!x)

        const routeDetail:RouteDetails =  {
            controller,
            controller_path,
            view_detail
        }
        
        return routeDetail;
    }


}   