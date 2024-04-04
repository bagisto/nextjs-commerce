import { BasketCartIcon } from 'components/icons/shopping-cart';
import dynamic from 'next/dynamic';
import { EventButton } from './event-button';
const OrderDetail = dynamic(() => import('./order-detail'), {
  loading: () => (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="mb-4 h-8 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <span className="sr-only">Loading...</span>
    </div>
  ),
  ssr: false
});
const EmptyCartPage = () => {
  return (
    <div className="mx-auto flex h-[100dvh] max-w-6xl items-center">
      <div className=" flex w-full flex-col items-center justify-center overflow-hidden">
        <BasketCartIcon className="h-48 w-48" />
        <OrderDetail />
        <h1 className="my-2 text-center text-4xl font-bold">Your cart is empty.</h1>
        <EventButton buttonName="continue shopping" redirect="/" />
      </div>
    </div>
  );
};
export default EmptyCartPage;
