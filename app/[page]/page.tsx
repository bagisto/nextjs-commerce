import Prose from 'components/prose';
import { getPage } from 'lib/bagisto';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: { page: string };
}): Promise<Metadata> {
  const page = await getPage({ urlKey: params.page });
  if (!page?.data?.length) return notFound();

  const pageData = page?.data?.[0]?.translations?.[0];
  return {
    title: pageData?.metaTitle || pageData?.pageTitle,
    description: pageData?.metaDescription || pageData?.htmlContent,
    openGraph: {
      publishedTime: page?.data?.[0]?.createdAt || '---',
      modifiedTime: page?.data?.[0]?.updatedAt || '---',
      type: 'article'
    }
  };
}

export default async function Page({ params }: { params: { page: string } }) {
  const page = await getPage({ urlKey: params.page });

  if (!page?.data?.length) return notFound();

  const pageData = page?.data?.[0]?.translations?.[0];
  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{pageData?.pageTitle}</h1>
      <Prose className="mb-8" html={pageData?.htmlContent as string} />
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })?.format(new Date(page?.data?.[0]?.updatedAt || '---'))}.`}
      </p>
    </>
  );
}
