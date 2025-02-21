import { ORDER_ID } from 'lib/constants';
import { cookies } from 'next/headers';

export default async function OrderDetail() {
  const cookieStore = await cookies();
  const getOrder = cookieStore.get(ORDER_ID);

  return (
    <div>
      <h1 className="my-2 text-center text-2xl font-bold">Your order number: #{getOrder?.value}</h1>
    </div>
  );
}
