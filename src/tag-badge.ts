const tagBadgeTemplate = document.createElement('template');
tagBadgeTemplate.innerHTML = `
<style>
.tag-bagde {
    background-color: var(--bg-color, #444);
    color: var(--text-color, #fff);
}
</style>
<span class="tag-bagde"><slot name="text"></span>
<button>X</button>`;


class TagBadgeElement extends HTMLElement {
    static get observedAttributes(): string[] {
        return ['value', 'editable'];
    }

    #value: string = '';
    #editable: boolean = false;
    readonly #shadowRoot: ShadowRoot;
    readonly #removeButton: HTMLButtonElement;

    onButtonClick = () => {
        this.dispatchEvent(new CustomEvent('remove', {
            bubbles: true,
            detail: {
                value: this.#value,
            }
        }));
    };

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.#shadowRoot.appendChild(tagBadgeTemplate.content.cloneNode(true));
        this.#removeButton = this.#shadowRoot.querySelector('button')!;

        this.value = this.getAttribute('value') ?? '';
        this.editable = this.getAttribute('editable') === 'true';

        if (!this.#editable) {
            this.#removeButton.remove();
        }
    }

    get value(): string {
        return this.#value;
    }

    set value(attrValue: string | number) {
        this.#value = String(attrValue);
        this.setAttribute('value', this.#value);
    }

    get editable(): boolean {
        return this.#editable;
    }

    set editable(attrValue: boolean) {
        this.#editable = attrValue;
        this.setAttribute('editable', String(this.#editable));
        if (this.#editable) {
            this.#shadowRoot.append(this.#removeButton);
        } else {
            this.#removeButton.remove();
        }
    }


    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case 'editable':
                    this.editable = newValue === 'true';
                    break;
                case 'value':
                    this.value = newValue;
                    break
            }

        }
    }

}

customElements.define('tag-badge', TagBadgeElement);

document.createElement('tag-badge');