import ProductCard from "@/components/product/ProductCard";
import type { ProductCardData } from "@/lib/shopify/types";

export default function ProductGrid({
  products,
  columns = 4,
}: {
  products: ProductCardData[];
  columns?: 3 | 4;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-2xl text-foreground">No products found</p>
        <p className="mt-2 text-sm text-foreground-secondary">
          Try adjusting your filters or check back soon — new drops land in Shopify automatically.
        </p>
      </div>
    );
  }

  const gridCols =
    columns === 3
      ? "grid-cols-2 lg:grid-cols-3"
      : "grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
