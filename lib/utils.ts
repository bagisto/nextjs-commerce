import { ReadonlyURLSearchParams } from "next/navigation";

import { AddressDataTypes, CartItem, FilterDataTypes } from "./bagisto/types";
import { isArray, isObject } from "./type-guards";

import { ReviewDatatypes } from "@/components/product/producr-more-detail";
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
export const getBaseUrl = (baseUrl: string | any) => {
  return baseUrl ? `https://${baseUrl}` : "http://localhost:3000";
};

/**
 * Returning the data with the form values.
 * @param address
 * @returns Format Form Object
 */
export const extractAddress = (address?: AddressDataTypes) => {
  if (isObject(address)) {
    const addressFormatalues = {
      companyName: address?.companyName,
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      address: address.address,
      country: address.country,
      state: address.state,
      city: address.city,
      postcode: address.postcode,
      phone: address.phone,
      defaultAddress: address.defaultAddress,
      saveAddress: false,
    };

    return addressFormatalues;
  }
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

  return filters.map(({ __typename, ...rest }) =>
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
  // Initialize the ratingCounts object
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
  isSelectShipping: boolean,
  isSelectPayment: boolean
): string => {
  if (!isArray(items) || items.length === 0) {
    return "/"; // empty cart
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
      return "/checkout?step=payment"; // ✅ redirect to shipping if selected
    }

    if (!email || typeof email === "object") {
      return "/checkout"; // step: email entry
    }
    return "/checkout?step=address";
  } else {
    if (isSelectPayment) {
      return "/checkout?step=review";
    }

    if (isSelectShipping) {
      return "/checkout?step=payment"; // ✅ redirect to shipping if selected
    }

    if (!email || typeof email === "object") {
      return "/checkout"; // step: email entry
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
