import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './google-pay-button.js'
import './payment-request-button.js'
import './shop-button.js';
import './shop-category-data.js';
import './shop-common-styles.js';
import './shop-image.js';
import './shop-select.js';
import './spot-buy-button.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { microTask } from '@polymer/polymer/lib/utils/async.js';
import config from './shop-configuration.js';

class ShopDetail extends PolymerElement {
  static get template() {
    return html`
    <style include="shop-common-styles shop-button shop-select">

      :host {
        display: block;
      }

      #content {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      shop-image {
        position: relative;
        margin: 64px 32px;
        width: 50%;
        max-width: 600px;
        --shop-image-img: {
          @apply --layout-fit;
        };
      }

      shop-image::before {
        content: "";
        display: block;
        padding-top: 100%;
      }

      .detail {
        margin: 64px 32px;
        width: 50%;
        max-width: 400px;
        transition: opacity 0.4s;
        opacity: 0;
      }

      .detail[has-content] {
        opacity: 1;
      }

      h1 {
        font-size: 24px;
        font-weight: 500;
        line-height: 28px;
        margin: 0;
      }

      .price {
        margin: 16px 0 40px;
        font-size: 16px;
        color: var(--app-secondary-color);
      }

      .description {
        margin: 32px 0;
      }

      .description > h2 {
        margin: 16px 0;
        font-size: 13px;
      }

      .description > p {
        margin: 0;
        color: var(--app-secondary-color);
      }

      .pickers {
        @apply --layout-vertical;
        border-top: 1px solid #ccc;
      }

      shop-select > select {
        font-size: 16px;
        padding: 16px 24px 16px 70px;
      }

      .buttons {
        display: flex;
        flex-direction: column;
      }

      .buttons > * {
        margin-top: 4px;
        width: 100%;
      }

      @media (max-width: 767px) {

        #content {
          @apply --layout-vertical;
          @apply --layout-center;
        }

        shop-image {
          margin: 0;
          width: 80%;
        }

        .detail {
          box-sizing: border-box;
          margin: 32px 0;
          padding: 0 24px;
          width: 100%;
          max-width: 600px;
        }

        h1 {
          font-size: 20px;
          line-height: 24px;
        }

        .price {
          font-size: inherit;
          margin: 12px 0 32px;
        }

      }

    </style>

    <!--
      app-route provides the name of the category and the item.
    -->
    <app-route
        route="[[route]]"
        pattern="/:category/:item"
        data="{{routeData}}"></app-route>

    <!--
      shop-category-data provides the item data for a given category and item name.
    -->
    <shop-category-data
        id="categoryData"
        category-name="[[routeData.category]]"
        item-name="[[routeData.item]]"
        item="{{item}}"
        failure="{{failure}}"></shop-category-data>

    <div id="content" hidden$="[[failure]]">
      <shop-image alt="[[item.title]]" src="[[item.image]]"></shop-image>
      <div class="detail" has-content$="[[_isDefined(item)]]">
        <h1>[[item.title]]</h1>
        <div class="price">[[_formatPrice(item.price)]]</div>
        <div class="pickers">
          <shop-select>
            <label id="sizeLabel" prefix>Size</label>
            <select id="sizeSelect" aria-labelledby="sizeLabel">
              <template is="dom-repeat" items="[[item.variations]]" as="size">
                <option value="[[size.title]]">[[size.title]]</option>
              </template>
            </select>
            <shop-md-decorator aria-hidden="true">
              <shop-underline></shop-underline>
            </shop-md-decorator>
          </shop-select>
          <shop-select>
            <label id="quantityLabel" prefix>Quantity</label>
            <select id="quantitySelect" aria-labelledby="quantityLabel" value="{{quantity::change}}">
              <option value="1" selected?="[[_isSelected(1, quantity)]]">1</option>
              <option value="2" selected?="[[_isSelected(2, quantity)]]">2</option>
              <option value="3" selected?="[[_isSelected(3, quantity)]]">3</option>
              <option value="4" selected?="[[_isSelected(4, quantity)]]">4</option>
              <option value="5" selected?="[[_isSelected(5, quantity)]]">5</option>
            </select>
            <shop-md-decorator aria-hidden="true">
              <shop-underline></shop-underline>
            </shop-md-decorator>
          </shop-select>
        </div>
        <div class="description">
          <h2>Description</h2>
          <p id="desc"></p>
        </div>
        <div class="buttons">
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
            payment-methods="[[config.paymentrequest.paymentMethods]]"
            shipping-options="[[config.paymentrequest.shippingOptions]]"
            request-shipping="[[config.paymentrequest.requestShipping]]"
            on-payment-data-result="[[_onPaymentRequestPaymentDataResult]]"
          ></spot-buy-button>
          <shop-button>
            <button on-click="_addToCart" aria-label="Add this item to cart">Add to Cart</button>
          </shop-button>
        </div>
      </div>
    </div>

    <!--
      shop-network-warning shows a warning message when the items can't be rendered due
      to network conditions.
    -->
    <shop-network-warning
        hidden$="[[!failure]]"
        offline="[[offline]]"
        on-try-reconnect="_tryReconnect"></shop-network-warning>
    `;

  }

