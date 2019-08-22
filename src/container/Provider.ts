
export interface ValueProvider {
    scope?:"Request" | "Singleton" | "Transient"
    provide:any;
    useValue:any;
    inject?:any[]
}



export interface FactoryProvider{

    scope?:"Request" | "Singleton" | "Transient"
    provide:any
    useFactory?:(...args:any)=>any|Promise<any>
    inject?:any[]
}



