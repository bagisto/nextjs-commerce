import { cache } from "react";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  BagistoCreateUserOperation,
  BagistoProductInfo,
  BagistoSession,
  BagistoUser,
  ImageInfo,
} from "@/types/types";
import {
  BAGISTO_SESSION,
  HIDDEN_PRODUCT_TAG,
  STOREFRONT_KEY,
} from "../constants";
import { getServerSession } from "next-auth";
import {
  CUSTOMER_LOGOUT,
  CUSTOMER_REGISTRATION,
  FORGET_PASSWORD,
  UPDATE_CUSTOMER_PROFILE,
} from "@/graphql/customer/mutations";
import { GET_CUSTOMER_PROFILE } from "@/graphql/customer/queries/GetCustomerProfile";
import { GET_CUSTOMER_ORDER } from "@/graphql/customer/queries/GetCustomerOrder";
import { GET_CUSTOMER_ORDERS } from "@/graphql/customer/queries/GetCustomerOrders";
import { GET_CUSTOMER_DOWNLOADABLE_PRODUCTS } from "@/graphql/customer/queries/GetCustomerDownloadableProducts";
import { GET_CUSTOMER_REVIEWS } from "@/graphql/customer/queries/GetCustomerReviews";
import { GET_CUSTOMER_ADDRESSES } from "@/graphql/customer/queries/GetCustomerAddresses";
import { CREATE_CUSTOMER_ADDRESS } from "@/graphql/customer/mutations/CreateCustomerAddress";
import { DocumentNode } from "graphql";
import { GRAPHQL_URL } from "@/utils/constants";
import {
  GET_FOOTER,
  GET_THEME_CUSTOMIZATION,
  PAGE_BY_URL_KEY,
} from "@/graphql";
import { SUBSCRIBE_TO_NEWSLETTER } from "@/graphql/theme/mutations";
import { cachedGraphQLRequest } from "@/lib/cached-graphql";
import { authOptions } from "@utils/auth";
import { RegisterInputs } from "@components/customer/types";
import {
  GetFooterResponse,
  ThemeCustomizationResult,
  ThemeCustomizationResponse,
  PageData,
} from "@/types/theme/theme-customization";
import { CREATE_COMPARE_ITEM } from "@/graphql/customer/mutations";
import { extractNumericId } from "@/utils/helper";

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

interface PageByUrlKeyResponse {
  pageByUrlKeypages?: PageData[];
}

export async function bagistoFetch<T>({
  cache = "force-cache",
  headers,
  query,
  tags,
  variables,
  isCookies = true,
  guestToken,
  revalidate = 60,
}: {
  cache?: RequestCache;
  headers?: HeadersInit | Record<string, string>;
  query: string | DocumentNode;
  tags?: string[];
  variables?: ExtractVariables<T>;
  isCookies?: boolean;
  guestToken?: string;
  revalidate?: number;
}): Promise<{ status: number; body: T } | never> {
  try {
    const queryString =
      typeof query === "string" ? query : (query.loc?.source?.body ?? "");

    let bagistoCartId = "";
    let accessToken: string | undefined = undefined;

    if (isCookies) {
      const cookieStore = await cookies();
      bagistoCartId = cookieStore.get(BAGISTO_SESSION)?.value ?? "";
      const sessions = (await getServerSession(
        authOptions,
      )) as BagistoSession | null;
      accessToken = sessions?.user?.accessToken;
    }

    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "X-STOREFRONT-KEY": STOREFRONT_KEY,
    };

    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    } else if (guestToken) {
      baseHeaders.Authorization = `Bearer ${guestToken}`;
    }

    if (bagistoCartId) {
      baseHeaders.Cookie = `${BAGISTO_SESSION}=${bagistoCartId}`;
    }

    if (isCookies && headers) {
      if (headers instanceof Headers) {
        headers.forEach((value, key) => (baseHeaders[key] = value));
      } else {
        Object.assign(baseHeaders, headers);
      }
    }

    const result = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: baseHeaders,
      body: JSON.stringify({
        query: queryString,
        ...(variables && { variables }),
      }),
      cache,
      next: {
        revalidate: cache === "no-store" ? 0 : revalidate || 60,
        ...(tags && { tags }),
      },
    });

    const body = await result.json();

    if (body.errors) throw body.errors[0];

    return { status: result.status, body };
  } catch (e) {
    throw e;
  }
}

