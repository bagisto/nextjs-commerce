import { NextResponse } from "next/server";
import { CREATE_CHECKOUT_ORDER } from "@/graphql";
import { bagistoFetch } from "@utils/bagisto";
import { isBagistoError } from "@utils/type-guards";
import { CreateCheckoutOrderOperation } from "@/types/checkout/type";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      token : body.token
    }

    const res = await bagistoFetch<CreateCheckoutOrderOperation>({
      query: CREATE_CHECKOUT_ORDER,
      variables: variables,
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
