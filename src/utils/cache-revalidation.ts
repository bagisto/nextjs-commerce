
import { revalidatePath } from "next/cache";

export async function revalidateProducts() {
  revalidatePath("/", "layout");
  revalidatePath("/product", "page");
}

export async function revalidateSearch() {
  revalidatePath("/search", "page");
}

export async function revalidateProductPage(productId: string) {
  revalidatePath(`/product/${productId}`, "page");
}

export async function revalidateSearchPage() {
  revalidatePath("/search", "page");
}

export async function revalidateAll() {
  revalidatePath("/", "layout");
}
