import { bagistoFetch } from "@/lib/bagisto";
import { addShippingAddressMutation } from "@/lib/bagisto/mutations/checkout/save-checkout-addresses";
import { isBagistoError } from "@/lib/type-guards";

export async function POST(request: Request) {
  try {
    const variables = await request.json();

    const res = await bagistoFetch<any>({
      query: addShippingAddressMutation,
      variables: variables,
      cache: "no-store",
    });

    return Response.json({ data: { ...res?.body?.data } }, { status: 200 });
  } catch (error) {
    if (isBagistoError(error)) {
      return Response.json(
        {
          data: { saveCheckoutAddresses: null },
          error: { ...error.cause },
        },
        { status: 200 },
      );
    } else {
      return Response.json(
        { error: "An unexpected error occurred." },
        { status: 500 },
      );
    }
  }
}
