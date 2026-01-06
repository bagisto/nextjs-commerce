import { GET_CHECKOUT_PAYMENT_METHODS } from "@/graphql";
import { CheckoutPaymentMethodsOperation } from "@/types/checkout/type";
import { bagistoFetch } from "@/utils/bagisto";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      token: body.token,
    };

    const response = await bagistoFetch<CheckoutPaymentMethodsOperation>({
      query: GET_CHECKOUT_PAYMENT_METHODS,
      variables: variables,
      cache: "no-store",
    });

      return Response.json(
      {
        data: response?.body?.data?.collectionPaymentMethods,
      },
      { status: 200 }
    );
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
