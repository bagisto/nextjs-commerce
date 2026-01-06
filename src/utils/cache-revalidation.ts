// "use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidate all product-related caches
 */
export async function revalidateProducts() {
  revalidatePath("/", "layout");
  revalidatePath("/product", "page");
}

/**
 * Revalidate search-related caches
 */
export async function revalidateSearch() {
  revalidatePath("/search", "page");
}

/**
 * Revalidate a specific product page
 */
export async function revalidateProductPage(productId: string) {
  revalidatePath(`/product/${productId}`, "page");
}

/**
 * Revalidate search page
 */
export async function revalidateSearchPage() {
  revalidatePath("/search", "page");
}

/**
 * Revalidate all caches (use sparingly)
 */
export async function revalidateAll() {
  revalidatePath("/", "layout");
}
