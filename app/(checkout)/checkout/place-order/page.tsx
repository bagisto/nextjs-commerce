import { getCart } from 'lib/bagisto';
import dynamic from 'next/dynamic';
const PlaceOrderPage = dynamic(() => import('components/checkout/place-order'), {
  ssr: false
});
export default async function palaceOrder() {
  const cart = await getCart();
  return (
    <PlaceOrderPage
      selectedPayment={cart?.payment}
      shippingAddress={cart?.shippingAddress}
      selectedShipping={cart?.selectedShippingRate}
    />
  );
}
