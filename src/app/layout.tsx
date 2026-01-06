import { Outfit } from "next/font/google";
import "./globals.css";
import {
  AppWrapper,
  ReduxProvider,
  ThemeProvider,
  ToastProvider,
  SessionProvider,
} from "@/providers";
import { generateMetadataForPage } from "@utils/helper";
import { staticSeo } from "@utils/metadata";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { SpeculationRules } from "@components/theme/SpeculationRules";
import clsx from "clsx";

export const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-outfit",
  display: "optional",
  preload: true,
});

export async function generateMetadata() {
  return generateMetadataForPage("", staticSeo.default);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
      <body  className={clsx(
          "min-h-screen font-outfit text-foreground bg-background antialiased",
          outfit.variable
        )}>
        <main>
        <ThemeProvider>
          <SessionProvider>
            <ToastProvider>
              <ReactQueryProvider>
                <ReduxProvider>
                  <AppWrapper>{children}</AppWrapper>
                </ReduxProvider>
              </ReactQueryProvider>
            </ToastProvider>
          </SessionProvider>
           <SpeculationRules />
        </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
