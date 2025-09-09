import OpenGraphImage from "@/components/opengraph-image";
import { getPage } from "@/lib/bagisto";

export default async function Image({ params }: { params: { page: string } }) {
  const page = await getPage({ urlKey: params.page });
  const pageData = page?.data?.[0]?.translations?.[0];
  const title = pageData?.metaTitle || pageData?.pageTitle;

  return await OpenGraphImage({ title });
}
