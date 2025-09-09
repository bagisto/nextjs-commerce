import { bagistoFetch } from "@/lib/bagisto";
import { getCartQuery } from "@/lib/bagisto/queries/cart";
import { BagistoCartOperation } from "@/lib/bagisto/types";
import { TAGS } from "@/lib/constants";
import { isObject } from "@/lib/type-guards";

export async function GET() {
  try {
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
