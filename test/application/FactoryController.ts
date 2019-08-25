import { Controller, View, Inject } from "../../src/decorators";
const FactoryView = require("../view/factory-constructor.svelte");


export const FactoryService = "factory";

export const FactoryProvider = {
    provide:FactoryService,
    useFactory(){
        return {
            message:"New Factory"
        }
    }
}




export const AsyncFactoryService = "factory";

export const AsyncFactoryProvider = {
    provide:FactoryService,
    useFactory(){
        return {
            message:"New Factory"
        }
    }
}


@Controller("/controller/factory")
export class FactoryController{

    constructor(@Inject(FactoryService) private factory, @Inject(AsyncFactoryService) private async_factory){

    }


    @View("/inject",FactoryView)
    view(){
        return this.factory
    }


    @View("/async",FactoryView)
    asyncView(){
        return this.async_factory
    }
}