import { bagistoFetch } from "@/lib/bagisto";
import { addToCartMutation } from "@/lib/bagisto/mutations/cart";
import { BagistoAddToCartOperation } from "@/lib/bagisto/types";
import { BAGISTO_SESSION } from "@/lib/constants";
import { isBagistoError } from "@/lib/type-guards";
import { generateCookieValue } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const variables = await req.json();
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
    }
    const res = await bagistoFetch<BagistoAddToCartOperation>({
      query: addToCartMutation,
      variables: variables,
      cache: "no-store",
    });

    return Response.json({ data: { ...res?.body.data } });
  } catch (error) {
    if (isBagistoError(error)) {
      // Bagisto-style GraphQL error
      return Response.json(
        {
          data: { addItemToCart: null },
          error: (error as any).cause || error,
        },
        { status: 200 }
      );
    } else {
      // Network or unexpected error
      return Response.json(
        {
          message: "Network error while calling Bagisto API",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 502 } // ✅ Bad Gateway fits network failure
      );
    }
  }
}
