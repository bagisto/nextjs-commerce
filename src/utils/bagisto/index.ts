import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  BagistoCollectionProductsOperation,
  BagistoCreateUserOperation,
  BagistoProductInfo,
  BagistoUser,
  ImageInfo,
  InputData,
  ProductDetailsInfo,
} from "@/types/types";
import {
  BAGISTO_SESSION,
  HIDDEN_PRODUCT_TAG,
} from "../constants";
import { getServerSession } from "next-auth";
import {
  CUSTOMER_LOGOUT,
  CUSTOMER_REGISTRATION,
  FORGET_PASSWORD,
} from "@/graphql/customer/mutations";
import { DocumentNode } from "graphql";
import { GRAPHQL_URL } from "@/utils/constants";
import { GET_FOOTER } from "@/graphql";
import { SUBSCRIBE_TO_NEWSLETTER } from "@/graphql/theme/mutations";
import { getHomeProductQuery } from "./product-collection";
import { authOptions } from "@utils/auth";
import { RegisterInputs } from "@components/customer/RegistrationForm";
import { GetFooterResponse, GetFooterVariables, ThemeCustomizationResult } from "@/types/theme/theme-customization";

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function bagistoFetch<T>({
  cache = "force-cache",
  headers,
  query,
  tags,
  variables,
  isCookies = true,
  revalidate = 60,
}: {
  cache?: RequestCache;
  headers?: HeadersInit | Record<string, string>;
  query: string | DocumentNode;
  tags?: string[];
  variables?: ExtractVariables<T>;
  isCookies?: boolean;
  revalidate?: number;
}): Promise<{ status: number; body: T } | never> {
  try {
    const queryString =
      typeof query === "string" ? query : query.loc?.source?.body ?? "";

    let bagistoCartId = "";
    let accessToken: string | undefined = undefined;

    if (isCookies) {
      const cookieStore = await cookies();
      bagistoCartId = cookieStore.get(BAGISTO_SESSION)?.value ?? "";
      const sessions = await getServerSession(authOptions);
      accessToken = (sessions as any)?.user?.accessToken;

    }

    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
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
  revalidate?: number,
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(GRAPHQL_URL, {
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
        revalidate: cache === "no-store" ? 0 : revalidate ||60,
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
  input: RegisterInputs
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
      revalidate : 3600,
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
      variables: {
        input: {
          token,
        },
      },
      isCookies: true,
      revalidate : 3600,
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
  input: Record<string, unknown>
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
      revalidate : 3600,
    });
  } catch (error) {
    return error;
  }
}

export async function subsCribeUser(
  input: Record<string, unknown>
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

export async function getCollectionHomeProducts({
  filters,
}: {
  filters: InputData[];
  tag: string;
}): Promise<ProductDetailsInfo[]> {
  try {
    const res = await bagistoFetchNoSession<BagistoCollectionProductsOperation>(
      {
        query: getHomeProductQuery,
        variables: { input: filters },
        tags: ["products"],
        isCookies: false,
         revalidate : 86400,
      }
    );

    if (
      res.body &&
      res.body.data &&
      res.body.data.allProducts &&
      Array.isArray(res.body.data.allProducts.data)
    ) {
      return reshapeProducts(res.body.data.allProducts.data);
    }
    return [];
  } catch {
    // Error handled silently
  }
  return [];
}

export async function getThemeCustomization(): Promise<ThemeCustomizationResult> {
  try {
    const footerRes = await bagistoFetch<{
      data: GetFooterResponse;
      variables: GetFooterVariables
    }>({
      query: GET_FOOTER,
      variables: { type: "footer_links" },
      isCookies: false,
       revalidate : 86400,
    });

    const servicesRes = await bagistoFetch<{
      data: GetFooterResponse;
      variables: GetFooterVariables;
    }>({
      query: GET_FOOTER,
      variables: { type: "services_content" },
      isCookies: false,
       revalidate : 86400,
    });



    return {
      footer_links: footerRes.body.data,
      services_content: servicesRes.body.data,
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
    now: Date.now()
  });
}
