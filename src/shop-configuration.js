export default {
  googlepay: {
    environment: 'TEST',
    version: {
      major: 2,
      minor: 0,
    },
    emailRequired: false,
    existingPaymentMethodRequired: false,
    shippingAddressRequired: true,
    appearance: {
      buttonColor: 'default',
      buttonType: 'long',
      width: '100%',
    },
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            'gateway': 'stripe',
            'stripe:version': '2018-10-31',
            'stripe:publishableKey': 'pk_test_MNKMwKAvgdo2yKOhIeCOE6MZ00yS3mWShu',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: '17613812255336763067',
      merchantName: 'Demo Merchant',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: '0',
      currencyCode: 'USD',
      countryCode: 'US',
    },
    onPaymentDataResponse: function (paymentResponse, context) {
      console.log('Success', paymentResponse);
      this.dispatchEvent(new CustomEvent('payment-selected', {
        bubbles: true,
        composed: true,
        detail: {
          paymentResponse,
          context: typeof context === 'function' ? context() : context,
        }
      }));
    },
    onPaymentAuthorized: function () { return { transactionState: 'SUCCESS'}; },
  },
  paymentrequest: {
    paymentMethods: [
      {
        supportedMethods: 'basic-card',
        data: {
          supportedNetworks: ['visa', 'mastercard', 'amex'],
        },
      },
    ],
    shippingOptions: [
      {
        id: 'free',
        label: 'Free shipping',
        amount: {
          currency: 'USD',
          value: '0.00',
        },
        selected: true,
      }
    ],
    requestShipping: true,
    onPaymentDataResponse: function (paymentResponse, context) {
      console.log('Success', paymentResponse);
      this.dispatchEvent(new CustomEvent('payment-selected', {
        bubbles: true,
        composed: true,
        detail: {
          paymentResponse,
          context: typeof context === 'function' ? context() : context,
        }
      }));
    },
  },
  spot: {
    version: {
      major: 2,
      minor: 0,
    },
    get allowedPaymentMethods() {
      const referenceId = `ref-${new Date().getTime()}`;
      return [
        {
          type: 'UPI',
          parameters: {
            payeeVpa: 'm-redirect@okaxis',
            payeeName: 'Merchant Name',
            mcc: '0000',
            transactionId: referenceId,
            transactionReferenceId: `${referenceId}txnId`,
          },
          tokenizationSpecification: {type: 'DIRECT', parameters: {}},
        },
      ];
    },
    merchantInfo: {
      merchantName: 'Demo Merchant',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: '0',
      currencyCode: 'INR',
      countryCode: 'IN',
    },
    onPaymentDataResponse: function (paymentResponse, context) {
      console.log('Success', paymentResponse);
      this.dispatchEvent(new CustomEvent('payment-selected', {
        bubbles: true,
        composed: true,
        detail: {
          paymentResponse,
          context: typeof context === 'function' ? context() : context,
        }
      }));
    },
  },
};
