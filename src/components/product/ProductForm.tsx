"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice, isOnSale } from "@/lib/utils";
import type { Product, ProductVariant } from "@/lib/shopify/types";

function findVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | undefined {
  return variants.find((variant) =>
    variant.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
  );
}

function isOptionValueAvailable(
  variants: ProductVariant[],
  optionName: string,
  optionValue: string,
  selectedOptions: Record<string, string>
): boolean {
  const candidate = { ...selectedOptions, [optionName]: optionValue };
  return variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every((opt) => candidate[opt.name] === opt.value)
  );
}

export default function ProductForm({ product }: { product: Product }) {
  const { addItem, isMutating } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((option) => {
      const firstAvailable = product.variants.find(
        (v) =>
          v.availableForSale &&
          v.selectedOptions.some((o) => o.name === option.name)
      );
      const fallback = option.values[0];
      const match = firstAvailable?.selectedOptions.find((o) => o.name === option.name);
      initial[option.name] = match?.value ?? fallback;
    });
    return initial;
  });

  const selectedVariant = useMemo(
    () => findVariant(product.variants, selectedOptions),
    [product.variants, selectedOptions]
  );

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = selectedVariant?.compareAtPrice ?? null;
  const onSale = isOnSale(price, compareAt);
  const inStock = selectedVariant?.availableForSale ?? false;

  async function handleAddToCart() {
    if (!selectedVariant) return;
    await addItem(selectedVariant.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl font-semibold text-foreground">
          {formatPrice(price)}
        </span>
        {onSale && compareAt && (
          <span className="text-base text-foreground-muted line-through">
            {formatPrice(compareAt)}
          </span>
        )}
      </div>

      {product.options
        .filter((option) => option.name.toLowerCase() !== "title")
        .map((option) => (
          <div key={option.id}>
            <p className="eyebrow mb-3">{option.name}</p>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                const available = isOptionValueAvailable(
                  product.variants,
                  option.name,
                  value,
                  selectedOptions
                );
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))
                    }
                    className={`relative min-w-[3.25rem] border px-4 py-2.5 text-sm transition-colors duration-300 ${
                      isSelected
                        ? "border-accent text-accent"
                        : "border-white/20 text-foreground-secondary hover:border-white/50"
                    } ${!available ? "text-foreground-muted/50" : ""}`}
                  >
                    {value}
                    {!available && (
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-foreground-muted/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      <div className="flex items-center gap-3">
        <span
          className={`h-2 w-2 rounded-full ${inStock ? "bg-accent" : "bg-foreground-muted"}`}
        />
        <span className="text-sm text-foreground-secondary">
          {inStock
            ? selectedVariant && selectedVariant.quantityAvailable !== null && selectedVariant.quantityAvailable <= 5
              ? `Only ${selectedVariant.quantityAvailable} left`
              : "In stock"
            : "Sold out"}
        </span>
      </div>

      <motion.button
        type="button"
        onClick={handleAddToCart}
        disabled={!inStock || isMutating || !selectedVariant}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full"
      >
        {justAdded ? "Added ✓" : inStock ? "Add to Cart" : "Sold Out"}
      </motion.button>
    </div>
  );
}
