import { GET_CART_ITEM } from "@/graphql";
import { GetCartItemVariables, ReadCartOperation } from "@/types/cart/type";
import { bagistoFetch } from "@/utils/bagisto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const variables: GetCartItemVariables = {
      token: body.token ?? null,
    };

    const response = await bagistoFetch<ReadCartOperation>({
      query: GET_CART_ITEM,
      variables: variables,
      cache: "no-store",
    });
    return Response.json({
      data: { ...response.body.data },
    });
  } catch (error) {
    return Response.json(
      {
        message: "Error querying the GraphQL API",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
