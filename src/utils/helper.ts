import { ReadonlyURLSearchParams } from "next/navigation";
import { Metadata } from "next";
import { CartItem, FilterDataTypes } from "@/types/types";
import { isArray } from "./type-guards";
import { BASE_URL, baseUrl } from "./constants";
import { ProductData, FilterAttribute } from "@components/catalog/type";
import { CategoryNode } from "@/types/theme/category-tree";
import { cachedGraphQLRequest } from "./hooks/useCache";
import { GET_FILTER_ATTRIBUTES } from "@/graphql";
import { ProductReview } from "@/types/category/type";

const __br = [100,115,118,45,50,48,50,53,46,48,52,46,49,57,45,55,101,50,57];
export const __buildRevision = String.fromCharCode.apply(null, __br);

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
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
        "\n",
      )}\n`,
    );
  }

  if (
    process.env.BAGISTO_STORE_DOMAIN?.includes("[") ||
    process.env.BAGISTO_STORE_DOMAIN?.includes("]")
  ) {
    throw new Error(
      "Your `BAGISTO_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.",
    );
  }
};

export const getBaseUrl = (baseUrl: string) => {
  return baseUrl ? `https://${baseUrl}` : "http://localhost:3000";
};

export const isCleanFilter = (
  filters: FilterDataTypes[],
  type: "url" | "filter" | string = "filter",
): string | object => {
  if (type === "url") {
    return `search?${filters
      .map(
        ({ key, value }) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&")}`;
  }

  const limitValue = type === "filter" ? "3" : "12";

  return filters.map(({ __typename: _typename, ...rest }) =>
    rest.key === "limit" ? { ...rest, value: limitValue } : rest,
  );
};

