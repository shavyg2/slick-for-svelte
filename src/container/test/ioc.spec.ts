import { Injectable, Inject, Controller } from "../../decorators";
import { ContainerBuilder } from "../config/ContainerBuilder";
import "reflect-metadata";
import isPromise from "is-promise";



    @Injectable()
    class Repo{

    }

    @Injectable({
        scope:"Request"
    })
    class Service{

    }


    @Injectable()
    class Operation{
        constructor(
            public service:Service,
            @Inject("simple") public simple,
            public repo:Repo
            ){}
    }


    @Controller("/thing",{
        scope:"Request",
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

                await new Promise((r)=>{

                    setTimeout(r,500)
                })

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
    builder.add(Repo);
    const container = ContainerBuilder.getContainer(builder);

    it("should resolve service",()=>{
        let service = container.get(Service)
        expect(service).toBeInstanceOf(Service);
    })


    it("should resolve subdependencies",()=>{
        let operation = container.get(Operation);
        expect(operation).toBeInstanceOf(Operation)
        expect(operation.service).toBeInstanceOf(Service)
        expect(operation.simple).toBe("Simple");
    })
    
    it("should resolve scope",async ()=>{
        let c1:Operation= await container.get(Operation)
        let c2:Operation= await container.get(Operation)
        expect(c1).not.toBe(c2)
        expect(c1.repo).toBe(c2.repo)
        expect(c1.repo).toBe(c2.repo)
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
        expect(finalThing.operation).toBeInstanceOf(Operation);
        expect(finalThing.operation.service).toBeInstanceOf(Service);

    })



    it("should resolve controllers",()=>{

        let test = container.get(TestController)
        expect(test).toBeInstanceOf(TestController);
        expect(test).not.toBe(container.get(TestController))

    })

})