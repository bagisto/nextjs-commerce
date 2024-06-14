import { getCart } from 'lib/bagisto';
import { cookies } from 'next/headers';
import CartModal from './modal';
import { BAGISTO_SESSION } from 'lib/constants';
export default async function Cart() {
  const cartId = cookies().get(BAGISTO_SESSION)?.value;
  let cart;
  if (cartId) {
    cart = await getCart();
  }

  return <CartModal cart={cart} />;
}
