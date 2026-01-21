import { NextRequest } from "next/server";

import { bagistoFetch } from "@/utils/bagisto";
import { isBagistoError } from "@/utils/type-guards";
import { UPDATE_CART_ITEM } from "@/graphql";
import { UpdateCartItemOperation } from "@/types/cart/type";
import { getAuthToken } from "@/utils/helper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const guestToken = getAuthToken(req);

    const variables = {
      cartItemId: body.cartItemId,
      quantity: body.quantity,
    };


    const res = await bagistoFetch<UpdateCartItemOperation>({
      query: UPDATE_CART_ITEM,
      variables: variables,
      cache: "no-store",
      guestToken,
    });

    return Response.json({
      data: { ...res?.body.data },
    });

  } catch (error) {
    if (isBagistoError(error)) {
      return Response.json(
        {
          data: { createUpdateCartItem: null },
          error: error.cause ?? error,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        message: "Network error",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
