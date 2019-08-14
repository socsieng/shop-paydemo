let _client;

export default class GPay {
  static get clientConfiguration() {
    return {
      environment: 'TEST',
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
          'gateway': 'example',
          'gatewayMerchantId': 'exampleGatewayMerchantId'
        },
      },
    };

    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      merchantInfo: {
        merchantId: '1234567890',
        merchantName: 'Demo Merchant',
      },
      allowedPaymentMethods: [
        cardPaymentMethod,
      ],
      shippingAddressRequired: false,
      shippingOptionRequired: false,
    };
  }

  static get client() {
    if (!_client) {
      _client = new google.payments.api.PaymentsClient(GPay.clientConfiguration);
    }

    return _client;
  }
}
