import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind BONESYDE — a premium streetwear label built for permanence.",
};

const VALUES = [
  {
    title: "Construction First",
    body: "Every silhouette starts as a pattern problem, not a mood board. We solve fit and structure before anything else.",
  },
  {
    title: "Considered Materials",
    body: "We work with mills that share our standards for weight, hand-feel, and longevity — nothing in the line is filler.",
  },
  {
    title: "Small Batches",
    body: "Limited production runs mean tighter quality control and pieces that don't flood the market the day they drop.",
  },
];

export default async function AboutPage() {
  const { products } = await getProducts({ first: 3 });
  const heroImage = products[0]?.featuredImage;

  return (
    <div className="pb-24">
      <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden mt-[76px]">
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt={heroImage.altText ?? "BONESYDE"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-background-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container-px max-w-container mx-auto pb-12">
          <p className="eyebrow mb-4">Our Story</p>
          <h1 className="font-display text-display-lg font-bold text-foreground max-w-2xl">
            We build for the long wear.
          </h1>
        </div>
      </div>

      <div className="container-px max-w-container mx-auto pt-20">
        <AnimatedSection className="max-w-3xl mb-20">
          <p className="text-lg leading-relaxed text-foreground-secondary">
            BONESYDE started as a rejection of disposable fashion — collections engineered to be
            worn for one season and forgotten the next. We design slower. Every piece moves
            through multiple fit samples, fabric trials, and wear tests before it earns a place
            in the line. The result is a wardrobe built on structure rather than trend, made to
            be worn for years, not weeks.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-24">
          {VALUES.map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 0.1}>
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="font-display text-xl font-semibold text-foreground mt-3 mb-3">
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground-secondary">{value.body}</p>
            </AnimatedSection>
          ))}
        </div>

        {products.length > 1 && (
          <AnimatedSection className="grid grid-cols-2 gap-4 sm:gap-6 mb-24">
            {products.slice(1, 3).map((product) =>
              product.featuredImage ? (
                <div key={product.id} className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText ?? product.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
              ) : null
            )}
          </AnimatedSection>
        )}

        <AnimatedSection className="text-center">
          <h2 className="font-display text-display-sm font-semibold text-foreground mb-6">
            Explore the line.
          </h2>
          <Link href="/shop" className="btn-primary">
            Shop The Collection
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}
