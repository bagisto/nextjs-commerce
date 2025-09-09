import { ensureStartsWith, getBaseUrl } from "@/lib/utils";
const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
export type SiteConfig = typeof siteConfig;
const baseUrl = getBaseUrl(process.env.NEXT_PUBLIC_VERCEL_URL);
const twitterCreator = TWITTER_CREATOR
  ? ensureStartsWith(TWITTER_CREATOR, "@")
  : undefined;
const twitterSite = TWITTER_SITE
  ? ensureStartsWith(TWITTER_SITE, "https://")
  : undefined;
export const siteConfig = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: "summary_large_image",
        creator: twitterCreator,
        site: twitterSite,
      },
    }),
};
