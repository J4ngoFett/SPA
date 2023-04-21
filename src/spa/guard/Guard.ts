import { ActivatedRouteState } from "../activatedRouteState";
import { RedirectPath } from "../redirectPath";

export interface Guard {
    canActivate(state: ActivatedRouteState): boolean | Promise<boolean> | RedirectPath | Promise<RedirectPath>;
};