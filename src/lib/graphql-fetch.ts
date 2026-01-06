import { unstable_cache } from "next/cache";
import { print, type DocumentNode } from "graphql";
import {
  type ApolloQueryResult,
  type OperationVariables,
} from "@apollo/client";
import makeClient from "./apollo-client";

let serverClient: ReturnType<typeof makeClient> | null = null;

function getClient() {
  if (!serverClient) {
    serverClient = makeClient();
  }
  return serverClient;
}


export type CacheLifePreset =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "max";

export type CacheLifeOption = number | CacheLifePreset;

export function getRevalidateTime(life?: CacheLifeOption): number | false {
  if (!life) return false;
  if (typeof life === "number") return life;

  switch (life) {
    case "seconds": return 10;
    case "minutes": return 60;
    case "hours": return 3600;
    case "days": return 86400;
    case "weeks": return 604800;
    case "max": return false;
    default: return false;
  }
}

const cacheKeyMemo = new Map<unknown, string>();
const queryPrintMemo = new WeakMap<DocumentNode, string>();

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .sort()
    .map(key => `"${key}":${stableStringify(obj[key])}`)
    .join(",")}}`;
}

function stableStringifyMemo(value: unknown): string {
  const cached = cacheKeyMemo.get(value);
  if (cached !== undefined) return cached;
  const str = stableStringify(value);
  cacheKeyMemo.set(value, str);
  return str;
}


export interface GraphQLRequestOptions {
  tags?: string[];
  life?: CacheLifeOption;
  noCache?: boolean;
  context?: Record<string, unknown>;
  fetchPolicy?: "cache-first" | "network-only" | "no-cache" | "cache-only";
}



export async function graphqlRequest<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode,
  variables?: TVariables,
  options?: GraphQLRequestOptions
): Promise<TData> {

  if (options?.noCache) {
    const client = getClient();
    const result: ApolloQueryResult<TData> = await client.query({
      query,
      variables,
      context: options?.context,
      fetchPolicy: options?.fetchPolicy ?? "no-cache",
    });
    return result.data;
  }

  if (options?.context) {
    throw new Error(
      "graphqlRequest: Caching with `context` is unsafe. Use noCache instead."
    );
  }

  let queryString: string;
  const cached = queryPrintMemo.get(query);
  if (cached !== undefined) {
    queryString = cached;
  } else {
    queryString = print(query);
    queryPrintMemo.set(query, queryString);
  }

  const cacheKey = `graphql:${stableStringifyMemo({
    query: queryString,
    variables,
  })}`;

  const cachedQuery = unstable_cache(
    async (): Promise<TData> => {
      const client = getClient();
      const result: ApolloQueryResult<TData> = await client.query({
        query,
        variables,
        fetchPolicy: "network-only",
      });
      return result.data;
    },
    [cacheKey],
    {
      tags: options?.tags,
      revalidate: getRevalidateTime(options?.life),
    }
  );

  return cachedQuery();
}


export async function graphqlRequestNoCache<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode,
  variables?: TVariables,
  options?: Omit<GraphQLRequestOptions, "noCache" | "tags" | "life">
): Promise<TData> {
  return graphqlRequest<TData, TVariables>(query, variables, {
    ...options,
    noCache: true,
  });
}
