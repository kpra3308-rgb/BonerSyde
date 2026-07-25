"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductCardData } from "@/lib/shopify/types";

type Props = {
  products: ProductCardData[];
};

export default function BrandStorySlider({ products }: Props) {
  const [current, setCurrent] = useState(0);
  const total = products.length;

  function prev() {
    setCurrent((i) => (i === 0 ? total - 1 : i - 1));
  }

  function next() {
    setCurrent((i) => (i === total - 1 ? 0 : i + 1));
  }

  const product = products[current];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-background-secondary/10">
        {product?.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
            key={product.id}
          />
        ) : (
          <Image
            src="/brand-story.jpg"
            alt="BONESYDE product"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className="text-foreground-secondary hover:text-foreground transition-colors duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className="text-sm text-foreground-secondary font-mono tabular-nums">
          {current + 1}/{total}
        </span>

        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className="text-foreground-secondary hover:text-foreground transition-colors duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
