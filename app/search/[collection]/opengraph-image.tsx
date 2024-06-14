import OpenGraphImage from 'components/opengraph-image';
export const runtime = 'edge';
export default async function Image() {
  const title = 'Test SEO details';
  return await OpenGraphImage({ title });
}
