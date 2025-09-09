import { bagistoFetch } from "@/lib/bagisto";
import { getShippingMethodsQuery } from "@/lib/bagisto/queries/checkout/shipping-methods";
import { BagistoCheckoutOperation } from "@/lib/bagisto/types";
import { isObject } from "@/lib/type-guards";

export async function GET() {
  try {
    const response = await bagistoFetch<BagistoCheckoutOperation>({
      query: getShippingMethodsQuery,
      cache: "no-store",
    });

    if (!isObject(response?.body?.data)) {
      return Response.json({ shippingMethods: null }, { status: 200 });
    }

    return Response.json(response?.body?.data, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: "Error querying the GraphQL API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
