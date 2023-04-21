import { ActivatedRouteState } from "../activatedRouteState";
import { RedirectPath } from "../redirectPath";

export interface GuardFunction{
    (state: ActivatedRouteState):boolean | Promise<boolean> | RedirectPath | Promise<RedirectPath>;
};