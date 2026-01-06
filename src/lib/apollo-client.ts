import { GRAPHQL_URL } from "@/utils/constants";
import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";

export default function initializeApollo() {
  const ssrMode = typeof window === "undefined";
  const cache = new InMemoryCache();

  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    credentials: "include", 
  });

  const authLink = setContext(async (_, { headers }) => {
    if (ssrMode) {
      return { headers };
    }

    const session = await getSession();
    const userToken = session?.user?.accessToken;

    return {
      headers: {
        ...headers,
        ...(userToken && { authorization: `Bearer ${userToken}` }),
        "Content-Type": "application/json",
      },
    };
  });

  return new ApolloClient({
    ssrMode,
    link: from([authLink, httpLink]),
    cache: cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: ssrMode ? "network-only" : "cache-first",
        nextFetchPolicy: ssrMode ? "network-only" : "cache-first",
      },
      query: {
        fetchPolicy: ssrMode ? "network-only" : "cache-first",
      },
    },
  });
}
