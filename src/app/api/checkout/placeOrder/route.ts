import { NextResponse } from "next/server";
import { CREATE_CHECKOUT_ORDER } from "@/graphql";
import { bagistoFetch } from "@utils/bagisto";
import { isBagistoError } from "@utils/type-guards";
import { CreateCheckoutOrderOperation } from "@/types/checkout/type";
import { getAuthToken } from "@/utils/helper";

export async function POST(req: Request) {
  try {
    const guestToken = getAuthToken(req);


    const res = await bagistoFetch<CreateCheckoutOrderOperation>({
      query: CREATE_CHECKOUT_ORDER,
      cache: "no-store",
      guestToken,
    });
    return NextResponse.json({ data: res?.body?.data }, { status: 200 });
  } catch (error) {
    if (isBagistoError(error)) {
      return NextResponse.json(
        {
          data: { createCheckoutOrder: null },
          error: error.cause ?? error,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "Network error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
