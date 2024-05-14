import FormPlaceHolder from 'components/checkout/place-holder';
import { getCart } from 'lib/bagisto';
import dynamic from 'next/dynamic';

const PaymentPage = dynamic(() => import('components/checkout/payment'), {
  loading: () => <FormPlaceHolder />,
  ssr: false
});
const payment = async () => {
  const cart = await getCart();

  return (
    <PaymentPage
      selectedPayment={cart?.payment}
      shippingAddress={cart?.shippingAddress}
      selectedShipping={cart?.selectedShippingRate}
    />
  );
};

export default payment;
