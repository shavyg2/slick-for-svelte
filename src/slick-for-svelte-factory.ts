import { InitModule } from "./decorators/InitModule";
import { ModuleInitOptions } from "./types/ModuleInitOptions";

export * from "./decorators";
export * from "./stores/main";
export class SlickForSvelteFactory{
    static create(app:any,options:ModuleInitOptions){
        const App = InitModule(
            app,
            options
        )

        return App;
    }
}