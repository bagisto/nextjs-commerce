'use client';
import { getLocalStorage } from 'lib/utils';
import { useSearchParams } from 'next/navigation';

export default function OrderDetail() {
  const searchParams = useSearchParams();
  const order = searchParams.get('order');
  const getOrder = getLocalStorage('reviewOrder', true);
  return (
    getOrder?.id == order && (
      <div>
        <h1 className="my-2 text-center text-2xl font-bold">Your order number:{getOrder?.id}</h1>
      </div>
    )
  );
}
