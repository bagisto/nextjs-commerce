import { GET_CHECKOUT_ADDRESSES } from "@/graphql";
import { GetCheckoutAddressesOperation } from "@/types/checkout/type";
import { bagistoFetch } from "@/utils/bagisto";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      token: body.token,
    };

    const response = await bagistoFetch<GetCheckoutAddressesOperation>({
      query: GET_CHECKOUT_ADDRESSES,
      variables: variables,
      cache: "no-store",
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