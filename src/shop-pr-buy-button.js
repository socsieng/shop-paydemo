import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import PaymentRequestFactory from './payment-request-factory';
import Settings from './settings.js';

class ShopPaymentRequestBuyButton extends PolymerElement {

  static get template() {
    return html`
    <style>
      :host {
        display: none;
      }

      button {
        background-color: #fff;
        color: var(--app-primary-color);
        border: 2px solid #000;
        width: 100%;
        padding: 8px 44px;
        font-size: 14px;
        font-weight: 500;
        display: block;
        text-transform: uppercase;
      }

      button:focus {
        background-color: #c5cad3;
      }

      button:active {
        background-color: #000;
        color: #fff;
      }
    </style>

    <button on-click="_buy">Buy Now</button>
    `;
  }

  static get is() { return 'shop-pr-buy-button'; }

  static get properties() {
    return {
      onBuy: Function,
    };
  }

  ready() {
    super.ready();

    if (Settings.get('pr') === '1') {
      this._initializeButton();
    }
  }

  _initializeButton() {
    if (window.PaymentRequest) {
      const factory = new PaymentRequestFactory();
      const paymentRequest = factory.createPaymentRequest();
      if (paymentRequest.canMakePayment()) {
        this.style.display = 'block';
      }
    }
  }

  _buy() {
    if (this.onBuy) {
      this.onBuy();
    }
  }
}

customElements.define(ShopPaymentRequestBuyButton.is, ShopPaymentRequestBuyButton);
