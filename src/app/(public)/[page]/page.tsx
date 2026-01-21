import { notFound } from "next/navigation";
import Prose from "@components/theme/search/Prose";
import { getPage } from "@utils/bagisto";


export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageParams } = await params;
  const page = await getPage({ urlKey: pageParams });
  if (!page?.length) return notFound();
  const pageData = page?.[0]?.translation;

  return (
    <div className="my-4 flex flex-col justify-between p-4">
      <div className="flex flex-col gap-4 mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">{pageData?.pageTitle}</h1>
        <Prose className="mb-8" html={pageData?.htmlContent} />
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        )?.format(new Date(page?.[0]?.updatedAt || "---"))}.`}
      </p>
      </div>
    </div>
  );
}
