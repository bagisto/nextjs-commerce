import CheckOut from "@/components/checkout";

export default async function Information({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { step = "email" } = (await searchParams) as { [key: string]: string };
  return <CheckOut
    step={step}
     />;
}