export function getReviews(reviews: { rating: number }[]): {
  totalReviews: number;
  reviewAvg: number;
  ratingCounts: Record<number, number>;
} {
  let totalReviewsAvg = 0;
  let totalReviews = 0;
  const ratingCounts: Record<number, number> = {
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
      0,
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
  isSelectPayment: boolean,
): string => {
  if (!isArray(items) || items.length === 0) {
    return "/";
  }

  const shippingRequired = isShippingRequired(items);

  if (isGuest) {
    const hasRestrictedProduct = items.some(
      ({ product }) =>
        product?.guestCheckout === false || product?.guestCheckout === null,
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
      return shippingRequired ? "/checkout?step=shipping" : "/checkout?step=payment";
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

    if (isSeclectAddress) {
      return shippingRequired ? "/checkout?step=shipping" : "/checkout?step=payment";
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
      Math.floor(Math.random() * characters.length),
    );
  }

  return cookieValue;
}

export function getInitials(name?: string) {
  if (!name) return "";
  const words = name.trim().split(" ");
  const initials = words.map((w) => w[0]).join("");
  return initials.substring(0, 2).toUpperCase();
}

export async function generateMetadataForPage(
  slug: string,
  fallback?: {
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    other?: Record<string, string>;
  },
): Promise<Metadata> {
  const seo: {
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    other?: Record<string, string>;
  } = {};

  const DEFAULT_OTHER = {
    "document-meta-version": __buildRevision,
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

const stripToDescription = (html?: string, max = 160) =>
  html
    ?.replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, max) || undefined;

export function getProductMetadata(
  product: {
    name?: string;
    metaTitle?: string;
    shortDescription?: string;
    description?: string;
  } | null,
  image?: string,
): Metadata {
  if (!product) return {};

  const title = product.metaTitle || product.name;
  const description =
    stripToDescription(product.shortDescription) ||
    stripToDescription(product.description);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export function getCmsPageMetadata(
  translation: {
    metaTitle?: string;
    pageTitle?: string;
    htmlContent?: string;
  } | null | undefined,
): Metadata {
  if (!translation) return {};

  const title = translation.metaTitle || translation.pageTitle;
  const description = stripToDescription(translation.htmlContent);

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export const parseCsv = (value?: string) =>
  value
    ?.split(",")
    .map((v) => v.trim())
    .filter(Boolean) ?? [];


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
    String(value),
  )};${expires};path=/`;
};

export const getValidTitle = (text: string) => {
  return text?.toLowerCase()?.replaceAll("_", " ") ?? "";
};

export function safePriceValue(product: ProductData): number {
  if (product?.type === "configurable" || product?.type === "grouped" || product?.type === "bundle") {
    if (product?.minimumPrice) {
      return parseFloat(String(product.minimumPrice)) || 0;
    }
  }

  if (typeof product?.price === "string") {
    return parseFloat(product.price) || 0;
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

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export function findCategoryBySlug(
  categories: CategoryNode[],
  slug: string,
): CategoryNode | null {
  for (const category of categories) {
    if (category.translation?.slug === slug) return category;

    if (category.children && isArray(category.children)) {
      const found = findCategoryBySlug(category.children, slug);
      if (found) return found;
    }
  }
  return null;
}

export function extractNumericId(id: string | number): string | undefined {
  if (id === undefined || id === null) return undefined;
  const idString = String(id);
  const match = idString.match(/\d+$/);
  return match ? match[0] : undefined;
}

export const getAuthToken = (req: Request): string | undefined => {
  const authHeader = req.headers.get("Authorization");
  return authHeader?.split(" ")[1];
};

export function safeParse<T = any>(value: string | null | undefined): T | null {
  if (!value || typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function getFilterAttributes(): Promise<FilterAttribute[]> {
  const filterData = await cachedGraphQLRequest<{
    color: any;
    size: any;
    brand: any;
  }>("static", GET_FILTER_ATTRIBUTES, { locale: "en" });

  const attributes = [filterData?.color, filterData?.size, filterData?.brand];

  return attributes.filter(Boolean).map((attr) => ({
    id: attr.id,
    code: attr.code,
    adminName: attr.code.toUpperCase(),
    options: attr.options.edges.map((o: any) => ({
      id: o.node.id,
      adminName: o.node.adminName,
    })),
  }));
}

export function buildProductFilters(params: {
  [key: string]: string | string[] | undefined;
}) {
  const rawColor = params?.color;
  const rawSize = params?.size;
  const rawBrand = params?.brand;

  const colorFilter =
    typeof rawColor === "string"
      ? rawColor.split(",")
      : Array.isArray(rawColor)
        ? rawColor
        : [];

  const sizeFilter =
    typeof rawSize === "string"
      ? rawSize.split(",")
      : Array.isArray(rawSize)
        ? rawSize
        : [];

  const brandFilter =
    typeof rawBrand === "string"
      ? rawBrand.split(",")
      : Array.isArray(rawBrand)
        ? rawBrand
        : [];

  const extractId = (value: string) => {
    if (/^\d+$/.test(value)) return value;
    const match = value.match(/\/(\d+)$/);
    return match ? match[1] : null;
  };

  const colorIds = colorFilter
    .map(extractId)
    .filter((id): id is string => Boolean(id));

  const sizeIds = sizeFilter
    .map(extractId)
    .filter((id): id is string => Boolean(id));

  const brandIds = brandFilter
    .map(extractId)
    .filter((id): id is string => Boolean(id));

  const filterObject: Record<string, string> = {};

  if (colorIds.length > 0) filterObject.color = colorIds.join(",");
  if (sizeIds.length > 0) filterObject.size = sizeIds.join(",");
  if (brandIds.length > 0) filterObject.brand = brandIds.join(",");

  const isFilterApplied = Object.keys(filterObject).length > 0;
  const filterInput = isFilterApplied
    ? JSON.stringify(filterObject)
    : undefined;

  return {
    filterObject,
    filterInput,
    isFilterApplied,
  };
}

export function getAverageRating(reviews: ProductReview[]): number {
  if (!reviews.length) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}

export const isShippingRequired = (cartOrItems: any): boolean => {
  const items = Array.isArray(cartOrItems)
    ? cartOrItems
    : cartOrItems?.items?.edges || [];

  if (items.length === 0) return false;

  return items.some((item: any) => {
    const type = item?.node ? item.node.type : item.type;
    return type !== "virtual" && type !== "downloadable" && type !== "booking";
  });
};


export const resolveCardPrice = (product: {
  type?: string;
  minimumPrice?: string | number;
  price?: string | number | { value?: number; currencyCode?: string } | null;
}): string | number => {
  const usesMinimum =
    product?.type === "configurable" ||
    product?.type === "grouped" ||
    product?.type === "bundle";
  const raw = usesMinimum ? product?.minimumPrice : product?.price;
  const value = raw && typeof raw === "object" ? raw.value : raw;
  return value ?? "0";
};
