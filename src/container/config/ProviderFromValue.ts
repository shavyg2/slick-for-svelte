import { ValueProvider, SCOPE } from "../Provider";
export function ProviderFromValue(provider: ValueProvider) {
    return {
        scope:SCOPE.Singleton,
        provide:provider.provide,
        inject: [],
        useFactory: () => provider.useValue
    };
}
