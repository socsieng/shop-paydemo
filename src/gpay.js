let _client;
let _googlePayLoadedResolver;

const _paymentClientPromise = new Promise(resolve => {
  _googlePayLoadedResolver = resolve;
});

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

window.addEventListener('load', () => {
  _googlePayLoadedResolver(google.payments.api.PaymentsClient);
});

export default class GPay {
  static get clientConfiguration() {
    return {
      environment: 'TEST',
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
      // tokenizationSpecification: {
      //   type: 'DIRECT',
      //   parameters: {
      //     'protocolVersion': 'ECv2',
      //     'publicKey': 'BMzk6xvwPgU8vjB6O/HnFFkMQL/w17yIoKy/6KuRYjOrh0eV12xM6guaYPHdgMHyUzTm9/Vi7KRu4tuRmhm6nv8=',
      //   },
      // },
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

  static getClient() {
    return _paymentClientPromise
      .then(PaymentsClient => {
        if (!_client) {
          _client = new PaymentsClient(GPay.clientConfiguration);
        }

        return _client;
      });
  }
}
