import OpenGraphImage from 'components/opengraph-image';

export const runtime = 'edge';

export default async function Image() {
  return await OpenGraphImage();
}
