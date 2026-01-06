import { CREATE_CHECKOUT_ADDRESS } from "@/graphql";
import { CreateCheckoutAddressOperation } from "@/types/checkout/type";
import { bagistoFetch } from "@/utils/bagisto";
import { isBagistoError } from "@/utils/type-guards";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      token: body.token,
      billingFirstName: body.billingFirstName,
      billingLastName: body.billingLastName,
      billingEmail: body.billingEmail,
      billingAddress: body.billingAddress,
      billingCity: body.billingCity,
      billingCountry: body.billingCountry,
      billingState: body.billingState,
      billingPostcode: body.billingPostcode,
      billingPhoneNumber: body.billingPhoneNumber,
      billingCompanyName: body.billingCompanyName,
      useForShipping: body.useForShipping,
    };


    if (!body.useForShipping) {
      Object.assign(variables, {
        shippingFirstName: body.shippingFirstName,
        shippingLastName: body.shippingLastName,
        shippingEmail: body.billingEmail,
        shippingAddress: body.shippingAddress,
        shippingCity: body.shippingCity,
        shippingCountry: body.shippingCountry,
        shippingState: body.shippingState,
        shippingPostcode: body.shippingPostcode,
        shippingPhoneNumber: body.shippingPhoneNumber,
        shippingCompanyName: body.shippingCompanyName,
      });
    }

    const res = await bagistoFetch<CreateCheckoutAddressOperation>({
      query: CREATE_CHECKOUT_ADDRESS,
      variables : variables,
      cache: "no-store",
    });

    return Response.json({ data: res?.body?.data }, { status: 200 });
  } catch (error) {
    if (isBagistoError(error)) {
      return Response.json(
        {
          data: { saveCheckoutAddresses: null },
          error: { ...error?.cause },
        },
        { status: 200 },
      );
    }

    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

