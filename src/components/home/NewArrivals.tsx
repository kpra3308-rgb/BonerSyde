import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import ProductCard from "@/components/product/ProductCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function NewArrivals() {
  const { products } = await getProducts({ first: 8, sortKey: "CREATED_AT", reverse: true });

  if (products.length === 0) return null;

  return (
    <AnimatedSection as="section" className="container-px max-w-container mx-auto py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">Just Landed</p>
          <h2 className="font-display text-display-sm font-semibold text-foreground">
            New Arrivals
          </h2>
        </div>
        <Link
          href="/shop?sort=newest"
          className="hidden sm:inline text-sm uppercase tracking-widest2 text-foreground-secondary hover:text-accent transition-colors link-underline"
        >
          Shop All
        </Link>
      </div>

      <div className="-mx-5 sm:-mx-8 lg:-mx-12 flex gap-4 sm:gap-6 overflow-x-auto px-5 sm:px-8 lg:px-12 pb-2 snap-x snap-mandatory scrollbar-none">
        {products.map((product) => (
          <div key={product.id} className="w-[58%] sm:w-[32%] lg:w-[23%] shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
