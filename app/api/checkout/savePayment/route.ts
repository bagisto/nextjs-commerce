import { NextResponse } from "next/server";

import { bagistoFetch } from "@/lib/bagisto";
import { addSavePaymentMutation } from "@/lib/bagisto/mutations/checkout/save-payment";
import { isBagistoError } from "@/lib/type-guards";

export async function POST(req: Request) {
  try {
    const variables = await req.json();

    const res = await bagistoFetch<any>({
      query: addSavePaymentMutation,
      variables: variables,
      cache: "no-store",
    });

    return NextResponse.json({ data: { ...res?.body?.data } });
  } catch (error) {
    if (isBagistoError(error)) {
      return NextResponse.json(
        {
          data: { savePayment: null },
          error: { ...(error as any).cause },
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 },
      );
    }
  }
}
