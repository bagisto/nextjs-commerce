import { NextRequest, NextResponse } from "next/server";

import { bagistoFetch } from "@/lib/bagisto";
import { editCartItemsMutation } from "@/lib/bagisto/mutations/cart/update-item-cart";
import { BagistoUpdateCartOperation } from "@/lib/bagisto/types";
import { isBagistoError } from "@/lib/type-guards";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const variables = await req.json();
    const res = await bagistoFetch<BagistoUpdateCartOperation>({
      query: editCartItemsMutation,
      variables: { ...variables },
      cache: "no-store",
    });

    return NextResponse.json({ data: { ...res?.body?.data } }, { status: 200 });
  } catch (error: any) {
    if (isBagistoError(error)) {
      return NextResponse.json(
        {
          data: {
            updateItemToCart: null,
          },
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
