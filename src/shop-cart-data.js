import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import { getCartPrice } from './payment-details-factory';

class ShopCartData extends PolymerElement {
  static get template() {
    return html`
    <app-localstorage-document key="shop-cart-data" data="{{cart}}"></app-localstorage-document>
`;
  }

  static get is() { return 'shop-cart-data'; }

  static get properties() { return {

    cart: {
      type: Array,
      value: () => [],
      notify: true
    },

    numItems: {
      type: Number,
      computed: '_computeNumItems(cart.splices)',
      notify: true
    },

    total: {
      type: Number,
      computed: '_computeTotal(cart.splices)',
      notify: true
    }

  }}

  addItem(detail) {
    let i = this._indexOfEntry(detail.item.sku, detail.variant);
    if (i !== -1) {
      detail.quantity += this.cart[i].quantity;
    }
    this.setItem(detail);
  }

  setItem(detail) {
    let i = this._indexOfEntry(detail.item.sku, detail.variant);
    if (detail.quantity === 0) {
      // Remove item from cart when the new quantity is 0.
      if (i !== -1) {
        this.splice('cart', i, 1);
      }
    } else {
      // Use Polymer's array mutation methods (`splice`, `push`) so that observers
      // on `cart.splices` are triggered.
      if (i !== -1) {
        this.splice('cart', i, 1, detail);
      } else {
        this.push('cart', detail);
      }
    }
  }

  clearCart() {
    this.cart = [];
  }

  _computeNumItems() {
    if (this.cart) {
      return this.cart.reduce((total, entry) => {
        return total + entry.quantity;
      }, 0);
    }

    return 0;
  }

  _computeTotal() {
    if (this.cart) {
      return getCartPrice(this.cart);
    }

    return 0;
  }

  _indexOfEntry(sku, variant) {
    if (this.cart) {
      for (let i = 0; i < this.cart.length; ++i) {
        let entry = this.cart[i];
        if (entry.item.sku === sku && entry.variant === variant) {
          return i;
        }
      }
    }

    return -1;
  }
}

customElements.define(ShopCartData.is, ShopCartData);
