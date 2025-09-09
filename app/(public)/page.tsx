import { getCollectionHomePage } from "@/lib/bagisto";
import ThemeCustomization from "@/components/theme-customization";
export const revalidate = 60;
export const dynamic = "auto";
export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Bagisto.",
  openGraph: {
    type: "website",
    title: "Bagisto Commerce",
    url: process.env.NEXTAUTH_URL,
  },
};

export default async function HomePage() {
  const themeCustomization = await getCollectionHomePage("homepage-handle");
  return <ThemeCustomization themeCustomization={themeCustomization} />;
}
