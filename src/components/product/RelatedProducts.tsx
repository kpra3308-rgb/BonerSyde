import { getProductRecommendations } from "@/lib/shopify";
import ProductGrid from "@/components/product/ProductGrid";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function RelatedProducts({ productId }: { productId: string }) {
  const recommendations = await getProductRecommendations(productId);

  if (recommendations.length === 0) return null;

  return (
    <AnimatedSection as="section" className="container-px max-w-container mx-auto py-24">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-display-sm font-semibold text-foreground">
          You May Also Like
        </h2>
      </div>
      <ProductGrid products={recommendations.slice(0, 4)} />
    </AnimatedSection>
  );
}
