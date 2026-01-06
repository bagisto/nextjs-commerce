"use client";

import { ApolloProvider } from "@apollo/client/react";
import { ReactNode, useMemo } from "react";
import initializeApollo  from "../lib/apollo-client";

const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => initializeApollo(), []);
  
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export  {ApolloWrapper};
