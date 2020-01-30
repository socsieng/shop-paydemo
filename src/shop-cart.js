import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './google-pay-button.js'
import './payment-request-button.js'
import './shop-button.js';
import './shop-common-styles.js';
import './shop-form-styles.js';
import './spot-buy-button.js';
import config from './shop-configuration.js';
import { createGooglePayPaymentDetails, createPaymentRequestApiPaymentDetails, createSpotPaymentDetails } from './payment-details-factory.js';

class ShopCart extends PolymerElement {
  static get template() {
    return html`
    <style include="shop-common-styles shop-button shop-form-styles">

      .list {
        margin: 40px 0;
      }

      .checkout-box {
        font-weight: bold;
        text-align: center;
      }

      .subtotal {
        margin: 0 0 0 24px;
      }

      .buy-buttons {
        width: 80%;
        max-width: 400px;
        margin: 40px auto 20px;
        padding: 20px;
      }

      .buy-buttons > * {
        margin-bottom: 4px;
        width: 100%;
      }

      @media (max-width: 767px) {

        .subtotal {
          margin: 0 0 0 24px;
        }

      }

    </style>

    <div class="main-frame">
      <div class="subsection" visible$="[[!_hasItems]]">
        <p class="empty-cart">Your <iron-icon icon="shopping-cart"></iron-icon> is empty.</p>
      </div>
      <div class="subsection" visible$="[[_hasItems]]">
        <header>
          <h1>Your Cart</h1>
          <span>([[_getPluralizedQuantity(cart.length)]])</span>
        </header>
        <div class="list">
          <dom-repeat items="[[cart]]" as="entry">
            <template>
              <shop-cart-item entry="[[entry]]"></shop-cart-item>
            </template>
          </dom-repeat>
        </div>
        <div class="checkout-box">
          Total: <span class="subtotal">[[_formatTotal(total)]]</span>
        </div>

        <div class="buy-buttons">
          <google-pay-button id="googlePayButton"
            environment="[[config.googlepay.environment]]"
            allowed-payment-methods="[[config.googlepay.allowedPaymentMethods]]"
            merchant-info="[[config.googlepay.merchantInfo]]"
            shipping-address-required="[[config.googlepay.shippingAddressRequired]]"
            appearance="[[config.googlepay.appearance]]"
            on-payment-data-result="[[_onGooglePayPaymentDataResult]]"
            on-payment-authorized="[[config.googlepay.onPaymentAuthorized]]"
            email-required="true"
          ></google-pay-button>
          <payment-request-button id="paymentRequestButton"
            payment-methods="[[config.paymentrequest.paymentMethods]]"
            shipping-options="[[config.paymentrequest.shippingOptions]]"
            request-shipping="[[config.paymentrequest.requestShipping]]"
            on-payment-data-result="[[_onPaymentRequestPaymentDataResult]]"
            request-payer-email="true"
            request-payer-name="true"
          ></payment-request-button>
          <spot-buy-button id="spotBuyButton"
            allowed-payment-methods="[[config.spot.allowedPaymentMethods]]"
            merchant-info="[[config.spot.merchantInfo]]"
            on-payment-data-result="[[_onSpotPaymentDataResult]]"
          ></spot-buy-button>

          <shop-button hidden$="[[_isSpot]]">
            <a href="/checkout">Checkout</a>
          </shop-button>
        </div>
      </div>
    </div>
    `;
  }

  static get is() { return 'shop-cart'; }

  static get properties() {
    return {

      config: {
        type: Object,
        value: () => config,
      },

      total: Number,

      cart: Array,

      visible: {
        type: Boolean,
        observer: '_visibleChanged'
      },

      _hasItems: {
        type: Boolean,
        computed: '_computeHasItem(cart.length)'
      },

      _isSpot: {
        type: Boolean,
        value: () => !!window.microapps,
      }

    }

  }

  static get observers() { return [
    '_refreshDetails(cart, total)',
  ]}

  constructor() {
    super();

    this._onGooglePayPaymentDataResult = this._onGooglePayPaymentDataResult.bind(this);
    this._onPaymentRequestPaymentDataResult = this._onPaymentRequestPaymentDataResult.bind(this);
    this._onSpotPaymentDataResult = this._onSpotPaymentDataResult.bind(this);
  }

  _formatTotal(total) {
    return isNaN(total) ? '' : '$' + total.toFixed(2);
  }

  _computeHasItem(cartLength) {
    return cartLength > 0;
  }

  _getPluralizedQuantity(quantity) {
    return quantity + ' ' + (quantity === 1 ? 'item' : 'items');
  }

  _visibleChanged(visible) {
    if (visible) {
      // Notify the section's title
      this.dispatchEvent(new CustomEvent('change-section', {
        bubbles: true, composed: true, detail: { title: 'Your cart' }}));
    }
  }

  _onGooglePayPaymentDataResult(paymentResponse) {
    this.config.googlepay.onPaymentDataResponse.bind(this)(paymentResponse, {
      items: this.cart,
      type: 'cart',
      method: 'google-pay',
    });
  }

  _onPaymentRequestPaymentDataResult(paymentResponse) {
    this.config.googlepay.onPaymentDataResponse.bind(this)(paymentResponse, {
      items: this.cart,
      type: 'cart',
      method: 'payment-request',
    });
  }

  _onSpotPaymentDataResult(paymentResponse) {
    this.config.googlepay.onPaymentDataResponse.bind(this)(paymentResponse, {
      items: this.cart,
      type: 'cart',
      method: 'spot',
    });
  }

  _refreshDetails() {
    this.$.googlePayButton.transactionInfo = createGooglePayPaymentDetails(this.cart);
    this.$.paymentRequestButton.details = createPaymentRequestApiPaymentDetails(this.cart);
    this.$.spotBuyButton.transactionInfo = createSpotPaymentDetails(this.cart);
  }

}

customElements.define(ShopCart.is, ShopCart);
