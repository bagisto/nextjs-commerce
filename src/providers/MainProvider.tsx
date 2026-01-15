"use client";

import { ReactNode } from "react";
import { ApolloWrapper } from "./ApolloWrapper";
import { Provider } from "react-redux";
import { store } from "@/store/store";

import { NextAuthProvider } from '@/providers/NextAuthProvider';



const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextAuthProvider>
      <Provider store={store}>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </Provider>
    </NextAuthProvider>
  );
};

export { MainProvider };
