"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ProductCardData } from "@/lib/shopify/types";
import ProductCard from "@/components/product/ProductCard";

type Props = {
  products: ProductCardData[];
};

export default function FeaturedSlider({ products }: Props) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const total = products.length;
  const maxIndex = Math.max(0, total - visibleCount);

  const updateVisibleCount = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) setVisibleCount(2);
    else if (w < 1024) setVisibleCount(3);
    else setVisibleCount(4);
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [updateVisibleCount]);

  function prev() {
    setCurrent((i) => {
      const next = Math.max(0, i - 1);
      if (scrollRef.current) {
        const card = scrollRef.current.children[next] as HTMLElement;
        card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      }
      return next;
    });
  }

  function next() {
    setCurrent((i) => {
      const next = Math.min(maxIndex, i + 1);
      if (scrollRef.current) {
        const card = scrollRef.current.children[next] as HTMLElement;
        card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      }
      return next;
    });
  }

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[48%] sm:w-[31%] lg:w-[23%] shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          aria-label="Previous"
          className="text-foreground-secondary hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200"
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
          disabled={current >= maxIndex}
          aria-label="Next"
          className="text-foreground-secondary hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
