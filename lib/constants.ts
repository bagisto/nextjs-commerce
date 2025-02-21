/**
 * Sorting & filtration constants
 */
export type SortFilterItem = {
  key: string;
  title: string;
  slug: string | null;
  sortKey: 'name' | 'created_at' | 'price' | 'PRICE';
  reverse: boolean;
  position: string;
};

export const defaultSort: SortFilterItem = {
  key: '0',
  title: 'From A-Z',
  slug: 'name-asc',
  sortKey: 'name',
  reverse: false, //asc
  position: '1'
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    key: '1',
    title: 'From Z-A',
    slug: 'name-desc',
    sortKey: 'name',
    reverse: true, //'desc',
    position: '2'
  },
  {
    key: '2',
    title: 'Newest First',
    slug: 'created_at-desc',
    sortKey: 'created_at',
    reverse: true, //'desc',
    position: '3'
  },
  {
    key: '3',
    title: 'Oldest First',
    slug: 'created_at-asc',
    sortKey: 'created_at',
    reverse: false, // 'asc',
    position: '4'
  },
  {
    key: '4',
    title: 'Cheapest First',
    slug: 'price-asc',
    sortKey: 'price',
    reverse: false, //'asc',
    position: '5'
  },
  {
    key: '5',
    title: 'Expensive First',
    slug: 'price-desc',
    sortKey: 'price',
    reverse: true, //'desc',
    position: '6'
  }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const FILTER_ATTRIBUTE = {
  sorting: 'sortings'
};
export const CHECKOUT = {
  shipping: 'collections',
  method: 'products',
  cart: 'cart'
};
export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const BAGISTO_GRAPHQL_API_ENDPOINT = '/graphql';
export const ORDER_ID = 'order-id';
/**
 * local storage constant keys
 */
export const SAVED_LOCAL_STORAGE = 'shippingAddress';
export const REVIEW_ORDER = 'reviewOrder';
export const CHECKOUT_DATA = 'checkOutData';
/**
productJsonLd constant
**/
export const BASE_SCHEMA_URL = 'https://schema.org';
export const PRODUCT_TYPE = 'Product';
export const PRODUCT_OFFER_TYPE = 'AggregateOffer';

/**
 * cookies constant
 */

export const BAGISTO_SESSION = 'bagisto_session';
export const TOKEN = 'token';
// next.js-frontend.vercel.app
export const BASE_URL = 'https://nextjs-frontend.vercel.app';
