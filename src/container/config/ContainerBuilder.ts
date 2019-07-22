import { FactoryProvider } from "../Provider";
import { IContainerBuilder } from "./IContainerBuilder";
import * as check from "../../provider/check";
import { ProviderFromConstructor } from "./ProviderFromConstructor";
import { ProviderFromValue } from "./ProviderFromValue";
import { Container } from "../builder/Container";
export class ContainerBuilder implements IContainerBuilder {
    private providers: FactoryProvider[] = [];


    bind(provider){
        return this.add(provider);
    }
    add(provider: any): this {
        if (check.isConstructor(provider)) {
            this.providers.push(ProviderFromConstructor(provider));
        }
        else if (check.IsUseValue(provider)) {
            this.providers.push(ProviderFromValue(provider));
        }
        else if (check.IsUseFactory(provider)) {
            this.providers.push(provider);
        }
        else {
            throw new Error("not a valid provider");
        }
        return this;
    }
    static getContainer(builder: ContainerBuilder) {
        return new Container(builder.providers);
    }
}
