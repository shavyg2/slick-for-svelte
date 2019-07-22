export interface IContainer {
    get<T = any>(identifier: any): T | PromiseLike<T>;
}
