const Page1 = require("../view/page1.svelte");
const ParamPage = require("../view/param.svelte")
const Framename = require("../view/class-constructor.svelte")
import { Controller, Inject, View, Param, Query } from "../../src/slick-for-svelte-factory";

import { foo } from "./foo";
import { FrameworkMeta } from "./FrameworkMeta";



@Controller("/")
export class BasicController {
    constructor(
        @Inject(foo)
        public foo: string,
        private framework:FrameworkMeta) {
    }
    @View("/", Page1)
    page() {
        
    }

    @View("/user/:name",ParamPage)
    paramTest(@Param('name') name:string,@Query('page',x=>x||"1",parseInt) page:any){
        
        return {
            name,
            page
        }
    }
    @View("/async/user/:name",ParamPage)
    async paramAsyncTest(@Param('name') name:string,@Query('page',x=>x||"1",parseInt) page:any){
        await new Promise(r=>setTimeout(r,10))
        return {
            name,
            page
        }
    }


    @View("/meta",Framename)
    withClassConstructor(){
        return {
            name:this.framework.getName(),
        }
    }


    @View("/error",ParamPage)
    errorTest(){
        throw new Error("This is intentional")
    }


}
