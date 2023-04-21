import { PathParams } from "./pathParams";
import { ResolvedData } from "./resolvedData";

export interface ActivatedRouteState {
    url: string;
    params: PathParams;
    resolvedData: null | ResolvedData;
};