import { bagistoFetch } from "@/lib/bagisto";
import { getCartQuery } from "@/lib/bagisto/queries/cart";
import { BagistoCartOperation } from "@/lib/bagisto/types";
import { BAGISTO_SESSION, TAGS } from "@/lib/constants";
import { isObject } from "@/lib/type-guards";
import { generateCookieValue } from "@/lib/utils";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const store = await cookies();
    let cartId = store.get(BAGISTO_SESSION)?.value;
    if (!cartId) {
      // Generate new session ID
      cartId = generateCookieValue(40);
      // Set cookie
      store.set({
        name: BAGISTO_SESSION,
        value: cartId,
        secure: false,
      });
      return Response.json({ cartDetail: null }, { status: 200 });
    }

    const response = await bagistoFetch<BagistoCartOperation>({
      query: getCartQuery,
      tags: [TAGS.cart],
      cache: "no-store",
    });
    const res = response.body.data;
    // Old carts becomes `null` when you checkout.
    if (!isObject(res?.cartDetail)) {
      return Response.json({ cartDetail: null }, { status: 200 });
    }

    return Response.json(res, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Error querying the GraphQL API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
