import { shopifyFetch } from "./client";
import {
  GET_ALL_COLLECTION_HANDLES_QUERY,
  GET_ALL_PRODUCT_HANDLES_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
  GET_PRODUCTS_QUERY,
} from "./queries";
import {
  getMockProducts,
  getMockProductByHandle,
  getMockProductRecommendations,
  getMockCollections,
  getMockCollectionByHandle,
  getMockAllCollectionHandles,
  getMockAllProductHandles,
} from "./mock";

const isShopifyConfigured = !!(
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
);
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  GET_CART_QUERY,
} from "./mutations";
import type {
  Cart,
  Collection,
  CollectionWithProducts,
  Image,
  Money,
  Product,
  ProductCardData,
  ProductFilters,
  ProductOption,
  ProductVariant,
  SelectedOption,
} from "./types";

/* -------------------------------------------------------------------------- */
/*  Raw Storefront API response shapes (subset of fields we actually query)   */
/* -------------------------------------------------------------------------- */

type RawPriceRange = { minVariantPrice: Money; maxVariantPrice: Money };
type RawUserError = { field: string[] | null; message: string };

type RawProductCardNode = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  tags: string[];
  featuredImage: Image | null;
  images: { nodes: Image[] };
  priceRange: RawPriceRange;
  compareAtPriceRange: RawPriceRange;
};

type RawProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  totalInventory: number | null;
  createdAt: string;
  updatedAt: string;
  priceRange: RawPriceRange;
  compareAtPriceRange: RawPriceRange;
  images: { nodes: Image[] };
  options: ProductOption[];
  variants: { nodes: ProductVariant[] };
};

type RawCollectionNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
  products?: { nodes: { featuredImage: Image | null }[] };
};

type RawCollectionWithProductsNode = RawCollectionNode & {
  products: {
    nodes: RawProductCardNode[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

type RawCartLineNode = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    image: Image | null;
    price: Money;
    selectedOptions: SelectedOption[];
    product: { id: string; handle: string; title: string };
  };
};

type RawCartNode = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: { nodes: RawCartLineNode[] };
};

/* -------------------------------------------------------------------------- */
/*  Shape helpers — translate raw Storefront API nodes into clean app types   */
/* -------------------------------------------------------------------------- */

function reshapeProductCard(node: RawProductCardNode): ProductCardData {
  const images: Image[] = node.images?.nodes ?? [];
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    availableForSale: node.availableForSale,
    featuredImage: node.featuredImage ?? images[0] ?? null,
    hoverImage: images[1] ?? null,
    priceRange: node.priceRange,
    compareAtPriceRange: node.compareAtPriceRange,
    tags: node.tags ?? [],
  };
}

function reshapeProduct(node: RawProductNode): Product {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    availableForSale: node.availableForSale,
    tags: node.tags ?? [],
    productType: node.productType,
    vendor: node.vendor,
    priceRange: node.priceRange,
    compareAtPriceRange: node.compareAtPriceRange,
    images: node.images?.nodes ?? [],
    options: node.options ?? [],
    variants: node.variants?.nodes ?? [],
    totalInventory: null,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
  };
}

function reshapeCollection(node: RawCollectionNode): Collection {
  const productImage = node.products?.nodes?.[0]?.featuredImage ?? null;
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    image: node.image ?? productImage,
  };
}

