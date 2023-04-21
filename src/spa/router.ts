import { AbstractPage } from "./abstractPage";
import { ActivatedRouteState } from "./activatedRouteState";
import { createPathRegExp } from "./createPathRegExp";
import { Guard } from "./guard/Guard";
import { GuardClass } from "./guard/guardClass";
import { GuardFunction } from "./guard/guardFunction";
import { PathParams } from "./pathParams";
import { RedirectPath } from "./redirectPath";
import { ResolvedData } from "./resolvedData";
import { resolvePath } from "./resolvepath";
import { Resolver } from "./resolver/resolver";
import { ResolverClass } from "./resolver/resolverClass";
import { ResolverFunction } from "./resolver/resolverFunction";
import { RouteConfig } from "./routeConfig";

export class Router {
    readonly #routes = new Map<RegExp, RouteConfig>();
    readonly #guardInstances = new WeakMap<GuardClass, Guard>();
    readonly #resolverInstances = new WeakMap<ResolverClass, Resolver>();
    readonly #outletElement: HTMLElement;
    #activePage: AbstractPage | null = null;

    constructor(outletElement: HTMLElement,routes: RouteConfig[]) {
        this.#outletElement = outletElement;
        routes.forEach((route) => {
            this.#routes.set(createPathRegExp(route.path), route);
        });
    };

    navigate(path: string) {
        const absolutePath = resolvePath(location.pathname, path);
        const [route, params] = this.#findRoute(absolutePath);
        if (route) {
            void this.#handleRoute(absolutePath, route, params ?? {});
        };
    };

    start(): void {
        this.navigate(location.pathname);
    };

    #findRoute(path: string): [RouteConfig | null, PathParams | null] {
        for (const [regExp, routeConfig] of this.#routes) {
            const execResult = regExp.exec(path);
            if (execResult) {
                return [routeConfig, execResult.groups ?? null];
            };
        };
        return [null, null];
    };

    async #handleRoute(path: string, route: RouteConfig, routeParams: PathParams) {
        const activatedRouteState: ActivatedRouteState = {
            url: new URL(path, location.origin).toString(),
            params: routeParams,
            resolvedData: null,
        };
        const guardResult = await this.#checkGuards(route, activatedRouteState);

        if (!guardResult) {
            return;
        }

        if (guardResult instanceof RedirectPath) {
            return this.navigate(guardResult.toString());
        }

        activatedRouteState.resolvedData = await this.#checkResolvers(route, activatedRouteState);

        if (route.redirectTo) {
            return this.navigate(route.redirectTo);
        }

        if (route.page) {
        const page = new route.page(activatedRouteState);
        const content = page.render();
        this.#outletElement.replaceChildren(content);

        this.#activePage?.onDestroy();
        this.#activePage = page;
        this.#outletElement.replaceChildren(content);
        this.#activePage?.onRender();

        history.pushState({}, '', activatedRouteState.url);
        }
    };

    async #checkGuards({ guards }: RouteConfig, state: ActivatedRouteState): Promise<boolean | RedirectPath> {
        if (!guards || !guards.length) {
            return true;
        };
        for (const guard of guards) {
            const result = await this.#invokeGuard(guard, state);

            if (result !== true) {
                return result;
            };
        }
        return true;
    };

    #invokeGuard(guard: GuardFunction | GuardClass, state: ActivatedRouteState) {
        if (isClass(guard)) {
            if (!this.#guardInstances.has(guard)) {
                this.#guardInstances.set(guard, new guard());
            }
            return this.#guardInstances.get(guard)!.canActivate(state);
        };
        return guard(state);
    };

    async #invokeResolver(resolver: ResolverFunction | ResolverClass, state: ActivatedRouteState): Promise<unknown> {
        if (isClass(resolver)) {
            if (!this.#resolverInstances.has(resolver)) {
                this.#resolverInstances.set(resolver, new resolver());
            }
            return this.#resolverInstances.get(resolver)!.resolve(state);
        };
        return resolver(state);
    };

    async #checkResolvers({ resolve }: RouteConfig, state: ActivatedRouteState): Promise<null | ResolvedData> {
        if (!resolve) {
            return null;
        };
        // const resolverEntries = Object.entries(resolve);
        // const promises = resolverEntries.map(([name, resolver]) => {
        //     const result = this.#invokeResolver(resolver, state);
        //     const promiseResult = result instanceof Promise ? result : Promise.resolve(result);

        //     return promiseResult.then((value) => [name, value]);
        // });

        // return Promise.all(promises).then((results) => Object.fromEntries(results));

        return Promise
            .all(
                Object
                    .entries(resolve)
                    .map(([name, resolver]) => {
                        return this.#invokeResolver(resolver, state).then((value) => [name, value]);
                    })
                ).then((resultEntries) => Object.fromEntries(resultEntries));
    };


};

function isClass<T>(value: CallableFunction | { new(...args: any[]): T }): value is { new(...args: any[]): T } {
    return typeof value === 'function' && /^class /.test(value.toString());
};

