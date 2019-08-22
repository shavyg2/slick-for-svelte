const Template = require("../template/base.svelte");
const NotFound = require("../template/404.svelte");
const ErrorPage = require("../template/error.svelte");
import "../dom";
import * as History from "history";






import { User } from "./User";
import { FooProvider } from "./foo";
import { Module, SlickForSvelteFactory } from "../../src/slick-for-svelte-factory";


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