"use client";

import { ReactNode } from "react";
import {ApolloWrapper} from "./ApolloWrapper";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ToastContainer } from "@/components/theme/toast/ToastContainer";
import {NextAuthProvider} from '@/providers/NextAuthProvider';



const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextAuthProvider>
        <Provider store={store}>
          <ApolloWrapper>
              {children}
              <ToastContainer />
          </ApolloWrapper>
        </Provider>
    </NextAuthProvider>
  );
};

export  {MainProvider};
