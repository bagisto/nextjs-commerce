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
export const BASE_URL = process.env.NEXTAUTH_URL;

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
