"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, isOnSale } from "@/lib/utils";
import type { ProductCardData } from "@/lib/shopify/types";

export default function ProductCard({ product }: { product: ProductCardData }) {
  const [isHovered, setIsHovered] = useState(false);

  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.maxVariantPrice;
  const onSale = isOnSale(price, compareAt);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-background-secondary/10">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-all duration-700 ease-premium ${
              isHovered && product.hoverImage ? "opacity-0" : "opacity-100"
            } group-hover:scale-[1.04]`}
          />
        )}
        {product.hoverImage && (
          <Image
            src={product.hoverImage.url}
            alt={product.hoverImage.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-700 ease-premium ${
              isHovered ? "opacity-100" : "opacity-0"
            } group-hover:scale-[1.04]`}
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {onSale && (
            <span className="bg-accent text-background text-[10px] font-semibold uppercase tracking-widest px-2 py-1">
              Sale
            </span>
          )}
          {!product.availableForSale && (
            <span className="bg-background/80 text-foreground text-[10px] font-semibold uppercase tracking-widest px-2 py-1 border border-white/20">
              Sold Out
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <h3 className="text-sm text-foreground group-hover:text-accent transition-colors duration-300">
          {product.title}
        </h3>
        <div className="flex shrink-0 items-baseline gap-2">
          {onSale && (
            <span className="text-xs text-foreground-muted line-through">
              {formatPrice(compareAt)}
            </span>
          )}
          <span className="text-sm text-foreground-secondary">{formatPrice(price)}</span>
        </div>
      </div>
    </Link>
  );
}
