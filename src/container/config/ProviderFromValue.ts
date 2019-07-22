import { ValueProvider, SCOPE } from "../Provider";
export function ProviderFromValue(provider: ValueProvider) {
    return {
        scope:SCOPE.Transient,
        provide:provider.provide,
        inject: [],
        useFactory: () => provider.useValue
    };
}
