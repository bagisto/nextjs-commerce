import { NextResponse } from "next/server";
import { bagistoFetch } from "@/lib/bagisto";
import { getPaymentMethodsQuery } from "@/lib/bagisto/queries/checkout/payment-methods";
import { isObject } from "@/lib/type-guards";

export async function POST(req: Request) {
  try {
    const variables = await req.json();
    const response = await bagistoFetch<any>({
      query: getPaymentMethodsQuery,
      variables: variables,
      cache: "no-store",
    });

    if (!isObject(response?.body?.data)) {
      return Response.json({ paymentMethods: null }, { status: 200 });
    }

    return Response.json(response?.body?.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error querying the GraphQL API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
