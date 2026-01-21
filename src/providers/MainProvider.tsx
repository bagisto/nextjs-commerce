"use client";

import { ReactNode } from "react";
import { ApolloWrapper } from "./ApolloWrapper";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { SessionSync } from "./SessionSync";

const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextAuthProvider>
      <Provider store={store}>
        <SessionSync/>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </Provider>
    </NextAuthProvider>
  );
};

export { MainProvider };
