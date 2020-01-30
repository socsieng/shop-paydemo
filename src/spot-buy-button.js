import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

const emptyPaymentDetails = {
  total: {
    label: 'Total',
    amount: {
      currency: 'USD',
      value: '0.00',
    },
  },
};

class SpotBuyButton extends PolymerElement {

  static get template() {
    return html`
    <style>
      :host {
        display: none;
      }

      button {
        background-color: #000;
        color: #fff;
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

    <button on-click="_handleClick">Buy Now</button>
    `;
  }

  static get is() { return 'spot-buy-button'; }

  static get properties() {
    return {
      version: {
        type: Object,
        value: {
          major: 2,
          minor: 0,
        }
      },
      allowedPaymentMethods: Array,
      merchantInfo: Object,
      transactionInfo: Object,
      onPaymentDataResult: Function,
      onError: Function,

      paymentMethods: Array,
      details: Object,
      shippingOptions: Array,
      requestShipping: Boolean,
      onPaymentDataChanged: Function,
      onPaymentAuthorized: Function,
      onCanMakePaymentChange: Function,
    };
  }

  constructor() {
    super();

    this._handleClick = this._handleClick.bind(this);
  }

  ready() {
    super.ready();

    if (window.microapps) {
      this._initializeButton();
    }
  }

  _buildPaymentRequest(paymentDetails = emptyPaymentDetails, options = null) {
    return new PaymentRequest(this.paymentMethods, paymentDetails, options);
  }

  _initializeButton() {
    this.style.display = 'block';
  }

  _handleClick() {
    const referenceId = `ref-${new Date().getTime()}`;

    const paymentRequest = {
      apiVersion: this.version.major,
      apiVersionMinor: this.version.minor,
      allowedPaymentMethods: this.allowedPaymentMethods,
      merchantInfo: this.merchantInfo,
      transactionInfo: this.transactionInfo,
    };

    microapps.requestPayment(paymentRequest).then(response => {
      if (this.onPaymentDataResult) {
        this.onPaymentDataResult(response);
      }
      console.log('microapps payment', response);
    }).catch(error => {
      if (this.onError) {
        this.onError(error);
      }
      console.log('microapps error', error);
    });
  }
}

customElements.define(SpotBuyButton.is, SpotBuyButton);
