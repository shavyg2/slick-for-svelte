import { Injectable, Inject, Controller } from "../../decorators";
import { ContainerBuilder } from "../config/ContainerBuilder";
import "reflect-metadata";
import isPromise from "is-promise";

    @Injectable({
        scope:"Request"
    })
    class Service{

    }


    @Injectable()
    class Operation{
        constructor(public service:Service,@Inject("simple") public simple){}
    }


    @Controller("/thing",{
        scope:"Request"
    })
    class TestController{

    }

    const simpleProvider = {
        provide:"simple",
        useValue:"Simple"
    }


    const factory = {
        provide:"factory",
        async useFactory(operation:Operation){
                return {
                    operation
                }
        },
        inject:[Operation]
    }

describe("With Promise",()=>{
    
    const builder = new ContainerBuilder();

    builder.add(Service);
    builder.add(Operation);
    builder.add(simpleProvider);
    builder.add(factory);
    builder.add(TestController);
    const container = ContainerBuilder.getContainer(builder);

    it("should resolve service",()=>{
        let service = container.get(Service)
        expect(service).toBeInstanceOf(Service);
    })


    it("should resolve subdependencies",()=>{
        let operation = container.get(Operation);
        expect(operation).toBeInstanceOf(Operation)
        expect(operation.service).toBeInstanceOf(Service)
    })
    
    it("should resolve singleton scope",()=>{
        expect(container.get(Operation)).toBe(container.get(Operation))
    })


    it("should resolve request scope",()=>{
        let service1 = container.get(Service)
        let service2 = container.get(Service)

        expect(service1).not.toBe(service2);
        expect(service1).toBeInstanceOf(Service);
        expect(service2).toBeInstanceOf(Service);
    })


    it("should provide by injection",()=>{
        expect(container.get(Operation).simple).toBe(simpleProvider.useValue);
    })





    it("should provide async factory",async()=>{
        let thing = container.get(factory.provide)

        expect(isPromise(thing)).toBe(true);

        let finalThing = await thing;

        expect(finalThing.operation).toBeInstanceOf(Operation);

    })



    it("should resolve controllers",()=>{

        let test = container.get(TestController)
        expect(test).toBeInstanceOf(TestController);
        expect(test).not.toBe(container.get(TestController))

    })

})