require("svelte/register");
import { Controller, Inject, View } from "../src/decorators";
import {Module} from "../src/decorators/Module";
import { SlickForSvelteFactory } from "../src/slick-for-svelte-factory";
let ErrorPage = require("./template/error.svelte");
import * as History from "history";

const Template = require("./template/base.svelte");
const NotFound = require("./template/404.svelte");

const Page1 = require("./view/page1.svelte");

import { document } from "./dom";
const foo = "foo-service"

const FooProvider = {
    provide:foo,
    useValue:"foo"
}


@Controller("/")
class User {

    constructor(@Inject(foo) public foo:string){

    }

    @View("/",Page1)
    page(){
        return {}
    }

}


@Module({
    controllers:[User],
    provider:[FooProvider]
})
class Application{

}


const history = History.createMemoryHistory()



const app = SlickForSvelteFactory.create(Application,{
    base:Template,
    component404:NotFound,
    target:document.body,
    error:ErrorPage,
    history
})



const application = app.Initialize();

describe("Framework Test",()=>{

    
    it("should have changed the document",()=>{
        history.push("/")
        let result = document.body.innerHTML;
        console.log(result);
    })


})