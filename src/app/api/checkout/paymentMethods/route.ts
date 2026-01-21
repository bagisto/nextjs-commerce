import { GET_CHECKOUT_PAYMENT_METHODS } from "@/graphql";
import { CheckoutPaymentMethodsOperation } from "@/types/checkout/type";
import { bagistoFetch } from "@/utils/bagisto";
import { isBagistoError } from "@/utils/type-guards";
import { getAuthToken } from "@/utils/helper";

export async function POST(req: Request) {
  try {
    const guestToken = getAuthToken(req);

    const response = await bagistoFetch<CheckoutPaymentMethodsOperation>({
      query: GET_CHECKOUT_PAYMENT_METHODS,
      variables: { token: "" } as any,
      cache: "no-store",
      guestToken,
    });

    return Response.json(
      {
        data: response?.body?.data?.collectionPaymentMethods,
      },
      { status: 200 }
    );
  } catch (error) {
    if (isBagistoError(error)) {
      return Response.json(
        {
          data: { collectionPaymentMethods: null },
          error: error.cause ?? error,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        message: "Network error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
