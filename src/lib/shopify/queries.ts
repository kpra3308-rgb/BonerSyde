import {
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_FULL_FRAGMENT,
} from "./fragments";

export const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts(
    $first: Int
    $after: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(
      first: $first
      after: $after
      sortKey: $sortKey
      reverse: $reverse
      query: $query
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...ProductCardFragment
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFullFragment
    }
  }
  ${PRODUCT_FULL_FRAGMENT}
`;

export const GET_PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductCardFragment
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const GET_COLLECTIONS_QUERY = /* GraphQL */ `
  query GetCollections($first: Int) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        descriptionHtml
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetCollectionByHandle(
    $handle: String!
    $first: Int
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      image {
        url
        altText
        width
        height
      }
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...ProductCardFragment
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const GET_ALL_PRODUCT_HANDLES_QUERY = /* GraphQL */ `
  query GetAllProductHandles($first: Int) {
    products(first: $first) {
      nodes {
        handle
        updatedAt
      }
    }
  }
`;

export const GET_ALL_COLLECTION_HANDLES_QUERY = /* GraphQL */ `
  query GetAllCollectionHandles($first: Int) {
    collections(first: $first) {
      nodes {
        handle
      }
    }
  }
`;
