import {
  BAGISTO_GRAPHQL_API_ENDPOINT,
  CHECKOUT,
  HIDDEN_PRODUCT_TAG,
  TAGS,
  TOKEN
} from 'lib/constants';
import { isArray, isBagistoError, isObject } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
import { revalidateTag } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { CustomerRegister } from './mutations/customer-register';
import { savePaymentMutation } from './mutations/payment-method';
import { savePlaceOrder } from './mutations/place-order';
import { ForgetPassword } from './mutations/recover-password';
import { addShippingAddressMutation } from './mutations/shipping-address';
import { addShippingMethodMutation } from './mutations/shipping-method';
import { getCartQuery } from './queries/cart';
import { getChannelQuery } from './queries/channel';
import { getCollectionProductsQuery, getCollectionsQuery } from './queries/collection';
import { getMenuQuery } from './queries/menu';
import {
  getCountryQuery,
  getPageQuery,
  getPagesQuery,
  getThemeCustomizationQuery
} from './queries/page';
import { getPaymentMethodsQuery } from './queries/payment-methods';
import { getShippingMethodQuery } from './queries/shipping-method';
import {
  BagistoAddToCartOperation,
  BagistoCart,
  BagistoCartOperation,
  BagistoChannelOperation,
  BagistoCheckoutOperation,
  BagistoCollection,
  BagistoCollectionOperation,
  BagistoCollectionProductsOperation,
  BagistoCollectionsOperation,
  BagistoCountriesOperation,
  BagistoCreateCartOperation,
  BagistoMenuOperation,
  BagistoPageOperation,
  BagistoPagesOperation,
  BagistoPaymentDataType,
  BagistoProductInfo,
  BagistoRemoveFromCartOperation,
  BagistoThemeCustomization,
  BagistoUpdateCartOperation,
  Cart,
  ChannelType,
  Collection,
  CountryArrayDataType,
  FilterCmsPageTranslationInput,
  ImageInfo,
  Menu,
  Page,
  Product,
  ShippingArrayDataType,
  SuperAttribute,
  ThemeCustomization
} from './types';

const domain = process.env.BAGISTO_STORE_DOMAIN
  ? ensureStartsWith(process.env.BAGISTO_STORE_DOMAIN, process.env.BAGISTO_PROTOCOL || 'https://')
  : '';
const endpoint = `${domain}${BAGISTO_GRAPHQL_API_ENDPOINT}`;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;
export async function bagistoFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables,
  cartId = true
}: {
  cache?: RequestCache;
  headers?: HeadersInit | any;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
  cartId?: boolean;
}): Promise<{ status: number; body: T } | never> {
  try {
    let bagistoCartId;
    if (cartId) {
      bagistoCartId = cookies().get('bagisto_session')?.value;
    }
    const session = cookies().get(TOKEN)?.value;
    if (isObject(headers)) {
      headers['Authorization'] = `${session}`;
    }
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${bagistoCartId ? `bagisto_session=${bagistoCartId}` : ''}`,
        Authorization: `${session}`,
        ...headers
      },

      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isBagistoError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = (array: Array<any>) => {
  return array?.map((edge) => edge);
};

const reshapeCart = (cart: BagistoCart): Cart => {
  return {
    ...cart,
    lines: removeEdgesAndNodes(cart?.items)
  };
};

const reshapePayments = (payments: any): any => {
  let paymentMethods = {};
  if (isObject(payments)) {
    paymentMethods = { ...payments };
  }
  return paymentMethods;
};

const reshapePaymentMethods = (payments: any): any => {
  let paymentMethods = {};
  if (isObject(payments)) {
    paymentMethods = { ...payments };
  }
  return paymentMethods;
};
const reshapeShippingAddress = (payments: any): any => {
  let paymentMethods = {};
  if (isObject(payments)) {
    paymentMethods = { ...payments };
  }
  return paymentMethods;
};

const reshapeCollection = (collection: BagistoCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle || collection.urlPath}`
  };
};

