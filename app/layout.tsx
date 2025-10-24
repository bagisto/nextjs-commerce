import { Metadata, Viewport } from "next";
import clsx from "clsx";
import "./globals.css";
import NextAuthProvider from "./providers/next-auth-provider";
import { TanstackProvider } from "./providers/tanstack-provider";
import { ReduxProvider } from "./providers/redux-provider";
import { ToastProvider } from "./context/toast-context";
import { siteConfig } from "@/config/site";
import { outfit } from "@/config/fonts";
import { Providers } from "@/app/providers/providers";
import { ToastContainer } from "@/components/elements/react-toasted/toast-container";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  ...siteConfig,
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={clsx(
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 dark:scrollbar-thumb-neutral-300"
      )}
      suppressHydrationWarning
      lang="en"
    >
      <head>
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  where: {
                    and: [
                      { href_matches: "/*" },
                      { not: { href_matches: "/logout" } },
                      { not: { href_matches: "/*\\?*(^|&)add-to-cart=*" } },
                      { not: { selector_matches: ".no-prerender" } },
                      { not: { selector_matches: "[rel~=nofollow]" } },
                    ],
                  },
                },
              ],
              prefetch: [
                {
                  urls: ["next.html", "next2.html"],
                  requires: ["anonymous-client-ip-when-cross-origin"],
                  referrer_policy: "no-referrer",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={clsx(
          "min-h-screen font-outfit text-foreground bg-background antialiased",
          outfit.variable
        )}
        suppressHydrationWarning={true}
      >
        <main>
          <NextAuthProvider>
            <TanstackProvider>
              <Providers
                themeProps={{ attribute: "class", defaultTheme: "light" }}
              >
                <ReduxProvider>
                  <ToastProvider>
                    {children}
                    <ToastContainer />
                  </ToastProvider>
                </ReduxProvider>
              </Providers>
            </TanstackProvider>
          </NextAuthProvider>
        </main>
      </body>
    </html>
  );
}
