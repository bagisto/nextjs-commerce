import { NextResponse } from "next/server";

import { bagistoFetch } from "@/lib/bagisto";
import { addShippingMethodMutation } from "@/lib/bagisto/mutations/checkout/save-shipping";
import { isBagistoError } from "@/lib/type-guards";

export async function POST(req: Request) {
  try {
    const variables = await req.json();

    const res = await bagistoFetch<any>({
      query: addShippingMethodMutation,
      variables: variables,
      cache: "no-store",
    });

    return NextResponse.json({ data: { ...res?.body?.data } });
  } catch (error) {
    if (isBagistoError(error)) {
      return NextResponse.json(
        {
          data: { saveShipping: null },
          error: { ...error.cause },
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
