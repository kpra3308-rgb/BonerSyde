export function mapSortToShopify(sort: string | null): { sortKey: string; reverse: boolean } {
  switch (sort) {
    case "best-selling":
      return { sortKey: "BEST_SELLING", reverse: false };
    case "price-asc":
      return { sortKey: "PRICE", reverse: false };
    case "price-desc":
      return { sortKey: "PRICE", reverse: true };
    case "title-asc":
      return { sortKey: "TITLE", reverse: false };
    default:
      return { sortKey: "CREATED_AT", reverse: true };
  }
}
