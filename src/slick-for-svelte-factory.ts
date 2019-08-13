import "reflect-metadata";
import { InitModule } from "./decorators/InitModule";
import { ModuleInitOptions } from "./types/ModuleInitOptions";

export * from "./decorators";
export * from "./stores/main";
export * from "./helpers/spa";
export * from "./helpers/history"
export class SlickForSvelteFactory{
    static create(app:any,options:ModuleInitOptions){
        const App = InitModule(
            app,
            options
        )
        return App;
    }
}