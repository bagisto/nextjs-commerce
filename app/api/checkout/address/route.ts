import { NextResponse } from "next/server";
import { getCustomerAddressQuery } from "@/lib/bagisto/queries/checkout";
import { bagistoFetch } from "@/lib/bagisto";
import { BagistoAddressDataTypes } from "@/lib/bagisto/types";
import { TAGS } from "@/lib/constants";
import { isObject } from "@/lib/type-guards";

export async function GET() {
  try {
    const response = await bagistoFetch<BagistoAddressDataTypes>({
      query: getCustomerAddressQuery,
      tags: [TAGS.address],
      cache: "no-store",
    });

    if (!isObject(response?.body?.data?.checkoutAddresses)) {
      return Response.json({ checkoutAddresses: null }, { status: 200 });
    }

    return Response.json(response?.body?.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error querying the GraphQL API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
