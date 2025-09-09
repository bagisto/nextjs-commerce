import { NextResponse } from "next/server";

import { bagistoFetch } from "@/lib/bagisto";
import { placeorder } from "@/lib/bagisto/mutations/checkout/place-order";
import { isBagistoError } from "@/lib/type-guards";
import { cookies } from "next/headers";
import { BAGISTO_SESSION } from "@/lib/constants";

export async function POST() {
  try {
    const store = await cookies();
    const res = await bagistoFetch<any>({
      query: placeorder,
      variables: {},
      cache: "no-store",
    });
    if (res?.body?.data?.placeOrder?.success) {
      store.delete(BAGISTO_SESSION);
    }

    return NextResponse.json({ data: { ...res?.body?.data } });
  } catch (error) {
    if (isBagistoError(error)) {
      return NextResponse.json(
        {
          data: { placeOrder: null },
          error: { ...(error as any).cause },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
}
