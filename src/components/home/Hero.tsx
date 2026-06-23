"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

export default function Hero({ image }: { image: ShopifyImage | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-background">
      <motion.div style={{ y }} className="absolute inset-0">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? "BONESYDE"}
            fill
            priority
            sizes="100vw"
            className="object-cover scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-background-secondary/40 via-background to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-start justify-end container-px max-w-container mx-auto pb-20 sm:pb-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mb-6"
        >
          BONESYDE — Permanent Collection
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-display-xl font-bold text-foreground max-w-3xl"
        >
          Built To
          <br />
          Outlast Trend.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap items-center gap-5"
        >
          <Link href="/shop" className="btn-primary">
            Shop The Collection
          </Link>
          <Link href="/collections" className="text-sm uppercase tracking-widest2 text-foreground-secondary hover:text-accent transition-colors link-underline">
            Explore Collections
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 right-6 sm:right-10 flex flex-col items-center gap-3 text-foreground-secondary"
      >
        <span className="text-[10px] uppercase tracking-widest3 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="h-10 w-px bg-foreground-secondary/40 animate-pulse-slow" />
      </motion.div>
    </section>
  );
}
