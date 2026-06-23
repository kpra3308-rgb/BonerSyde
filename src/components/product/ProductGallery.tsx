"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

export default function ProductGallery({
  images,
  title,
}: {
  images: ShopifyImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = images.length > 0 ? images : [];

  if (gallery.length === 0) {
    return <div className="aspect-[4/5] w-full bg-background-secondary/10" />;
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex shrink-0 gap-3 sm:flex-col sm:overflow-y-auto sm:max-h-[640px] overflow-x-auto sm:w-20">
        {gallery.map((image, index) => (
          <button
            key={image.url}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
            className={`relative aspect-[4/5] w-16 sm:w-20 shrink-0 overflow-hidden border transition-colors duration-300 ${
              activeIndex === index ? "border-accent" : "border-transparent hover:border-white/30"
            }`}
          >
            <Image
              src={image.url}
              alt={image.altText ?? `${title} thumbnail ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative flex-1 aspect-[4/5] overflow-hidden bg-background-secondary/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={gallery[activeIndex].url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={gallery[activeIndex].url}
              alt={gallery[activeIndex].altText ?? title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => setActiveIndex((i) => (i === 0 ? gallery.length - 1 : i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-background/70 text-foreground hover:bg-accent hover:text-background transition-colors duration-300"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => setActiveIndex((i) => (i === gallery.length - 1 ? 0 : i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-background/70 text-foreground hover:bg-accent hover:text-background transition-colors duration-300"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
