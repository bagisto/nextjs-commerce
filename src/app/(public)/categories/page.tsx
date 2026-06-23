import { GET_TREE_CATEGORIES } from "@/graphql";
import { cachedGraphQLRequest } from "@utils/hooks/useCache";
import { CategoryNode, TreeCategoriesResponse } from "@/types/theme/category-tree";
import CategoriesPageClient from "@/components/categories/CategoriesPageClient";

export default async function CategoriesPage() {
  let categories: { id: string; name: string; slug: string }[] = [];

  try {
    const data = await cachedGraphQLRequest<TreeCategoriesResponse>(
      "category",
      GET_TREE_CATEGORIES,
      { parentId: 1 }
    );

    const cats = data?.treeCategories || [];
    const filtered = cats
      .filter((cat: CategoryNode) => cat.id !== "1")
      .map((cat: CategoryNode) => {
        const translation = cat.translation;
        return {
          id: cat.id,
          name: translation?.name || "",
          slug: translation?.slug || "",
        };
      })
      .filter((item) => item.name && item.slug);

    categories = [
      { id: "all", name: "All", slug: "" },
      ...filtered.slice(0, 3),
    ];
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return <CategoriesPageClient categories={categories} />;
}