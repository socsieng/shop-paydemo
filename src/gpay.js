let _client;

const shippingOptions = [
  {
    "id": "free",
    "label": "Free shipping",
    "detail": "Arrives in 5 to 7 days",
    "price": 0.00
  },
  {
    "id": "express",
    "label": "Express shipping",
    "detail": "Arrives in 1 to 3 days",
    "price": 5.00
  }
];

export default class GPay {
  static get clientConfiguration() {
    return {
      environment: 'PRODUCTION',
      // paymentDataCallbacks: {
      //   onPaymentDataChanged: (data) => {
      //     console.log('onPaymentDataChanged', data);
      //     return Promise.resolve({});
      //   },
      // },
    };
  }

  static get gPayBaseRequest() {
    const cardPaymentMethod = {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          'gateway': 'stripe',
          'stripe:version': '2018-10-31',
          'stripe:publishableKey': 'pk_test_MNKMwKAvgdo2yKOhIeCOE6MZ00yS3mWShu',
        },
      },
    };

    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      merchantInfo: {
        merchantId: '17613812255336763067',
        merchantName: 'Demo Merchant',
      },
      allowedPaymentMethods: [
        cardPaymentMethod,
      ],
      shippingAddressRequired: true,
      // callbackIntents: ['SHIPPING_ADDRESS'], //, 'SHIPPING_OPTION'],
      // shippingOptionRequired: true,
    };
  }

  static get client() {
    if (!_client) {
      _client = new google.payments.api.PaymentsClient(GPay.clientConfiguration);
    }

    return _client;
  }
}
