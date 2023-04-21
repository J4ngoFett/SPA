import { ActivatedRouteState } from "../activatedRouteState";

export interface Resolver<T = unknown> {
    resolve(state: ActivatedRouteState): T | Promise<T>;
}