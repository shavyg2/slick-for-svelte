const Template = require("../template/base.svelte");
const NotFound = require("../template/404.svelte");
const ErrorPage = require("../template/error.svelte");
import "../dom";
import * as History from "history";

import { BasicController } from "./BasicController";
import { FooProvider } from "./foo";
import { Module, SlickForSvelteFactory } from "../../src/slick-for-svelte-factory";
import { FrameworkMeta } from "./FrameworkMeta";
import { FactoryController, FactoryProvider } from "./FactoryController";


@Module({
    controllers: [BasicController, FactoryController],
    provider: [FooProvider, FrameworkMeta, FactoryProvider]
})
class Application {

}


export const history = History.createMemoryHistory()



const app = SlickForSvelteFactory.create(Application, {
    base: Template,
    component404: NotFound,
    target: document.body,
    error: ErrorPage,
    history
})



app.Initialize();