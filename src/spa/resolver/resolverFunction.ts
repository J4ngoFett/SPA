import { ActivatedRouteState } from "../activatedRouteState";

export interface ResolverFunction<T = unknown> {
    (state: ActivatedRouteState): T | Promise<T>;
};