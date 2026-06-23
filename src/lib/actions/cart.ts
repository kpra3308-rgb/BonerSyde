"use server";

import {
  addCartLines,
  createCart,
  getCart as getCartById,
  removeCartLines,
  updateCartLines,
  type CartLineInput,
} from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

// NOTE: these are thin server actions. The Storefront access token lives
// only in server-side env vars (SHOPIFY_STOREFRONT_ACCESS_TOKEN, no
// NEXT_PUBLIC_ prefix), so all cart mutations must be invoked from the
// server. The client-side CartContext calls these actions instead of
// talking to Shopify directly.

export async function getCartAction(cartId: string): Promise<Cart | null> {
  return getCartById(cartId);
}

export async function createCartAction(lines: CartLineInput[] = []): Promise<Cart> {
  return createCart(lines);
}

export async function addCartLineAction(cartId: string, lines: CartLineInput[]): Promise<Cart> {
  return addCartLines(cartId, lines);
}

export async function updateCartLineAction(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  return updateCartLines(cartId, lines);
}

export async function removeCartLineAction(cartId: string, lineIds: string[]): Promise<Cart> {
  return removeCartLines(cartId, lineIds);
}
