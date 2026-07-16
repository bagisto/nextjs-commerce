"use server";
import { redirect } from "next/navigation";
import {
  createUserToLogin,
  getCustomerProfile,
  logoutUser,
  recoverUserLogin,
  subscribeUser,
  getWishlistIds,
  getCompareIds,
} from '@/utils/bagisto';
import { isObject } from "@utils/type-guards";
import { RegisterInputs, RecoverPasswordFormState } from "@components/customer/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { extractNumericId } from "@/utils/helper";
import { createCompareItem } from "@/utils/bagisto";
import { WishlistIdsConnection, CompareIdsConnection, CustomerAddress, CreateCustomerAddressInput } from "@/types/customer/type";

export type RegisterFormState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    passwordConfirmation?: string[];
    apiError?: string;
    agreement?: string[];
  };
};

interface RecoverLoginResult {
  error?: { message?: string };
  body?: {
    data?: {
      createForgotPassword?: {
        forgotPassword?: {
          success?: boolean;
          message?: string;
        };
      };
    };
  };
}

export async function redirectToCheckout(formData: FormData) {
  const url = formData.get("url") as string;
  redirect(url);
}


export async function createUser(formData: RegisterInputs) {
  try {
    const { firstName, lastName, email, password, passwordConfirmation } =
      formData;

    const user = await createUserToLogin({
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
    });

    return {
      error: {},
      success: true,
      customer: user,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      error: { message },
      success: false,
      customer: {},
    };
  }
}


export async function recoverPassword(formData: {
  email: string;
}): Promise<RecoverPasswordFormState> {

  const result = (await recoverUserLogin({ email: formData.email })) as RecoverLoginResult;

  if (isObject(result?.error)) {
    const error = result.error as Record<string, unknown>;
    return {
      errors: {
        apiRes: {
          status: false,
          msg: (error?.message as string) ?? "Something went wrong",
        },
      },
    };
  }

  const body = result?.body;
  const createForgotPassword = body?.data?.createForgotPassword;
  const forgotPassword = createForgotPassword?.forgotPassword;

  return {
    success: {
      status: forgotPassword?.success ?? false,
      msg: "Recovery email sent successfully.",
    },
  };
}




export async function userSubscribe(
  _prevState: RecoverPasswordFormState,
  formData: FormData
): Promise<RecoverPasswordFormState> {
  const email = formData.get("email");

  const data = {
    email: typeof email === "string" ? email.trim() : "",
  };

  try {
    const result = await subscribeUser(data) as Record<string, unknown>;

    if (result?.error) {
      const error = result.error as Record<string, unknown>;
      return {
        errors: {
          apiRes: {
            status: false,
            msg: (error.message as string) || "Something went wrong",
          },
        },
      };
    }

    const body = result?.body as Record<string, unknown>;
    const bodyData = body?.data as Record<string, unknown>;

    return {
      errors: {
        apiRes: {
          status: true,
          msg: (bodyData?.message as string) || "Subscription successful!",
        },
      },
    };
  } catch {
    return {
      errors: {
        apiRes: {
          status: false,
          msg: "Unexpected error occurred. Please try again.",
        },
      },
    };
  }
}


export async function logoutAction() {
  return await logoutUser();
}

export async function getCustomerProfileAction() {
  return await getCustomerProfile();
}

