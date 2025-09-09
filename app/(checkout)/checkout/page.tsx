import { Metadata } from "next";

import CheckOut from "@/components/checkout/information/checkout";
import { getCountryList } from "@/lib/bagisto";

export default async function Information({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { step = "email" } = (await searchParams) as { [key: string]: string };

  const countryList = await getCountryList();

  return <CheckOut countries={countryList} step={step} />;
}

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout with store items",
};
