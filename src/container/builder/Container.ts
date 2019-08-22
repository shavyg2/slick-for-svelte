import { FactoryProvider } from "../Provider";
import { SCOPE } from "../SCOPE";
// import uuid from "uuid/v4";
import is from "@sindresorhus/is"
import { IContainer } from "./IContainer";
import { makeid } from "../../helpers/generate_id";

export type Scope = "Request" | "Transient" | "Singleton";

export class Container implements IContainer {
  cache = {
    Request: new Map<any, Map<any, any>>(),
    Singleton: new Map<any, any>()
  };
  constructor(private providers: FactoryProvider[]) {}

  isBound(identifier: any) {
    return !!this.providers.find(x => x.provide === identifier);
  }

  get<T = any>(identifier: any): T | PromiseLike<T> {
    let id = makeid();
    this.cache.Request.set(id, new Map());
    let build = this.build(identifier, id);

    if (is.promise(build)) {
      return build.then((instance:any) => {
        this.cache.Request.delete(id);
        return instance;
      });
    } else {
      this.cache.Request.delete(id);
      return build;
    }
  }

  build(identifier: any, requestID: string) {
    let provider = this.providers.find(x => x.provide === identifier);
    if (!provider) {
      throw new Error(
        `No Provider for identifier ${this.printIdentifier(identifier)}`
      );
    }

    if (provider.inject && provider.inject.length) {
      let injectScope = this.getScopeOfInjects(provider.inject);
      let scope = ScopePicker.pickList(provider.scope, ...injectScope);

      scope = provider.scope || "Singleton";

      switch (scope) {
        case "Singleton":
          return this.buildAsSingleton(provider, requestID);
        case "Request":
          return this.buildAsRequest(provider, requestID);
        case "Transient":
          return this.buildAsTransient(provider, requestID);
      }
    } else {
      switch (provider.scope || "Singleton") {
        case "Singleton":
          return this.buildAsSingleton(provider, requestID);
        case "Request":
          return this.buildAsRequest(provider, requestID);
        case "Transient":
          return this.buildAsTransient(provider, requestID);
        default:
          throw new Error(`Invalid scope ${provider.scope}`);
      }
    }
  }

  private buildAsSingleton(provider: FactoryProvider, requestID: string) {
    let cache = this.cache.Singleton;
    if (cache.has(provider.provide)) {
      return cache.get(provider.provide);
    } else {
      
      let dependencies = provider.inject.map(x => {
        return this.build(x, requestID);
      });

      if (dependencies.some(is.promise)) {
        return Promise.all(dependencies.map(x => Promise.resolve(x)))
          .then(args => {
            return provider.useFactory(...args);
          })
          .then(instance => {
            cache.set(provider.provide, instance);
            return instance;
          });
      } else {
        const instance = provider.useFactory(...dependencies);
        cache.set(provider.provide, instance);
        return instance;
      }
    }
  }

  buildAsRequest(provider: FactoryProvider, requestID: string) {
    let cache = this.cache.Request.get(requestID);

    if (cache.has(provider.provide)) {
      return cache.get(provider.provide);
    } else {
      let dependencies = (provider.inject || []).map(x => {
        return this.build(x, requestID);
      });

      if (dependencies.some(is.promise)) {
        return Promise.all(dependencies.map(x => Promise.resolve(x)))
          .then(args => {
            return provider.useFactory(...args);
          })
          .then(instance => {
            cache.set(provider.provide, instance);
            return instance;
          });
      } else {
        const instance = provider.useFactory(...dependencies);
        cache.set(provider.provide, instance);
        return instance;
      }
    }
  }

  buildAsTransient(provider: FactoryProvider, requestID) {
    let dependencies = (provider.inject || []).map(x => {
      return this.build(x, requestID);
    });

    if (dependencies.some(is.promise)) {
      return Promise.all(dependencies.map(x => Promise.resolve(x)))
        .then(args => {
          return provider.useFactory(...args);
        })
        .then(instance => {
          return instance;
        });
    } else {
      const instance = provider.useFactory(...dependencies);
      return instance;
    }
  }
  private printIdentifier(identifier: any) {
    return `${identifier}`;
  }

  private getScopeOfInjects(injects: any[]) {
    let scopes = injects.map(inject => {
      let dependency = this.providers.find(x => x.provide === inject);

      if (!dependency) {
        throw new Error(`Dependency not found for ${inject}`);
      }

      return dependency.scope;
    });

    return scopes;
  }

  private scopePicker(
    scope1: Scope,
    scope2: Scope,
    options = ["Transient", "Request", "Singleton"]
  ) {
    return [scope1, scope2].sort((a, b) => {
      return options.indexOf(a) - options.indexOf(b);
    })[0];
  }
}

export class ScopePicker {
  public static pickList(...scopes: Scope[]) {
    return scopes.reduce((a, b) => {
      return this.pick(a, b);
    }, "Singleton");
  }

  public static pick(
    scope1: Scope,
    scope2: Scope,
    options = ["Transient", "Request", "Singleton"]
  ) {
    return [scope1, scope2].sort((a, b) => {
      return options.indexOf(a) - options.indexOf(b);
    })[0];
  }
}
