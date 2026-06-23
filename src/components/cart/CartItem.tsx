"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { CartLine } from "@/lib/shopify/types";

export default function CartItem({ line }: { line: CartLine }) {
  const { updateItemQuantity, removeItem, isMutating } = useCart();

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-6 border-b border-line"
    >
      <div className="relative h-28 w-[88px] shrink-0 overflow-hidden bg-background-secondary/20">
        {line.merchandise.image ? (
          <Image
            src={line.merchandise.image.url}
            alt={line.merchandise.image.altText ?? line.merchandise.product.title}
            fill
            className="object-cover"
            sizes="88px"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">{line.merchandise.product.title}</p>
            {line.merchandise.selectedOptions.length > 0 && (
              <p className="mt-1 text-xs text-foreground-muted">
                {line.merchandise.selectedOptions.map((o) => o.value).join(" / ")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeItem(line.id)}
            aria-label="Remove item"
            disabled={isMutating}
            className="text-foreground-muted hover:text-accent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center border border-white/20">
            <button
              type="button"
              onClick={() => updateItemQuantity(line.id, line.quantity - 1)}
              disabled={isMutating}
              aria-label="Decrease quantity"
              className="h-8 w-8 flex items-center justify-center text-foreground-secondary hover:text-accent transition-colors disabled:opacity-40"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{line.quantity}</span>
            <button
              type="button"
              onClick={() => updateItemQuantity(line.id, line.quantity + 1)}
              disabled={isMutating}
              aria-label="Increase quantity"
              className="h-8 w-8 flex items-center justify-center text-foreground-secondary hover:text-accent transition-colors disabled:opacity-40"
            >
              +
            </button>
          </div>
          <span className="text-sm font-medium text-foreground">
            {formatPrice(line.cost.totalAmount)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}
