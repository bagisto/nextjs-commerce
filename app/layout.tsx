import './globals.css';
import { GeistSans } from 'geist/font';
import { getChannel } from 'lib/bagisto';
import { ensureStartsWith, getBaseUrl } from 'lib/utils';
import { ReactNode } from 'react';
import { GlobalContextProvider } from './context/store';
import NextAuthProvider from './next-auth-provider';
import { Providers } from './providers';
export const dynamic = 'force-dynamic';
const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = getBaseUrl(process.env.NEXT_PUBLIC_VERCEL_URL);
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const storeConfig = await getChannel();
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        <link rel="icon" href={storeConfig?.faviconUrl} sizes="any" />
      </head>
      <body
        className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white"
        suppressHydrationWarning={true}
      >
        <main>
          <Providers>
            <GlobalContextProvider>
              <NextAuthProvider> {children} </NextAuthProvider>{' '}
            </GlobalContextProvider>
          </Providers>
        </main>
      </body>
    </html>
  );
}
