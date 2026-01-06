import { NextResponse } from "next/server";
import { bagistoFetch } from "@/utils/bagisto";
import { isBagistoError } from "@/utils/type-guards";
import { CREATE_CHECKOUT_PAYMENT_METHODS } from "@/graphql";

export async function POST(req: Request) {
  try {
     const body = await req.json();

    const variables = {
  token: body.token,
  paymentMethod: body.paymentMethod,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
  failureUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`
}

    const res = await bagistoFetch<any>({
      query: CREATE_CHECKOUT_PAYMENT_METHODS,
      variables: variables as any ,
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