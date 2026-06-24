// Thin, typed wrapper around the Shopify Storefront API GraphQL endpoint.
// Every piece of product/collection/cart data in this app flows through
// this single function — there is no hardcoded product data anywhere.

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2025-01";
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  // We intentionally do not throw at import time — this file is imported
  // by server components during build, and we want clear runtime errors
  // instead of crashing the whole build if env vars are briefly missing
  // (e.g. preview deployments). Each call site surfaces a useful error.
  console.warn(
    "[shopify] Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN. " +
      "Set these in .env.local — see .env.local.example."
  );
}

const endpoint = domain
  ? `https://${domain}/api/${apiVersion}/graphql.json`
  : "";

type ShopifyFetchOptions<TVariables> = {
  query: string;
  variables?: TVariables;
  cache?: RequestCache;
  tags?: string[];
};

export class ShopifyApiError extends Error {
  constructor(message: string, public errors?: unknown) {
    super(message);
    this.name = "ShopifyApiError";
  }
}

export async function shopifyFetch<TData, TVariables = Record<string, unknown>>({
  query,
  variables,
  cache = "force-cache",
  tags,
}: ShopifyFetchOptions<TVariables>): Promise<TData> {
  if (!domain || !storefrontAccessToken) {
    throw new ShopifyApiError(
      "Shopify Storefront API is not configured. Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to your environment."
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags ? { next: { tags } } : {}),
  });

  const body = await res.json();

  if (!res.ok || body.errors) {
    throw new ShopifyApiError(
      `Shopify API request failed: ${res.status} ${res.statusText}`,
      body.errors
    );
  }

  return body.data as TData;
}
