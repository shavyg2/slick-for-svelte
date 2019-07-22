
export interface ScopeOptions{
    scope?:"Request"|"Singleton"|"Transient"
}

export interface ControllerOptions extends ScopeOptions{
    layout?: any;
    loading?:any
    error?:any;
    pause?:number
}