function reshapeCart(node: RawCartNode): Cart {
  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    cost: node.cost,
    lines: (node.lines?.nodes ?? []).map((line) => ({
      id: line.id,
      quantity: line.quantity,
      cost: line.cost,
      merchandise: {
        id: line.merchandise.id,
        title: line.merchandise.title,
        image: line.merchandise.image ?? null,
        product: line.merchandise.product,
        selectedOptions: line.merchandise.selectedOptions ?? [],
        price: line.merchandise.price,
      },
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*  Products                                                                  */
/* -------------------------------------------------------------------------- */

export async function getProducts(
  filters: ProductFilters & { first?: number } = {}
): Promise<{ products: ProductCardData[]; hasNextPage: boolean; endCursor: string | null }> {
  if (!isShopifyConfigured) return getMockProducts(filters);
  const { first = 24, after = null, sortKey = "CREATED_AT", reverse = true, query, collectionHandle } = filters;

  let searchQuery = query ?? "";
  if (collectionHandle) {
    searchQuery = `${searchQuery} collection:${collectionHandle}`.trim();
  }

  try {
    const data = await shopifyFetch<{
      products: { nodes: RawProductCardNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
    }>({
      query: GET_PRODUCTS_QUERY,
      variables: {
        first,
        after,
        sortKey,
        reverse,
        query: searchQuery || undefined,
      },
      cache: "no-store",
    });

    return {
      products: data.products.nodes.map(reshapeProductCard),
      hasNextPage: data.products.pageInfo.hasNextPage,
      endCursor: data.products.pageInfo.endCursor,
    };
  } catch (error) {
    console.error("[shopify] getProducts failed:", error);
    return { products: [], hasNextPage: false, endCursor: null };
  }
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured) return getMockProductByHandle(handle);
  try {
    const data = await shopifyFetch<{ product: RawProductNode | null }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
      cache: "no-store",
    });

    if (!data.product) return null;
    return reshapeProduct(data.product);
  } catch (error) {
    console.error("[shopify] getProductByHandle failed:", error);
    return null;
  }
}

export async function getProductRecommendations(productId: string): Promise<ProductCardData[]> {
  if (!isShopifyConfigured) return getMockProductRecommendations(productId);
  try {
    const data = await shopifyFetch<{ productRecommendations: RawProductCardNode[] }>({
      query: GET_PRODUCT_RECOMMENDATIONS_QUERY,
      variables: { productId },
      cache: "no-store",
    });
    return (data.productRecommendations ?? []).map(reshapeProductCard);
  } catch (error) {
    console.error("[shopify] getProductRecommendations failed:", error);
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*  Collections                                                               */
/* -------------------------------------------------------------------------- */

export async function getCollections(first = 24): Promise<Collection[]> {
  if (!isShopifyConfigured) return getMockCollections(first);
  try {
    const data = await shopifyFetch<{ collections: { nodes: RawCollectionNode[] } }>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first },
      cache: "no-store",
    });
    return data.collections.nodes.map(reshapeCollection);
  } catch (error) {
    console.error("[shopify] getCollections failed:", error);
    return [];
  }
}

export async function getCollectionByHandle(
  handle: string,
  options: { first?: number; after?: string | null; sortKey?: string; reverse?: boolean } = {}
): Promise<{ collection: CollectionWithProducts | null; hasNextPage: boolean; endCursor: string | null }> {
  if (!isShopifyConfigured) return getMockCollectionByHandle(handle, options);
  const { first = 24, after = null, sortKey = "CREATED_AT", reverse = true } = options;
  try {
    const data = await shopifyFetch<{ collection: RawCollectionWithProductsNode | null }>({
      query: GET_COLLECTION_BY_HANDLE_QUERY,
      variables: { handle, first, after, sortKey, reverse },
      cache: "no-store",
    });

    if (!data.collection) {
      return { collection: null, hasNextPage: false, endCursor: null };
    }

    const collection: CollectionWithProducts = {
      ...reshapeCollection(data.collection),
      products: data.collection.products.nodes.map(reshapeProductCard),
    };

    return {
      collection,
      hasNextPage: data.collection.products.pageInfo.hasNextPage,
      endCursor: data.collection.products.pageInfo.endCursor,
    };
  } catch (error) {
    console.error("[shopify] getCollectionByHandle failed:", error);
    return { collection: null, hasNextPage: false, endCursor: null };
  }
}

export async function getAllProductHandles(): Promise<{ handle: string; updatedAt: string }[]> {
  if (!isShopifyConfigured) return getMockAllProductHandles();
  try {
    const data = await shopifyFetch<{ products: { nodes: { handle: string; updatedAt: string }[] } }>({
      query: GET_ALL_PRODUCT_HANDLES_QUERY,
      variables: { first: 250 },
      cache: "no-store",
    });
    return data.products.nodes;
  } catch (error) {
    console.error("[shopify] getAllProductHandles failed:", error);
    return [];
  }
}

export async function getAllCollectionHandles(): Promise<{ handle: string }[]> {
  if (!isShopifyConfigured) return getMockAllCollectionHandles();
  try {
    const data = await shopifyFetch<{ collections: { nodes: { handle: string }[] } }>({
      query: GET_ALL_COLLECTION_HANDLES_QUERY,
      variables: { first: 250 },
      cache: "no-store",
    });
    return data.collections.nodes;
  } catch (error) {
    console.error("[shopify] getAllCollectionHandles failed:", error);
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*  Cart                                                                       */
/* -------------------------------------------------------------------------- */

export type CartLineInput = { merchandiseId: string; quantity: number };

export async function createCart(lines: CartLineInput[] = []): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: RawCartNode; userErrors: RawUserError[] } }>({
    query: CART_CREATE_MUTATION,
    variables: { lines },
    cache: "no-store",
  });
  if (data.cartCreate.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", "));
  }
  return reshapeCart(data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const data = await shopifyFetch<{ cart: RawCartNode | null }>({
      query: GET_CART_QUERY,
      variables: { cartId },
      cache: "no-store",
    });
    if (!data.cart) return null;
    return reshapeCart(data.cart);
  } catch (error) {
    console.error("[shopify] getCart failed:", error);
    return null;
  }
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: RawCartNode; userErrors: RawUserError[] } }>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
  });
  if (data.cartLinesAdd.userErrors?.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(", "));
  }
  return reshapeCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: RawCartNode; userErrors: RawUserError[] } }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
  });
  if (data.cartLinesUpdate.userErrors?.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(", "));
  }
  return reshapeCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: RawCartNode; userErrors: RawUserError[] } }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  if (data.cartLinesRemove.userErrors?.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(", "));
  }
  return reshapeCart(data.cartLinesRemove.cart);
}

export * from "./types";
