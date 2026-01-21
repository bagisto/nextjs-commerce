import { GET_CHECKOUT_SHIPPING_RATES } from "@/graphql";
import { bagistoFetch } from "@/utils/bagisto";
import { getAuthToken } from "@/utils/helper";

export async function POST(req: Request) {
  try {
    const guestToken = getAuthToken(req);

    const variables = { token: "" };

    const response = await bagistoFetch<any>({
      query: GET_CHECKOUT_SHIPPING_RATES,
      variables: variables as any,
      cache: "no-store",
      guestToken,
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
