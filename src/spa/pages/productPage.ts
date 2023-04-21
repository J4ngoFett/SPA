import { AbstractPage } from "../abstractPage";

export class ProductPage extends AbstractPage {
    render(): HTMLElement | DocumentFragment {
        const content = document.createElement('div');
        content.textContent = `Product: ${this.routeState.params.productId}`;
        return content;
    }
}