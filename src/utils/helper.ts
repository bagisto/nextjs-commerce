import { ReadonlyURLSearchParams } from "next/navigation";
import { Metadata } from "next";
import { CartItem, FilterDataTypes } from "@/types/types";
import { isArray } from "./type-guards";
import { BASE_URL, baseUrl } from "./constants";
import { ProductData, ReviewDatatypes } from "@components/catalog/type";
import { useAddress } from "@utils/useAddress";
import { CheckoutAddressNode, MappedCheckoutAddress } from "@/types/checkout/type";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = ["BAGISTO_STORE_DOMAIN"];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/BAGISTO#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n"
      )}\n`
    );
  }

  if (
    process.env.BAGISTO_STORE_DOMAIN?.includes("[") ||
    process.env.BAGISTO_STORE_DOMAIN?.includes("]")
  ) {
    throw new Error(
      "Your `BAGISTO_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them."
    );
  }
};

/**
 * Get base url
 * @returns string
 */
export const getBaseUrl = (baseUrl: string) => {
  return baseUrl ? `https://${baseUrl}` : "http://localhost:3000";
};


export const isCleanFilter = (
  filters: FilterDataTypes[],
  type: "url" | "filter" | string = "filter"
): string | object => {
  if (type === "url") {
    return `search?${filters
      .map(
        ({ key, value }) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&")}`;
  }

  const limitValue = type === "filter" ? "3" : "12";

  return filters.map(({ __typename: _typename, ...rest }) =>
    rest.key === "limit" ? { ...rest, value: limitValue } : rest
  );
};

export function getReviews(reviews: ReviewDatatypes[]): {
  totalReviews: number;
  reviewAvg: number;
  ratingCounts: { [key: number]: number };
} {
  let totalReviewsAvg = 0;
  let totalReviews = 0;
  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  if (isArray(reviews)) {
    totalReviews = reviews.length;
    const totalReviewCount = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    totalReviewsAvg = totalReviewCount / totalReviews;
    reviews.forEach((review) => {
      if (ratingCounts[review.rating] !== undefined) {
        ratingCounts[review.rating]++;
      }
    });
  }

  return {
    reviewAvg: totalReviewsAvg,
    totalReviews: totalReviews,
    ratingCounts: ratingCounts,
  };
}

export function formatDate(dateStr: string): string {
  const dateObj = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return dateObj.toLocaleDateString("en-US", options);
}

export const isCheckout = (
  items: Array<CartItem>,
  isGuest: boolean,
  email: string,
  isSeclectAddress: boolean,
  isSelectShipping: boolean,
  isSelectPayment: boolean
): string => {
  if (!isArray(items) || items.length === 0) {
    return "/";
  }

  if (isGuest) {
    const hasRestrictedProduct = items.some(
      ({ product }) =>
        product?.guestCheckout === false || product?.guestCheckout === null
    );

    if (hasRestrictedProduct) {
      return "/customer/login";
    }

    if (isSelectPayment) {
      return "/checkout?step=review";
    }

    if (isSelectShipping) {
      return "/checkout?step=payment";
    }

    if (isSeclectAddress) {
      return "/checkout?step=shipping";
    }

    if (!email || typeof email === "object") {
      return "/checkout";
    }

    return "/checkout?step=address";
  } else {
    if (isSelectPayment) {
      return "/checkout?step=review";
    }

    if (isSelectShipping) {
      return "/checkout?step=payment";
    }

    if (!email || typeof email === "object") {
      return "/checkout";
    }
    return "/checkout?step=address";
  }
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function generateCookieValue(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let cookieValue = "";

  for (let i = 0; i < length; i++) {
    cookieValue += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return cookieValue;
}

export function getInitials(name?: string) {
  if (!name) return "";
  const words = name.trim().split(" ");
  const initials = words.map((w) => w[0]).join(""); // JDS
  return initials.substring(0, 2).toUpperCase(); // JD
}

export async function generateMetadataForPage(
  slug: string,
  fallback?: {
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    other?: Record<string, string>;
  }
): Promise<Metadata> {
  const seo: {
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    other?: Record<string, string>;
  } = {};

  // Default fallback (from your staticSeo.default)
  const DEFAULT_OTHER = {
    "document-meta-version": "dsv-2025.04.19-7e29",
  };

  const title = seo.title || fallback?.title || "Default Title";
  const description =
    seo.description || fallback?.description || "Default page description.";
  const ogImage = seo.image || fallback?.image || "/default-og.png";
  const canonicalUrl =
    seo.canonical || fallback?.canonical || `${BASE_URL}/${slug}`;

  const otherMeta = {
    ...DEFAULT_OTHER,
    ...(fallback?.other || {}),
    ...(seo.other || {}),
  };

  return {
    metadataBase: new URL(baseUrl || BASE_URL || "http://localhost:3000"),

    title,
    description,

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Your Store Name",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },

    alternates: {
      canonical: canonicalUrl,
    },

    other: otherMeta,
  };
}

export const parseCsv = (value?: string) =>
  value
    ?.split(",")
    .map((v) => v.trim())
    .filter(Boolean) ?? [];


/**
 * Safely converts a value to an array, handling null/undefined
 * @param value - Any value that might be an array, null, or undefined
 * @returns An array or empty array
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function safeArray<T = any>(value: T[] | null | undefined): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [];
}

export const setCookie = (name: string, value: string | number, days = 30) => {
  if (typeof window === "undefined" || !name) return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    String(value)
  )};${expires};path=/`;
};

export const getValidTitle = (text: string) => {
  return text?.toUpperCase()?.replaceAll('_', ' ') ?? ''
}


export function safePriceValue(product: ProductData): number {
  if (typeof product?.price === "string") {
    const priceValue = product?.type === "configurable"
      ? product?.minimumPrice ?? "0"
      : product?.price ?? "0";
    // const priceValue = product?.minimumPrice ?? "0";
    return parseFloat(priceValue) || 0;
  }
  if (
    typeof product?.price === "object" &&
    product.price !== null &&
    typeof (product.price as { value?: number }).value === "number"
  ) {
    return (product.price as { value: number }).value;
  }
  return 0;
}

export function safeCurrencyCode(product: ProductData): string {
  if (product?.priceHtml?.currencyCode) return product.priceHtml.currencyCode;

  if (
    typeof product?.price === "object" &&
    product.price !== null &&
    "currencyCode" in product.price &&
    typeof product.price.currencyCode === "string"
  ) {
    return product.price.currencyCode;
  }

  return "USD";
}


export const useAddressesFromApi = () : {
  billingAddress: MappedCheckoutAddress | null;
  shippingAddress: MappedCheckoutAddress | null;
} => {
  const { data } = useAddress();
  const address = data?.data?.edges;
  if (!Array.isArray(address))
    return { billingAddress: null, shippingAddress: null };

  const billingNode = address.find((a) => a.node?.addressType === "cart_billing")
    ?.node;

  const shippingNode = address.find(
    (a) => a.node?.addressType === "cart_shipping"
  )?.node;

  const mapNode = (
    node?: CheckoutAddressNode
  ): MappedCheckoutAddress | null =>
    node
      ? {
        firstName: node.firstName,
        lastName: node.lastName,
        companyName: node.companyName,
        address: node.address,
        city: node.city,
        state: node.state,
        country: node.country,
        postcode: node.postcode,
        email: node.email,
        phone: node.phone,
      }
      : null;

  return {
    billingAddress: mapNode(billingNode),
    shippingAddress: mapNode(shippingNode),
  };
};
