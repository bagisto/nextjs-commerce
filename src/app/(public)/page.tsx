import { GET_THEME_CUSTOMIZATION } from "@/graphql";
import { graphqlRequest } from "../../lib/graphql-fetch";
import RenderThemeCustomization from "@components/home/RenderThemeCustomization";
import { ThemeCustomizationResponse } from "@/types/theme/theme-customization";

export const revalidate = 3600;

export default async function Home() {
  const data = await graphqlRequest<ThemeCustomizationResponse>(GET_THEME_CUSTOMIZATION, {}, {
    tags: ["theme-customization"],
    life: "days"
  });

  return (
    <RenderThemeCustomization themeCustomizations={data?.themeCustomizations} />
  );
}
