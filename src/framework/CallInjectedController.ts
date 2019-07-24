import { MODULE } from "../types/constants";
import { Container } from "../container/builder/Container";
export function CallInjectedController(constructor) {
    
    let container: Container = Reflect.getMetadata(MODULE, constructor);
    return container.get(constructor);
}
