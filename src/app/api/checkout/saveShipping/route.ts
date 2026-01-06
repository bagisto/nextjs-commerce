import { NextResponse } from "next/server";
import { bagistoFetch } from "@/utils/bagisto";
import { isBagistoError } from "@/utils/type-guards";
import { CREATE_CHECKOUT_SHIPPING_METHODS } from "@/graphql";
import { CreateCheckoutShippingMethodVariables } from "@/types/checkout/type";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables : CreateCheckoutShippingMethodVariables = {
      token : body.token,
      shippingMethod: body.shippingMethod
    }

    const res = await bagistoFetch<any>({
      query: CREATE_CHECKOUT_SHIPPING_METHODS,
      variables: variables as any,
      cache: "no-store",
    });

    return NextResponse.json({ data: res?.body?.data}, { status: 200 });
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
