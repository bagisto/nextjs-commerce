import { CREATE_ADD_PRODUCT_IN_CART } from "@/graphql";
import { AddToCartOperation } from "@/types/cart/type";
import { bagistoFetch } from "@/utils/bagisto";
import { isBagistoError } from "@/utils/type-guards";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      token: body.token ?? null,
      cartId: body.cartId ?? null,
      productId: body.productId,
      quantity: body.quantity,
    };

    const res = await bagistoFetch<AddToCartOperation>({
      query: CREATE_ADD_PRODUCT_IN_CART,
      variables: variables,
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

