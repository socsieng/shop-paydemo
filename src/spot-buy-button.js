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
      paymentMethods: Array,
      details: Object,
      shippingOptions: Array,
      requestShipping: Boolean,
      onPaymentDataChanged: Function,
      onPaymentAuthorized: Function,
      onPaymentDataResult: Function,
      onError: Function,
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
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'UPI',
        parameters: {
          payeeVpa: 'merchant@psp',
          payeeName: 'Merchant Name',
          mcc: '0000',
          transactionId: referenceId,
          transactionReferenceId: `${referenceId}txnId`,
        },
        tokenizationSpecification: {type: 'DIRECT', parameters: {}}
      }],
      merchantInfo: {merchantId: 'Example Merchant'},
      transactionInfo: {
        currencyCode: 'INR',
        countryCode: 'IN',
        totalPriceStatus: 'FINAL',
        totalPrice: '10' // set in checkout()
      }
    };

    microapps.requestPayment(paymentRequest).then(response => {
      console.log('microapps payment');
    }).catch(error => {
      console.log('microapps error', error);
    });
    // const details = this.details;

    // if (!details.total.amount.value && details.displayItems) {
    //   const total = details.displayItems.reduce((sum, item) => sum + parseFloat(item.amount.value), 0);
    //   details.total.amount.value = total.toFixed(2);
    // }

    // const paymentRequest = this._buildPaymentRequest({
    //   shippingOptions: this.shippingOptions,
    //   ...details,
    // }, {
    //   requestShipping: this.requestShipping,
    // });

    // return paymentRequest.show()
    //   .then(paymentResponse => {
    //     if (this.onPaymentDataResult) {
    //       this.onPaymentDataResult(paymentResponse);
    //     }
    //     paymentResponse.complete();
    //   })
    //   .catch(error => {
    //     if (this.onError) {
    //       this.onError(error);
    //     }
    //     console.log('Error', { error, paymentRequest });
    //   });
  }
}

customElements.define(SpotBuyButton.is, SpotBuyButton);
