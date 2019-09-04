import history from "history";
export interface ModuleInitOptions {
    base?:any
    target: HTMLElement;
    component404: any;
    error?:any
    history: history.History;
}
