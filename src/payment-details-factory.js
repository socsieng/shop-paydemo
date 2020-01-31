function getTotalPrice(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

export function getCartSummary(cart) {
  return cart.map(i => ({
    label: `${i.item.title}${i.variant ? ` - ${i.variant.title}` : ''} x ${i.quantity}`,
    price: ((i.variant ? i.variant.price : i.item.price) * i.quantity),
  }));
}

export function getCartPrice(cart) {
  return getTotalPrice(getCartSummary(cart));
}

export function createGooglePayPaymentDetails(cart) {
  const items = getCartSummary(cart);

  return {
    totalPriceStatus: 'FINAL',
    totalPriceLabel: 'Total',
    totalPrice: getTotalPrice(items).toFixed(2),
    currencyCode: 'USD',
    countryCode: 'US',
    displayItems: items.map(i => ({
      label: i.label,
      type: 'LINE_ITEM',
      price: i.price.toFixed(2),
    })),
  };
}

export function createPaymentRequestApiPaymentDetails(cart) {
  const items = getCartSummary(cart);

  return {
    total: {
      label: 'Total',
      amount: {
        currency: 'USD',
        value: getTotalPrice(items).toFixed(2),
      },
    },
    displayItems: items.map(i => ({
      label: i.label,
      type: 'LINE_ITEM',
      amount: {
        currency: 'USD',
        value: i.price.toFixed(2),
      }
    })),
  };
}

export function createSpotPaymentDetails(cart) {
  const details = createGooglePayPaymentDetails(cart);

  return {
    ...details,
    currencyCode: 'INR',
    countryCode: 'IN',
  };
}
