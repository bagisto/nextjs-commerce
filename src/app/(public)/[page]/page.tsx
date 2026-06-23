import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Prose from "@components/theme/search/Prose";
import { getPage } from "@utils/bagisto";
import { getCmsPageMetadata } from "@utils/helper";
import { PageData } from "@/types/theme/theme-customization";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page: pageParams } = await params;
  const pageDataArray: PageData[] = await getPage({ urlKey: pageParams });
  return getCmsPageMetadata(pageDataArray?.[0]?.translation);
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageParams } = await params;
  const pageDataArray: PageData[] = await getPage({ urlKey: pageParams });
  if (!pageDataArray?.length) return notFound();
  const pageData = pageDataArray?.[0]?.translation;

  return (
    <div className="my-4 flex flex-col justify-between p-4">
      <div className="flex flex-col gap-4 mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">{pageData?.pageTitle}</h1>
        <Prose className="mb-8" html={pageData?.htmlContent || ""} />
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        )?.format(new Date(pageDataArray?.[0]?.updatedAt || "---"))}.`}
      </p>
      </div>
    </div>
  );
}