  constructor() {
    super();

    this._onGooglePayPaymentDataResult = this._onGooglePayPaymentDataResult.bind(this);
    this._onPaymentRequestPaymentDataResult = this._onPaymentRequestPaymentDataResult.bind(this);
  }

  static get is() { return 'shop-detail'; }

  static get properties() { return {

    config: {
      type: Object,
      value: () => config,
    },

    item: Object,

    quantity: {
      type: Number,
      value: 1,
      observer: '_quantityChanged',
    },

    route: Object,

    routeData: Object,

    visible: {
      type: Boolean,
      value: false
    },

    offline: {
      type: Boolean,
      observer: '_offlineChanged'
    },

    failure: Boolean

  }}

  static get observers() { return [
    '_itemChanged(item, visible)',
    '_updateSizes(item)',
  ]}

  _itemChanged(item, visible) {
    if (visible) {
      this._itemChangeDebouncer = Debouncer.debounce(this._itemChangeDebouncer,
        microTask, () => {
          let text = item ? item.descriptionHtml : '';
          this.$.desc.innerHTML = this._unescapeText(text);

          this._updateSizes(item);

          // Reset the select menus.
          this.quantity = 1;

          this.$.googlePayButton.transactionInfo = this._getGooglePayTransactionInfo();
          this.$.paymentRequestButton.details = this._getPaymentRequestDetails();

          this.dispatchEvent(new CustomEvent('change-section', {
            bubbles: true, composed: true, detail: {
              category: item ? item.category : '',
              title: item ? item.title : '',
              description: item ? item.description.substring(0, 100) : '',
              image: item ? this.baseURI + item.image : ''
            }}));
        })
    }
  }

  _onGooglePayPaymentDataResult(paymentResponse) {
    this.config.googlepay.onPaymentDataResponse.bind(this)(paymentResponse, this._getPurchaseContext('google-pay'));
  }

  _onPaymentRequestPaymentDataResult(paymentResponse) {
    this.config.paymentrequest.onPaymentDataResponse.bind(this)(paymentResponse, this._getPurchaseContext('payment-request'));
  }

  _getPurchaseContext(method) {
    return {
      items: [
        {
          item: this.item,
          quantity: this.quantity,
          size: this.$.sizeSelect.value
        }
      ],
      type: 'item',
      method,
    };
  }

  _quantityChanged(q) {
    if (typeof q === 'string') {
      this.quantity = parseInt(q, 10);
    }
    this.$.googlePayButton.transactionInfo = this._getGooglePayTransactionInfo();
    this.$.paymentRequestButton.details = this._getPaymentRequestDetails();
  }

  _updateSizes(item) {
    if (item) {
      this.$.sizeSelect.value = (item.variations.find(v => v.title === 'M') || item.variations[0]).title;
    } else {
      this.$.sizeSelect.value = 'M';
    }
  }

  _unescapeText(text) {
    let elem = document.createElement('textarea');
    elem.innerHTML = text;
    return elem.textContent;
  }

  _formatPrice(price) {
    return price ? '$' + price.toFixed(2) : '';
  }

  _addToCart() {
    // This event will be handled by shop-app.
    this.dispatchEvent(new CustomEvent('add-cart-item', {
      bubbles: true, composed: true, detail: {
        item: this.item,
        quantity: this.quantity,
        size: this.$.sizeSelect.value
      }}));
  }

  _isDefined(item) {
    return item != null;
  }

  _tryReconnect() {
    this.$.categoryData.refresh();
  }

  _offlineChanged(offline) {
    if (!offline) {
      this._tryReconnect();
    }
  }

  _getGooglePayTransactionInfo() {
    if (this.item) {
      const price = this.quantity * this.item.price;
      return {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: price.toFixed(2),
        currencyCode: 'USD',
        countryCode: 'US',
        displayItems: [{
          label: `${this.item.title} x ${this.quantity}`,
          type: 'LINE_ITEM',
          price: price.toFixed(2),
        }],
      };
    }
    return null;
  }

  _getPaymentRequestDetails() {
    if (this.item) {
      const price = this.quantity * this.item.price;
      return {
        total: {
          label: 'Total',
          amount: {
            currency: 'USD',
            value: price.toFixed(2),
          },
        },
        displayItems: [{
          label: `${this.item.title} x ${this.quantity}`,
          type: 'LINE_ITEM',
          amount: {
            currency: 'USD',
            value: price.toFixed(2),
          }
        }],
      };
    }
    return null;
  }

  _isSelected(option, value) {
    return option == value;
  }

}

customElements.define(ShopDetail.is, ShopDetail);
