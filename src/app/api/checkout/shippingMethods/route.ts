import { GET_CHECKOUT_SHIPPING_RATES } from "@/graphql";
import { bagistoFetch } from "@/utils/bagisto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      token: body.token,
    };

    const response = await bagistoFetch<any>({
      query: GET_CHECKOUT_SHIPPING_RATES,
      variables : variables as any ,
      cache: "no-store",
    });

    return Response.json(
      {
        data: response?.body?.data?.collectionShippingRates,
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
