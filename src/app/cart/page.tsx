"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import CartItem from "@/components/cart/CartItem";

export default function CartPage() {
  const { cart, isLoading } = useCart();
  const lines = cart?.lines ?? [];

  return (
    <div className="pt-32 pb-24 min-h-[60vh]">
      <div className="container-px max-w-container mx-auto">
        <div className="mb-12">
          <p className="eyebrow mb-3">Your Order</p>
          <h1 className="font-display text-display-md font-semibold text-foreground">Cart</h1>
        </div>

        {isLoading ? (
          <p className="text-foreground-secondary text-sm">Loading cart...</p>
        ) : lines.length === 0 ? (
          <div className="flex flex-col items-start gap-5 py-10">
            <p className="text-foreground-secondary">Your cart is currently empty.</p>
            <Link href="/shop" className="btn-primary">
              Shop The Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
            <ul>
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <CartItem key={line.id} line={line} />
                ))}
              </AnimatePresence>
            </ul>

            <div className="border border-line p-6 h-fit">
              <h2 className="eyebrow mb-5">Order Summary</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground-secondary">Subtotal</span>
                <span className="text-sm font-medium text-foreground">
                  {cart && formatPrice(cart.cost.subtotalAmount)}
                </span>
              </div>
              <p className="mb-6 text-xs text-foreground-muted">
                Shipping and taxes calculated at checkout.
              </p>
              {cart && (
                <a href={cart.checkoutUrl} className="btn-primary w-full">
                  Checkout
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
