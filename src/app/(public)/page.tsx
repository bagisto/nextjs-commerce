import { Suspense } from "react";
import { GET_THEME_CUSTOMIZATION } from "@/graphql";
import RenderThemeCustomization from "@components/home/RenderThemeCustomization";
import { ThemeCustomizationResponse } from "@/types/theme/theme-customization";
import { cachedGraphQLRequest } from "@/lib/cached-graphql";
import { ThemeSkeleton } from "@components/common/skeleton/ThemeSkeleton";

export const revalidate = 3600;


async function HomeContent() {
  const data = await cachedGraphQLRequest<ThemeCustomizationResponse>(
    "home",
    GET_THEME_CUSTOMIZATION,
    { first: 20 }
  );

  return (
    <RenderThemeCustomization themeCustomizations={data?.themeCustomizations} />
  );
}

export default function Home() {
  return (
    <Suspense fallback={<ThemeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
