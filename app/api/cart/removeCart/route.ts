import { bagistoFetch } from "@/lib/bagisto";
import { removeFromCartMutation } from "@/lib/bagisto/mutations/cart/remove-cart";
import { BagistoRemoveFromCartOperation } from "@/lib/bagisto/types";
import { isBagistoError } from "@/lib/type-guards";

export async function POST(req: Request) {
  try {
    const variables = await req.json();

    const res = await bagistoFetch<BagistoRemoveFromCartOperation>({
      query: removeFromCartMutation,
      variables: { ...variables },
      cache: "no-store",
    });

    return Response.json({ data: { ...res?.body.data } });
  } catch (error) {
    if (isBagistoError(error)) {
      return Response.json({
        data: { removeCartItem: null },
        error: { ...error.cause },
      });
    }

    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
