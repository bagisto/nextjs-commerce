import { cache as reactCache } from "react";
import { GRAPHQL_URL } from "@/utils/constants";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";
import { getCartToken, getNativeCookie } from "@/utils/getCartToken";
import { BagistoSession } from "@/types/types";
import { NEXTAUTH_TOKEN, NEXTAUTH_SECURE_TOKEN } from "@/utils/constants";


let sessionCache: { session: BagistoSession | null; timestamp: number } | null =
  null;
let inFlightSession: Promise<BagistoSession | null> | null = null;
const SESSION_CACHE_TTL = 5 * 60 * 1000;


function hasNextAuthSessionCookie(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(
    getNativeCookie(NEXTAUTH_TOKEN) ||
      getNativeCookie(NEXTAUTH_SECURE_TOKEN),
  );
}

async function resolveSession(): Promise<BagistoSession | null> {
  if (typeof window === "undefined") return null;
  if (!hasNextAuthSessionCookie()) return null;
  return (await getSession()) as BagistoSession | null;
}

export function clearSessionCache(): void {
  sessionCache = null;
  inFlightSession = null;
}

async function getCachedSession(): Promise<BagistoSession | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const now = Date.now();


  if (sessionCache && now - sessionCache.timestamp < SESSION_CACHE_TTL) {
    return sessionCache.session;
  }


  if (!inFlightSession) {
    inFlightSession = resolveSession()
      .then((session) => {
        sessionCache = { session, timestamp: Date.now() };
        return session;
      })
      .finally(() => {
        inFlightSession = null;
      });
  }

  return inFlightSession;
}

function createApolloClient() {
  const ssrMode = typeof window === "undefined";
  const cache = new InMemoryCache();

  const httpLink = new HttpLink({
    uri: ssrMode ? GRAPHQL_URL : "/api/graphql",
    credentials: "include",
  });

  const authLink = setContext(async (_, { headers }) => {
    const session = await getCachedSession();
    const userToken = session?.user?.accessToken;
    const guestToken = !userToken ? getCartToken() : null;
    const token = userToken || guestToken;

    if (ssrMode) {
      const storefrontKey = process.env.BAGISTO_STOREFRONT_KEY || "";
      return {
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "X-STOREFRONT-KEY": storefrontKey,
        },
      };
    }

    return {
      headers: {
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
    };
  });

  const link = from([authLink, httpLink]);

  return new ApolloClient({
    ssrMode,
    link,
    cache,
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

const getClient = reactCache(createApolloClient);

export default function initializeApollo() {
  if (typeof window === "undefined") {
    return getClient();
  }
  return createApolloClient();
}