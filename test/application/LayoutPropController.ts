import { Controller, View } from "../../src/decorators";
const Layout = require("../view/layout-prop-view.svelte");
const Page = require("../view/user-view.svelte");
import { LayoutProps } from "../../src/decorators/layout-props";

@Controller("/layout",{
    layout:Layout
})
export class LayoutPropController{


    @LayoutProps
    getUser(){
        return {
            user:{
                username:"bob"
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