export async function bagistoFetchNoSession<T>({
  query,
  tags,
  variables,
  headers,
  cache = "force-cache",
  revalidate = 60,
}: {
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
  headers?: HeadersInit | Record<string, string>;
  cache?: RequestCache;
  isCookies?: boolean;
  revalidate?: number;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-STOREFRONT-KEY": STOREFRONT_KEY,
        "x-locale": "en",
        "x-currency": "USD",
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      next: {
        revalidate: cache === "no-store" ? 0 : revalidate || 60,
        ...(tags && { tags }),
      },
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    throw { error: e, query };
  }
}

export const removeEdgesAndNodes = <T>(array: Array<T>) => {
  return array?.map((edge) => edge);
};

const reshapeImages = (images: Array<ImageInfo>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image?.url.match(/.*\/(.*)\..*/)?.[1];

    return {
      ...image,
      altText: image?.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: BagistoProductInfo,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags?.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

export const reshapeProducts = (products: BagistoProductInfo[]) => {
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

export async function createUserToLogin(
  input: RegisterInputs,
): Promise<BagistoUser> {
  try {
    const { passwordConfirmation, ...userInput } = input;
    const res = await bagistoFetch<BagistoCreateUserOperation>({
      query: CUSTOMER_REGISTRATION,
      variables: {
        input: {
          ...userInput,
          confirmPassword: passwordConfirmation,
          status: "1",
          isVerified: "1",
          isSuspended: "0",
          subscribedToNewsLetter: true,
        },
      },
      cache: "no-store",
      revalidate: 3600,
    });

    return res.body.data.createCustomer.customer;
  } catch (error: any) {
    throw new Error(error?.message || "Registration failed");
  }
}

export async function logoutUser() {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "User token missing",
      };
    }

    const res = await bagistoFetch<{
      data: { createLogout: { logout: { success: boolean; message: string } } };
      variables: { input: { token: string } };
    }>({
      query: CUSTOMER_LOGOUT,
      isCookies: true,
      revalidate: 3600,
    });

    const success = res?.body?.data?.createLogout?.logout?.success ?? false;

    const message =
      res?.body?.data?.createLogout?.logout?.message ?? "Logout executed";

    const cookieStore = await cookies();
    cookieStore.delete(BAGISTO_SESSION);

    return {
      success,
      message,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function recoverUserLogin(
  input: Record<string, unknown>,
): Promise<unknown> {
  try {
    return await bagistoFetch<{
      data: unknown;
      variables: Record<string, unknown>;
    }>({
      query: FORGET_PASSWORD,
      variables: {
        ...input,
      },
      cache: "no-store",
      revalidate: 3600,
    });
  } catch (error) {
    return error;
  }
}

export async function subscribeUser(
  input: Record<string, unknown>,
): Promise<unknown> {
  try {
    return await bagistoFetch<{
      data: unknown;
      variables: Record<string, unknown>;
    }>({
      query: SUBSCRIBE_TO_NEWSLETTER,
      variables: {
        ...input,
      },
      cache: "no-store",
    });
  } catch (error) {
    return error;
  }
}

export async function getThemeCustomization(): Promise<ThemeCustomizationResult> {
  try {
    const [footerRes, servicesRes] = await Promise.all([
      cachedGraphQLRequest<GetFooterResponse>("static", GET_FOOTER, {
        type: "footer_links",
      }),
      cachedGraphQLRequest<GetFooterResponse>("static", GET_FOOTER, {
        type: "services_content",
      }),
    ]);

    return {
      footer_links: footerRes,
      services_content: servicesRes,
    };
  } catch (err) {
    console.error("ThemeCustomization Error:", err);
  }

  return {
    footer_links: null,
    services_content: null,
  };
}

export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = (await headers()).get("x-bagisto-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.BAGISTO_REVALIDATION_SECRET) {
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    return NextResponse.json({ status: 200, message: "No action needed" });
  }

  if (isProductUpdate) {
    revalidatePath("/", "layout");
  } else if (isCollectionUpdate) {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({
    status: 200,
    revalidated: true,
    topic,
    now: Date.now(),
  });
}

export async function getHomePageData(): Promise<ThemeCustomizationResponse> {
  const res = await bagistoFetch<{
    data: ThemeCustomizationResponse;
    variables: { first: number };
  }>({
    query: GET_THEME_CUSTOMIZATION,
    variables: { first: 20 },
    tags: ["theme-customization"],
    revalidate: 60,
  });

  return res.body.data;
}

export async function getPage(input: { urlKey: string }): Promise<PageData[]> {
  const res = await bagistoFetch<{
    data: PageByUrlKeyResponse;
    variables: { pageByUrlKey: string };
  }>({
    query: PAGE_BY_URL_KEY,
    cache: "no-store",
    isCookies: false,
    variables: { pageByUrlKey: input.urlKey },
  });

  return res.body.data?.pageByUrlKeypages || [];
}

export const getCustomerProfile = cache(async () => {
  try {
    const res = await bagistoFetch<{
      data: { readCustomerProfile: any };
    }>({
      query: GET_CUSTOMER_PROFILE,
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.readCustomerProfile;
  } catch (error) {
    console.error("getCustomerProfile error:", error);
    return null;
  }
});

export async function updateCustomerProfile(input: any) {
  try {
    const res = await bagistoFetch<any>({
      query: UPDATE_CUSTOMER_PROFILE,
      variables: { input },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: true,
      data: res.body.data?.createCustomerProfileUpdate?.customerProfileUpdate
    };
  } catch (error: any) {
    console.error("updateCustomerProfile error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function getCustomerOrders(variables?: { first?: number; after?: string }) {
  try {
    const res = await bagistoFetch<{
      data: { customerOrders: any };
      variables: any;
    }>({
      query: GET_CUSTOMER_ORDERS,
      variables: variables || { first: 10 },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.customerOrders;
  } catch (error) {
    console.error("getCustomerOrders error:", error);
    return null;
  }
}

export async function getCustomerOrder(id: string) {
  try {
    const res = await bagistoFetch<{
      data: { customerOrder: any };
      variables: any;
    }>({
      query: GET_CUSTOMER_ORDER,
      variables: { id },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.customerOrder;
  } catch (error) {
    console.error("getCustomerOrder error:", error);
    return null;
  }
}

export async function getCustomerDownloadableProducts({
  first = 10,
  after = null,
}: {
  first?: number;
  after?: string | null;
}) {
  try {
    const res = await bagistoFetch<{
      data: { customerDownloadableProducts: any };
      variables: any;
    }>({
      query: GET_CUSTOMER_DOWNLOADABLE_PRODUCTS,
      variables: { first, after },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.customerDownloadableProducts;
  } catch (error) {
    console.error("getCustomerDownloadableProducts error:", error);
    return null;
  }
}

export async function getCustomerReviews({
  first = 10,
  after = null,
}: {
  first?: number;
  after?: string | null;
}) {
  try {
    const res = await bagistoFetch<{
      data: { customerReviews: any };
      variables: any;
    }>({
      query: GET_CUSTOMER_REVIEWS,
      variables: { first, after },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.customerReviews;
  } catch (error) {
    console.error("getCustomerReviews error:", error);
    return null;
  }
}
export async function getCustomerAddresses({
  first = 10,
  after = null,
}: {
  first?: number;
  after?: string | null;
}) {
  try {
    const res = await bagistoFetch<{
      data: { getCustomerAddresses: any };
      variables: any;
    }>({
      query: GET_CUSTOMER_ADDRESSES,
      variables: { first, after },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.getCustomerAddresses;
  } catch (error) {
    console.error("getCustomerAddresses error:", error);
    return null;
  }
}

export async function createCustomerAddress(input: any) {
  try {
    const res = await bagistoFetch<any>({
      query: CREATE_CUSTOMER_ADDRESS,
      variables: { input },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: true,
      data: res.body.data?.createAddUpdateCustomerAddress?.addUpdateCustomerAddress
    };
  } catch (error: any) {
    console.error("createCustomerAddress error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function deleteCustomerAddress(addressId: string) {
  try {
    const { DELETE_CUSTOMER_ADDRESS } = await import('@/graphql/customer/mutations');
    const res = await bagistoFetch<any>({
      query: DELETE_CUSTOMER_ADDRESS,
      variables: { input: { addressId: parseInt(addressId) } },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: true,
      data: res.body.data?.createDeleteCustomerAddress?.deleteCustomerAddress
    };
  } catch (error: any) {
    console.error("deleteCustomerAddress error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function setDefaultAddress(address: any) {
  try {
    const { CREATE_CUSTOMER_ADDRESS } = await import('@/graphql/customer/mutations');

    const input = {
      addressId: parseInt(address._id || address.id),
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      address1: address.address1 || address.address,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      country: address.country,
      postcode: address.postcode,
      phone: address.phone,
      defaultAddress: true,
      useForShipping: true
    };

    const res = await bagistoFetch<any>({
      query: CREATE_CUSTOMER_ADDRESS,
      variables: { input },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: true,
      data: res.body.data?.createAddUpdateCustomerAddress?.addUpdateCustomerAddress
    };
  } catch (error: any) {
    console.error("setDefaultAddress error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function getCustomerAddress(id: string) {
  try {
    const { GET_CUSTOMER_ADDRESS } = await import('@/graphql/customer/queries/GetCustomerAddress');
    const res = await bagistoFetch<any>({
      query: GET_CUSTOMER_ADDRESS,
      variables: { id },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.customerAddress;
  } catch (error) {
    console.error("getCustomerAddress error:", error);
    return null;
  }
}

export async function toggleWishlist(productId: string | number) {
  try {
    const { TOGGLE_WISHLIST_MUTATION } = await import('@/graphql/catalog/mutations');
    const res = await bagistoFetch<any>({
      query: TOGGLE_WISHLIST_MUTATION,
      variables: { input: { productId: typeof productId === 'string' ? parseInt(productId.split('/').pop() || '0') : productId } },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: true,
      data: res.body.data?.toggleWishlist
    };
  } catch (error: any) {
    if (error?.message?.toLowerCase()?.includes("removed from wishlist")) {
      return {
        success: true,
        data: null
      };
    }
    console.error("toggleWishlist error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function getCustomerWishlist() {
  try {
    const { GET_WISHLISTS } = await import('@/graphql/customer/queries/GetWishlists');
    const res = await bagistoFetch<any>({
      query: GET_WISHLISTS,
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.wishlists?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.error("getCustomerWishlist error:", error);
    return [];
  }
}

export async function getWishlistItem(id: string) {
  try {
    const { GET_WISHLIST } = await import('@/graphql/customer/queries/GetWishlist');
    const res = await bagistoFetch<any>({
      query: GET_WISHLIST,
      variables: { id },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.wishlist;
  } catch (error) {
    if ((error as any)?.extensions?.status === 400) {
      return null;
    }
    console.error("getWishlistItem error:", error);
    return null;
  }
}

export async function getAllWishlists(variables?: { first?: number; after?: string }) {
  try {
    const { GET_ALL_WISHLISTS } = await import('@/graphql/customer/queries/GetAllWishlists');
    const res = await bagistoFetch<any>({
      query: GET_ALL_WISHLISTS,
      variables: variables || { first: 10 },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.wishlists;
  } catch (error) {
    console.error("getAllWishlists error:", error);
    return null;
  }
}

export async function getWishlistIds(variables?: { first?: number; after?: string }) {
  try {
    const { GET_WISHLIST_IDS } = await import('@/graphql/customer/queries/GetWishlistIds');
    const res = await bagistoFetch<any>({
      query: GET_WISHLIST_IDS,
      variables: variables || { first: 500 },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.wishlists;
  } catch (error) {
    console.error("getWishlistIds error:", error);
    return null;
  }
}

export async function deleteWishlistItem(id: string) {
  try {
    const { DELETE_WISHLIST_ITEM } = await import('@/graphql/customer/mutations/DeleteWishlist');
    const res = await bagistoFetch<any>({
      query: DELETE_WISHLIST_ITEM,
      variables: { input: { id } },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: true,
      data: res.body.data?.deleteWishlist?.wishlist
    };
  } catch (error: any) {
    console.error("deleteWishlistItem error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function moveWishlistToCart(wishlistItemId: string, quantity: number) {
  try {
    const { MOVE_WISHLIST_TO_CART } = await import('@/graphql/customer/mutations/MoveWishlistToCart');
    const { extractNumericId } = await import('@/utils/helper');
    const numericId = extractNumericId(wishlistItemId);

    const res = await bagistoFetch<any>({
      query: MOVE_WISHLIST_TO_CART,
      variables: { 
        input: { 
          wishlistItemId: parseInt(numericId || '0'),
          quantity 
        } 
      },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: true,
      data: res.body.data?.moveWishlistToCart?.wishlistToCart
    };
  } catch (error: any) {
    console.error("moveWishlistToCart error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function createCompareItem(productId: string | number) {
  try {

    const numericId = extractNumericId(productId);

    const res = await bagistoFetch<any>({
      query: CREATE_COMPARE_ITEM,
      variables: { 
        input: { 
          productId: parseInt(numericId || '0')
        } 
      },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: true,
      data: res.body.data?.createCompareItem?.compareItem
    };
  } catch (error: any) {
    console.error("createCompareItem error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function getCompareItems(variables?: { first?: number; after?: string }) {
  try {
    const { GET_COMPARE_ITEMS } = await import('@/graphql');
    
    const res = await bagistoFetch<any>({
      query: GET_COMPARE_ITEMS,
      variables: variables || { first: 10 },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.compareItems || null;
  } catch (error) {
    console.error("getCompareItems error:", error);
    return null;
  }
}

export async function getCompareIds(variables?: { first?: number; after?: string }) {
  try {
    const { GET_COMPARE_IDS } = await import('@/graphql/customer/queries/GetCompareIds');

    const res = await bagistoFetch<any>({
      query: GET_COMPARE_IDS,
      variables: variables || { first: 500 },
      cache: "no-store",
      isCookies: true,
    });

    return res.body.data?.compareItems || null;
  } catch (error) {
    console.error("getCompareIds error:", error);
    return null;
  }
}

export async function deleteCompareItem(id: string) {
  try {
    const { DELETE_COMPARE_ITEM } = await import('@/graphql');
    
    const res = await bagistoFetch<any>({
      query: DELETE_COMPARE_ITEM,
      variables: { input: { id } },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: !!res.body.data?.deleteCompareItem?.compareItem,
      message: res.body.data?.deleteCompareItem?.compareItem ? "Product removed from comparison" : "Failed to remove product"
    };
  } catch (error: any) {
    console.error("deleteCompareItem error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function deleteAllCompareItems() {
  try {
    const { DELETE_ALL_COMPARE_ITEMS } = await import('@/graphql');
    
    const res = await bagistoFetch<any>({
      query: DELETE_ALL_COMPARE_ITEMS,
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: !!res.body.data?.createDeleteAllCompareItems?.deleteAllCompareItems,
      message: res.body.data?.createDeleteAllCompareItems?.deleteAllCompareItems?.message || "All items removed from comparison"
    };
  } catch (error: any) {
    console.error("deleteAllCompareItems error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}

export async function addProductToCart(productId: string | number, quantity: number) {
  try {
    const { CREATE_ADD_PRODUCT_IN_CART } = await import('@/graphql/cart/mutations');
    const numericId = extractNumericId(productId);

    const res = await bagistoFetch<any>({
      query: CREATE_ADD_PRODUCT_IN_CART,
      variables: { 
        productId: parseInt(numericId || '0'),
        quantity 
      },
      cache: "no-store",
      isCookies: true,
    });

    return {
      success: res.body.data?.createAddProductInCart?.addProductInCart?.success || false,
      message: res.body.data?.createAddProductInCart?.addProductInCart?.message || "Product added to cart"
    };
  } catch (error: any) {
    console.error("addProductToCart error:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong"
    };
  }
}
