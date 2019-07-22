import { IModuleConfig } from "./types/IModuleConfig";
import { History } from "history";
import { Container } from "./container/builder/Container";
export declare class SlickApp {
    private container;
    private options;
    private target;
    private base;
    private Component404;
    private history;
    constructor(container: Container, options: IModuleConfig, target: HTMLElement, base: any, Component404: any, history: History);
    Initialize(): void;
    protected readonly controllers: any[];
    private getViewNavigation;
    private getControllerRouteDetail;
}
//# sourceMappingURL=application.d.ts.map