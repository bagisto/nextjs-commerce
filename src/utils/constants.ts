// import { parseCsv } from './helper';

export const CACHE_KEY = {
  homeTheme: "collection-homepage",
  headerMenus: "header-menus",
  footerLink: "footer-link",
};
/**
 * Caching Tags for caching
 */
export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
  carDetail: "carDetail",
  address: "address",
  themeCustomize: "themeCustomize",
  defaultChannel: "channel",
};

/**
 * Checkout Caching Tags
 */
export const CHECKOUT = {
  shipping: "collections",
  method: "products",
  cart: "cart",
};
export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const BAGISTO_GRAPHQL_API_ENDPOINT = "/graphql";

/**
 * productJsonLd constant
 */
export const BASE_SCHEMA_URL = "https://schema.org";
export const PRODUCT_TYPE = "Product";
export const PRODUCT_OFFER_TYPE = "AggregateOffer";

/**
 * cookies constant
 */
export const BAGISTO_SESSION = process.env.BAGISTO_SESSION ?? "bagisto_session";
export const TOKEN = "token";
export const BASE_URL = process.env.NEXT_PUBLIC_NEXT_AUTH_URL;
export const baseUrl = process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT;
export const GRAPHQL_URL = typeof window === 'undefined'
  ? `${process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT}/api/graphql`
  : `${process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT}`;
export const NEXT_AUTH_SECRET=process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET;


// -----Pagination--------//
export const PAGE = "page";
export const LIMIT = "limit";
export const LOADING = "loading";
export const QUERY = "q";
export const SORT = "sort";

/**
 * Placeholder Images
 */
export const SIGNUP_IMG = "/image/sign-in.webp";
export const SIGNIN_IMG = "/image/login.webp";
export const FORGET_PASSWORD_IMG = "/image/forget-password.webp";
export const NOT_IMAGE = "/image/placeholder.webp";

export const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};


export const configHeader = [
  // Security headers for all routes
  {
    source: "/:path*",
    headers: [
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
    ],
  },
  // Cache dynamic pages - shorter cache for frequently updated content
  {
    source: "/search/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    ],
  },
  {
    source: "/product/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, s-maxage=3600, stale-while-revalidate=86400",
      },
      {
        key: "Vary",
        value: "Accept-Encoding",
      },
    ],
  },
  {
    source: "/checkout/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "private, no-cache, no-store, must-revalidate",
      },
    ],
  },
  {
    source: "/customer/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "private, no-cache, no-store, must-revalidate",
      },
    ],
  },
  // Next.js static assets - long cache with immutable
  {
    source: "/_next/static/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ],
  },
  {
    source: "/_next/image/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ],
  },
  // Public folder assets - long cache
  {
    source: "/image/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ],
  },
  {
    source: "/fonts/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ],
  },
]


// export const magentoImageDomains = parseCsv(
//   process.env.NEXT_SERVER_BAGISTO_IMAGE_DOMAINS
// );

export const imageProtocol = (process.env.NEXT_SERVER_MAGENTO_PROTOCOL ||
  "https") as "http" | "https";



export function getImageUrl(url?: string, baseUrl?: string, fallback?: string) {
  if (!url) return fallback;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
}


export type SortOrderTypes = {
  key: string;
  title: string;
  value: string;
  sortKey: string;
  reverse: boolean;
};

export const SortByFields: SortOrderTypes[] = [
  {
    key: "name-asc",
    title: "From A-Z",
    value: "name-asc",
    sortKey: "TITLE",
    reverse: false,
  },
  {
    key: "name-desc",
    title: "From Z-A",
    value: "name-desc",
    sortKey: "TITLE",
    reverse: true,
  },
  {
    key: "newest",
    title: "Newest First",
    value: "newest",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    key: "oldest",
    title: "Oldest First",
    value: "oldest",
    sortKey: "CREATED_AT",
    reverse: false,
  },
  {
    key: "price-asc",
    title: "Cheapest First",
    value: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  },
  {
    key: "price-desc",
    title: "Expensive First",
    value: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const GUEST_CART_TOKEN = "guest_cart_token";
export const GUEST_CART_ID = "guest_cart_id";
export const IS_GUEST = "is_guest";


export const NEXTAUTH_TOKEN = "next-auth.session-token";
export const NEXTAUTH_SECURE_TOKEN = "__Secure-next-auth.session-token";

export const ORDER_ID = "order_id";

