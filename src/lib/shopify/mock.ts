import type { Collection, CollectionWithProducts, Product, ProductCardData } from "./types";

const MOCK_PRODUCTS: ProductCardData[] = [
  {
    id: "mock-1",
    handle: "classic-tee",
    title: "Classic Tee",
    availableForSale: true,
    featuredImage: null,
    hoverImage: null,
    priceRange: { minVariantPrice: { amount: "29.00", currencyCode: "USD" }, maxVariantPrice: { amount: "29.00", currencyCode: "USD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "29.00", currencyCode: "USD" }, maxVariantPrice: { amount: "29.00", currencyCode: "USD" } },
    tags: ["apparel", "t-shirt"],
  },
  {
    id: "mock-2",
    handle: "oversized-hoodie",
    title: "Oversized Hoodie",
    availableForSale: true,
    featuredImage: null,
    hoverImage: null,
    priceRange: { minVariantPrice: { amount: "68.00", currencyCode: "USD" }, maxVariantPrice: { amount: "68.00", currencyCode: "USD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "68.00", currencyCode: "USD" }, maxVariantPrice: { amount: "68.00", currencyCode: "USD" } },
    tags: ["apparel", "hoodie"],
  },
  {
    id: "mock-3",
    handle: "cargo-pants",
    title: "Cargo Pants",
    availableForSale: true,
    featuredImage: null,
    hoverImage: null,
    priceRange: { minVariantPrice: { amount: "55.00", currencyCode: "USD" }, maxVariantPrice: { amount: "55.00", currencyCode: "USD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "55.00", currencyCode: "USD" }, maxVariantPrice: { amount: "55.00", currencyCode: "USD" } },
    tags: ["apparel", "pants"],
  },
  {
    id: "mock-4",
    handle: "mesh-shorts",
    title: "Mesh Shorts",
    availableForSale: true,
    featuredImage: null,
    hoverImage: null,
    priceRange: { minVariantPrice: { amount: "42.00", currencyCode: "USD" }, maxVariantPrice: { amount: "42.00", currencyCode: "USD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "42.00", currencyCode: "USD" }, maxVariantPrice: { amount: "42.00", currencyCode: "USD" } },
    tags: ["apparel", "shorts"],
  },
  {
    id: "mock-5",
    handle: "cap",
    title: "Cap",
    availableForSale: true,
    featuredImage: null,
    hoverImage: null,
    priceRange: { minVariantPrice: { amount: "25.00", currencyCode: "USD" }, maxVariantPrice: { amount: "25.00", currencyCode: "USD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "25.00", currencyCode: "USD" }, maxVariantPrice: { amount: "25.00", currencyCode: "USD" } },
    tags: ["accessories", "headwear"],
  },
  {
    id: "mock-6",
    handle: "bomber-jacket",
    title: "Bomber Jacket",
    availableForSale: true,
    featuredImage: null,
    hoverImage: null,
    priceRange: { minVariantPrice: { amount: "95.00", currencyCode: "USD" }, maxVariantPrice: { amount: "95.00", currencyCode: "USD" } },
    compareAtPriceRange: { minVariantPrice: { amount: "95.00", currencyCode: "USD" }, maxVariantPrice: { amount: "95.00", currencyCode: "USD" } },
    tags: ["apparel", "jacket"],
  },
];

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "mock-col-1",
    handle: "new-arrivals",
    title: "New Arrivals",
    description: "Fresh drops straight from the vision.",
    descriptionHtml: "<p>Fresh drops straight from the vision.</p>",
    image: null,
  },
  {
    id: "mock-col-2",
    handle: "best-sellers",
    title: "Best Sellers",
    description: "The pieces everyone is after.",
    descriptionHtml: "<p>The pieces everyone is after.</p>",
    image: null,
  },
  {
    id: "mock-col-3",
    handle: "accessories",
    title: "Accessories",
    description: "Finish the fit.",
    descriptionHtml: "<p>Finish the fit.</p>",
    image: null,
  },
];

export function getMockProducts(
  filters: {
    query?: string;
    sortKey?: string;
    reverse?: boolean;
    collectionHandle?: string;
    after?: string | null;
    first?: number;
  } = {},
) {
  const { first = 24, query, sortKey, reverse } = filters;
  let items = [...MOCK_PRODUCTS];

  if (query) {
    const q = query.toLowerCase();
    items = items.filter(
      (p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (sortKey === "PRICE") {
    items.sort((a, b) => +a.priceRange.minVariantPrice.amount - +b.priceRange.minVariantPrice.amount);
  } else if (sortKey === "TITLE") {
    items.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortKey === "BEST_SELLING") {
    items.sort((a, b) => +b.priceRange.maxVariantPrice.amount - +a.priceRange.maxVariantPrice.amount);
  } else {
    items.sort((a, b) => b.id.localeCompare(a.id));
  }

  if (reverse) items.reverse();

  const sliced = items.slice(0, first);

  return {
    products: sliced,
    hasNextPage: items.length > first,
    endCursor: sliced.length > 0 ? sliced[sliced.length - 1].id : null,
  };
}

export function getMockProductByHandle(handle: string): Product | null {
  const found = MOCK_PRODUCTS.find((p) => p.handle === handle);
  if (!found) return null;
  return {
    ...found,
    description: "A mock product for preview purposes.",
    descriptionHtml: "<p>A mock product for preview purposes.</p>",
    productType: "Apparel",
    vendor: "BONESYDE",
    totalInventory: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: [
      { id: "mock-opt-1", name: "Size", values: ["S", "M", "L", "XL"] },
      { id: "mock-opt-2", name: "Color", values: ["Black", "White"] },
    ],
    variants: [
      {
        id: `${found.id}-variant`,
        title: "Default",
        availableForSale: true,
        quantityAvailable: 10,
        selectedOptions: [{ name: "Size", value: "M" }, { name: "Color", value: "Black" }],
        price: found.priceRange.minVariantPrice,
        compareAtPrice: null,
        image: null,
        sku: `MOCK-${found.handle.toUpperCase()}`,
      },
    ],
    images: [],
  };
}

export function getMockCollections(first = 20): Collection[] {
  return MOCK_COLLECTIONS.slice(0, first);
}

export function getMockCollectionByHandle(
  handle: string,
  options: { first?: number; sortKey?: string; reverse?: boolean } = {},
) {
  const col = MOCK_COLLECTIONS.find((c) => c.handle === handle);
  if (!col) return { collection: null as CollectionWithProducts | null, hasNextPage: false, endCursor: null };

  const { first = 24 } = options;
  const products = getMockProducts({ ...options, first, collectionHandle: handle });

  return {
    collection: { ...col, products: products.products } as CollectionWithProducts,
    hasNextPage: products.hasNextPage,
    endCursor: products.endCursor,
  };
}

export function getMockAllCollectionHandles(): { handle: string }[] {
  return MOCK_COLLECTIONS.map((c) => ({ handle: c.handle }));
}

export function getMockProductRecommendations(_productId: string): ProductCardData[] {
  return MOCK_PRODUCTS.slice(0, 4);
}

export function getMockAllProductHandles(): { handle: string; updatedAt: string }[] {
  return MOCK_PRODUCTS.map((p) => ({ handle: p.handle, updatedAt: new Date().toISOString() }));
}
