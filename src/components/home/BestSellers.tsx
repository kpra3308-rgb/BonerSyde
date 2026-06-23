import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import ProductGrid from "@/components/product/ProductGrid";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function BestSellers() {
  const { products } = await getProducts({ first: 4, sortKey: "BEST_SELLING", reverse: false });

  if (products.length === 0) return null;

  return (
    <AnimatedSection
      as="section"
      className="container-px max-w-container mx-auto py-24 border-t border-line"
    >
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">Most Wanted</p>
          <h2 className="font-display text-display-sm font-semibold text-foreground">
            Best Sellers
          </h2>
        </div>
        <Link
          href="/shop?sort=best-selling"
          className="hidden sm:inline text-sm uppercase tracking-widest2 text-foreground-secondary hover:text-accent transition-colors link-underline"
        >
          Shop All
        </Link>
      </div>

      <ProductGrid products={products} />
    </AnimatedSection>
  );
}
