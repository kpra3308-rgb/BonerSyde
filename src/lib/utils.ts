import { clsx, type ClassValue } from "clsx";
import type { Money } from "@/lib/shopify/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(money: Money, locale = "en-IN"): string {
  const amount = Number(money.amount);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function isOnSale(price: Money, compareAtPrice: Money | null | undefined): boolean {
  if (!compareAtPrice) return false;
  return Number(compareAtPrice.amount) > Number(price.amount);
}

export function discountPercent(price: Money, compareAtPrice: Money): number {
  const p = Number(price.amount);
  const c = Number(compareAtPrice.amount);
  if (c <= 0) return 0;
  return Math.round(((c - p) / c) * 100);
}
