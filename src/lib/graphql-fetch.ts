import { type DocumentNode } from "graphql";
import { type OperationVariables } from "@apollo/client";
import makeClient from "./apollo-client";


export type CacheLifePreset =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "max";

export type CacheLifeOption = number | CacheLifePreset;

/**
 * Resolves a {@link CacheLifeOption} to seconds (or `false` for "never
 * revalidate"). Consumed by the `cacheLife()` mapping in `cached-graphql.ts`.
 */
export function getRevalidateTime(life?: CacheLifeOption): number | false {
  if (!life) return false;
  if (typeof life === "number") return life;

  switch (life) {
    case "seconds":
      return 10;
    case "minutes":
      return 60;
    case "hours":
      return 3600;
    case "days":
      return 86400;
    case "weeks":
      return 604800;
    case "max":
      return false;
    default:
      return false;
  }
}

export interface GraphQLRequestNoCacheOptions {
  context?: Record<string, unknown>;
  fetchPolicy?: "cache-first" | "network-only" | "no-cache" | "cache-only";
}

/**
 * Uncached GraphQL request. Use this for personalized / request-time data that
 * must never be shared across requests (it bypasses the `'use cache'` layer).
 */
export async function graphqlRequestNoCache<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode,
  variables?: TVariables,
  options?: GraphQLRequestNoCacheOptions,
): Promise<TData> {
  const client = makeClient();
  const result = await client.query({
    query,
    variables,
    context: options?.context,
    fetchPolicy: options?.fetchPolicy ?? "no-cache",
  });

  return result.data as TData;
}
