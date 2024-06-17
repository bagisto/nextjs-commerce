import dynamic from 'next/dynamic';
import { getCart } from 'lib/bagisto';
import { cookies } from 'next/headers';
import { BAGISTO_SESSION } from 'lib/constants';
const CartModal = dynamic(() => import('./modal'), { ssr: false });

export default async function Cart() {
  const cartId = cookies().get(BAGISTO_SESSION)?.value;
  let cart;
  if (cartId) {
    cart = await getCart();
  }

  return <CartModal cart={cart} />;
}
