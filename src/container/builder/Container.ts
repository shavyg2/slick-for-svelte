import { FactoryProvider, SCOPE } from "../Provider";
import uuid from "uuid/v4";
import isPromise from "is-promise";
import { IContainer } from "./IContainer";
export class Container implements IContainer {
    cache = {
        Request: new Map<any, Map<any, any>>(),
        Singleton: new Map<any, any>()
    };
    constructor(private providers: FactoryProvider[]) {
    }
    get<T = any>(identifier: any): T | PromiseLike<T> {
        let id = uuid();
        this.cache.Request.set(id, new Map());
        let build = this.buildWithCapture(identifier, id);
        if (isPromise(build)) {
            return build.then(build => {
                this.cache.Request.delete(id);
                return build;
            });
        }
        else {
            this.cache.Request.delete(id);
            return build;
        }
    }

    isBound(identifier:any){
        return !!this.providers.find(x=>x.provide===identifier)
    }
    buildWithCapture(identifier: any, requestID: string) {
        let instance = this.build(identifier, requestID);
        let provider = this.providers.find(x => x.provide === identifier);
        let cache: Map<any, any> | WeakMap<any, any>;
        let cacheKey;
        if (provider.scope === SCOPE.Request) {
            cache = this.cache.Request.get(identifier);
            cacheKey = requestID;
        }
        else if (provider.scope === SCOPE.Singleton) {
            cache = this.cache.Singleton;
            cacheKey = identifier;
        }
        if (isPromise(instance)) {
            return instance.then(x => {
                if (cache) {
                    cache.set(cacheKey, x);
                }
                return x;
            });
        }
        else {
            if (cache) {
                cache.set(cacheKey, instance);
            }
            return instance;
        }
    }
    build(identifier: any, requestID: string) {
        let provider = this.providers.find(x => x.provide === identifier);
        if (!provider) {
            throw new Error(`No Provider for identifier ${this.printIdentifier(identifier)}`);
        }
        const request = this.cache.Request.get(requestID);
        if (provider.scope === "Request" && request.has(identifier)) {
            return request.get(identifier);
        }
        else if (provider.scope === "Singleton" && this.cache.Singleton.has(identifier)) {
            return this.cache.Singleton.get(identifier);
        }
        if (provider.inject && provider.inject.length) {
            //Potential Race condition
            let dependencies = provider.inject.map(x => this.buildWithCapture(x, requestID));
            if (dependencies.some(isPromise)) {
                return Promise.all(dependencies.map(x => Promise.resolve(x)))
                    .then(dep => {
                        return provider.useFactory(...dep);
                    });
            }
            else {
                return provider.useFactory(...dependencies);
            }
        }
        else {
            return provider.useFactory();
        }
    }
    private printIdentifier(identifier: any) {
        return `${identifier}`;
    }
}
