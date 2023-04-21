import { Resolver } from "./resolver";

export interface ResolverClass<T = unknown> {
    new(): Resolver<T>;
};