const reshapeCollections = (collections: BagistoCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);
      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Array<ImageInfo>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image?.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image?.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (product: BagistoProductInfo, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts && product.tags?.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: BagistoProductInfo[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await bagistoFetch<BagistoCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function getChannel(): Promise<ChannelType> {
  const res = await bagistoFetch<BagistoChannelOperation>({
    query: getChannelQuery,
    cache: 'no-store'
  });
  return res.body.data?.getDefaultChannel;
}

export async function addToCart(input: {
  productId: number;
  quantity: number;
  selectedConfigurableOption: number | undefined;
  superAttribute: SuperAttribute[];
}): Promise<Cart> {
  const res = await bagistoFetch<BagistoAddToCartOperation>({
    query: addToCartMutation,
    variables: { input },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.addItemToCart.cart);
}

export async function addShippingMethod(input: { method: string }): Promise<any> {
  const res = await bagistoFetch<any>({
    query: addShippingMethodMutation,
    variables: {
      input
    },
    cache: 'no-store'
  });

  revalidateTag(TAGS.cart);
  return reshapePayments(res.body.data.saveShipping);
}

export async function getPaymentMethod(input: { shippingMethod: string }) {
  const res = await bagistoFetch<any>({
    query: getPaymentMethodsQuery,
    variables: {
      input
    },
    cache: 'no-store'
  });
  const { paymentMethods } = res?.body?.data?.paymentMethods;
  if (!isArray(paymentMethods)) {
    return [];
  }

  return paymentMethods;
}

export async function addPaymentMethod(input: { method: string }): Promise<BagistoPaymentDataType> {
  const res = await bagistoFetch<any>({
    query: savePaymentMutation,
    variables: {
      input
    },
    cache: 'no-store'
  });
  return reshapePaymentMethods(res.body.data.savePayment);
}

export async function createPlaceOrder(): Promise<any> {
  const res = await bagistoFetch<any>({
    query: savePlaceOrder,
    cache: 'no-store'
  });
  return res.body.data.placeOrder;
}

export async function addCheckoutAddress(input: any): Promise<any> {
  const res = await bagistoFetch<any>({
    query: addShippingAddressMutation,
    variables: {
      input
    },
    cache: 'no-store'
  });
  return reshapeShippingAddress(res.body.data.saveCheckoutAddresses);
}

export async function createUserToLogin(input: any): Promise<any> {
  let result = null;
  try {
    const res = await bagistoFetch<any>({
      query: CustomerRegister,
      variables: {
        input
      },
      cache: 'no-store'
    });
    result = res;
  } catch (error) {
    result = error;
  }
  return result;
}

export async function recoverUserLogin(input: any): Promise<any> {
  try {
    return await bagistoFetch<any>({
      query: ForgetPassword,
      variables: {
        ...input
      },
      cache: 'no-store'
    });
  } catch (error) {
    return error;
  }
}

export async function removeFromCart(lineIds: number): Promise<Cart> {
  const res = await bagistoFetch<BagistoRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.removeCartItem.cart);
}

export async function updateCart(qty: { cartItemId: number; quantity: number }[]): Promise<Cart> {
  const res = await bagistoFetch<BagistoUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      input: { qty }
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.updateItemToCart.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const res = await bagistoFetch<BagistoCartOperation>({
    query: getCartQuery,
    tags: [TAGS.cart],
    cache: 'no-store'
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cartDetail) {
    return undefined;
  }
  return reshapeCart(res.body.data.cartDetail);
}

export async function getCollection(handle: string): Promise<Product[] | undefined> {
  const input = [{ key: 'category_id', value: `${handle}` }];
  const res = await bagistoFetch<BagistoCollectionOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections],
    variables: {
      input
    }
  });

  return reshapeProducts(res.body.data.allProducts.data);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  page
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  page?: string;
}): Promise<Product[]> {
  let input = [{ key: 'limit', value: '100' }];

  if (collection && page != 'product') {
    input = [{ key: 'category_id', value: `${collection}` }, ...input];
  }
  if (sortKey) {
    const direction = reverse ? 'desc' : 'asc';
    input = [{ key: 'sort', value: `${sortKey.toLowerCase()}-${direction}` }, ...input];
  }
  if (collection && page === 'product') {
    input = [{ key: 'url_key', value: collection }, ...input];
  }
  const res = await bagistoFetch<BagistoCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      input
    }
  });
  if (!res.body.data?.allProducts) {
    // console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(res.body.data.allProducts.data);
}

export async function getCollections(): Promise<Collection[]> {
  const res = await bagistoFetch<BagistoCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  const bagistoCollections = removeEdgesAndNodes(res.body?.data?.homeCategories);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(bagistoCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getHomeCategories(): Promise<Collection[]> {
  const res = await bagistoFetch<BagistoCollectionsOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    cartId: false
  });
  const bagistoCollections = removeEdgesAndNodes(res.body?.data?.homeCategories);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },

    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(bagistoCollections).filter(
      (collection) => !collection.handle?.startsWith('hidden')
    )
  ];
  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await bagistoFetch<BagistoMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return (
    res.body?.data?.homeCategories?.map((item: { name: string; slug: string; id: string }) => ({
      id: item.id,
      title: item.name,
      path: `/search/${item.slug
        .replace(domain, '')
        .replace('/collections', '/search')
        .replace('/pages', '/search')}`
    })) || []
  );
}

export async function getThemeCustomization(handle: string): Promise<ThemeCustomization[]> {
  const res = await bagistoFetch<BagistoThemeCustomization>({
    query: getThemeCustomizationQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });
  return res.body?.data?.themeCustomization?.filter((item) => item?.type === 'footer_links') || [];
}

export async function getPage(input: FilterCmsPageTranslationInput): Promise<Page> {
  const res = await bagistoFetch<BagistoPageOperation>({
    query: getPageQuery,
    cache: 'no-store',
    variables: { input }
  });
  return res.body.data?.cmsPages;
}

export async function getPages(): Promise<Page> {
  const res = await bagistoFetch<BagistoPagesOperation>({
    query: getPagesQuery,
    cartId: false,
    cache: 'no-store'
  });

  return res.body.data?.cmsPages;
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  let input = [{ key: 'limit', value: '10' }];
  if (sortKey) {
    const direction = reverse ? 'desc' : 'asc';
    input = [{ key: 'sort', value: `${sortKey.toLowerCase()}-${direction}` }, ...input];
  }
  if (query) {
    input = [{ key: 'name', value: query }, ...input];
  }

  const res = await bagistoFetch<BagistoCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.products],
    cartId: false,
    variables: {
      input
    }
  });

  return reshapeProducts(res.body.data.allProducts.data);
}

export async function getCountryList(): Promise<CountryArrayDataType[]> {
  const res = await bagistoFetch<BagistoCountriesOperation>({
    query: getCountryQuery
  });
  return res.body?.data?.countries;
}

export async function getShippingMethod(): Promise<ShippingArrayDataType[] | undefined> {
  const res = await bagistoFetch<BagistoCheckoutOperation>({
    query: getShippingMethodQuery,
    tags: [CHECKOUT.method],
    cache: 'no-store'
  });
  // Old carts becomes `null` when you checkout.
  if (!res.body.data.shippingMethods) {
    return undefined;
  }
  return res.body.data.shippingMethods;
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Bagisto,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = headers().get('x-bagisto-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.BAGISTO_REVALIDATION_SECRET) {
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
