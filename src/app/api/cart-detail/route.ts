import { GET_CART_ITEM } from "@/graphql";
import { ReadCartOperation } from "@/types/cart/type";
import { bagistoFetch } from "@/utils/bagisto";
import { isBagistoError } from "@/utils/type-guards";
import { getAuthToken } from "@/utils/helper";

export async function POST(req: Request) {
  try {
    const guestToken = getAuthToken(req);

    const response = await bagistoFetch<ReadCartOperation>({
      query: GET_CART_ITEM,
      cache: "no-store",
      guestToken,
    });
    return Response.json({
      data: { ...response.body.data },
    });
  } catch (error) {
    if (isBagistoError(error)) {
      return Response.json(
        {
          data: { createReadCart: null },
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
