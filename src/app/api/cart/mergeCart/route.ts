import { CREATE_MERGE_CART } from "@/graphql";
import { bagistoFetch } from "@/utils/bagisto";
import { isBagistoError } from "@/utils/type-guards";
import { CreateMergeCartOperation } from "@/types/cart/type";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      token: body.token ?? null,
      cartId: body.cartId ?? null,
    };

    const res = await bagistoFetch<CreateMergeCartOperation>({
      query: CREATE_MERGE_CART,
      variables : variables,
      cache: "no-store",
    });

    return Response.json({
      data: { ...res?.body.data },
    });
  } catch (error) {
    if (isBagistoError(error)) {
      return Response.json(
        {
          data: { createAddProductInCart: null },
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

