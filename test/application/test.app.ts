let ErrorPage = require("../template/error.svelte");
const Template = require("../template/base.svelte");
const NotFound = require("../template/404.svelte");
import * as History from "history";
import "../dom";





import { Module } from "../../src/decorators";
import { SlickForSvelteFactory } from "../../src/slick-for-svelte-factory";
import { User } from "./User";
import { FooProvider } from "./foo";


@Module({
    controllers:[User],
    provider:[FooProvider]
})
class Application{

}


export const history = History.createMemoryHistory()



const app = SlickForSvelteFactory.create(Application,{
    base:Template,
    component404:NotFound,
    target:document.body,
    error:ErrorPage,
    history
})



app.Initialize();