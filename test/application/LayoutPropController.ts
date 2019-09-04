import { Controller, View, Inject } from "../../src/decorators";
const Layout = require("../view/layout-prop-view.svelte");
const Page = require("../view/user-view.svelte");
import { LayoutProps } from "../../src/decorators/layout-props";
import { foo } from "./foo";

@Controller("/layout",{
    layout:Layout
})
export class LayoutPropController{


    @LayoutProps
    getUser(@Inject(foo) foo:string){
        return {
            user:{
                username:foo
            }
        }
    }

    @View("/props",Page)
    getView(){
        return {
            date:"Good Day"
        }
    }

}