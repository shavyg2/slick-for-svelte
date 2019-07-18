import { Container } from "inversify";
import { IModuleConfig, CONTROLLER_PATH, VIEW_PATH } from "./decorators/main";
import history,{History} from "history";
import { URLSTORE,PARAMSTORE } from "./store/main";
import RouteParser from "route-parser";
import urlJoin from "url-join";

export interface ViewDetail{
    controller:any
    method: string
    route: string
    path: string;
    url: string
}



export interface RouteDetail{
    controller:any;
    controller_path:string;
    view_detail:ViewDetail[];
}

export class FrontEndSvelte{

    constructor(
        private container:Container,
        private options:IModuleConfig,
        private target:HTMLElement,
        private baseComponent:any,
        private Component404:any,
        private history:History
    ){

    }


    Initialize(){
        const routeDetail = this.controllers.map(Controller=>{
            return this.getControllerRouteDetail(Controller);
        })

        const RouteNavigation = this.getViewNavigation(routeDetail);


        const UrlCompass:[RouteParser,ViewDetail][] = [] as any;

        RouteNavigation.map(navigation=>{
            const search = new RouteParser(navigation.url)
            UrlCompass.push([search,navigation])
        })

        const Application =  new this.baseComponent({
            target:this.target,
            props:{
                URLSTORE,
                PARAMSTORE
            }
        })

        this.history.listen((location,action)=>{
            let match 
        })
    }

    protected get controllers(){
        return (this.options.controllers||[]).map(x=>x);
    }

    private getViewNavigation(routeDetail: RouteDetail[]) {
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
        }, [] as ViewDetail[]);

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
                } as ViewDetail;
            }else{
                return null as any as ViewDetail;
            }
        }).filter(x=>!!x)

        const routeDetail:RouteDetail =  {
            controller,
            controller_path,
            view_detail
        }
        
        return routeDetail;
    }


}   