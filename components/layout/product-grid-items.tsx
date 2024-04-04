import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/bagisto/types';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.urlKey} className="animate-fadeIn">
          <Link className="relative inline-block h-full w-full" href={`/product/${product.urlKey}`}>
            <GridTileImage
              alt={product.name || ''}
              label={{
                title: product.name || '',
                amount: product.priceHtml?.regularPrice,
                currencyCode: product.priceHtml?.currencyCode
              }}
              src={product.images?.[0]?.url || ''}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
