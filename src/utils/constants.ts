
export const CACHE_KEY = {
  homeTheme: "collection-homepage",
  headerMenus: "header-menus",
  footerLink: "footer-link",
};
export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
  carDetail: "carDetail",
  address: "address",
  themeCustomize: "themeCustomize",
  defaultChannel: "channel",
};

export const CHECKOUT = {
  shipping: "collections",
  method: "products",
  cart: "cart",
};
export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const BAGISTO_GRAPHQL_API_ENDPOINT = "/api/graphql";

export const BASE_SCHEMA_URL = "https://schema.org";
export const PRODUCT_TYPE = "Product";
export const PRODUCT_OFFER_TYPE = "AggregateOffer";

export const BAGISTO_SESSION = process.env.BAGISTO_SESSION ?? "bagisto_session";
export const TOKEN = "token";
export const BASE_URL = process.env.NEXTAUTH_URL;
export const baseUrl = process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT;
export const GRAPHQL_URL = `${(process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT || '').replace(/\/$/, '')}${BAGISTO_GRAPHQL_API_ENDPOINT}`;


export const STOREFRONT_KEY = process.env.BAGISTO_STOREFRONT_KEY || process.env.NEXT_PUBLIC_BAGISTO_STOREFRONT_KEY || "";

export const OPERATION_TO_ROUTE_MAP: Record<string, string> = {
};

export const PAGE = "page";
export const LIMIT = "limit";
export const LOADING = "loading";
export const QUERY = "q";
export const SORT = "sort";

const IMAGE_BASE = "/image";
const ICON_BASE = "/icons";

export const IMAGES = {
  logo: `${IMAGE_BASE}/Logo.webp`,

  signUp: `${IMAGE_BASE}/sign-in.webp`,
  signIn: `${IMAGE_BASE}/login.webp`,
  forgetPassword: `${IMAGE_BASE}/forget-password.webp`,
  placeholder: `${IMAGE_BASE}/placeholder.webp`,

  profile: `${ICON_BASE}/users.svg`,
  orders: `${ICON_BASE}/orders.svg`,
  download: `${ICON_BASE}/download.svg`,
  wishlist: `${ICON_BASE}/heart.svg`,
  reviews: `${ICON_BASE}/star.svg`,
  address: `${ICON_BASE}/location.svg`,
  compare: `${ICON_BASE}/compare-arrow.svg`,
  settings: `${ICON_BASE}/settings.svg`,
  logout: `${ICON_BASE}/logout.svg`,
  arrowRight: `${ICON_BASE}/arrow-right.svg`,

  filter: `${ICON_BASE}/filter.svg`,
  sortBy: `${ICON_BASE}/sort-by.svg`,
  sortLeft: `${ICON_BASE}/icon-sort-left.svg`,
  sortRight: `${ICON_BASE}/icon-sort-right.svg`,
  compareArrows: `${ICON_BASE}/compare-arrows.svg`,

  noResult: `${ICON_BASE}/no-result.svg`,
  noReview: `${ICON_BASE}/no-review.svg`,
  noDownloadableProducts: `${ICON_BASE}/no-downloadable-products.svg`,
  emptyWishlist: `${ICON_BASE}/wishlist.svg`,
  emptyCompare: `${ICON_BASE}/compare.svg`,
} as const;

export const SIGNUP_IMG = IMAGES.signUp;
export const SIGNIN_IMG = IMAGES.signIn;
export const FORGET_PASSWORD_IMG = IMAGES.forgetPassword;
export const NOT_IMAGE = IMAGES.placeholder;

export const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};


export const configHeader = [
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
    source: "/icons/:path*",
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


export type LabelValueOption = { label: string; value: string };

export const ORDER_STATUS_OPTIONS: LabelValueOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Canceled", value: "canceled" },
  { label: "Closed", value: "closed" },
];

export const DOWNLOADABLE_STATUS_OPTIONS: LabelValueOption[] = [
  { label: "Available", value: "available" },
  { label: "Expired", value: "expired" },
  { label: "Pending", value: "pending" },
];

export const GENDER_OPTIONS: LabelValueOption[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export const PER_PAGE_LIMIT_OPTIONS = [10, 20, 30, 40, 50];

export const GUEST_CART_TOKEN = "guest_cart_token";
export const GUEST_CART_ID = "guest_cart_id";
export const IS_GUEST = "is_guest";


export const NEXTAUTH_TOKEN = "next-auth.session-token";
export const NEXTAUTH_SECURE_TOKEN = "__Secure-next-auth.session-token";

export const ORDER_ID = "order_id";

export const EMAIL_REGEX = /^(?![.-])(?!.*[.-]@)(?!.*\.\.)[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

export const IS_VALID_INPUT = /^[a-zA-Z0-9\s]*$/;
export const IS_VALID_ADDRESS = /^[a-zA-Z0-9\s,\/-]*$/;
export const IS_VALID_PHONE = /^[0-9]{10}$/;



export const WISHLIST_STORAGE_KEY = "wishlist_ids";
export const WISHLIST_TIMESTAMP_KEY = "wishlist_ts";
export const WISHLIST_AUTH_KEY = "wishlist_auth";
export const WISHLIST_DEFAULT_TTL_MS = 5 * 60 * 1000;

export const COMPARE_STORAGE_KEY = "compare_ids";
export const COMPARE_TIMESTAMP_KEY = "compare_ts";
export const COMPARE_AUTH_KEY = "compare_auth";
export const COMPARE_DEFAULT_TTL_MS = 5 * 60 * 1000;


export const CURRENCY_CODE = "USD";