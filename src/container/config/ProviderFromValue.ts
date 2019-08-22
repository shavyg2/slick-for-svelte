import { ValueProvider } from "../Provider";
import { SCOPE } from "../SCOPE";
export function ProviderFromValue(provider: ValueProvider) {
    return {
        scope:SCOPE.Singleton,
        provide:provider.provide,
        inject: [],
        useFactory: () => provider.useValue
    };
}
