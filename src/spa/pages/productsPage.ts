import { AbstractPage } from "../abstractPage";

export class ProductsPage extends AbstractPage {
    #onDocClick = () => {
        
        alert('Hello');
    };
    render(): HTMLElement | DocumentFragment {
        const content = document.createElement('div');
        content.textContent = `Products: ${JSON.stringify(this.routeState.resolvedData?.productList, null, 2)}`;
        return content;
    }

    onRender() {
        document.addEventListener('click', this.#onDocClick);
    }
    onDestroy() {
        document.removeEventListener('click', this.#onDocClick);
    }
}