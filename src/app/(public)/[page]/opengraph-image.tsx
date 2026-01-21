import OpenGraphImage from "@components/common/OpenGraphImage";
import { getPage } from "@utils/bagisto";

export default async function Image({ params }: { params: { page: string } }) {
  const page = await getPage({ urlKey: params.page });
  const pageData = page?.[0]?.translation;
  const title = pageData?.metaTitle || pageData?.pageTitle;

  return await OpenGraphImage({ title });
}
