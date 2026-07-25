import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function BrandStory() {
  const { products } = await getProducts({ first: 2 });
  const [imgA, imgB] = products;

  return (
    <section className="container-px max-w-container mx-auto py-24 border-t border-line">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <AnimatedSection className="flex flex-col items-start gap-8">
          <Link href="/shop" className="btn-primary">
            Shop All
          </Link>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="relative h-[480px] sm:h-[560px]">
          {imgA?.featuredImage && (
            <div className="absolute left-0 top-0 h-[65%] w-[55%] overflow-hidden">
              <Image
                src={imgA.featuredImage.url}
                alt={imgA.featuredImage.altText ?? "BONESYDE garment detail"}
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          )}
          {imgB?.featuredImage && (
            <div className="absolute bottom-0 right-0 h-[75%] w-[65%] overflow-hidden border-4 border-background">
              <Image
                src={imgB.featuredImage.url}
                alt={imgB.featuredImage.altText ?? "BONESYDE garment detail"}
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          )}
          {!imgA && !imgB && (
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/brand-story.jpg"
                alt="BONESYDE brand story"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
