import { Injectable, Controller, Module, InitModule, View, CallInjectedView } from "../src/decorators/main";



@Injectable()
class Wheel{

}


@Injectable()
class Drive{
    distance:number=0;
    setAmount(num:number){
        this.distance+=num;
    }
}



@Controller("/drive")
class Car{
    constructor(public wheel:Wheel){

    }

    @View("/")
    move(drive:Drive){

        return {
            view:null
        }
    }
}

@Module({
    provider:[Wheel,Drive],
    controllers:[Car]
})
class Plant{


}


let module = InitModule(Plant);


let car = module.get(Car);


let result =  CallInjectedView(car,"move");






console.log(result)


