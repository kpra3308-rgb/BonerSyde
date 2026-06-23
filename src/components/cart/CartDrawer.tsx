"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import CartItem from "@/components/cart/CartItem";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, isMutating } = useCart();
  const lines = cart?.lines ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
          />

          <motion.aside
            className="fixed top-0 right-0 z-[80] flex h-full w-full max-w-md flex-col bg-background border-l border-line"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-line">
              <h2 className="font-display text-lg font-semibold uppercase tracking-widest2">
                Cart {cart && cart.totalQuantity > 0 ? `(${cart.totalQuantity})` : ""}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="text-foreground-secondary hover:text-accent transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-foreground-secondary text-sm">Your cart is empty.</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="btn-outline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <CartItem key={line.id} line={line} />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && cart && (
              <div className="border-t border-line px-6 py-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground-secondary">Subtotal</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatPrice(cart.cost.subtotalAmount)}
                  </span>
                </div>
                <p className="mb-5 text-xs text-foreground-muted">
                  Shipping and taxes calculated at checkout.
                </p>
                <a
                  href={cart.checkoutUrl}
                  className="btn-primary w-full"
                  aria-disabled={isMutating}
                >
                  Checkout
                </a>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-3 block text-center text-xs uppercase tracking-widest2 text-foreground-secondary hover:text-accent transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
