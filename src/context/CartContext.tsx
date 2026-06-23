"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addCartLineAction,
  createCartAction,
  getCartAction,
  removeCartLineAction,
  updateCartLineAction,
} from "@/lib/actions/cart";
import type { Cart } from "@/lib/shopify/types";

const CART_ID_STORAGE_KEY = "bonesyde_cart_id";

type CartContextValue = {
  cart: Cart | null;
  isLoading: boolean;
  isMutating: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate cart from a previously stored cart id on mount.
  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const storedId =
        typeof window !== "undefined"
          ? window.localStorage.getItem(CART_ID_STORAGE_KEY)
          : null;

      if (!storedId) {
        setIsLoading(false);
        return;
      }

      try {
        const existing = await getCartAction(storedId);
        if (isMounted) {
          setCart(existing);
        }
      } catch {
        // stored cart id is stale/invalid — ignore, a new cart will be
        // created on first add-to-cart.
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  const persistCartId = useCallback((id: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_ID_STORAGE_KEY, id);
    }
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      setIsMutating(true);
      try {
        let nextCart: Cart;
        if (!cart) {
          nextCart = await createCartAction([{ merchandiseId, quantity }]);
          persistCartId(nextCart.id);
        } else {
          nextCart = await addCartLineAction(cart.id, [{ merchandiseId, quantity }]);
        }
        setCart(nextCart);
        setIsOpen(true);
      } finally {
        setIsMutating(false);
      }
    },
    [cart, persistCartId]
  );

  const updateItemQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsMutating(true);
      try {
        if (quantity <= 0) {
          const nextCart = await removeCartLineAction(cart.id, [lineId]);
          setCart(nextCart);
        } else {
          const nextCart = await updateCartLineAction(cart.id, [{ id: lineId, quantity }]);
          setCart(nextCart);
        }
      } finally {
        setIsMutating(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsMutating(true);
      try {
        const nextCart = await removeCartLineAction(cart.id, [lineId]);
        setCart(nextCart);
      } finally {
        setIsMutating(false);
      }
    },
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      isLoading,
      isMutating,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateItemQuantity,
      removeItem,
    }),
    [cart, isLoading, isMutating, isOpen, openCart, closeCart, toggleCart, addItem, updateItemQuantity, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