export async function getThemeCustomizationAction() {
  try {
    const { getThemeCustomization } = await import('@/utils/bagisto');
    return await getThemeCustomization();
  } catch (err: unknown) {
    console.error("getThemeCustomizationAction error:", err);
    return null;
  }
}
export async function createCustomerAddressAction(input: CreateCustomerAddressInput) {
  try {
    const { createCustomerAddress } = await import('@/utils/bagisto');
    return await createCustomerAddress(input);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function deleteCustomerAddressAction(addressId: string) {
  try {
    const { deleteCustomerAddress } = await import('@/utils/bagisto');
    return await deleteCustomerAddress(addressId);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function setDefaultAddressAction(address: CustomerAddress) {
  try {
    const { setDefaultAddress } = await import('@/utils/bagisto');
    return await setDefaultAddress(address);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function toggleWishlistAction(productId: string | number) {
  try {
    const { toggleWishlist } = await import('@/utils/bagisto');
    return await toggleWishlist(productId);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function getCustomerWishlistAction() {
  try {
    const { getCustomerWishlist } = await import('@/utils/bagisto');
    return await getCustomerWishlist();
  } catch (err: unknown) {
    console.error("getCustomerWishlistAction error:", err);
    return [];
  }
}

export async function getWishlistItemAction(id: string) {
  try {
    const { getWishlistItem } = await import('@/utils/bagisto');
    return await getWishlistItem(id);
  } catch (err: unknown) {
    console.error("getWishlistItemAction error:", err);
    return null;
  }
}

export async function isProductInWishlist(productId: string) {
  try {
    const session = await getServerSession(authOptions);
   
    if (!session) {
      return false;
    }

    const wishlistData = (await getWishlistIds({ first: 500 })) as WishlistIdsConnection | null;
    const wishlist = wishlistData?.edges?.map((edge) => edge.node) || [];
    const targetId = extractNumericId(productId);

    if (!targetId) return false;

    return wishlist.some((item) => {
      const wishProductId = extractNumericId(item?.product?.id);
      return wishProductId === targetId;
    });
  } catch (error) {
    console.error("isProductInWishlist error:", error);
    return false;
  }
}


export async function getWishlistProductIdsAction(): Promise<string[]> {
  try {
    const session = await getServerSession(authOptions);

 
    if (!session) {
      return [];
    }

    const wishlistData = (await getWishlistIds({ first: 500 })) as WishlistIdsConnection | null;
    const wishlist = wishlistData?.edges?.map((edge) => edge.node) || [];

    const ids: string[] = [];
    for (const item of wishlist) {
      const numericId = extractNumericId(item?.product?.id);
      if (numericId) {
        ids.push(numericId);
      }
    }
    return ids;
  } catch (error) {
    console.error("getWishlistProductIdsAction error:", error);
    return [];
  }
}

export async function deleteWishlistItemAction(id: string) {
  try {
    const { deleteWishlistItem } = await import('@/utils/bagisto');
    return await deleteWishlistItem(id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function moveWishlistToCartAction(wishlistItemId: string, quantity: number) {
  try {
    const { moveWishlistToCart } = await import('@/utils/bagisto');
    return await moveWishlistToCart(wishlistItemId, quantity);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function createCompareAction(productId: string | number) {
  try {

    return await createCompareItem(productId);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function toggleCompareAction(
  productId: string | number,
  isCurrentlyCompared?: boolean
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, message: "Please login to manage your comparison list" };
    }

    if (isCurrentlyCompared === false) {
      const result = await createCompareItem(productId);
      return { ...result, removed: false };
    }

    const { deleteCompareItem } = await import('@/utils/bagisto');
    const targetId = extractNumericId(String(productId));

    const compareData = (await getCompareIds({ first: 500 })) as CompareIdsConnection | null;
    const items = compareData?.edges?.map((edge) => edge.node) || [];
    const existing = items.find(
      (item) => extractNumericId(item?.product?.id) === targetId
    );

    if (existing) {
      const result = await deleteCompareItem(existing.id);
      return { ...result, removed: true };
    }

    const result = await createCompareItem(productId);
    return { ...result, removed: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function getCompareItemsAction(variables?: { first?: number; after?: string }) {
  try {
    const { getCompareItems } = await import('@/utils/bagisto');
    return await getCompareItems(variables);
  } catch (err: unknown) {
    console.error("getCompareItemsAction error:", err);
    return null;
  }
}

export async function getCompareProductIdsAction(): Promise<string[]> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return [];
    }

    const compareData = (await getCompareIds({ first: 500 })) as CompareIdsConnection | null;
    const items = compareData?.edges?.map((edge) => edge.node) || [];

    const ids: string[] = [];
    for (const item of items) {
      const numericId = extractNumericId(item?.product?.id);
      if (numericId) {
        ids.push(numericId);
      }
    }
    return ids;
  } catch (error) {
    console.error("getCompareProductIdsAction error:", error);
    return [];
  }
}

export async function deleteCompareAction(id: string) {
  try {
    const { deleteCompareItem } = await import('@/utils/bagisto');
    return await deleteCompareItem(id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function deleteAllCompareAction() {
  try {
    const { deleteAllCompareItems } = await import('@/utils/bagisto');
    return await deleteAllCompareItems();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}

export async function addProductToCartAction(productId: string | number, quantity: number) {
  try {
    const { addProductToCart } = await import('@/utils/bagisto');
    return await addProductToCart(productId, quantity);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return {
      success: false,
      message,
    };
  }
}
