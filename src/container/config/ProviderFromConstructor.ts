import { Design } from "../builder/design";
import { IConstructor } from "../builder/IConstructor";
import { PARAMETER, INJECT_OPTIONS } from "../../types/constants";
import { SCOPE } from "../Provider";
export function ProviderFromConstructor(constructor: IConstructor) {
  const inject = Reflect.getMetadata(Design.Constructor, constructor) || [];
  const alter = Reflect.getMetadata(PARAMETER, constructor);

  if (alter) {
    alter.forEach(({ index, identifier }) => {
      inject.splice(index, 1, identifier);
    });
  }

  return {
    provide: constructor,
    inject,
    useFactory: (...args: any[]) => {
      return Reflect.construct(constructor, args);
    },
    scope: (Reflect.getMetadata(INJECT_OPTIONS, constructor) || {}).scope
  };
}
