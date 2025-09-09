import { revalidateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import lruCache from "../lru";

import {
  addToCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { userSubsCribeMutation } from "./mutations/common/subscribe";
import { savePaymentMutation } from "./mutations/payment-method";
import { savePlaceOrder } from "./mutations/place-order";
import { ForgetPassword } from "./mutations/recover-password";
import { addShippingAddressMutation } from "./mutations/shipping-address";
import { addShippingMethodMutation } from "./mutations/shipping-method";
import { UpdateAddressMutation } from "./mutations/update-address";
import { getCartQuery } from "./queries/cart";
import { getChannelQuery } from "./queries/channel";
import { getCustomerAddressQuery } from "./queries/checkout";
import {
  getCollectionProductQuery,
  getCollectionProductsQuery,
  getCollectionSeoQuery,
} from "./queries/collection";
import { getThemeFooterLinksQuery } from "./queries/common/footer-links";
import { getHomeCategoriesQuery } from "./queries/common/home-categories";
import { getHomeProductQuery } from "./queries/common/product-collection";
import { getHomeCustomizationQuery } from "./queries/common/theme-customization";
import { getMenuQuery } from "./queries/menu";
import { getCountryQuery, getPageQuery, getPagesQuery } from "./queries/page";
import { getPaymentMethodsQuery } from "./queries/payment-methods";
import { getFilterAttributesQuery } from "./queries/product/product-attributes";
import { getProductInfoQuery } from "./queries/product/product-info";
import { getShippingMethodQuery } from "./queries/shipping-method";
import {
  BagistoAddToCartOperation,
  BagistoAddressDataTypes,
  BagistoCart,
  BagistoCartOperation,
  BagistoChannelOperation,
  BagistoCheckoutOperation,
  BagistoCollection,
  BagistoCollectionCategoriesOperation,
  BagistoCollectionHomeCategoryCarousel,
  BagistoCollectionHomeOperation,
  BagistoCollectionMenus,
  BagistoCollectionOperation,
  BagistoCollectionProductsOperation,
  BagistoCountriesOperation,
  BagistoCreateUserOperation,
  BagistoMenuOperation,
  BagistoPageOperation,
  BagistoPagesOperation,
  BagistoPaymentDataType,
  BagistoProductInfo,
  BagistoRemoveFromCartOperation,
  BagistoUpdateCartOperation,
  BagistoUserTypes,
  Cart,
  ChannelType,
  Collection,
  CountryArrayDataType,
  FilterCmsPageTranslationInput,
  ImageInfo,
  Menu,
  Page,
  PaginatedProducts,
  Product,
  ProductDetailsInfo,
  ShippingArrayDataType,
  SuperAttribute,
  ThemeCustomizationTypes,
} from "./types";

import { isArray, isBagistoError, isObject } from "@/lib/type-guards";
import {
  BAGISTO_GRAPHQL_API_ENDPOINT,
  BAGISTO_SESSION,
  CACHE_KEY,
  CHECKOUT,
  HIDDEN_PRODUCT_TAG,
  TAGS,
  TOKEN,
} from "@/lib/constants";
import { CustomerRegister } from "./mutations/customer/customer-register";
import { RegisterInputs } from "@/components/customer/login/registration-form";
import { getProductsUrlQuery } from "./queries/product/product-urls";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const domain = process.env.BAGISTO_STORE_DOMAIN || "";

const endpoint = `${domain}${BAGISTO_GRAPHQL_API_ENDPOINT}`;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function bagistoFetch<T>({
  cache = "force-cache", // Always fetch fresh data
  headers,
  query,
  tags,
  variables,
  isCookies = true,
}: {
  cache?: RequestCache;
  headers?: HeadersInit | any;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
  cartId?: boolean;
  isCookies?: boolean;
}): Promise<{ status: number; body: T } | never> {
  try {
    const cookieStore = await cookies();
    let bagistoCartId = "";

    if (isCookies) {
      bagistoCartId = cookieStore.get(BAGISTO_SESSION)?.value ?? "";
    }

    const sessions = await getServerSession(authOptions);

    const accessToken = sessions?.user?.accessToken;

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "x-locale": "en",
        // "x-currency": "USD",
        ...(accessToken && {
          Authorization: `Bearer ${accessToken}`,
        }),
        ...(bagistoCartId && {
          Cookie: `${BAGISTO_SESSION}=${bagistoCartId}`,
        }),
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache: cache,
      next: {
        revalidate: cache === "no-store" ? 0 : 60,
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
    if (isBagistoError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

export async function bagistoFetchNoSession<T>({
  query,
  tags,
  variables,
  headers,
  cache = "force-cache",
}: {
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
  headers?: HeadersInit | any;
  cache?: RequestCache;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        revalidate: cache === "no-store" ? 0 : 60,
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
const removeEdgesAndNodes = (array: Array<any>) => {
  return array?.map((edge) => edge);
};

const reshapeCart = (cart: BagistoCart): Cart => {
  return {
    ...cart,
    lines: removeEdgesAndNodes(cart?.items),
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

const reshapeCollection = (
  collection: BagistoCollection
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle || collection.urlPath}`,
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
      altText: image?.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: BagistoProductInfo,
  filterHiddenProducts: boolean = true
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

export async function getChannel(): Promise<ChannelType> {
  const res = await bagistoFetch<BagistoChannelOperation>({
    query: getChannelQuery,
    tags: [TAGS.defaultChannel],
  });

  return res.body.data?.getDefaultChannel;
}

export async function addToCart(input: {
  productId: number;
  quantity: number;
  selectedConfigurableOption: number | undefined;
  superAttribute: SuperAttribute[];
  isBuyNow: Boolean;
}): Promise<Cart> {
  const res = await bagistoFetch<BagistoAddToCartOperation>({
    query: addToCartMutation,
    variables: { input },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.addItemToCart.cart);
}

export async function addShippingMethod(input: {
  method: string;
}): Promise<any> {
  const res = await bagistoFetch<any>({
    query: addShippingMethodMutation,
    variables: {
      input,
    },
    cache: "no-store",
  });

  revalidateTag(TAGS.cart);

  return reshapePayments(res.body.data.saveShipping);
}

export async function getPaymentMethod(input: { shippingMethod: string }) {
  const res = await bagistoFetch<any>({
    query: getPaymentMethodsQuery,
    variables: {
      input,
    },
    cache: "no-store",
  });
  const { paymentMethods } = res?.body?.data?.paymentMethods;

  if (!isArray(paymentMethods)) {
    return [];
  }

  return paymentMethods;
}

export async function addPaymentMethod(input: {
  method: string;
}): Promise<BagistoPaymentDataType> {
  const res = await bagistoFetch<any>({
    query: savePaymentMutation,
    variables: {
      input,
    },
    cache: "no-store",
  });

  return reshapePaymentMethods(res.body.data.savePayment);
}

export async function createPlaceOrder(): Promise<any> {
  const res = await bagistoFetch<any>({
    query: savePlaceOrder,
    cache: "no-store",
  });

  return res.body.data.placeOrder;
}

export async function addCheckoutAddress(input: any): Promise<any> {
  const res = await bagistoFetch<any>({
    query: addShippingAddressMutation,
    variables: {
      ...input,
    },
    cache: "no-store",
  });

  return reshapeShippingAddress(res.body.data.saveCheckoutAddresses);
}

export async function updateCustomerAddress(input: any) {
  const res = await bagistoFetch<any>({
    query: UpdateAddressMutation,
    variables: {
      ...input,
    },
    cache: "no-store",
  });

  const response = res?.body.data;

  if (!isObject(response)) {
    return null;
  }

  return response;
}

export async function createUserToLogin(
  input: RegisterInputs
): Promise<BagistoUserTypes> {
  try {
    const res = await bagistoFetch<BagistoCreateUserOperation>({
      query: CustomerRegister,
      variables: { input },
      cache: "no-store",
    });

    return res.body.data.customerSignUp;
  } catch (error: any) {
    return error;
  }
}

export async function recoverUserLogin(input: any): Promise<any> {
  try {
    return await bagistoFetch<any>({
      query: ForgetPassword,
      variables: {
        ...input,
      },
      cache: "no-store",
    });
  } catch (error) {
    return error;
  }
}

export async function subsCribeUser(input: any): Promise<any> {
  try {
    return await bagistoFetch<any>({
      query: userSubsCribeMutation,
      variables: {
        ...input,
      },
      cache: "no-store",
    });
  } catch (error) {
    return error;
  }
}

export async function removeFromCart(lineIds: number): Promise<Cart> {
  const res = await bagistoFetch<BagistoRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      lineIds,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.removeCartItem.cart);
}

export async function updateCart(
  qty: { cartItemId: number; quantity: number }[]
): Promise<Cart> {
  const res = await bagistoFetch<BagistoUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      input: { qty },
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.updateItemToCart.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const res = await bagistoFetch<BagistoCartOperation>({
    query: getCartQuery,
    tags: [TAGS.cart],
    cache: "no-store",
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data?.cartDetail) {
    return undefined;
  }

  return reshapeCart(res.body.data.cartDetail);
}

export async function getCheckoutAddress() {
  try {
    const res = await bagistoFetch<BagistoAddressDataTypes>({
      query: getCustomerAddressQuery,
      tags: [TAGS.address],
      cache: "no-store",
    });

    if (!isObject(res.body.data?.checkoutAddresses)) {
      return null;
    }

    return res.body.data?.checkoutAddresses;
  } catch (error) {
    return {
      isGuest: true,
      customer: {
        addresses: [],
      },
    };
  }
}

export async function getCollection(
  handle: string
): Promise<ProductDetailsInfo[] | undefined> {
  const input = [{ key: "category_id", value: `${handle}` }];
  const res = await bagistoFetch<BagistoCollectionOperation>({
    query: getCollectionSeoQuery,
    tags: [TAGS.collections],
    variables: {
      input,
    },
  });

  return res.body.data.allProducts.data;
}

export async function getCollectionHomePage(
  handle: string
): Promise<ThemeCustomizationTypes[]> {
  const res: any = await bagistoFetchNoSession<BagistoCollectionHomeOperation>({
    query: getHomeCustomizationQuery,
    tags: [handle, TAGS.themeCustomize],
  });
  if (!isArray(res.body.data?.themeCustomization)) {
    return [];
  }

  return res.body.data.themeCustomization;
}

export async function getCollectionMenus({
  inputs,
  getCategoryTree,
  tag,
}: {
  inputs: any;
  getCategoryTree: boolean;
  tag: string;
}): Promise<BagistoCollectionMenus[]> {
  const cachedData = lruCache.get(tag);

  if (cachedData) return cachedData;

  try {
    const input = { input: inputs, getCategoryTree: getCategoryTree };

    const res =
      await bagistoFetchNoSession<BagistoCollectionHomeCategoryCarousel>({
        query: getHomeCategoriesQuery,
        tags: [TAGS.collections, TAGS.products],
        variables: input,
      });

    lruCache.set(tag, res.body.data.homeCategories);

    return res.body.data.homeCategories;
  } catch (error) {
    console.error("Error fetching collection menus: line 531", error);
  }

  return [];
}

export async function getCollectionProducts({
  collection,
  type,
  reverse,
  sortKey,
  page,
}: {
  collection: string;
  type: string;
  reverse?: boolean;
  sortKey?: string;
  page?: string;
}): Promise<ProductDetailsInfo[]> {
  let input = [{ key: "limit", value: "100" }];

  if (collection && page != "product") {
    input = [{ key: "category_id", value: `${collection}` }, ...input];
  }
  if (sortKey) {
    const direction = reverse ? "desc" : "asc";

    input = [
      { key: "sort", value: `${sortKey.toLowerCase()}-${direction}` },
      ...input,
    ];
  }
  if (collection && page === "product") {
    input = [
      { key: "url_key", value: collection },
      { key: "type", value: type },
      ...input,
    ];
  }

  const res = await bagistoFetch<BagistoCollectionProductsOperation>({
    query: getCollectionProductQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      input,
    },
  });

  if (!res.body.data?.allProducts) {
    // console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(res.body.data.allProducts.data);
}

export async function getAllProductUrls(): Promise<Product[]> {
  const input = [
    { key: "sort", value: "name-desc" },
    { key: "page", value: "1" },
    { key: "limit", value: "48" },
  ];

  const res = await fetch(`${process.env.BAGISTO_STORE_DOMAIN}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: getProductsUrlQuery,
      variables: {
        input,
      },
    }),
    cache: "no-store",
  });

  const body = await res.json();
  return body?.data?.allProducts?.data;
}

export async function getCollectionReviewProducts({
  collection,
  reverse,
  sortKey,
  page,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  page?: string;
}): Promise<any> {
  let input = [{ key: "limit", value: "100" }];

  if (sortKey) {
    const direction = reverse ? "desc" : "asc";

    input = [
      { key: "sort", value: `${sortKey.toLowerCase()}-${direction}` },
      ...input,
    ];
  }
  if (collection && page === "product") {
    input = [{ key: "url_key", value: collection }, ...input];
  }

  const res = await bagistoFetch<any>({
    query: getProductInfoQuery,
    variables: {
      input,
    },
  });

  if (!isObject(res.body.data?.allProducts)) {
    // console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return res.body.data.allProducts.data[0];
}

export async function getCollectionHomeProducts({
  filters,
  tag,
}: {
  filters: any;
  tag: string;
}): Promise<ProductDetailsInfo[]> {
  const cachedData = lruCache.get(tag);
  if (cachedData) return cachedData;
  try {
    const res = await bagistoFetchNoSession<BagistoCollectionProductsOperation>(
      {
        query: getHomeProductQuery,
        tags: [TAGS.collections, TAGS.products],
        variables: { input: filters },
      }
    );

    // Only cache if products exist and no errors
    if (
      res.body &&
      res.body.data &&
      res.body.data.allProducts &&
      Array.isArray(res.body.data.allProducts.data)
    ) {
      const BannerProduct = reshapeProducts(res.body.data.allProducts.data);
      lruCache.set(tag, BannerProduct);
      return BannerProduct;
    }
    // Do not cache if error or no products
    return [];
  } catch (error) {
    console.error("Error fetching collection home products: line 630", error);
  }
  return [];
}

export async function getHomeCategories(): Promise<any[]> {
  const res = await bagistoFetch<any>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    cartId: false,
  });
  const bagistoCollections = removeEdgesAndNodes(
    res.body?.data?.homeCategories
  );
  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },

    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(bagistoCollections).filter(
      (collection) => !collection.handle?.startsWith("hidden")
    ),
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const cached = lruCache.get(handle);

  if (cached) {
    // If entry is stale (expired), lruCache.has(handle) will be false
    if (!lruCache.has(handle)) {
      // Trigger background refresh
      bagistoFetch<BagistoMenuOperation>({
        query: getMenuQuery,
        tags: [TAGS.collections],
        variables: { handle },
      }).then((res) => {
        const response =
          res.body?.data?.homeCategories?.map(
            (item: {
              name: string;
              slug: string;
              id: string;
              description: string;
            }) => ({
              id: item.id,
              title: item.name,
              description: item.description,
              path: `/search/${item.slug
                .replace(domain, "")
                .replace("/collections", "/search")
                .replace("/pages", "/search")}`,
            })
          ) || [];

        lruCache.set(handle, response);
      });
    }

    // Return cached (fresh or stale)
    return cached;
  }

  // No cache at all → fetch fresh
  const res = await bagistoFetch<BagistoMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  const response =
    res.body?.data?.homeCategories?.map((item) => ({
      id: item.id,
      title: item.name,
      description: item.description,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      metaKeywords: item.metaKeywords,
      path: `/search/${item.slug
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", "/search")}`,
    })) || [];

  lruCache.set(handle, response);

  return response;
}

export async function getThemeCustomization(): Promise<{
  footer_links: ThemeCustomizationTypes[];
  services_content: ThemeCustomizationTypes[];
}> {
  // const cachedData = lruCache.get(CACHE_KEY.footerLink);

  // if (cachedData) return cachedData;

  try {
    const res = await bagistoFetch<BagistoCollectionHomeOperation>({
      query: getThemeFooterLinksQuery,
      tags: [TAGS.collections],
    });

    const data = res.body?.data?.themeCustomization || [];

    const footer_links = data.filter((item) => item?.type === "footer_links");
    const services_content = data.filter(
      (item) => item?.type === "services_content"
    );

    const response = {
      footer_links,
      services_content,
    };

    lruCache.set(CACHE_KEY.footerLink, response);

    return response;
  } catch (error) {
    console.log(error, "line 727");
  }

  return {
    footer_links: [],
    services_content: [],
  };
}

export async function getPage(
  input: FilterCmsPageTranslationInput
): Promise<Page> {
  const res = await bagistoFetch<BagistoPageOperation>({
    query: getPageQuery,
    cache: "no-store",
    variables: { input },
  });

  return res.body.data?.cmsPages;
}

export async function getPages(): Promise<Page> {
  const res = await bagistoFetch<BagistoPagesOperation>({
    query: getPagesQuery,
    cartId: false,
    cache: "no-store",
  });

  return res.body.data?.cmsPages;
}

export async function getProducts({
  categoryId,
  query,
  sortKey,
  filters,
  tag,
}: {
  categoryId?: string;
  query?: string;
  sortKey?: string;
  filters?: any;
  tag: string;
}): Promise<PaginatedProducts> {
  let input = [{ key: "limit", value: "12" }];

  if (sortKey) {
    input = [{ key: "sort", value: `${sortKey}` }, ...input];
  }
  if (query) {
    input = [{ key: "name", value: query }, ...input];
  }

  if (categoryId) {
    input = [{ key: "category_id", value: categoryId }, ...input];
  }

  if (isArray(filters)) {
    input = [...filters, ...input];
  }

  const res = await bagistoFetch<BagistoCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [tag, TAGS.products],
    cartId: false,
    variables: {
      input,
    },
  });

  if (!isArray(res.body.data.allProducts.data)) {
    return {
      paginatorInfo: {
        count: 0,
        currentPage: 1,
        lastPage: 1,
        total: 12,
      },
      products: [],
    };
  }

  return {
    paginatorInfo: res.body.data.allProducts?.paginatorInfo,
    products: reshapeProducts(res.body.data.allProducts.data),
  };
}

export async function getFilterAttributes({
  categorySlug,
}: {
  categorySlug: string;
}): Promise<any> {
  const res = await bagistoFetch<BagistoCollectionCategoriesOperation>({
    query: getFilterAttributesQuery,
    cartId: false,
    variables: {
      categorySlug,
    },
  });

  if (!isObject(res.body.data?.getFilterAttribute)) {
    return {};
  }

  return res.body.data.getFilterAttribute;
}

export async function getCountryList(): Promise<CountryArrayDataType[]> {
  const res = await bagistoFetch<BagistoCountriesOperation>({
    query: getCountryQuery,
  });

  return res.body?.data?.countries;
}

export async function getShippingMethod(): Promise<
  ShippingArrayDataType[] | undefined
> {
  const res = await bagistoFetch<BagistoCheckoutOperation>({
    query: getShippingMethodQuery,
    tags: [CHECKOUT.method],
    cache: "no-store",
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
