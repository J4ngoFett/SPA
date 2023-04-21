import { GuardClass } from "./guard/guardClass";
import { GuardFunction } from "./guard/guardFunction";
import { PageClass } from "./pageClass";
import { ResolverClass } from "./resolver/resolverClass";

import { ResolverFunction } from "./resolver/resolverFunction";

export interface RouteConfig {
    path: string;
    page?: PageClass;
    redirectTo?: string;
    guards?: (GuardFunction | GuardClass)[];
    resolve?: Record<string, ResolverFunction | ResolverClass>;
};