const Page1 = require("../view/page1.svelte");
const ParamPage = require("../view/param.svelte")
import { Controller, Inject, View, Param, Query } from "../../src/decorators";

import { foo } from "./foo";


@Controller("/")
export class User {
    constructor(
        @Inject(foo)
        public foo: string) {
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


    @View("/error",ParamPage)
    errorTest(){
        throw new Error("This is intentional")
    }


}
