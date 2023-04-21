import './tag-badge';
import { CartPage } from "./spa/pages/cartPage";
import { HistoryPage } from "./spa/pages/historyPage";
import { ProductPage } from "./spa/pages/productPage";
import { ProductsPage } from "./spa/pages/productsPage";
import { Router } from "./spa/router";
const routerOutlet = document.getElementById('routerOutlet') as HTMLElement;
const appRouter = new Router(routerOutlet, [
    {
        path: '',
        redirectTo: '/products',
    },
    {
        path: 'cart',
        page: CartPage,

    },
    { 
        path: 'history',
        page: HistoryPage,
    },
    {
        path: 'products',
        page: ProductsPage,
        resolve: {
            productList: () => new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        {id: 1, title: 'foo'},
                        {id: 2, title: 'bar'},
                    ]);
                }, 1_000)

            }),
        },
    },
    {
        path: 'products/:productId'
        , page: ProductPage,
    },
]);

appRouter.start();


document.addEventListener('click', (event) => {
    const routerLink = (event.target as Element).closest<HTMLAnchorElement>('a[data-router="true"]');

    if (routerLink) {

        const path = new URL(routerLink.href).pathname;

        event.preventDefault();
        appRouter.navigate(path);

        //todo: pass into router
    }
});

