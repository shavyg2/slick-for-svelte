import { SlickApp } from "../application";
import history from "history";
import { MODULE, MODULE_OPTIONS } from "../types/constants";
import { ModuleInitOptions } from "../types/ModuleInitOptions";

export function InitModule(ModuleClass: any, options: ModuleInitOptions) {
    const container = Reflect.getMetadata(MODULE, ModuleClass);
    const moduleConfig = Reflect.getMetadata(MODULE_OPTIONS, ModuleClass);
    const h = options.history || history.createBrowserHistory();
    const framework = new SlickApp(container, moduleConfig, options.target || document.body, options.base, options.component404, h);
    return framework;
}
