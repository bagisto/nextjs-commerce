import { GET_CHECKOUT_ADDRESSES } from "@/graphql";
import { GetCheckoutAddressesOperation } from "@/types/checkout/type";
import { bagistoFetch } from "@/utils/bagisto";
import { getAuthToken } from "@/utils/helper";

export async function POST(req: Request) {
  try {
    const guestToken = getAuthToken(req);

    const response = await bagistoFetch<GetCheckoutAddressesOperation>({
      query: GET_CHECKOUT_ADDRESSES,
      cache: "no-store",
      guestToken,
    });

    return Response.json(
      {
        data: response?.body?.data?.collectionGetCheckoutAddresses,
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