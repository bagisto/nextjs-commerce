import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ReduxProvider } from "./ReduxProvider";
import { ToastProvider } from "./ToastProvider";
import { ApolloWrapper } from "./ApolloWrapper";
import { NextAuthProvider } from "./NextAuthProvider";
import { SessionSync } from "./SessionSync";

export function GlobalProviders({ children }: { children: ReactNode }) {
  return (
    <NextAuthProvider>
      <ThemeProvider>
        <ReduxProvider>
          <SessionSync />
          <ToastProvider>
            <ApolloWrapper>

              {children}
            </ApolloWrapper>
          </ToastProvider>
        </ReduxProvider>
      </ThemeProvider>
    </NextAuthProvider>
  );
} 