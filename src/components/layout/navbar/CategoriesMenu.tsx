import Link from "next/link";
import { GET_TREE_CATEGORIES } from "@/graphql";
import MobileMenu from "./MobileMenu";
import { cachedGraphQLRequest } from "@/lib/cached-graphql";
import { CategoryNode, TreeCategoriesResponse } from "@/types/theme/category-tree";

export async function CategoriesMenu({ type }: { type?: "mobile" | "desktop" }) {
   const data = await cachedGraphQLRequest<TreeCategoriesResponse>(
    "category",
    GET_TREE_CATEGORIES,
    { parentId: 1 }
  );


  const categories = data?.treeCategories || [];

  const filteredCategories = categories
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

  const menuData = [
    { id: "all", name: "All", slug: "" },
    ...filteredCategories.slice(0, 3),
  ];

  return (
    <>
      {(type === "mobile" || !type) && <MobileMenu menu={menuData} />}
      {(type === "desktop" || !type) && (
        <ul className="hidden gap-4 text-sm md:items-center lg:flex xl:gap-6">
          {menuData.map(
            (item: { id: string; name: string; slug: string }) => (
              <li key={item?.id + item?.name}>
                <Link
                  className="text-nowrap relative text-selected-black before:absolute before:bottom-0 before:left-0 before:h-px before:w-0 before:bg-current before:transition-all before:duration-300 before:content-[''] hover:text-black hover:before:w-full dark:text-selected-white dark:hover:text-neutral-300"
                  href={item.slug ? `/search/${item.slug}` : "/search"}
                  prefetch={true}
                  aria-label={`Browse ${item.name} products`}
                >
                  {item.name}
                </Link>
              </li>
            )
          )}
        </ul>
      )}
    </>
  );
}