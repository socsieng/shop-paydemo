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
import { createGooglePayPaymentDetails, createPaymentRequestApiPaymentDetails, createSpotPaymentDetails } from './payment-details-factory.js';

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
        <div class="price">[[_formatPrice(price)]]</div>
        <div class="pickers">
          <shop-select hidden$="[[!hasVariations]]">
            <label id="sizeLabel" prefix>Size</label>
            <select id="sizeSelect" aria-labelledby="sizeLabel" onChange="{{_variantChanged}}">
              <template is="dom-repeat" items="[[item.variations]]" as="v">
                <option value="[[v.title]]" selected?="[[_isVariantSelected(v)]]">[[v.title]]</option>
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
            allowed-payment-methods="[[config.spot.allowedPaymentMethods]]"
            merchant-info="[[config.spot.merchantInfo]]"
            on-payment-data-result="[[_onSpotPaymentDataResult]]"
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
    this._onSpotPaymentDataResult = this._onSpotPaymentDataResult.bind(this);
    this._variantChanged = this._variantChanged.bind(this);
  }

  static get is() { return 'shop-detail'; }

  static get properties() { return {

    config: {
      type: Object,
      value: () => config,
    },

    variant: Object,

    item: Object,
    price: Number,

    quantity: {
      type: Number,
      value: 1,
      observer: '_quantityChanged',
    },

    hasVariations: {
      type: Boolean,
      computed: '_hasVariations(item)',
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
  ]}

  _itemChanged(item, visible) {
    if (visible) {
      this._itemChangeDebouncer = Debouncer.debounce(this._itemChangeDebouncer,
        microTask, () => {
          // Reset the select menus.
          this.quantity = 1;

          if (item && item.variations) {
            this.variant = item.variations.find(v => v.title === 'M') || item.variations[0];
          }

          this._updateDetails();

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

  _onSpotPaymentDataResult(paymentResponse) {
    this.config.spot.onPaymentDataResponse.bind(this)(paymentResponse, this._getPurchaseContext('spot'));
  }

  _getPurchaseContext(method) {
    return {
      items: [
        {
          item: this.item,
          quantity: this.quantity,
          variant: this.variant,
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
    this._updateDetails();
  }

  _variantChanged(event) {
    const item = this.item;
    if (item && item.variations) {
      const variant = item.variations.find(v => v.title === event.target.value) || item.variations[0];
      this.variant = variant;
    }
    this._updateDetails();
  }

  _isVariantSelected(variant) {
    return this.variant === variant;
  }

  _updateDetails() {
    const item = this.item;

    if (item) {
      this.price = this.variant ? this.variant.price : item ? item.price : undefined;

      this.$.desc.innerHTML = this.variant && this.variant.descriptionHtml
        ? this.variant.descriptionHtml
        : item
          ? item.descriptionHtml
          : '';

      this.$.sizeSelect.value = this.variant ? this.variant.title : undefined;

      const cart = [{
        item,
        variant: this.variant,
        quantity: this.quantity,
      }];
      this.$.googlePayButton.transactionInfo = createGooglePayPaymentDetails(cart);
      this.$.paymentRequestButton.details = createPaymentRequestApiPaymentDetails(cart);
      this.$.spotBuyButton.transactionInfo = createSpotPaymentDetails(cart);
    }
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
        variant: this.variant,
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

  _isSelected(option, value) {
    return option == value;
  }

  _hasVariations(item) {
    return item && (item.variations || []).length;
  }

}

customElements.define(ShopDetail.is, ShopDetail);
