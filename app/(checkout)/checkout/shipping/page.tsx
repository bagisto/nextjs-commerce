import FormPlaceHolder from 'components/checkout/place-holder';
import { getCart, getShippingMethod } from 'lib/bagisto';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
const ShippingMethod = dynamic(() => import('components/checkout/shipping'), {
  loading: () => <FormPlaceHolder />,
  ssr: false
});
const Shipping = async () => {
  const cart = await getCart();
  const shippingMethod = await getShippingMethod();

  return <ShippingMethod shippingAddress={cart?.shippingAddress} shippingMethod={shippingMethod} />;
};
export default Shipping;
export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Checkout with store items'
};
