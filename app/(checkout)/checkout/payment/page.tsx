import FormPlaceHolder from 'components/checkout/place-holder';
import { getCart, getPaymentMethod } from 'lib/bagisto';

import dynamic from 'next/dynamic';

const PaymentPage = dynamic(() => import('components/checkout/payment'), {
  loading: () => <FormPlaceHolder />,
  ssr: false
});
const payment = async () => {
  const cart = await getCart();

  const methods = await getPaymentMethod({
    shippingMethod: cart?.selectedShippingRate?.method || ''
  });
  return (
    <PaymentPage
      selectedPayment={cart?.payment}
      shippingAddress={cart?.shippingAddress}
      methods={methods}
      selectedShipping={cart?.selectedShippingRate}
    />
  );
};

export default payment;
