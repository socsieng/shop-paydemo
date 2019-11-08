const emptyPaymentDetails = {
  total: {
    label: 'Total',
    amount: {
      currency: 'USD',
      value: '0.00',
    },
  },
};

const paymentMethods = [
  {
    supportedMethods: 'basic-card',
    data: {
      supportedNetworks: ['visa', 'mastercard', 'amex'],
    },
  },
  {
    supportedMethods: 'https://google.com/pay',
    data: {
      environment: 'TEST',
      apiVersion: 2,
      apiVersionMinor: 0,
      merchantInfo: {
        // A merchant ID is available after approval by Google.
        // @see {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist}
        // merchantId: '01234567890123456789',
        merchantName: 'Example Merchant',
      },
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          // Check with your payment gateway on the parameters to pass.
          // @see {@link https://developers.google.com/pay/api/web/reference/object#Gateway}
          parameters: {
            'gateway': 'example',
            'gatewayMerchantId': 'exampleGatewayMerchantId',
          },
        },
      }],
    },
  },
];

export default class PaymentRequestFactory {
  createPaymentRequest(paymentDetails = emptyPaymentDetails, options = null) {
    return new PaymentRequest(paymentMethods, paymentDetails, options);
  }
}