import OpengraphImage from 'components/opengraph-image';
// import { getCollection } from 'lib/bagisto';

export const runtime = 'edge';

export default async function Image() {
  // { params }: { params: { collection: string } }
  // TODO: Api is pending for collection
  // const collection = await getCollection(params.collection);
  // const title = collection?.seo?.title || collection?.title;
  const title = 'Test SEO details';

  return await OpengraphImage({ title });
}
