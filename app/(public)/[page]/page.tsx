import type { Metadata } from "next";

import { notFound } from "next/navigation";

import Prose from "@/components/prose";
import { getPage } from "@/lib/bagisto";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  // No need to await params, it's already an object
  const { page: pageParams } = await params;
  const page = await getPage({ urlKey: pageParams });

  if (!page?.data?.length) return notFound();

  const pageData = page?.data?.[0]?.translations?.[0];

  return {
    title: pageData?.metaTitle || pageData?.pageTitle,
    description: pageData?.metaDescription || pageData?.htmlContent,
    openGraph: {
      publishedTime: page?.data?.[0]?.createdAt || "---",
      modifiedTime: page?.data?.[0]?.updatedAt || "---",
      type: "article",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  // No need to await params, it's already an object
  const { page: pageParams } = await params;
  const page = await getPage({ urlKey: pageParams });

  if (!page?.data?.length) return notFound();

  const pageData = page?.data?.[0]?.translations?.[0];

  return (
    <div className="my-4 flex flex-col justify-between py-4">
      <div>
        <h1 className="text-5xl font-bold">{pageData?.pageTitle}</h1>
        <Prose className="mb-8" html={pageData?.htmlContent as string} />
      </div>
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        )?.format(new Date(page?.data?.[0]?.updatedAt || "---"))}.`}
      </p>
    </div>
  );
}
