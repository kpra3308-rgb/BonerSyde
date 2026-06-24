// Core Shopify Storefront API types used throughout the app.
// Keeping these separate from raw GraphQL response shapes makes the rest of
// the codebase (components, pages) agnostic of GraphQL — they just consume
// clean, predictable objects.

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
  sku: string | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images: Image[];
  options: ProductOption[];
  variants: ProductVariant[];
  totalInventory: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductCardData = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: Image | null;
  hoverImage: Image | null;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  tags: string[];
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
};

export type CollectionWithProducts = Collection & {
  products: ProductCardData[];
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
    amountPerQuantity?: Money;
  };
  merchandise: {
    id: string;
    title: string;
    image: Image | null;
    product: {
      id: string;
      handle: string;
      title: string;
    };
    selectedOptions: SelectedOption[];
    price: Money;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: CartLine[];
};

export type SortKey =
  | "RELEVANCE"
  | "BEST_SELLING"
  | "CREATED_AT"
  | "PRICE"
  | "TITLE";

export type ProductFilters = {
  query?: string;
  sortKey?: SortKey;
  reverse?: boolean;
  collectionHandle?: string;
  after?: string | null;
};
